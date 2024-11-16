"use client";
import classes from "@/styles/FilesList.module.css";
import { FolderType } from "@/types/driveTypes";
import FoldersListItem from "./FoldersListItem";

interface FoldersListProps {
  folders: FolderType[];
  handleListItemRightClick: (
    event: React.MouseEvent,
    folder: FolderType
  ) => void;
}
const FoldersList: React.FC<FoldersListProps> = ({
  folders,
  handleListItemRightClick,
}) => {
  return (
    <div className={classes["folders-container"]}>
      <h3>Folders</h3>
      {folders.length > 0 ? (
        <ul className={classes["files-list"]}>
          <li className={classes["files-list-item-first"]}>
            <div className={classes["except-size"]}></div>
            <p className={classes["folder-last-modified"]}>Last Modified</p>
          </li>
          {folders.map((folder) => (
            <FoldersListItem
              key={folder._id}
              handleListItemRightClick={handleListItemRightClick}
              folder={folder}
            />
          ))}
        </ul>
      ) : (
        <p>No folders found.</p>
      )}
    </div>
  );
};

export default FoldersList;
