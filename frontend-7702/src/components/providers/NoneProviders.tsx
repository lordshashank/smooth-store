"use client";
import { createConfig, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { odysseyTestnet } from "viem/chains";

import React from "react";

const config = createConfig({
  chains: [odysseyTestnet],
  multiInjectedProviderDiscovery: false,
  transports: {
    [odysseyTestnet.id]: http(),
  },
});

export const queryClient = new QueryClient();
export const client = config.getClient();
export type Client = typeof client;

export default function NoneProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
