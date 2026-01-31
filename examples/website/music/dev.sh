#!/bin/bash

echo "🎵 Music Website Development Server"
echo "==================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "🚀 Starting development server..."
echo "📱 Website will be available at: http://localhost:5173"
echo ""
echo "Features to test:"
echo "  🎧 Play/Pause music with spacebar"
echo "  🔀 Shuffle mode (S key)"
echo "  🔁 Repeat modes (R key)"
echo "  ❤️  Add/remove favorites (F key)"
echo "  📚 Switch between Library and Favorites"
echo "  🔍 Search for songs/artists"
echo "  📱 Test responsive design"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
