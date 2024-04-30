'use client'
import { ChakraProvider } from '@chakra-ui/react'
import '@rainbow-me/rainbowkit/styles.css';
import { sepolia } from 'wagmi/chains';

import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';

import { publicProvider } from 'wagmi/providers/public';

import { infuraProvider } from 'wagmi/providers/infura';

const { chains, publicClient } = configureChains(
  [sepolia],
  [
    infuraProvider({ apiKey: "8c1b27267a58405583b4da2943d9cae7
" })
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Pool App',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID || '',
  chains
});

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains}>
            <ChakraProvider>
              {children}
            </ChakraProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </body>
    </html>
  )
}
