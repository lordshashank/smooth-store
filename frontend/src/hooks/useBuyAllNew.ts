"use client";
import { useState } from "react";
import CID from "cids";
import useNotification from "./useNotification";
import { FileData, useFiles } from "@/contexts/fileContext";
import useDealClient from "./useDealClient";
import useCrossDealClient from "./useCrossDealClient";
import { useChainId, useAccount } from "wagmi";
import {
  getDealForRenew,
  getBackendDealForRenew,
} from "@/utils/dealRenewHelpers";
import useSmoothStore from "./useSmoothStore";
import useToken from "./useToken";
import { bytesToHex } from "viem";
import BigNumber from "bignumber.js";
import { contractTypeAddress } from "../../constants";
import { postDeal } from "@/utils/postDeal";
import { BackendFileType } from "@/types/dealTypes";
import { Miner } from "@/app/drive/miner/page";

export interface Deal extends BackendFileType {
  carLink?: string;
  miner?: Miner;
}

export const useBuyAllNew = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { files, renewFiles, setFiles, setRenewFiles } = useFiles();

  // const { account: userAccount, chainId } = useMoralis();
  const { address: userAccount } = useAccount();
  const chainId = useChainId();
  const { offerDataBatch } = useSmoothStore();
  const { approve } = useToken();
  const { showNotification } = useNotification();
  const { makeDealProposal, makeBatchDealProposal } = useDealClient();
  const { makeBatchCrossDealProposal } = useCrossDealClient();

  const handleBuy = async () => {
    if (!userAccount) {
      showNotification({ type: "ERROR", message: "Please Connect to Wallet!" });
      return;
    }
    if (files.length + renewFiles.length === 0) return;

    try {
      setIsLoading(true);

      const dealParamsArray = await Promise.all(
        files.map((fileData) => getDealParams(fileData))
      );

      const dealRequestStructs = dealParamsArray.map((dealParams, index) =>
        createDealRequestStruct(dealParams, files[index])
      );

      const deals: Deal[] = dealParamsArray.map((dealParams, index) =>
        createDealObject(dealParams, files[index])
      );
      // const backendDeals = renewFiles.map((fileData) =>
      //   getBackendDealForRenew(fileData)
      // );
      // const combinedDeals = deals.concat(backendDeals);

      // console.log(combinedDeals);

      const minerPrices: {
        [key: string]: { value: string; token: `0x${string}` };
      } = {};

      for (let i = 0; i < deals.length; i++) {
        const deal = deals[i];
        if (!deal.miner) return;
        const value = new BigNumber(deal.pieceSize.toString())
          .multipliedBy(deal.miner.amountPerByte.toString())
          .toString();
        console.log(value);
        minerPrices[deal.miner.minerId] = minerPrices[deal.miner.minerId] || {
          value: "0",
          token: `0x${deal.miner.token}`,
        };
        minerPrices[deal.miner.minerId].value = new BigNumber(
          minerPrices[deal.miner.minerId]?.value || "0"
        )
          .plus(value.toString())
          .toString();
        console.log(minerPrices);
        minerPrices[deal.miner.minerId].token = deal.miner
          .token as `0x${string}`;
      }

      console.log(minerPrices);

      for (let miner in minerPrices) {
        console.log(minerPrices[miner].value);
        const valueAsBigInt = BigInt(
          new BigNumber(minerPrices[miner].value).toFixed(0)
        );

        await approve(
          contractTypeAddress.SmoothStoreOP,
          valueAsBigInt.toString(),
          minerPrices[miner].token
        );
      }

      // add timeout for 15 seconds to wait for approval
      await new Promise((resolve) => setTimeout(resolve, 30000));

      let result;
      result = await offerDataBatch(
        deals.map((deal) => {
          const cid = new CID(deal.pieceCid).bytes;
          return {
            minerId: deal.miner?.minerId || "",
            commP: bytesToHex(cid),
            size: deal.pieceSize,
            location: deal.carLink || "",
          };
        }),
        userAccount,
        deals,
        renewFiles.length
      );

      // delete the miner field from each deal object
      deals.forEach((deal) => {
        delete deal.miner;
      });

      // if (Number(chainId) === 314159) {
      //   result = await makeBatchDealProposal(
      //     dealRequestStructs,
      //     userAccount.toLowerCase(),
      //     combinedDeals,
      //     backendDeals.length
      //   );
      // } else {
      //   result = await makeBatchCrossDealProposal(
      //     dealRequestStructs,
      //     userAccount.toLowerCase(),
      //     combinedDeals,
      //     backendDeals.length
      //   );
      // }

      // Handle the result as needed

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      showNotification({ type: "ERROR", message: "Something Went Wrong!" });
      console.error(error);
    }
  };

  const handleRenewDeal = async () => {
    // ...
    if (renewFiles.length === 0) return;
    if (!userAccount) {
      showNotification({ type: "ERROR", message: "Please Connect to Wallet!" });
      return;
    }

    const deals = renewFiles.map((fileData) => getDealForRenew(fileData));

    const backendDeals = renewFiles.map((fileData) =>
      getBackendDealForRenew(fileData)
    );

    try {
      setIsLoading(true);

      let result;
      if (Number(chainId) === 314159) {
        result = await makeBatchDealProposal(
          deals,
          userAccount.toLowerCase(),
          backendDeals,
          backendDeals.length
        );
      } else {
        result = await makeBatchCrossDealProposal(
          deals,
          userAccount.toLowerCase(),
          backendDeals,
          backendDeals.length
        );
      }

      // Handle the result as needed

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      showNotification({ type: "ERROR", message: "Something Went Wrong!" });
    }
  };

  const getDealParams = async (fileData: FileData) => {
    // ...

    const formData = new FormData();
    formData.append("files", fileData.file);
    formData.append("startDate", fileData.startDate);
    formData.append("endDate", fileData.endDate);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/piece-cid`,
      {
        method: "POST",
        body: formData,
      }
    );

    const resData = await response.json();

    if (resData.success === false) {
      throw new Error("Something Went Wrong!");
    }

    const dealParams = resData.result;

    if (dealParams.pieceCid === "") {
      throw new Error("Try again after sometime!");
    }

    return dealParams;
  };

  const createDealRequestStruct = (dealParams: any, fileData: FileData) => {
    // ...

    const commP = dealParams["pieceCid"];
    // console.log(commP);
    // setDealCid(commP);

    const cid = new CID(commP);
    // setDealCid(cid);
    const genesisDate = new Date("2022-11-02");
    const genesisTime = genesisDate.getTime() / 1000;
    // console.log(genesisTime);
    const startDate = new Date(fileData.startDate);
    const startTime = startDate.getTime() / 1000;
    // console.log(startTime);
    const endDate = new Date(fileData.endDate);
    const endTime = endDate.getTime() / 1000;
    // console.log(endTime);
    const startEpoch = Math.floor((startTime - genesisTime) / 30) + 2000;
    const endEpoch = Math.floor((endTime - genesisTime) / 30) + 2000;
    // console.log(startEpoch, "to", endEpoch);
    const verifiedDeal = true;
    const extraParamsV1 = [
      dealParams.carLink,
      dealParams.carSize, //carSize,
      false, // taskArgs.skipIpniAnnounce,
      false, // taskArgs.removeUnsealedCopy
    ];
    const DealRequestStruct = [
      cid.bytes, //cidHex
      dealParams.pieceSize, //taskArgs.pieceSize,
      verifiedDeal, //taskArgs.verifiedDeal,
      commP, //taskArgs.label,
      startEpoch, // startEpoch
      endEpoch, // endEpoch
      0, // taskArgs.storagePricePerEpoch,
      0, // taskArgs.providerCollateral,
      0, // taskArgs.clientCollateral,
      1, //taskArgs.extraParamsVersion,
      extraParamsV1,
    ];

    return DealRequestStruct;
  };

  const createDealObject = (dealParams: any, fileData: FileData) => {
    // ...

    const commP = dealParams["pieceCid"];
    // console.log(commP);
    // setDealCid(commP);

    const cid = new CID(commP);
    // setDealCid(cid);
    const genesisDate = new Date("2022-11-02");
    const genesisTime = genesisDate.getTime() / 1000;
    // console.log(genesisTime);
    const startDate = new Date(fileData.startDate);
    const startTime = startDate.getTime() / 1000;
    // console.log(startTime);
    const endDate = new Date(fileData.endDate);
    const endTime = endDate.getTime() / 1000;
    // console.log(endTime);
    const startEpoch = Math.floor((startTime - genesisTime) / 30) + 2000;
    const endEpoch = Math.floor((endTime - genesisTime) / 30) + 2000;
    // console.log(startEpoch, "to", endEpoch);
    const verifiedDeal = true;
    const extraParamsV1 = [
      dealParams.carLink,
      dealParams.carSize, //carSize,
      false, // taskArgs.skipIpniAnnounce,
      false, // taskArgs.removeUnsealedCopy
    ];
    const deal = {
      id: dealParams.id,
      folder_id: fileData.folderId,
      name: fileData.file.name,
      size: fileData.file.size,
      mimeType: dealParams.mimeType,
      cid: dealParams.root,
      pieceCid: commP,
      pieceSize: dealParams.pieceSize,
      carSize: dealParams.carSize,
      startDate: fileData.startDate,
      startEpoch: startEpoch,
      endDate: fileData.endDate,
      endEpoch: endEpoch,
      verifiedDeal: verifiedDeal,
      needsRenewal: false,
      miner: fileData.miner,
      carLink: dealParams.carLink,
    };

    return deal;
  };

  return {
    handleBuy,
    handleRenewDeal,
    length: files.length + renewFiles.length,
    renewLength: renewFiles.length,
    isLoading,
  };
};
