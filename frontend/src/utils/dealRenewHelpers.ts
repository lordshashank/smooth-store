import { stringToHex } from "viem";
import { FileType, FolderType } from "../types/driveTypes";
import CID from "cids";
import { compareAsc, subDays } from "date-fns";
export const getDealForRenew = (selected: FileType) => {
  const cid = new CID(selected.cid);
  const genesisDate = new Date("2022-11-02");
  const genesisTime = genesisDate.getTime() / 1000;
  const startDate = new Date(selected.startDate);
  const startTime = startDate.getTime() / 1000;
  const endDate = new Date(selected.endDate);
  const endTime = endDate.getTime() / 1000;
  const startEpoch = Math.floor((startTime - genesisTime) / 30) + 2000;
  const endEpoch = Math.floor((endTime - genesisTime) / 30) + 2000;
  const verifiedDeal = true;
  const carLink = `https://data-depot.lighthouse.storage/api/download/download_car?fileId=${selected.id}.car`;
  const extraParamsV1 = [
    carLink,
    selected.carSize, //carSize,
    false, // taskArgs.skipIpniAnnounce,
    false, // taskArgs.removeUnsealedCopy
  ];
  const deal = [
    cid.bytes, //cidHex
    selected.pieceSize, //taskArgs.pieceSize,
    verifiedDeal, //taskArgs.verifiedDeal,
    selected.pieceCid, //taskArgs.label,
    startEpoch, // startEpoch
    endEpoch, // endEpoch
    0, // taskArgs.storagePricePerEpoch,
    0, // taskArgs.providerCollateral,
    0, // taskArgs.clientCollateral,
    1, //taskArgs.extraParamsVersion,
    extraParamsV1,
  ];
  return deal;
};

export const getBackendDealForRenew = (selected: FileType) => {
  const cid = new CID(selected.cid);
  const genesisDate = new Date("2022-11-02");
  const genesisTime = genesisDate.getTime() / 1000;
  const startDate = new Date(selected.startDate);
  const startTime = startDate.getTime() / 1000;
  const endDate = new Date(selected.endDate);
  const endTime = endDate.getTime() / 1000;
  const startEpoch = Math.floor((startTime - genesisTime) / 30) + 2000;
  const endEpoch = Math.floor((endTime - genesisTime) / 30) + 2000;
  const verifiedDeal = true;
  const deal = {
    id: selected.id,
    folder_id: selected.folder_id,
    size: selected.size,
    name: selected.name,
    mimeType: selected.mimeType,
    cid: selected.cid,
    pieceSize: selected.pieceSize,
    carSize: selected.carSize,
    pieceCid: selected.pieceCid,
    startDate: selected.startDate,
    startEpoch: startEpoch,
    endDate: selected.endDate,
    endEpoch: endEpoch,
    verifiedDeal: verifiedDeal,
    needsRenewal: false,
    miner: selected.miner,
  };
  return deal;
};

export const showRenewButton = (
  selected: FileType | FolderType | undefined,
  days: number
) => {
  if (!selected) return false;
  if (!("cid" in selected)) return false;

  const currentDate = new Date();
  const endDate = new Date(selected.endDate);

  const beforeEndDate = subDays(endDate, days);

  return compareAsc(currentDate, beforeEndDate) === 1;
};
