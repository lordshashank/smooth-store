import { contractTypeAddress as contractAddress, abi } from "../../constants";
import { useChainId } from "wagmi";
import DealStruct, { BackendFileType } from "@/types/dealTypes";
import { postDeal } from "@/utils/postDeal";
import { useFiles } from "@/contexts/fileContext";
import useNotification from "./useNotification";
import { calculateBridgeFee } from "@/utils/calculateGasFee";
import { bytesToHex, parseUnits } from "viem";
import { useWriteContract } from "wagmi";
const useCrossDealClient = () => {
  const chainId = useChainId();
  const { setFiles, setRenewFiles } = useFiles();
  const { showNotification } = useNotification();

  const { writeContractAsync } = useWriteContract();

  const makeBatchCrossDealProposal = async (
    dealsArray: DealStruct[],
    userAccount: string,
    deals: BackendFileType[],
    renewDealsLength: number
  ) => {
    try {
      const fee = (await calculateBridgeFee(Number(chainId), {})) as string;
      const dealRequests = dealsArray.map((deal) => {
        const piece_cid = bytesToHex(deal.shift() as Uint8Array);
        return [piece_cid, ...deal];
      });
      const response = await writeContractAsync(
        {
          address: contractAddress[`${Number(chainId)}`],
          args: ["filecoin-2", contractAddress.DealClient, dealRequests],
          abi: abi.CrossDealClient,
          functionName: "makeBatchCrossDeal",
          value: parseUnits(fee, 0),
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

  return { makeBatchCrossDealProposal };
};
export default useCrossDealClient;
