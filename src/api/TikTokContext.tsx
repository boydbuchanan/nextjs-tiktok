import { createContext, useContext, useState, ReactNode } from 'react';

interface TikTokContextType {
  state: {
    userInfo: any;
  };
  actions: {
    setUserInfo: (info: string) => void;
  };
}

const defaultTikTokContext: TikTokContextType = {
  state: {
    userInfo: '',
  },
  actions: {
    setUserInfo: () => {},
  },
};

export const TikTokContext = createContext<TikTokContextType>(defaultTikTokContext);

export function useTikTok(): TikTokContextType {
  return useContext(TikTokContext);
}

interface TikTokProviderProps {
  children: ReactNode;
}

export function TikTokProvider({ children }: TikTokProviderProps) {
  const [userInfo, setUserInfo] = useState<string>('');
  const value: TikTokContextType = {
    state: { userInfo },
    actions: { setUserInfo },
  };

  return (
    <TikTokContext.Provider value={value}>
      {children}
    </TikTokContext.Provider>
  );
}