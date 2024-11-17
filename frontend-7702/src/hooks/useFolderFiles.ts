import { useDrive } from "@/contexts/DriveContext";
import { use, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { getFolderFiles } from "@/utils/actions";
import { Account } from "@/modules/Account";

export const useFolderFiles = (folder_id: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const { setDrive } = useDrive();
  const { data: account } = Account.useQuery();
  const address = account?.address;
  useEffect(() => {
    const getData = async () => {
      if (!address) return;
      setIsLoading(true);
      try {
        const response = await getFolderFiles(address.toLowerCase(), folder_id);
        if (response?.success) {
          setDrive({ files: response.files, folders: response.folders });
        }
        setIsLoading(false);
      } catch (e) {
        console.log(e);
        setIsLoading(false);
      }
    };
    if (address) {
      getData();
    }
  }, [address]);

  return { isLoading };
};
