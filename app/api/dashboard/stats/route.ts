import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { DashboardStats } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Get basic statistics
    const [
      totalConsultations,
      totalDocuments,
      totalExports,
      consultationsWithDuration
    ] = await Promise.all([
      prisma.consultation.count({
        where: { userId }
      }),
      prisma.document.count({
        where: { userId }
      }),
      prisma.export.count({
        where: { userId }
      }),
      prisma.consultation.findMany({
        where: { 
          userId,
          duration: { not: null }
        },
        select: { duration: true }
      })
    ])

    // Calculate average consultation duration
    const averageConsultationDuration = consultationsWithDuration.length > 0
      ? consultationsWithDuration.reduce((sum, c) => sum + (c.duration || 0), 0) / consultationsWithDuration.length
      : 0

    // Get recent activity
    const recentActivity = await prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        action: true,
        resource: true,
        createdAt: true,
        details: true
      }
    })

    const formattedActivity = recentActivity.map(activity => ({
      id: activity.id,
      type: activity.resource,
      description: getActivityDescription(activity.action, activity.resource),
      timestamp: activity.createdAt
    }))

    const stats: DashboardStats = {
      totalConsultations,
      totalDocuments,
      totalExports,
      averageConsultationDuration,
      recentActivity: formattedActivity
    }

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { message: 'Erreur lors du chargement des statistiques' },
      { status: 500 }
    )
  }
}

function getActivityDescription(action: string, resource: string): string {
  const descriptions: Record<string, Record<string, string>> = {
    LOGIN: {
      USER: 'Connexion au système'
    },
    REGISTER: {
      USER: 'Création du compte'
    },
    CREATE: {
      CONSULTATION: 'Nouvelle consultation créée',
      DOCUMENT: 'Nouveau document généré',
      EXPORT: 'Export de données effectué'
    },
    UPDATE: {
      CONSULTATION: 'Consultation mise à jour',
      DOCUMENT: 'Document modifié',
      USER: 'Profil mis à jour'
    },
    DELETE: {
      CONSULTATION: 'Consultation supprimée',
      DOCUMENT: 'Document supprimé'
    }
  }

  return descriptions[action]?.[resource] || `${action} sur ${resource}`
}