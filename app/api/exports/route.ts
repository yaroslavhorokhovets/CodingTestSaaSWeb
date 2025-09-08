import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { exportSchema } from '@/lib/validation'
import { ExportFormat } from '@prisma/client'
import { decrypt } from '@/lib/encryption'
import PDFDocument from 'pdfkit'

// Helper function to wrap text
function wrapText(text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''
  
  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word
    if (testLine.length <= maxWidth) {
      currentLine = testLine
    } else {
      if (currentLine) {
        lines.push(currentLine)
        currentLine = word
      } else {
        lines.push(word)
      }
    }
  }
  
  if (currentLine) {
    lines.push(currentLine)
  }
  
  return lines
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validate input
    const validatedData = exportSchema.parse(body)

    // Build query conditions
    const whereConditions: any = {
      userId: session.user.id
    }

    if (validatedData.dateRange) {
      whereConditions.createdAt = {
        gte: validatedData.dateRange.start,
        lte: validatedData.dateRange.end
      }
    }

    // Get consultations
    const consultations = await prisma.consultation.findMany({
      where: whereConditions,
      include: {
        patient: true,
        documents: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // Generate export based on format
    let fileName: string
    let fileContent: Buffer
    let mimeType: string

    switch (validatedData.format) {
      case ExportFormat.PDF:
        const pdfData = await generatePDF(consultations, validatedData, session.user)
        fileName = `export_consultations_${Date.now()}.pdf`
        fileContent = pdfData
        mimeType = 'application/pdf'
        break

      case ExportFormat.CSV:
        const csvData = await generateCSV(consultations, validatedData)
        fileName = `export_consultations_${Date.now()}.csv`
        fileContent = Buffer.from(csvData, 'utf-8')
        mimeType = 'text/csv'
        break

      case ExportFormat.FHIR:
        const fhirData = await generateFHIR(consultations, validatedData, session.user)
        fileName = `export_consultations_${Date.now()}.json`
        fileContent = Buffer.from(JSON.stringify(fhirData, null, 2), 'utf-8')
        mimeType = 'application/json'
        break

      default:
        throw new Error('Format non supporté')
    }

    // Save export record
    const exportRecord = await prisma.export.create({
      data: {
        userId: session.user.id,
        format: validatedData.format,
        fileName,
        fileUrl: `/exports/${fileName}`, // In production, this would be a real URL
        fileSize: fileContent.length
      }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE',
        resource: 'EXPORT',
        resourceId: exportRecord.id,
        details: {
          format: validatedData.format,
          fileName,
          fileSize: fileContent.length,
          consultationsCount: consultations.length,
          createdAt: new Date()
        }
      }
    })

    // TODO: In production, upload file to secure storage (AWS S3, etc.)
    // For now, we'll return the file content as base64
    const base64Content = fileContent.toString('base64')

    return NextResponse.json({
      success: true,
      data: {
        id: exportRecord.id,
        fileName,
        format: validatedData.format,
        fileSize: fileContent.length,
        downloadUrl: `data:${mimeType};base64,${base64Content}`,
        createdAt: exportRecord.createdAt
      }
    })

  } catch (error) {
    console.error('Export creation error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { message: 'Données invalides' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { message: 'Erreur lors de la création de l\'export' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    const exports = await prisma.export.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    return NextResponse.json({
      success: true,
      data: exports
    })

  } catch (error) {
    console.error('Exports fetch error:', error)
    return NextResponse.json(
      { message: 'Erreur lors du chargement des exports' },
      { status: 500 }
    )
  }
}

async function generatePDF(consultations: any[], options: any, user: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument()
    const buffers: Buffer[] = []

    doc.on('data', buffers.push.bind(buffers))
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers)
      resolve(pdfData)
    })
    doc.on('error', reject)

    // PDF Header
    doc.fontSize(20)
    doc.text('Export des Consultations', 50, 50)
    
    doc.fontSize(12)
    doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 50, 80)
    doc.text(`Médecin: Dr. ${user.firstName} ${user.lastName}`, 50, 100)
    doc.text(`Spécialité: ${user.medicalSpecialty}`, 50, 120)
    
    let yPosition = 150

    consultations.forEach((consultation, index) => {
      if (yPosition > 700) {
        doc.addPage()
        yPosition = 50
      }

      doc.fontSize(14)
      doc.text(`${index + 1}. ${consultation.title}`, 50, yPosition)
      yPosition += 25
      
      doc.fontSize(10)
      doc.text(`Date: ${new Date(consultation.createdAt).toLocaleDateString('fr-FR')}`, 50, yPosition)
      yPosition += 20

      if (options.includeTranscription && consultation.transcription) {
        const transcription = decrypt(consultation.transcription)
        doc.fontSize(10)
        doc.text('Transcription:', 50, yPosition)
        yPosition += 20
        doc.fontSize(9)
        
        // Split long text into multiple lines
        const maxWidth = 500
        const transcriptionText = transcription.substring(0, 500) + '...'
        const lines = wrapText(transcriptionText, maxWidth)
        lines.forEach((line, index) => {
          doc.text(line, 50, yPosition + (index * 15))
        })
        yPosition += lines.length * 15 + 20
      }

      if (options.includeNotes && consultation.soapNotes) {
        const soapNotes = JSON.parse(decrypt(consultation.soapNotes))
        doc.fontSize(10)
        doc.text('Notes SOAP:', 50, yPosition)
        yPosition += 20
        doc.fontSize(9)
        
        const soapText = `S: ${soapNotes.subjective} | O: ${soapNotes.objective} | A: ${soapNotes.assessment} | P: ${soapNotes.plan}`
        const soapLines = wrapText(soapText, 500)
        soapLines.forEach((line, index) => {
          doc.text(line, 50, yPosition + (index * 15))
        })
        yPosition += soapLines.length * 15 + 30
      }

      yPosition += 20
    })

    doc.end()
  })
}

async function generateCSV(consultations: any[], options: any): Promise<string> {
  const headers = ['Date', 'Titre', 'Patient', 'Durée (min)']
  
  if (options.includeTranscription) {
    headers.push('Transcription')
  }
  
  if (options.includeNotes) {
    headers.push('Notes SOAP')
  }

  const rows = consultations.map(consultation => {
    const row = [
      new Date(consultation.createdAt).toLocaleDateString('fr-FR'),
      consultation.title,
      consultation.patient ? `${consultation.patient.firstName} ${consultation.patient.lastName}` : '',
      consultation.duration ? Math.round(consultation.duration / 60) : ''
    ]

    if (options.includeTranscription && consultation.transcription) {
      row.push(decrypt(consultation.transcription).replace(/\n/g, ' '))
    }

    if (options.includeNotes && consultation.soapNotes) {
      const soapNotes = JSON.parse(decrypt(consultation.soapNotes))
      row.push(`S: ${soapNotes.subjective} | O: ${soapNotes.objective} | A: ${soapNotes.assessment} | P: ${soapNotes.plan}`)
    }

    return row.map(cell => `"${cell}"`).join(',')
  })

  return [headers.map(h => `"${h}"`).join(','), ...rows].join('\n')
}

async function generateFHIR(consultations: any[], options: any, user: any): Promise<any> {
  const bundle: any = {
    resourceType: 'Bundle',
    type: 'document',
    timestamp: new Date().toISOString(),
    meta: {
      profile: ['http://hl7.org/fhir/StructureDefinition/Bundle']
    },
    identifier: {
      system: 'https://healthcare-ai-saas.com/exports',
      value: `export-${Date.now()}`
    },
    entry: []
  }

  // Add practitioner resource
  const practitioner = {
    resource: {
      resourceType: 'Practitioner',
      id: user.id,
      name: [{
        use: 'official',
        family: user.lastName,
        given: [user.firstName]
      }],
      qualification: [{
        code: {
          coding: [{
            system: 'http://snomed.info/sct',
            code: user.medicalSpecialty,
            display: user.medicalSpecialty
          }]
        }
      }]
    }
  }

  bundle.entry.push(practitioner as any)

  // Add consultation resources
  consultations.forEach(consultation => {
    const encounter = {
      resource: {
        resourceType: 'Encounter',
        id: consultation.id,
        status: 'finished',
        class: {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
          code: 'AMB',
          display: 'ambulatory'
        },
        subject: consultation.patient ? {
          reference: `Patient/${consultation.patient.id}`
        } : undefined,
        period: {
          start: consultation.createdAt,
          end: consultation.completedAt || consultation.createdAt
        },
        reasonCode: [{
          text: consultation.title
        }]
      }
    }

    bundle.entry.push(encounter as any)

    if (options.includeTranscription && consultation.transcription) {
      const observation = {
        resource: {
          resourceType: 'Observation',
          id: `${consultation.id}-transcription`,
          status: 'final',
          code: {
            coding: [{
              system: 'http://loinc.org',
              code: '11488-4',
              display: 'Consult note'
            }]
          },
          subject: consultation.patient ? {
            reference: `Patient/${consultation.patient.id}`
          } : undefined,
          encounter: {
            reference: `Encounter/${consultation.id}`
          },
          valueString: decrypt(consultation.transcription)
        }
      }

      bundle.entry.push(observation as any)
    }
  })

  return bundle
}