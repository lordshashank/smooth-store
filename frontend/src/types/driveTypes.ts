import { Miner } from "@/app/drive/miner/page";

export interface FileType {
  _id: string;
  id: string;
  user_id: string;
  folder_id: string;
  size: number;
  name: string;
  mimeType: string;
  cid: string;
  pieceCid: string;
  pieceSize: number;
  carSize: number;
  startDate: string;
  startEpoch: number;
  endDate: string;
  endEpoch: number;
  verifiedDeal: boolean;
  created_at: Date;
  starred: boolean;
  needsRenewal: boolean;
  miner: Miner;
}
export interface FolderType {
  _id: string;
  user_id: string;
  parent_id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  starred: boolean;
}
