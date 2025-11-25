import { WebSocketServer } from 'ws';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3001;
const games = new Map();
const activeSessions = new Map(); // gameId -> { host: ws, guest: ws, gameState: {...} }

const app = express();

// Serve static files from dist folder
app.use(express.static(join(__dirname, 'dist')));

// Serve index.html for all routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Create HTTP server
const server = createServer(app);

// Attach WebSocket server to HTTP server
const wss = new WebSocketServer({ server });

console.log(`🎮 Pferdeäpfel WebSocket Server running on port ${PORT}`);

// Broadcast to all connected clients
function broadcast(message) {
  const data = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // OPEN
      client.send(data);
    }
  });
}

// Clean up expired games (older than 60 seconds)
function cleanupExpiredGames() {
  const now = Date.now();
  let changed = false;
  for (const [id, game] of games.entries()) {
    if (now - game.createdAt > 60000) {
      games.delete(id);
      changed = true;
    }
  }
  if (changed) {
    broadcast({ type: 'gamesList', games: Array.from(games.values()) });
  }
}

// Run cleanup every 5 seconds
setInterval(cleanupExpiredGames, 5000);

wss.on('connection', (ws) => {
  console.log('📱 New client connected');
  
  ws.gameId = null; // Track which game session this client belongs to
  ws.isHost = false;

  // Send current games list to new client
  ws.send(JSON.stringify({ 
    type: 'gamesList', 
    games: Array.from(games.values()) 
  }));

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());

      switch (message.type) {
        case 'createGame':
          const game = {
            id: message.game.id,
            hostName: message.game.hostName,
            hostColor: message.game.hostColor,
            createdAt: message.game.createdAt
          };
          games.set(game.id, game);
          
          // Set up session for host
          ws.gameId = game.id;
          ws.isHost = true;
          
          console.log(`🎮 Game created: ${game.id} by ${game.hostName}`);
          broadcast({ type: 'gamesList', games: Array.from(games.values()) });
          break;

        case 'removeGame':
          if (games.has(message.gameId)) {
            games.delete(message.gameId);
            console.log(`❌ Game removed: ${message.gameId}`);
            broadcast({ type: 'gamesList', games: Array.from(games.values()) });
          }
          break;

        case 'joinGame':
          if (games.has(message.gameId)) {
            const game = games.get(message.gameId);
            games.delete(message.gameId);
            
            // Set up session for guest
            ws.gameId = message.gameId;
            ws.isHost = false;
            
            // Find the host connection
            let hostWs = null;
            for (const client of wss.clients) {
              if (client.gameId === message.gameId && client.isHost) {
                hostWs = client;
                break;
              }
            }
            
            // Create active session
            if (hostWs) {
              activeSessions.set(message.gameId, {
                host: hostWs,
                guest: ws,
                gameState: {
                  player1Pos: { row: 0, col: 0 },
                  player2Pos: { row: 7, col: 7 },
                  apples: [],
                  currentTurn: 1
                }
              });
            }
            
            console.log(`🎮 ${message.guestName} joined game ${message.gameId}`);
            
            // Notify all clients about the match
            broadcast({ 
              type: 'gameStarted',
              gameId: message.gameId,
              hostName: game.hostName,
              hostColor: game.hostColor,
              guestName: message.guestName,
              guestColor: message.guestColor
            });
            
            // Update games list
            broadcast({ type: 'gamesList', games: Array.from(games.values()) });
          }
          break;

        case 'getGames':
          ws.send(JSON.stringify({ 
            type: 'gamesList', 
            games: Array.from(games.values()) 
          }));
          break;

        case 'gameMove':
          // Forward move to opponent
          if (ws.gameId && activeSessions.has(ws.gameId)) {
            const session = activeSessions.get(ws.gameId);
            const opponent = ws.isHost ? session.guest : session.host;
            
            if (opponent && opponent.readyState === 1) {
              opponent.send(JSON.stringify({
                type: 'opponentMove',
                move: message.move
              }));
              console.log(`📤 Forwarded move in game ${ws.gameId}`);
            }
          }
          break;

        case 'gameEnd':
          // Forward game end to opponent
          if (ws.gameId && activeSessions.has(ws.gameId)) {
            const session = activeSessions.get(ws.gameId);
            const opponent = ws.isHost ? session.guest : session.host;
            
            if (opponent && opponent.readyState === 1) {
              opponent.send(JSON.stringify({
                type: 'gameEnded',
                winner: message.winner
              }));
              console.log(`🏆 Game ${ws.gameId} ended - Winner: ${message.winner}`);
            }
            
            // Clean up session
            activeSessions.delete(ws.gameId);
          }
          break;

        default:
          console.log('Unknown message type:', message.type);
      }
    } catch (e) {
      console.error('Error processing message:', e);
    }
  });

  ws.on('close', () => {
    console.log('📱 Client disconnected');
    
    // Clean up session if this was part of an active game
    if (ws.gameId && activeSessions.has(ws.gameId)) {
      const session = activeSessions.get(ws.gameId);
      const opponent = ws.isHost ? session.guest : session.host;
      
      // Notify opponent that player left
      if (opponent && opponent.readyState === 1) {
        opponent.send(JSON.stringify({
          type: 'opponentLeft',
          message: 'Your opponent has left the game'
        }));
        console.log(`👋 Notified opponent that player left game ${ws.gameId}`);
      }
      
      activeSessions.delete(ws.gameId);
      console.log(`🧹 Cleaned up session ${ws.gameId}`);
    }
    
    // Remove any pending games created by this client
    if (ws.gameId && games.has(ws.gameId)) {
      games.delete(ws.gameId);
      broadcast({ type: 'gamesList', games: Array.from(games.values()) });
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

server.listen(PORT, () => {
  console.log(`🎮 Pferdeäpfel server running on port ${PORT}`);
  console.log('✨ Server ready to accept connections');
});
