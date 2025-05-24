#!/bin/bash

echo "🧪 PDF Export Testing Script"
echo "=============================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the project root."
    exit 1
fi

echo "✅ In correct project directory"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "✅ Dependencies installed"

# Start the development server in the background
echo "🚀 Starting development server..."
npm run dev &
SERVER_PID=$!

# Wait for the server to start
echo "⏳ Waiting for server to start..."
sleep 5

# Check if server is running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Server is running on http://localhost:3000"
else
    echo "❌ Server failed to start"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎯 PDF Export Test Page: http://localhost:3000/test-pdf"
echo ""
echo "📋 Testing Checklist:"
echo "  1. Open the test page in your browser"
echo "  2. Open DevTools → Console for detailed logs"
echo "  3. Test each tab (Basic, Customization, Preview, Analytics, Advanced)"
echo "  4. Try downloading PDFs with different quality settings"
echo "  5. Test the preview functionality"
echo "  6. Check the rate limiting feature"
echo "  7. Verify analytics tracking"
echo ""
echo "🌐 Opening test page in browser..."

# Try to open the test page
if command -v open &> /dev/null; then
    # macOS
    open http://localhost:3000/test-pdf
elif command -v xdg-open &> /dev/null; then
    # Linux
    xdg-open http://localhost:3000/test-pdf
elif command -v start &> /dev/null; then
    # Windows
    start http://localhost:3000/test-pdf
else
    echo "Please manually open: http://localhost:3000/test-pdf"
fi

echo ""
echo "⌨️  Press Enter to stop the server and exit..."
read

echo "🛑 Stopping development server..."
kill $SERVER_PID 2>/dev/null

echo "✅ Testing session completed!"
echo ""
echo "📝 Next Steps:"
echo "  - Review console logs for any errors"
echo "  - Test with real resume data in your main application"
echo "  - Deploy to staging for full testing"
echo "  - Set up proper authentication for production" 