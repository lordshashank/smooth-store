import { useSearchParams, usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import useNotification from "./useNotification";
import { useEffect } from "react";
import { useFiles } from "@/contexts/fileContext";

export const useRenewDeals = () => {
  const { address } = useAccount();
  const pathname = usePathname();
  const { showNotification } = useNotification();
  const { setRenewFiles, totalRenewDealsCount, renewFiles } = useFiles();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  useEffect(() => {
    const getRenewDeals = async () => {
      if (!address) return;
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL
          }/users/${address.toLowerCase()}/cart/renew-deals`
        );

        if (response.ok) {
          const data = await response.json();

          setRenewFiles(data.files);
        } else {
          showNotification({
            type: "ERROR",
            message: "Unable to fetch renewal Deals!",
          });
        }
      } catch (err) {
        console.log(err);
        showNotification({
          type: "ERROR",
          message: "Unable to fetch renewal Deals!",
        });
      }
    };
    if (renewFiles.length !== totalRenewDealsCount) {
      if (
        address
          ? pathname === "/drive/shopping-cart"
            ? true
            : status === "upload"
            ? true
            : false
          : false
      )
        getRenewDeals();
    }
  }, [status, address, totalRenewDealsCount]);
};
