type extraParamsV1 = (string | number | boolean)[];

type DealStruct = (string | number | boolean | Uint8Array | extraParamsV1)[];
export default DealStruct;

export interface BackendFileType {
  id: string;
  folder_id: string;
  size: number;
  name: string;
  mimeType: string;
  cid: string;
  pieceSize: number;
  carSize: number;
  pieceCid: string;
  startDate: string;
  startEpoch: number;
  endDate: string;
  endEpoch: number;
  verifiedDeal: boolean;
  needsRenewal: boolean;
}
