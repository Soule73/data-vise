import {
  //Profiler,
  StrictMode
} from 'react'
import { createRoot } from 'react-dom/client'
import '@styles/index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  // <Profiler id="App" onRender={(id, phase, actualDuration) => {
  // }}>
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
  // {/* </Profiler> */}
);
