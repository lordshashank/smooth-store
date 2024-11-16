import classes from "@/styles/shopping-cart/ShoppingListItem.module.css";
import Image from "next/image";
import { fileImage } from "../../../public";
import { FileData } from "@/contexts/fileContext";
import { formatFileSize } from "@/utils/getFormattedSize";
import { addDays, addYears } from "date-fns";
import { Miner } from "@/app/drive/miner/page";
import { convertBytesToMinerId } from "@/utils/helpers";

interface ShoppingListItemProps {
  fileData: FileData;
  startDateHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  endDateHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (e: React.MouseEvent) => void;
  tomorrow: Date;
  minersData: Miner[];
}
const ShoppingListItem: React.FC<ShoppingListItemProps> = ({
  fileData,
  startDateHandler,
  endDateHandler,
  removeFile,
  tomorrow,
  minersData,
}) => {
  const file = fileData.file;
  let minEndDate = addDays(new Date(fileData.startDate), 190);
  let maxEndDate = addYears(new Date(fileData.endDate), 3.5);
  return (
    <li className={classes["files-list-item"]}>
      <Image src={fileImage} alt="file" />
      <div className={classes.right}>
        <div className={classes["name-remove"]}>
          <div className={classes["details"]}>
            <a
              href={URL.createObjectURL(file)}
              target="_blank"
              rel="noreferrer"
            >
              {file.name}
            </a>
            {/* <p>8303-3839-3839</p> */}
          </div>

          <button
            key={file.lastModified}
            data-key={file.lastModified}
            className={classes.close}
            onClick={removeFile}
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
              data-id={file.lastModified}
              value={fileData.startDate}
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
              data-id={file.lastModified}
              value={fileData.endDate}
              onChange={endDateHandler}
              disabled={fileData.startDate.length === 0}
              min={minEndDate.toISOString().split("T")[0]}
              max={maxEndDate.toISOString().split("T")[0]}
              style={{ width: "120px" }}
            />
          </div>
          <div className={classes["start-date"]}>
            <label htmlFor="miners">Miners</label>
            <select name="miners" id="miners">
              {minersData &&
                minersData.map((miner) => (
                  <option key={miner.minerId} value={miner.minerId}>
                    {convertBytesToMinerId(miner.minerId)}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
    </li>
  );
};

export default ShoppingListItem;
