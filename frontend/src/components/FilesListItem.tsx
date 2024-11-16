import { FileType } from "@/types/driveTypes";
import Image from "next/image";
import { previewIcon } from "../../public";
import { formatFileSize } from "@/utils/getFormattedSize";
import classes from "@/styles/FilesListItem.module.css";
import FileIcon from "./FileIcon";
import Link from "next/link";
import { useDrive } from "@/contexts/DriveContext";
import { usePathname, useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useFiles } from "@/contexts/fileContext";
import { useRemoveFileFromCart } from "@/hooks/useRemoveFileFromCart";
import { MdOutlineEnergySavingsLeaf } from "react-icons/md";
import { TbCircleLetterR } from "react-icons/tb";
import useNotification from "@/hooks/useNotification";
import { Tooltip } from "react-tooltip";
import { differenceInDays } from "date-fns";
interface FilesListItemProps {
  file: FileType;
  handleListItemRightClick: (event: React.MouseEvent, file: FileType) => void;
}

const FilesListItem: React.FC<FilesListItemProps> = ({
  file,
  handleListItemRightClick,
}) => {
  const { selected, setSelected } = useDrive();
  const pathName = usePathname();
  const router = useRouter();
  const isSelected = selected
    ? "id" in selected
      ? selected?.id === file.id
      : false
    : false;
  const { address: userAccount } = useAccount();
  const { setRenewFiles, setTotalRenewDealsCount } = useFiles();
  const { removeFileFromCart } = useRemoveFileFromCart();
  const { showNotification } = useNotification();
  const date = new Date(file.endDate);
  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  const currentDate = new Date();
  const startDate = new Date(file.startDate);
  const endDate = new Date(file.endDate);
  const oneMonthBeforeEndDate = new Date(endDate);
  oneMonthBeforeEndDate.setMonth(endDate.getMonth() - 1);

  let status = "";
  if (currentDate < startDate) {
    status = "pending";
  } else if (currentDate >= startDate && currentDate < oneMonthBeforeEndDate) {
    status = "active";
  } else if (currentDate >= oneMonthBeforeEndDate && currentDate <= endDate) {
    status = "expiring";
  } else {
    status = "expired";
  }
  // useEffect(() => {
  //   const getDealIdH = async () => {
  //     const cid = new CID(file.cid);
  //     const response = await getDealId(cid);
  //   };

  //   if (file.cid) {
  //     getDealIdH();
  //   }
  // }, [file.cid]);

  const handleAddToRenewCart = async () => {
    if (!userAccount) return;
    if (!("endDate" in file)) return;
    if (!file.carSize) {
      showNotification({ type: "ERROR", message: "Car size not found!" });
      return;
    }
    const fileId = file._id;
    try {
      if (file.needsRenewal) {
        await removeFileFromCart(fileId);
        file.needsRenewal = false;
      } else {
        await addFileToCart(fileId, file);
        router.push(`${pathName}?status=upload`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const addFileToCart = async (fileId: string, selected: FileType) => {
    if (!userAccount) return;
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/users/${userAccount.toLowerCase()}/cart/renew-deal/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ file_id: fileId }),
        }
      );

      if (response.ok) {
        const updatedSelected: FileType = {
          ...selected,
          needsRenewal: true,
        } as FileType;
        setSelected(updatedSelected);
        setRenewFiles((prev) => [...prev, selected]);
        file.needsRenewal = true;
        setTotalRenewDealsCount((prev) => prev + 1);
        showNotification({
          type: "SUCCESS",
          message: "File added to cart!",
        });
        if (status === "pending" || status === "active") {
          const diff = differenceInDays(endDate, currentDate);
          showNotification({
            type: "WARN",
            message: `Deal would be live for ${diff} more days!`,
          });
        }
      } else {
        showNotification({ type: "ERROR", message: "Error adding to cart!" });
      }
    } catch (err) {
      showNotification({ type: "ERROR", message: "Error adding to cart!" });
      console.log(err);
    }
  };

  const RENEWFILLCOLOR = file.needsRenewal ? "#9a9eff" : "#000";
  return (
    <li
      className={`${classes["files-list-item"]} ${
        isSelected ? classes["active-file"] : ""
      }`}
      key={file.id.toString()}
      onClick={() => setSelected(file)}
      onContextMenu={(event) => handleListItemRightClick(event, file)}
    >
      <FileIcon mimeType={file.mimeType} size="small" />
      <div className={classes["heading-wrapper"]}>
        <h4>{file.name}</h4>
      </div>
      <p className={classes["file-expire"]}>{formattedDate}</p>
      <p className={classes["file-size"]}>{formatFileSize(file.size)}</p>
      <p className={`${classes["file-status"]} ${classes[status]}`}>{status}</p>
      <div className={classes["file-actions-group"]}>
        <button
          className={classes["file-actions"]}
          onClick={handleAddToRenewCart}
          data-tooltip-id="renew"
          data-tooltip-content={
            file.needsRenewal ? "Added for Renewal" : "Add File for Renewal"
          }
        >
          <TbCircleLetterR fill={RENEWFILLCOLOR} size={14} color="#AEB9E1" />
        </button>
        <Tooltip id="renew" className={classes["tool-tip"]} />
        <Tooltip id="view" className={classes["tool-tip"]} />
        <Link
          className={classes["file-actions"]}
          href={`${pathName}?status=details`}
          data-tooltip-id="view"
          data-tooltip-content={"View File Info"}
        >
          <Image src={previewIcon} width={14} height={14} alt="info" />
        </Link>
      </div>
    </li>
  );
};

export default FilesListItem;
