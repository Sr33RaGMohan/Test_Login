import React, { createContext, useContext, useState } from 'react';

// Define a type for results
interface Results {
  score: number;
  correct: number;
  wrong: number;
  skipped: number;
  timeTaken: string;
}

// Define context type including setCategory
interface AppContextType {
  category: string;
  setCategory: (newCategory: string) => void;
  results: Results | null;
  setResults: (results: Results) => void;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create provider
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [category, setCategory] = useState<string>('');
  const [results, setResults] = useState<Results | null>(null);

  const contextValue: AppContextType = {
    category,
    setCategory,
    results,
    setResults,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

// Custom hook to use context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};