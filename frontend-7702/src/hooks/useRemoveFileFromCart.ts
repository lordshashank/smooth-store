import { useFiles } from "@/contexts/fileContext";
import { useDrive } from "@/contexts/DriveContext";
import { useAccount } from "wagmi";
import useNotification from "./useNotification";
import { FileType } from "@/types/driveTypes";
import { Account } from "@/modules/Account";

export const useRemoveFileFromCart = () => {
  const { setRenewFiles, setTotalRenewDealsCount } = useFiles();
  const { selected, setSelected } = useDrive();
  const { showNotification } = useNotification();
  const { data: account } = Account.useQuery();
  const userAccount = account?.address;

  const removeFileFromCart = async (fileId: string) => {
    if (!userAccount) return;
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/users/${userAccount.toLowerCase()}/cart/renew-deal/${fileId}/remove`,
        { method: "DELETE" }
      );

      if (response.ok) {
        const updatedSelected: FileType = {
          ...selected,
          needsRenewal: false,
        } as FileType;
        setSelected(updatedSelected);
        setRenewFiles((prev) => prev.filter((file) => file._id !== fileId));
        setTotalRenewDealsCount((prev) => prev - 1);
        showNotification({
          type: "SUCCESS",
          message: "File removed from cart!",
        });
      } else {
        const res = await response.json();
        console.log(res.message);
        showNotification({
          type: "ERROR",
          message: "Error removing from cart!",
        });
      }
    } catch (err) {
      showNotification({ type: "ERROR", message: "Error removing from cart!" });
      console.log(err);
    }
  };

  return { removeFileFromCart };
};
