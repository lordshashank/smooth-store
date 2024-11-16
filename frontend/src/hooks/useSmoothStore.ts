import { contractTypeAddress as contractAddress, abi } from "../../constants";
import useNotification from "./useNotification";
import { useFiles } from "@/contexts/fileContext";
import { useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { postDeal } from "@/utils/postDeal";
import { BigNumber } from "ethers";
import { BackendFileType } from "@/types/dealTypes";
import { Deal } from "./useBuyAllNew";

interface Offer {
  minerId: string;
  commP: string;
  size: number;
  location: string;
}

const useSmoothStore = () => {
  const { setFiles, setRenewFiles } = useFiles();
  const { showNotification } = useNotification();

  const { writeContractAsync } = useWriteContract();

  const registerMiner = async (
    token: string,
    amountPerByte: BigNumber,
    location: string,
    retrieval: boolean,
    minerId: string
  ) => {
    try {
      const response = await writeContractAsync({
        address: contractAddress.SmoothStoreOP,
        args: [token, amountPerByte, location, retrieval, minerId],
        abi: abi.SmoothStore,
        functionName: "registerMiner",
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
    offersArray: Offer[],
    userAccount: string,
    deals: Deal[],
    renewDealsLength: number
  ) => {
    try {
      const response = await writeContractAsync(
        {
          address: contractAddress.SmoothStoreOP,
          args: [offersArray],
          abi: abi.SmoothStore,
          functionName: "offerDataBatch",
        },
        {
          onSuccess: async () => {
            deals.forEach((deal) => {
              delete deal.miner;
              delete deal.carLink;
            });
            const backResponse = await postDeal(
              userAccount,
              deals,
              renewDealsLength
            );
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
          },
          onError: (error) => {
            console.log(error);
            showNotification({
              type: "ERROR",
              message: "Something Went Wrong!",
            });
          },
        }
      );
      showNotification({
        type: "SUCCESS",
        message: "Files uploaded successfully!",
      });
      return response;
    } catch (error) {
      console.log(error);
      showNotification({
        type: "ERROR",
        message: "Something went wrong!",
      });
    }
  };

  const offerData = async (offer: Offer) => {
    try {
      const response = await writeContractAsync({
        address: contractAddress.SmoothStoreOP,
        args: [offer],
        abi: abi.SmoothStore,
        functionName: "offerData",
        // value: parseEther("0.1"),
      });
      showNotification({
        type: "SUCCESS",
        message: "File uploaded successfully!",
      });
      return response;
    } catch (error) {
      console.log(error);
      showNotification({
        type: "ERROR",
        message: "Something went wrong!",
      });
    }
  };

  return { registerMiner, offerDataBatch, offerData };
};

export default useSmoothStore;
