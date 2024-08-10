import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { TonConnectUIProvider } from '@tonconnect/ui-react';

createRoot(document.getElementById('root')).render(

  <div className='root'>
    <TonConnectUIProvider
      manifestUrl="https://ton-flip-coin.vercel.app/tonconnect-manifest.json"
      actionsConfiguration={{
        returnStrategy: 'https://t.me/ryan_hsu_test_bot/myapp'
      }}
    >
      <StrictMode>
        <App />
      </StrictMode>
    </TonConnectUIProvider>
  </div>
)
