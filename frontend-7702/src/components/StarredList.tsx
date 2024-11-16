import React from "react";
import classes from "@/styles/Starred.module.css";
import { FolderType, FileType } from "@/types/driveTypes";
import FoldersListItem from "./FoldersListItem";
import FilesListItem from "./FilesListItem";
interface StarredListProps {
  starred: {
    files: FileType[];
    folders?: FolderType[];
  };
  handleListItemRightClick: (
    event: React.MouseEvent,
    files: FileType | FolderType
  ) => void;
}
const StarredList: React.FC<StarredListProps> = ({
  starred,
  handleListItemRightClick,
}) => {
  return (
    <>
      {starred.folders
        ? starred.folders!.length > 0 && (
            <>
              <div className={classes["files-header"]}>
                <h3 className={classes["files-heading"]}>Folders</h3>
              </div>
              <ul className={classes["files-list"]}>
                <li>
                  <div className={classes["except-size"]}></div>
                  <p className={classes["folder-last-modified"]}>
                    Last Modified
                  </p>
                </li>
                {starred.folders!.map((folder) => (
                  <FoldersListItem
                    key={folder._id}
                    folder={folder}
                    handleListItemRightClick={handleListItemRightClick}
                  />
                ))}
              </ul>
            </>
          )
        : null}

      {starred.files.length > 0 && (
        <>
          <div className={classes["files-header"]}>
            <h3 className={classes["files-heading"]}>Files</h3>
          </div>
          <ul className={classes["files-list"]}>
            <li className={classes["files-details-heading"]}>
              <div className={classes["except-size"]}></div>
              <p className={classes["file-expire"]}>Expires in</p>
              <p className={classes["file-size"]}>File size</p>
              <p className={classes["file-status"]}>Status</p>
              <div className={classes["file-actions-group"]}></div>
            </li>
            {starred.files.map((file) => (
              <FilesListItem
                key={file.id}
                file={file}
                handleListItemRightClick={handleListItemRightClick}
              />
            ))}{" "}
          </ul>
        </>
      )}
    </>
  );
};

export default StarredList;
