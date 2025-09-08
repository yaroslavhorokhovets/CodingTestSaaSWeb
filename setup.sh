#!/bin/bash

# Healthcare AI SaaS - Setup Script
echo "🏥 Healthcare AI SaaS Setup Script"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/healthcare_ai_saas"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here-change-in-production"
JWT_SECRET="your-jwt-secret-key-here-change-in-production"

# Encryption
ENCRYPTION_KEY="your-32-character-encryption-key-change-in-production"

# OpenAI API
OPENAI_API_KEY="your-openai-api-key"

# Application Settings
APP_NAME="Healthcare AI Assistant"
APP_URL="http://localhost:3000"
NODE_ENV="development"

# Security
BCRYPT_ROUNDS=12
SESSION_TIMEOUT=3600000
MAX_LOGIN_ATTEMPTS=5
LOGIN_LOCKOUT_DURATION=900000

# Compliance
GDPR_CONSENT_REQUIRED=true
DATA_RETENTION_DAYS=2555
AUDIT_LOG_RETENTION_DAYS=365
EOF
    echo "✅ .env file created"
    echo "⚠️  Please update the .env file with your actual configuration values"
else
    echo "✅ .env file already exists"
fi

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
npx prisma generate

if [ $? -eq 0 ]; then
    echo "✅ Prisma client generated successfully"
else
    echo "❌ Failed to generate Prisma client"
    echo "⚠️  Make sure your DATABASE_URL is correct in .env file"
fi

# Run type check
echo "🔍 Running type check..."
npm run type-check

if [ $? -eq 0 ]; then
    echo "✅ Type check passed"
else
    echo "⚠️  Type check failed - please review the errors above"
fi

echo ""
echo "🎉 Setup completed!"
echo ""
echo "Next steps:"
echo "1. Update your .env file with actual configuration values"
echo "2. Set up your PostgreSQL database"
echo "3. Run 'npx prisma db push' to create database tables"
echo "4. Run 'npm run dev' to start the development server"
echo ""
echo "For production deployment:"
echo "1. Update all environment variables with secure values"
echo "2. Set up proper database connection"
echo "3. Configure SSL/TLS certificates"
echo "4. Set up proper logging and monitoring"
echo ""
echo "🔒 Security Notice:"
echo "This application handles sensitive medical data. Ensure you:"
echo "- Use strong encryption keys"
echo "- Set up proper database security"
echo "- Configure HTTPS in production"
echo "- Follow GDPR and HDS compliance requirements"