import { createRoot } from 'react-dom/client';
import './index.css';
import '@blocknote/mantine/style.css';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { initAuth } from '@/api/initAuth';
import React from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      gcTime: 10 * 60 * 1000,
    },
  },
});
const root = createRoot(document.getElementById('root')!);

(async () => {
  try {
    await initAuth(); //reissue
  } finally {
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <App />
            <Toaster
              position='top-center'
              toastOptions={{
                duration: 2000,
                success: { duration: 2000 },
                error: { duration: 2000 },
              }}
            />
          </QueryClientProvider>
        </BrowserRouter>
      </React.StrictMode>,
    );
  }
})();
