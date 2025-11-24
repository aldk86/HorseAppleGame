# Pferdeäpfel 🐴🍎

A tactical two-player board game where horses move like chess knights and leave apple obstacles behind.

## Game Rules

1. **Setup**: Two players choose names and colors
2. **Board**: 8×8 grid with horses starting at opposite corners (0,0) and (7,7)
3. **Movement**: Horses move like chess knights (L-shaped moves)
4. **Apples**: When a horse moves, an apple is placed on the square it left
5. **Restrictions**: Horses cannot move onto squares with apples
6. **Capture**: Landing on opponent's horse captures it and wins the game
7. **Blockage Win**: If a player has no legal moves due to apples, they lose

## Installation & Running

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── App.tsx              # Main application component
├── main.tsx            # Entry point
├── gameLogic.ts        # Pure game logic functions
└── components/
    ├── Setup.tsx       # Player setup screen
    ├── Board.tsx       # Game board component
    └── EndModal.tsx    # End game modal
```

## Technology Stack

- React 18
- TypeScript
- Vite
- No external CSS libraries (inline styles)
- No backend or persistence

## Features

✅ Full game logic implementation
✅ Knight movement validation
✅ Apple placement system
✅ Win condition detection (capture & blockage)
✅ Turn-based gameplay
✅ Interactive UI with move highlighting
✅ Responsive design
✅ Clean, maintainable code structure
