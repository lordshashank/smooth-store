import { FileType } from "@/types/driveTypes";
import styles from "@/styles/FilesList.module.css";
import FilesListItem from "./FilesListItem";
import Image from "next/image";
import { gridIcon, rowIcon } from "../../public";
import { useState } from "react";
import FilesListItemVerticle from "./FilesListItemVerticle";

interface FilesListProps {
  files: FileType[];
  handleListItemRightClick: (event: React.MouseEvent, files: FileType) => void;
}
const FilesList: React.FC<FilesListProps> = ({
  files,
  handleListItemRightClick,
}) => {
  const [isGrid, setIsGrid] = useState(false);
  return (
    <div className={styles["files-container"]}>
      <div className={styles["files-header"]}>
        <h3 className={styles["files-heading"]}>Files</h3>
        {/* <div className={styles["files-show-action"]}>
          <button
            className={isGrid ? styles.active : ""}
            onClick={() => setIsGrid(true)}
          >
            <Image src={gridIcon} alt="grid" />
          </button>
          <button
            className={isGrid ? "" : styles.active}
            onClick={() => setIsGrid(false)}
          >
            <Image src={rowIcon} alt="row" />
          </button>
        </div> */}
      </div>
      {files.length > 0 ? (
        isGrid ? (
          <ul className={styles.grid}>
            {files.map((file) => (
              <FilesListItemVerticle
                key={file.id}
                file={file}
                handleListItemRightClick={handleListItemRightClick}
              />
            ))}
          </ul>
        ) : (
          <ul className={styles["files-list"]}>
            <li className={styles["files-list-item-first"]}>
              <div className={styles["except-size"]}></div>
              <p className={styles["file-expire"]}>Expires in</p>
              <p className={styles["file-size"]}>File size</p>
              <p className={styles["file-status"]}>Status</p>
              <div className={styles["file-actions-group"]}></div>
            </li>
            {files.map((file) => (
              <FilesListItem
                key={file.id}
                file={file}
                handleListItemRightClick={handleListItemRightClick}
              />
            ))}
          </ul>
        )
      ) : (
        <p>There are no files.</p>
      )}
    </div>
  );
};

export default FilesList;
