export interface GameRoom {
  id: string;
  hostName: string;
  hostColor: string;
  createdAt: number;
}

class GameManager {
  private games: Map<string, GameRoom> = new Map();
  private listeners: Set<() => void> = new Set();
  private ws: WebSocket | null = null;
  private reconnectTimer: number | null = null;

  constructor() {
    this.connectWebSocket();
  }

  generateGameId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < 6; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  createGame(hostName: string, hostColor: string): GameRoom {
    const id = this.generateGameId();
    const game: GameRoom = {
      id,
      hostName,
      hostColor,
      createdAt: Date.now()
    };
    this.games.set(id, game);
    
    // Send to server
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'createGame',
        game
      }));
    }
    
    this.notifyListeners();
    return game;
  }

  getGame(id: string): GameRoom | undefined {
    return this.games.get(id);
  }

  getAllGames(): GameRoom[] {
    return Array.from(this.games.values());
  }

  removeGame(id: string): boolean {
    const result = this.games.delete(id);
    if (result) {
      // Send to server
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'removeGame',
          gameId: id
        }));
      }
      this.notifyListeners();
    }
    return result;
  }

  joinGame(gameId: string, guestName: string, guestColor: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'joinGame',
        gameId,
        guestName,
        guestColor
      }));
    }
  }

  onGameStarted(callback: (data: { gameId: string; hostName: string; hostColor: string; guestName: string; guestColor: string }) => void): () => void {
    const handler = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'gameStarted') {
          callback(message);
        }
      } catch (e) {
        // Ignore parsing errors
      }
    };

    if (this.ws) {
      this.ws.addEventListener('message', handler);
    }

    return () => {
      if (this.ws) {
        this.ws.removeEventListener('message', handler);
      }
    };
  }

  sendMove(move: { player: number; oldPos: { row: number; col: number }; newPos: { row: number; col: number }; apples: { row: number; col: number }[]; nextTurn: number }): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'gameMove',
        move
      }));
    }
  }

  sendGameEnd(winner: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'gameEnd',
        winner
      }));
    }
  }

  onGameEnded(callback: (winner: string) => void): () => void {
    const handler = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'gameEnded') {
          callback(message.winner);
        }
      } catch (e) {
        // Ignore parsing errors
      }
    };

    if (this.ws) {
      this.ws.addEventListener('message', handler);
    }

    return () => {
      if (this.ws) {
        this.ws.removeEventListener('message', handler);
      }
    };
  }

  onOpponentLeft(callback: (message: string) => void): () => void {
    const handler = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'opponentLeft') {
          callback(message.message);
        }
      } catch (e) {
        // Ignore parsing errors
      }
    };

    if (this.ws) {
      this.ws.addEventListener('message', handler);
    }

    return () => {
      if (this.ws) {
        this.ws.removeEventListener('message', handler);
      }
    };
  }

  onOpponentMove(callback: (move: { player: number; newPos: { row: number; col: number }; apples: { row: number; col: number }[]; nextTurn: number }) => void): () => void {
    const handler = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'opponentMove') {
          callback(message.move);
        }
      } catch (e) {
        // Ignore parsing errors
      }
    };

    if (this.ws) {
      this.ws.addEventListener('message', handler);
    }

    return () => {
      if (this.ws) {
        this.ws.removeEventListener('message', handler);
      }
    };
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  clearAll() {
    this.games.clear();
    this.notifyListeners();
  }

  private connectWebSocket() {
    try {
      const wsUrl = window.location.hostname === 'localhost' 
        ? 'ws://localhost:3001'
        : `ws://${window.location.hostname}:3001`;
      
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('🔗 Connected to game server');
        // Request current games list
        this.ws?.send(JSON.stringify({ type: 'getGames' }));
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === 'gamesList') {
            this.games.clear();
            message.games.forEach((game: GameRoom) => {
              this.games.set(game.id, game);
            });
            this.notifyListeners();
          }
        } catch (e) {
          console.error('Error processing server message:', e);
        }
      };

      this.ws.onclose = () => {
        console.log('❌ Disconnected from game server');
        this.ws = null;
        // Attempt to reconnect after 3 seconds
        this.reconnectTimer = window.setTimeout(() => {
          this.connectWebSocket();
        }, 3000);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (e) {
      console.error('Failed to connect to game server:', e);
    }
  }

  destroy() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    if (this.ws) {
      this.ws.close();
    }
  }
}

export const gameManager = new GameManager();
