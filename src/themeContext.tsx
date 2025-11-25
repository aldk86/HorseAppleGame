import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type KnightSymbol = 'chess' | 'horse' | 'crown' | 'star';

export interface BoardTheme {
  id: string;
  name: string;
  lightSquare: string;
  darkSquare: string;
  highlight: string;
  selected: string;
}

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  boardTheme: BoardTheme;
  setBoardTheme: (theme: BoardTheme) => void;
  knightSymbol: KnightSymbol;
  setKnightSymbol: (symbol: KnightSymbol) => void;
}

export const BOARD_THEMES: BoardTheme[] = [
  {
    id: 'classic',
    name: 'Classic',
    lightSquare: '#f0d9b5',
    darkSquare: '#b58863',
    highlight: '#90EE90',
    selected: '#FFD700'
  },
  {
    id: 'blue',
    name: 'Ocean Blue',
    lightSquare: '#e0f2f7',
    darkSquare: '#4a90a4',
    highlight: '#80deea',
    selected: '#ffd54f'
  },
  {
    id: 'green',
    name: 'Forest Green',
    lightSquare: '#e8f5e9',
    darkSquare: '#388e3c',
    highlight: '#aed581',
    selected: '#ffeb3b'
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    lightSquare: '#f3e5f5',
    darkSquare: '#7b1fa2',
    highlight: '#ba68c8',
    selected: '#ffd740'
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    lightSquare: '#ffffff',
    darkSquare: '#404040',
    highlight: '#90ee90',
    selected: '#ffd700'
  },
  {
    id: 'sunset',
    name: 'Sunset',
    lightSquare: '#ffe0b2',
    darkSquare: '#d84315',
    highlight: '#ffcc80',
    selected: '#ffeb3b'
  }
];

export const KNIGHT_SYMBOLS: Record<KnightSymbol, { player1: string; player2: string; name: string }> = {
  chess: { player1: '♘', player2: '♞', name: 'Chess Knights' },
  horse: { player1: '🐴', player2: '🐎', name: 'Horse Emojis' },
  crown: { player1: '👑', player2: '🎩', name: 'Royal Symbols' },
  star: { player1: '⭐', player2: '✨', name: 'Stars' }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [boardTheme, setBoardTheme] = useState<BoardTheme>(() => {
    const saved = localStorage.getItem('boardTheme');
    if (saved) {
      const themeId = JSON.parse(saved);
      return BOARD_THEMES.find(t => t.id === themeId) || BOARD_THEMES[0];
    }
    return BOARD_THEMES[0];
  });

  const [knightSymbol, setKnightSymbol] = useState<KnightSymbol>(() => {
    const saved = localStorage.getItem('knightSymbol');
    return (saved ? JSON.parse(saved) : 'chess') as KnightSymbol;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.body.style.backgroundColor = '#1a1a1a';
    } else {
      document.body.style.backgroundColor = '#f5f5f5';
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('boardTheme', JSON.stringify(boardTheme.id));
  }, [boardTheme]);

  useEffect(() => {
    localStorage.setItem('knightSymbol', JSON.stringify(knightSymbol));
  }, [knightSymbol]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{
      isDarkMode,
      toggleDarkMode,
      boardTheme,
      setBoardTheme,
      knightSymbol,
      setKnightSymbol
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
