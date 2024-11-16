"use client";
import { usePathname } from "next/navigation";
import classes from "@/styles/DriveHeader.module.css";
import { useDrive } from "@/contexts/DriveContext";
import SortPop from "./SortPop";
import Link from "next/link";
import ActionModal from "./ActionModal";
import { useFiles } from "@/contexts/fileContext";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";

const DriveHeader = () => {
  const {
    sortFilesBySize,
    sortFilesByStartDate,
    sortFilesByEndDate,
    sortFilesByCreatedAt,
  } = useDrive();
  const { totalRenewDealsCount } = useFiles();
  const pathname = usePathname();

  const handleSort = (value: string) => {
    switch (value) {
      case "size":
        sortFilesBySize();
        break;
      case "startDate":
        sortFilesByStartDate();
        break;
      case "endDate":
        sortFilesByEndDate();
        break;
      case "created_at":
        sortFilesByCreatedAt();
        break;
      default:
        break;
    }
  };

  return (
    <div className={classes["drive-header"]}>
      {/* <div className={classes["search-input-container"]}>
        <div className={classes["input-container"]}>
          <input placeholder="Search Drive" />
          <button className={classes["search-btn"]}>
            <Image src={search} alt={"search"} />
          </button>
        </div>
        <button className={classes["caret-btn"]}>
          <Image src={caretButton} alt="down" />
        </button>
      </div> */}
      <div className={classes.actions}>
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
        <ActionModal />
        <SortPop handleSort={handleSort} />
      </div>
      <div className={classes.modal}>
        <DynamicWidget />
      </div>
    </div>
  );
};

export default DriveHeader;
