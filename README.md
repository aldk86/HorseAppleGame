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

npm run dev
npm run dev

npm run server
node server.js

# Build for production
npm run build

# Preview production build
npm run preview

```



## How to Use Settings

1. From the **Dashboard**, click the **⚙️ Settings** button in the top-right corner
2. Toggle **Dark Mode** between light and dark themes
3. Choose a **Board Theme** from 6 different color schemes
4. Select **Knight Symbols** to change how the game pieces appear
5. Your preferences are automatically saved and will persist across sessions

See [`THEME_FEATURES.md`](THEME_FEATURES.md) for full details on theme and UX customization.


## Project Structure

```
src/
├── App.tsx              # Main application component
├── main.tsx             # Entry point
├── gameLogic.ts         # Pure game logic functions
├── gameManager.ts       # Network play logic (WebSocket)
├── themeContext.tsx     # Theme and settings context
└── components/
  ├── Dashboard.tsx    # Main menu/dashboard
  ├── Setup.tsx        # Player setup screen
  ├── Board.tsx        # Game board component
  ├── EndModal.tsx     # End game modal
  ├── NetworkLobby.tsx # Network play lobby
  ├── CreateGame.tsx   # Create network game
  ├── JoinGame.tsx     # Join network game
  └── Settings.tsx     # Settings screen
```


## Technology Stack

- React 18
- TypeScript
- Vite
- WebSocket server (`ws`)
- No external CSS libraries (inline styles)


## Features

### Gameplay
- ✅ Full game logic implementation
- ✅ Knight movement validation
- ✅ Apple placement system
- ✅ Win condition detection (capture & blockage)
- ✅ Turn-based gameplay
- ✅ Interactive UI with move highlighting
- ✅ Move timer for each turn

### Play Modes
- ✅ **Same Device**: Local multiplayer on one device
- ✅ **Network Play**: Play with friends on the same local network or internet
  - Create and host games
  - Join existing games with game codes
  - Real-time synchronization via WebSockets
  - Disconnect handling and notifications
  - Play mode indicators (see who is host/guest)

### Customization & Themes
- ✅ **Dark Mode**: Toggle between light and dark themes
- ✅ **Board Themes**: Choose from 6 different color schemes
  - Classic (traditional chess colors)
  - Ocean Blue
  - Forest Green
  - Royal Purple
  - Monochrome
  - Sunset
- ✅ **Knight Symbols**: 4 different symbol sets to choose from
  - Chess Knights (♘ ♞)
  - Horse Emojis (🐴 🐎)
  - Royal Symbols (👑 🎩)
  - Stars (⭐ ✨)
- ✅ **Settings Persistence**: Preferences saved in localStorage

### Dashboard & UX
- ✅ Modern dashboard with animated settings button
- ✅ Visual theme previews in settings
- ✅ Responsive design for mobile and desktop
- ✅ Clean, maintainable code structure
- ✅ Smooth animations and transitions

### Network & Server
- ✅ WebSocket server for real-time network play (`ws`)
- ✅ Game lobby with game list, create/join, and timeouts
- ✅ Handles disconnects and notifies opponent
- ✅ Easy deployment to Render, Azure, or other Node hosts

## Deployment

See [`DEPLOYMENT.md`](DEPLOYMENT.md) for full deployment instructions, including:
- How to run in production
- How to deploy to Render.com or Azure
- How to serve both frontend and WebSocket server together

---

Enjoy playing Pferdeäpfel! 🐴🍎
