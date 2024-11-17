import { useEffect, useState } from "react";
import { FileType, FolderType } from "@/types/driveTypes";
import { getExpiredFiles, getAllFiles } from "@/utils/actions";
import { useAccount } from "wagmi";
import { Account } from "@/modules/Account";

type PathType = "EXPIRED" | "ALLFILES";
export type DataType = {
  files: FileType[];
};
export const useExpiredOrAllFiles = (path: PathType) => {
  const [data, setData] = useState<DataType>({
    files: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const { data: address } = Account.useQuery();
  const account = address?.address;

  const getData = async () => {
    if (!account) return;
    setIsLoading(true);
    try {
      const response =
        path === "EXPIRED"
          ? await getExpiredFiles(account.toLowerCase())
          : await getAllFiles(account.toLowerCase());
      if (response?.success) {
        setData({ files: response.files });
      }
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (account) {
      getData();
    }
  }, [account]);

  return { data, isLoading, setData };
};
