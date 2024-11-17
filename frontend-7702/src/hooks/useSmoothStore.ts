import {
  contractTypeAddress as contractAddress,
  abi,
  contractTypeAddress,
} from "../../constants";
import useNotification from "./useNotification";
import { useFiles } from "@/contexts/fileContext";
import { useWaitForTransactionReceipt } from "wagmi";
// import { parseEther } from "viem";
import { postDeal } from "@/utils/postDeal";
import { BigNumber } from "ethers";
import { BackendFileType } from "@/types/dealTypes";
import { Deal } from "./useBuyAllNew";
import { client } from "@/components/providers/NoneProviders";
import { Account } from "../modules/Account";
import { encodeFunctionData, formatEther } from "viem";

interface Offer {
  minerId: string;
  commP: string;
  size: number;
  location: string;
}

const useSmoothStore = ({
  account,
}: {
  account: Account.Account | undefined;
}) => {
  const { setFiles, setRenewFiles } = useFiles();
  const { showNotification } = useNotification();

  const {
    data: hash,
    mutateAsync: execute,
    isPending,
  } = Account.useExecute({
    client,
  });

  const { data: receipt, ...receiptQuery } = useWaitForTransactionReceipt({
    hash,
  });

  const registerMiner = async (
    token: string,
    amountPerByte: BigNumber,
    location: string,
    retrieval: boolean,
    minerId: string
  ) => {
    if (!account) return;
    try {
      const response = await execute({
        account,
        calls: [
          {
            to: contractAddress.SmoothStore,
            data: encodeFunctionData({
              abi: abi.SmoothStore,
              functionName: "registerMiner",
              args: [token, amountPerByte, location, retrieval, minerId],
            }),
          },
        ],
      });
      showNotification({
        type: "SUCCESS",
        message: "Miner registered successfully!",
      });
      return response;
    } catch (error) {
      console.log(error);
      showNotification({
        type: "ERROR",
        message: "Miner registration failed!",
      });
    }
  };

  const approveAndRegisterMiner = async (
    owner: string,
    spender: string,
    amount: string,
    // contractAddress: `0x${string}`
    token: string,
    amountPerByte: BigInt,
    location: string,
    retrieval: boolean,
    minerId: string
  ) => {
    if (!account) return;
    console.log(token as `0x${string}`);
    try {
      const response = await execute({
        account,
        calls: [
          {
            to: token as `0x${string}`,
            data: encodeFunctionData({
              abi: abi.Token,
              functionName: "mint",
              args: [owner, amount],
            }),
          },
          {
            to: token as `0x${string}`,
            data: encodeFunctionData({
              abi: abi.Token,
              functionName: "approve",
              args: [spender, amount],
            }),
          },
        ],
      });
      showNotification({
        type: "SUCCESS",
        message: "Miner registered successfully!",
      });
      return response;
    } catch (error) {
      console.log(error);
      showNotification({
        type: "ERROR",
        message: "Miner registration failed!",
      });
    }
  };

  const offerDataBatch = async (
    token: string,
    amount: string,
    offersArray: Offer[],
    userAccount: string,
    deals: Deal[],
    renewDealsLength: number
  ) => {
    if (!account) return;
    try {
      const response = await execute({
        account,
        calls: [
          {
            to: token as `0x${string}`,
            data: encodeFunctionData({
              abi: abi.Token,
              functionName: "mint",
              args: [account.address, amount],
            }),
          },
          {
            to: token as `0x${string}`,
            data: encodeFunctionData({
              abi: abi.Token,
              functionName: "approve",
              args: [contractTypeAddress.SmoothStore, amount],
            }),
          },
        ],
      });

      deals.forEach((deal) => {
        delete deal.miner;
        delete deal.carLink;
      });
      const backResponse = await postDeal(userAccount, deals, renewDealsLength);
      if (backResponse.success) {
        const uploadedSizes = backResponse.files.map((deal) => deal.size);
        setFiles((prev) =>
          prev.filter((file) => !uploadedSizes.includes(file.file.size))
        );
        setRenewFiles((prev) =>
          prev.filter((file) => !uploadedSizes.includes(file.size))
        );
        showNotification({
          type: "SUCCESS",
          message: "File uploaded Successfully!",
        });
      }
      return response;
    } catch (error) {
      console.log(error);
      // showNotification({
      //   type: "ERROR",
      //   message: "Something went wrong!",
      // });
    }
  };

  return { registerMiner, offerDataBatch, approveAndRegisterMiner };
};

export default useSmoothStore;
