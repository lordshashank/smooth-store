import { contractTypeAddress as contractAddress, abi } from "../../constants";
import DealStruct, { BackendFileType } from "@/types/dealTypes";
import { postDeal } from "@/utils/postDeal";
import useNotification from "./useNotification";
import { useFiles } from "@/contexts/fileContext";
import { useWriteContract } from "wagmi";
import { bytesToHex, parseEther } from "viem";

const useDealClient = () => {
  const { setFiles, setRenewFiles } = useFiles();
  const { showNotification } = useNotification();

  const { writeContractAsync } = useWriteContract();

  const makeBatchDealProposal = async (
    dealsArray: DealStruct[],
    userAccount: string,
    deals: BackendFileType[],
    renewDealsLength: number
  ) => {
    try {
      const dealRequests = dealsArray.map((deal) => {
        const piece_cid = bytesToHex(deal.shift() as Uint8Array);
        return [piece_cid, ...deal];
      });
      const response = await writeContractAsync(
        {
          address: contractAddress.DealClient,
          args: [dealRequests],
          abi: abi.DealClient,
          functionName: "makeBatchDealProposal",
        },
        {
          onSuccess: async () => {
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
      return response;
    } catch (error) {
      console.log(error);
    }
  };
  const makeDealProposal = async (
    dealsArray: DealStruct,
    userAccount: string,
    deals: BackendFileType[],
    renewDealsLength: number
  ) => {
    try {
      const piece_cid = bytesToHex(dealsArray.shift() as Uint8Array);
      const deal = [piece_cid, ...dealsArray];
      const response = await writeContractAsync(
        {
          address: contractAddress.DealClient,
          args: [deal],
          abi: abi.DealClient,
          functionName: "makeDealProposal",
          value: parseEther("0.1"),
        },
        {
          onSuccess: async () => {
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
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  return { makeBatchDealProposal, makeDealProposal };
};
export default useDealClient;
