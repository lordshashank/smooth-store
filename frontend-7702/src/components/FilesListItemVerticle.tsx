"use client";
import classes from "@/styles/FilesListItemVerticle.module.css";
import Image from "next/image";
import { folder as folderIcon, user, folderXl } from "../../public";
import { FileType, FolderType } from "@/types/driveTypes";
import { formatFileSize } from "@/utils/getFormattedSize";
import FileIcon from "./FileIcon";
import { useDrive } from "@/contexts/DriveContext";

interface FilesListItemVerticleProps {
  file: FileType;
  handleListItemRightClick: (event: React.MouseEvent, file: FileType) => void;
}
const FilesListItemVerticle: React.FC<FilesListItemVerticleProps> = ({
  file,
  handleListItemRightClick,
}) => {
  const { selected, setSelected } = useDrive();
  const isSelected = selected
    ? "id" in selected
      ? selected?.id === file.id
      : false
    : false;
  return (
    <li
      className={`${classes["file-container"]} ${
        isSelected ? classes["active-file"] : ""
      }`}
      onClick={() => setSelected(file)}
      onContextMenu={(event) => handleListItemRightClick(event, file)}
    >
      <div className={classes["diff-bg"]}>
        <FileIcon mimeType={file.mimeType} size="large" />
        <div className={classes["name-user"]}>
          <h4>{file.name}</h4>
          <p>{file.user_id}</p>
        </div>
      </div>
      <div className={classes["size-user"]}>
        <p>{formatFileSize(file.size)}</p>
        {/* <Image src={user} alt="user" /> */}
      </div>
    </li>
  );
};

export default FilesListItemVerticle;
