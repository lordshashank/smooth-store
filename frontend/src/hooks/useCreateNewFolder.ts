"use client";

import { useState } from "react";
import useNotification from "./useNotification";
import { useAccount } from "wagmi";
import { createFolder } from "@/utils/actions";
import { useDrive } from "@/contexts/DriveContext";
import { useRouter } from "next/navigation";

export const useCreateNewFolder = (parentId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();
  const { address: account } = useAccount();
  const { setDrive } = useDrive();
  const router = useRouter();

  const handleCreateNewFolder = async (formData: FormData) => {
    if (!account) return;
    setIsLoading(true);
    const folderName = formData.get("folder") as string;
    try {
      const response = await createFolder(parentId, account, folderName);
      if (response.success) {
        setDrive((prev) => ({
          ...prev,
          folders: [...prev.folders, response.folder],
        }));
        showNotification({
          type: "SUCCESS",
          message: "Folder Created Successfully!",
        });
        router.push(`/drive/folders/${parentId}?new=false`);
      } else
        showNotification({
          type: "ERROR",
          message: "Something Went Wrong!",
        });

      setIsLoading(false);
    } catch (e) {
      console.log(e);
      showNotification({
        type: "ERROR",
        message: "Something Went Wrong!",
      });
      setIsLoading(false);
    }
  };

  return { handleCreateNewFolder, isLoading };
};
