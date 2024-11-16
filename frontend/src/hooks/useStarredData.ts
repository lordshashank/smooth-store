import { useEffect, useState } from "react";
import { FileType, FolderType } from "@/types/driveTypes";
import { getStarredData } from "@/utils/actions";
import { useAccount } from "wagmi";

type DataType = {
  files: FileType[];
  folders?: FolderType[];
};
export const useStarredData = () => {
  const [data, setData] = useState<DataType>({
    files: [],
    folders: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const { address: account } = useAccount();

  const getData = async () => {
    if (!account) return;
    setIsLoading(true);
    try {
      const response = await getStarredData(account);
      if (response?.success) {
        setData({ files: response.files, folders: response.folders });
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
