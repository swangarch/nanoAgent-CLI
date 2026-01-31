# Snake Game 🐍

A classic Snake game implemented in the command line using Python curses library!

## Features

- **Smooth gameplay** with real-time controls
- **Color-coded interface** (green snake, red food, white borders)
- **Score tracking** - earn 10 points for each food eaten
- **Collision detection** - game ends if you hit walls or yourself
- **Responsive controls** - use arrow keys to change direction

## How to Play

1. **Install dependencies** (Python's curses is usually built-in):
   ```bash
   # Python 3 includes curses by default on most systems
   # If you encounter issues, you might need to install:
   # Ubuntu/Debian: sudo apt-get install python3-curses
   # macOS: curses is included with Python
   ```

2. **Run the game**:
   ```bash
   python3 snake_game.py
   ```

## Controls

- **Arrow Keys**: Move the snake (↑ ↓ ← →)
- **'q' Key**: Quit the game
- **Any Key**: Exit game over screen

## Game Rules

1. **Objective**: Eat the red food (*) to grow your snake and increase your score
2. **Movement**: The snake continuously moves in the current direction
3. **Growth**: Each food eaten makes your snake one segment longer
4. **Game Over**: 
   - Hit the wall (border)
   - Run into yourself
5. **Scoring**: +10 points for each food eaten

## Tips

- Plan your moves ahead - you can't reverse direction immediately
- Use the walls strategically, but don't hit them!
- Try to create safe paths for longer sequences
- The game speed stays constant throughout

## Technical Details

- **Language**: Python 3
- **Library**: Curses (terminal UI)
- **Grid-based**: Uses terminal character grid for rendering
- **Real-time**: 150ms game loop for smooth gameplay

Enjoy playing! 🎮🐍
