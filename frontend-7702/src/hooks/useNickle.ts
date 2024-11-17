import { contractTypeAddress as contractAddress, abi } from "../../constants";
import { useReadContracts, useWriteContract } from "wagmi";
import { BigNumber } from "ethers";
import { encodeFunctionData } from "viem";
import useNotification from "./useNotification";
import { Account } from "@/modules/Account";
import { client } from "@/components/providers/NoneProviders";

const useNickle = () => {
  const { showNotification } = useNotification();
  const { writeContractAsync } = useWriteContract();
  const { data: account } = Account.useQuery();
  const {
    data: hash,
    mutate: execute,
    error,
    ...executeQuery
  } = Account.useExecute({
    client,
  });

  const allowance = async (
    owner: string,
    spender: string
  ): Promise<BigNumber | undefined> => {
    try {
      const { data, error } = useReadContracts({
        contracts: [
          {
            address: contractAddress.Nickle,
            abi: abi.Nickle,
            functionName: "allowance",
            args: [owner, spender],
          },
        ],
      });

      if (error) {
        console.error("Error reading allowance:", error);
        return undefined;
      }

      if (data && data[0] && data[0].result) {
        return data[0].result as BigNumber;
      }
      return undefined;
    } catch (error) {
      console.error("Error reading allowance:", error);
      return undefined;
    }
  };

  const approve = async (
    spender: string,
    amount: string,
    contractAddress: `0x${string}`
  ) => {
    if (!account) return;
    try {
      execute({
        account,
        calls: [
          {
            to: contractAddress,
            data: encodeFunctionData({
              abi: abi.Nickle,
              functionName: "approve",
              args: [spender, amount],
            }),
          },
        ],
      });
      showNotification({
        type: "SUCCESS",
        message: "Allowance updated successfully!",
      });
    } catch (error) {
      console.error("Error updating allowance:", error);
      showNotification({
        type: "ERROR",
        message: "Failed to update allowance!",
      });
    }
  };

  return { allowance, approve };
};

export default useNickle;
