import {
  AxelarQueryAPI,
  Environment,
  CHAINS,
} from "@axelar-network/axelarjs-sdk";
import { getActiveChainName } from "./getActiveChainName";

type OptionsType = {
  gasLimit?: number;
  gasMultiplier?: number;
  symbol?: string;
};

type ChainsTestnetType = {
  [key: string]: string;
};

export async function calculateBridgeFee(
  chainId: number,
  options: OptionsType
) {
  try {
    const api = new AxelarQueryAPI({ environment: Environment.TESTNET });

    const { gasLimit, gasMultiplier, symbol } = options;
    const chain = getActiveChainName(chainId);

    const chainsTestnet: ChainsTestnetType = CHAINS.TESTNET; // Add type annotation

    const result = await api.estimateGasFee(
      chainsTestnet[chain.name.toUpperCase()], // Use the indexed access operator
      CHAINS.TESTNET["FILECOIN"],
      chain.gasLimit.toString(),
      gasMultiplier
    );
    return result as string;
  } catch (err) {
    console.log(err);
  }
}
