#!/bin/bash

echo "🧪 Running Client Portal Files Page Tests"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run the tests
echo "🚀 Running comprehensive tests for client-portal/files page..."
npm run test src/test/client-portal/files/page.test.tsx

echo ""
echo "✅ Test run completed!"
echo ""
echo "📊 Test Coverage Areas:"
echo "  ✓ Authentication & Access Control"
echo "  ✓ File Upload Features"
echo "  ✓ Project Integration"
echo "  ✓ Email & Message Features"
echo "  ✓ Upload & Send Functionality"
echo "  ✓ UI/UX Elements"
echo "  ✓ Error Handling"
echo "  ✓ Data Flow Integration"
echo "  ✓ Dependencies & Imports"