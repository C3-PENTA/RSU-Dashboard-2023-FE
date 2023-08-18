import { ReactNode, createContext, useContext, useState } from 'react';

type LoadingProviderProps = {
  children: ReactNode;
};

const LoadingContext = createContext({
  loading: false,
  setLoading: (loading: boolean) => {
    return;
  },
});

export const LoadingProvider = ({ children }: LoadingProviderProps) => {
  const [loading, setLoading] = useState(false);
  const value = { loading, setLoading };
  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
};
