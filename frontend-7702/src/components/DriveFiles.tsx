"use client";
import React, { useState, useEffect } from "react";
import classes from "@/styles/DriveFiles.module.css";
import UploadFile from "./UploadFile";
import CommonModal from "./CommonModal";
import DriveHeader from "./DriveHeader";
import { FileType, FolderType } from "@/types/driveTypes";
import { useSearchParams } from "next/navigation";
import OptionsModal from "./OptionsModal";
import FoldersList from "./FoldersList";
import FilesList from "./FilesList";
import FileDetails from "./FileDetails";
import { useDrive } from "@/contexts/DriveContext";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import AccountInitialization from "./home/AccountInitialization";
import { Account } from "@/modules/Account";

interface DriveFilesProps {
  folderId: string;
}

const DriveFiles: React.FC<DriveFilesProps> = ({ folderId }) => {
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  const [contextMenuState, setContextMenuState] = useState(false);
  const { selected, setSelected, drive } = useDrive();
  const { data: userAccount } = Account.useQuery();
  const SearchParams = useSearchParams();
  const status = SearchParams.get("status");

  const handleRightClick = (event: React.MouseEvent) => {
    event.preventDefault();

    let clickX = event.clientX;
    let clickY = event.clientY;

    setContextMenu({ visible: true, x: clickX, y: clickY });
  };

  const handleClick = () => {
    setContextMenu({ visible: false, x: 0, y: 0 });
    setContextMenuState(false);
  };

  const handleListItemRightClick = (
    event: React.MouseEvent,
    file: FileType | FolderType
  ) => {
    event.preventDefault();
    setSelected(file);
    setContextMenuState(true);
    handleRightClick(event);
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);
  if (!userAccount?.address) {
    return (
      <div className={classes["wallet-container"]}>
        <AccountInitialization />
      </div>
    );
  }
  if (drive.files.length == 0 && drive.folders.length == 0) {
    return (
      <>
        <div className="upload-file-container">
          <DriveHeader />
          <div className={classes["upload-file-wrapper"]}>
            <UploadFile folderId={folderId} showStorage={false} />
          </div>
        </div>
      </>
    );
  }
  const showInfo =
    status === "upload"
      ? classes["show-info"]
      : status === "details"
      ? !selected
        ? ""
        : "cid" in selected
        ? classes["show-info"]
        : ""
      : "";
  return (
    <>
      <div
        onContextMenu={handleRightClick}
        onClick={handleClick}
        className={classes["header-folders"]}
      >
        <DriveHeader />
        {/* {selected && (
          <SelectedMenu setSelected={setSelected} setShowInfo={setShowInfo} />
        )} */}

        <div className={classes["folders-files"]}>
          <div className={classes["scroll-wrapper"]}>
            <div className={classes["wrapper"]}>
              {drive.folders.length === 0 ? null : (
                <FoldersList
                  folders={drive.folders}
                  handleListItemRightClick={handleListItemRightClick}
                />
              )}
              {drive.files.length === 0 ? null : (
                <FilesList
                  files={drive.files}
                  handleListItemRightClick={handleListItemRightClick}
                />
              )}
            </div>
          </div>
        </div>
        <div className={`${classes["info-container"]} ${showInfo}`}>
          {status === "details" ? (
            !selected ? null : "cid" in selected ? (
              <FileDetails />
            ) : null
          ) : null}
          {status === "upload" && (
            <div className={"file-upload-container"}>
              <UploadFile folderId={folderId} showStorage={true} />
            </div>
          )}
        </div>
      </div>

      {contextMenu.visible && !contextMenuState && (
        <CommonModal top={contextMenu.y} left={contextMenu.x} />
      )}
      {contextMenu.visible && contextMenuState && (
        <OptionsModal
          top={contextMenu.y}
          left={contextMenu.x}
          fileCid={selected ? ("cid" in selected ? selected.cid : "0") : "0"}
          oldName={selected?.name}
          isFile={selected ? ("cid" in selected ? true : false) : undefined}
          folderId={
            selected
              ? "cid" in selected
                ? undefined
                : selected._id
              : undefined
          }
          setShowModal={setContextMenu}
          starred={selected?.starred}
        />
      )}
    </>
  );
};

export default DriveFiles;
