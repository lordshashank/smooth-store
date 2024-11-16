"use client";
import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { createConfig, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import {
  filecoinCalibration,
  polygonMumbai,
  arbitrumSepolia,
  fantomTestnet,
  optimismSepolia,
  avalancheFuji,
  moonbaseAlpha,
  celoAlfajores,
  mantleTestnet,
  scrollSepolia,
  baseSepolia,
  blastSepolia,
} from "viem/chains";

import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import React from "react";

const config = createConfig({
  chains: [
    filecoinCalibration,
    polygonMumbai,
    arbitrumSepolia,
    fantomTestnet,
    optimismSepolia,
    avalancheFuji,
    moonbaseAlpha,
    celoAlfajores,
    mantleTestnet,
    scrollSepolia,
    baseSepolia,
    blastSepolia,
  ],
  multiInjectedProviderDiscovery: false,
  pollingInterval: 1000,
  transports: {
    [filecoinCalibration.id]: http(),
    [polygonMumbai.id]: http(),
    [arbitrumSepolia.id]: http(),
    [fantomTestnet.id]: http(),
    [optimismSepolia.id]: http(),
    [avalancheFuji.id]: http(),
    [moonbaseAlpha.id]: http(),
    [celoAlfajores.id]: http(),
    [mantleTestnet.id]: http(),
    [scrollSepolia.id]: http(),
    [baseSepolia.id]: http(),
    [blastSepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

export default function DynamicProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_KEY as string,
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>{children}</DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}
