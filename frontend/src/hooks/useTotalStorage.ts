"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { getTotalStorage } from "@/utils/actions";
export const useTotalStorage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [usedStorage, setUsedStorage] = useState(0);
  const { address: account } = useAccount();

  useEffect(() => {
    const getData = async () => {
      if (!account) return;
      setIsLoading(true);
      try {
        const response = await getTotalStorage(account);
        if (response?.totalStorage) {
          setUsedStorage(response.totalStorage);
        }
        setIsLoading(false);
      } catch (e) {
        console.log(e);
        setIsLoading(false);
      }
    };
    if (account) getData();
  }, [account]);

  return { usedStorage, isLoading };
};
