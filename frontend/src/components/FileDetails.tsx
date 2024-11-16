import React, { useState } from "react";
import Image from "next/image";
import { fileImage, star } from "../../public";
import classes from "@/styles/FileDetails.module.css";
import { MdClose } from "react-icons/md";
import { deleteDark, starDark, downloadDark } from "../../public";
import { FileType } from "@/types/driveTypes";
import CID from "cids";
import { formatFileSize } from "@/utils/getFormattedSize";
import { getFormattedDate } from "@/utils/getFormattedDate";
import { useDrive } from "@/contexts/DriveContext";
import { useDealId } from "@/hooks/useDealId";
import useNotification from "@/hooks/useNotification";
import { downloadFile } from "@/utils/downloadFile";
import { useAccount } from "wagmi";
import { useFiles } from "@/contexts/fileContext";
import { useRouter } from "next/navigation";
import { useRemoveFileFromCart } from "@/hooks/useRemoveFileFromCart";

const FileDetails: React.FC = () => {
  const { starFile, selected, setSelected } = useDrive();
  const { getDealId } = useDealId();
  const { showNotification } = useNotification();
  const [openingFilfox, setIsOpeningFilfox] = useState(false);
  const { address: userAccount } = useAccount();
  const { setRenewFiles, setTotalRenewDealsCount } = useFiles();
  const { removeFileFromCart } = useRemoveFileFromCart();
  const router = useRouter();

  const handleOpenFilfox = async () => {
    setIsOpeningFilfox(true);
    try {
      const fileCid = selected
        ? "pieceCid" in selected
          ? selected?.pieceCid
          : ""
        : "";
      if (fileCid === "") {
        setIsOpeningFilfox(false);
        return;
      }
      const cid = new CID(fileCid);
      const response = await getDealId(cid);
      setIsOpeningFilfox(false);
      if (Number(response) === 0) {
        showNotification({ type: "INFO", message: "Deal would be live soon!" });
        return;
      }
      const url = `https://calibration.filfox.info/en/deal/${Number(
        response
      ).toString()}`;
      if (window !== undefined) window.open(url, "_blank");
    } catch (error) {
      setIsOpeningFilfox(false);
      showNotification({ type: "ERROR", message: "Error opening Filfox!" });
    }
  };

  const handleRenewDeal = async () => {
    if (!userAccount) return;
    if (!selected || !("endDate" in selected)) return;
    if (!selected.carSize) {
      showNotification({ type: "ERROR", message: "Car size not found!" });
      return;
    }
    const fileId = selected._id;
    if (selected.needsRenewal) {
      await removeFileFromCart(fileId);
    } else {
      await addFileToCart(fileId, selected);
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
        setTotalRenewDealsCount((prev) => prev + 1);
        showNotification({
          type: "SUCCESS",
          message: "File added to cart!",
        });
      } else {
        showNotification({ type: "ERROR", message: "Error adding to cart!" });
      }
    } catch (err) {
      showNotification({ type: "ERROR", message: "Error adding to cart!" });
      console.log(err);
    }
  };
  if (!selected) return <div></div>;
  if (!("cid" in selected)) return <div></div>;
  return (
    <div className={"file-details-container"}>
      <button
        className={classes["close-btn"]}
        onClick={() => {
          router.back();
        }}
      >
        <MdClose size={15} fill={"#fff"} />
      </button>
      <Image
        src={fileImage}
        alt="file-image"
        className={classes["preview-img"]}
      />
      <div className={classes.actions}>
        <button disabled>
          <Image src={deleteDark} alt="delete" />
        </button>
        <div
          onClick={() => {
            if (
              !selected?.name ||
              selected?.folder_id === undefined ||
              selected?.starred === undefined
            )
              return;
            starFile(selected.name, true, selected.starred);
          }}
        >
          <Image src={selected?.starred ? starDark : star} alt="star" />
        </div>
        <button
          onClick={() => {
            if (userAccount) {
              downloadFile(selected.cid, selected.name, userAccount.toString());
            } else {
              showNotification({
                type: "ERROR",
                message: "User account not found!",
              });
            }
          }}
          disabled={selected?.cid === ""}
        >
          <Image src={downloadDark} alt="download" />
        </button>
      </div>
      <div className={classes["file-name"]}>
        <h6>{selected.name}</h6>
        <p>{selected.cid}</p>
      </div>

      <div className={classes["file-info"]}>
        <h6>Info</h6>
        <div className={classes["file-size"]}>
          <p>Size</p>
          <p>{formatFileSize(selected.size)}</p>
        </div>
        <div className={classes["file-size"]}>
          <p>Start Date</p>
          <p>{getFormattedDate(new Date(selected.startDate))}</p>
        </div>
        <div className={classes["file-size"]}>
          <p>End Date</p>
          <p>{getFormattedDate(new Date(selected.endDate))}</p>
        </div>
        <div className={classes["file-size"]}>
          <p>Created</p>
          <p>{getFormattedDate(selected.created_at)}</p>
        </div>
      </div>

      <button
        className={classes["view-deal-button"]}
        onClick={handleOpenFilfox}
        disabled={openingFilfox}
      >
        {openingFilfox ? "Opening..." : "View Deal"}
      </button>
      <button className={classes["view-deal-button"]} onClick={handleRenewDeal}>
        {selected.needsRenewal ? "Remove From Cart" : "Renew Deal"}
      </button>
    </div>
  );
};

export default FileDetails;
