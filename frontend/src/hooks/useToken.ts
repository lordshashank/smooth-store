import { contractTypeAddress as contractAddress, abi } from "../../constants";
import { useReadContracts, useWriteContract } from "wagmi";
import { BigNumber } from "ethers";
import useNotification from "./useNotification";

const useToken = () => {
  const { showNotification } = useNotification();
  const { writeContractAsync } = useWriteContract();

  const allowance = async (
    owner: string,
    spender: string
  ): Promise<BigNumber | undefined> => {
    try {
      const { data, error } = useReadContracts({
        contracts: [
          {
            address: contractAddress.Token,
            abi: abi.Token,
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
    try {
      const response = await writeContractAsync({
        address: contractAddress,
        abi: abi.Token,
        functionName: "approve",
        args: [spender, amount],
      });
      showNotification({
        type: "SUCCESS",
        message: "Allowance updated successfully!",
      });
      return response;
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

export default useToken;
