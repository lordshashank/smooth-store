"use client";
import React, { useState } from "react";
import Image from "next/image";
import classes from "@/styles/DriveHeader.module.css";
import { down } from "../../public";
import SortPop from "./SortPop";
import {
  sortFilesBySize,
  sortFilesByStartDate,
  sortFilesByEndDate,
  sortFilesByCreatedAt,
} from "@/utils/SortActions";
import { FileType, FolderType } from "@/types/driveTypes";
import Link from "next/link";
import { useFiles } from "@/contexts/fileContext";
import { usePathname } from "next/navigation";

type DriveType = {
  files: FileType[];
  folders?: FolderType[];
};
interface SortHeaderProps {
  setData: React.Dispatch<React.SetStateAction<DriveType>>;
}

const SortHeader: React.FC<SortHeaderProps> = ({ setData }) => {
  const [showSortOptions, setShowSortOptions] = useState(false);
  const { totalRenewDealsCount } = useFiles();
  const pathname = usePathname();

  const handleSort = (value: string) => {
    switch (value) {
      case "size":
        // Call the sorting function for size
        sortFilesBySize(setData);
        break;
      case "startDate":
        // Call the sorting function for startDate
        sortFilesByStartDate(setData);
        break;
      case "endDate":
        // Call the sorting function for endDate
        sortFilesByEndDate(setData);
        break;
      case "created_at":
        // Call the sorting function for created_at
        sortFilesByCreatedAt(setData);
        break;
      default:
        break;
    }
    setShowSortOptions(false);
  };

  return (
    <div className={classes["drive-header"]}>
      <div className={classes["cart-wrapper"]}>
        <Link
          href={`${pathname}?status=upload`}
          className={classes["sort-btn"]}
        >
          Uploads
        </Link>
        <p className={`${classes.badge} ${classes.shake}`}>
          {totalRenewDealsCount > 9 ? "9+" : totalRenewDealsCount}
        </p>
      </div>
      <SortPop handleSort={handleSort} />
    </div>
  );
};

export default SortHeader;
