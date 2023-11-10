import { useState, useMemo } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import Confession from './pages/Confession';
import { ContextProvider } from './context/Context';
import Router from './Router';


function App() {
  const endpoint = "https://api.devnet.solana.com"
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
    ],
    []
  )

  return (

    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <ContextProvider>
          <Router/>
          {/* <Confession/> */}
        </ContextProvider>
      </WalletProvider> 
    </ConnectionProvider>
  )
}

export default App
