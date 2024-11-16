import { chains } from "./chains";
import { filecoin } from "../../public";

export const getActiveChainName = (chainId: number) => {
  const chain = chains.find((chain) => chain.chainId === chainId);
  if (!chain) {
    return {
      src: filecoin,
      name: "Filecoin",
      chainId: 314159,
      gasLimit: 6000000,
    };
  }
  return chain;
};
