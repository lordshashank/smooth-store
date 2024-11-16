import classes from "@/styles/shopping-cart/ShoppingListItem.module.css";
import Image from "next/image";
import { addDays, addYears } from "date-fns";
import { FileType } from "@/types/driveTypes";
import { fileImage } from "../../../public";
import { formatFileSize } from "@/utils/getFormattedSize";
import { useRemoveFileFromCart } from "@/hooks/useRemoveFileFromCart";

interface RenewListItemProps {
  file: FileType;
  startDateHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  endDateHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const RenewListItem: React.FC<RenewListItemProps> = ({
  file,
  startDateHandler,
  endDateHandler,
}) => {
  const { removeFileFromCart } = useRemoveFileFromCart();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  let minEndDate = addDays(new Date(file.startDate), 190);
  let maxEndDate = addYears(new Date(file.endDate), 3.5);
  return (
    <li className={classes["files-list-item"]}>
      <Image src={fileImage} alt="file" />
      <div className={classes.right}>
        <div className={classes["name-remove"]}>
          <div className={classes["details"]}>
            <a href={"#"}>{file.name}</a>
            {/* <p>8303-3839-3839</p> */}
          </div>
          <button
            className={classes.close}
            onClick={() => {
              removeFileFromCart(file._id);
            }}
          ></button>
        </div>
        <div className={classes.info}>
          <h3>Info</h3>
          <div className={classes.size}>
            <p>Size</p>
            <p>{formatFileSize(file.size)}</p>
          </div>
          <div className={classes["start-date"]}>
            <label htmlFor="start-time">Start Time</label>
            <input
              id="start-time"
              type="date"
              value={file.startDate}
              data-id={file.cid}
              onChange={startDateHandler}
              min={tomorrow.toISOString().split("T")[0]}
              max={maxEndDate.toISOString().split("T")[0]}
              style={{ width: "120px" }}
            />
          </div>
          <div className={classes["start-date"]}>
            <label htmlFor="end-time">End Time</label>
            <input
              id="end-time"
              type="date"
              value={file.endDate}
              data-id={file.cid}
              onChange={endDateHandler}
              disabled={file.startDate.length === 0}
              min={minEndDate.toISOString().split("T")[0]}
              max={maxEndDate.toISOString().split("T")[0]}
              style={{ width: "120px" }}
            />
          </div>
        </div>
      </div>
    </li>
  );
};

export default RenewListItem;
