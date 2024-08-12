import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { TonConnectUIProvider } from '@tonconnect/ui-react';

createRoot(document.getElementById('root')).render(

  <div className='root'>
    <TonConnectUIProvider
      manifestUrl="https://bafkreieptlsvvbm3jt63km7uukdzeiknd6k5vgdy2dgjqozwhq2ogyfwfy.ipfs.web3approved.com/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaWQiOiJiYWZrcmVpZXB0bHN2dmJtM2p0NjNrbTd1dWtkemVpa25kNms1dmdkeTJkZ2pxb3p3aHEyb2d5ZndmeSIsInByb2plY3RfdXVpZCI6ImY3MjlmMjA5LTQxNDItNDZiOC1hNjM4LTFiZTEwZWZkYjI2MCIsImlhdCI6MTcyMzQ1NDM2Niwic3ViIjoiSVBGUy10b2tlbiJ9.7i5DNl93YLKeGRPCHJIX6mE-rnUgbHNSHWExD8j5lHo"
      actionsConfiguration={{
        twaReturnUrl: 'https://t.me/ryan_hsu_test_bot/myapp'
      }}
    >
      <StrictMode>
        <App />
      </StrictMode>
    </TonConnectUIProvider>
  </div>
)
