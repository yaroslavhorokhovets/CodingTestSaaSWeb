#!/bin/bash

# Healthcare AI SaaS - Dependency Installation Script
echo "Installing dependencies for Healthcare AI SaaS..."

# Install all dependencies from package.json
npm install

# Verify critical dependencies
echo "Verifying critical dependencies..."
npm list @tailwindcss/forms
npm list tailwindcss
npm list next

echo "Dependencies installation complete!"
echo "You can now run: npm run dev"