"use client";
import classes from "@/styles/Starred.module.css";
import { FileType, FolderType } from "@/types/driveTypes";
import useContextMenu from "@/hooks/useContextMenu";
import OptionsModal from "@/components/OptionsModal";
import StarredList from "@/components/StarredList";
import FileDetails from "@/components/FileDetails";
import { useExpiredOrAllFiles } from "@/hooks/useExpiredOrAllFiles";
import SortHeader from "@/components/SortHeader";
import { useDrive } from "@/contexts/DriveContext";
import Skeleton from "@/components/ui/Skeleton";
import { useSearchParams } from "next/navigation";
import { useRenewDeals } from "@/hooks/useRenewDeals";
import UploadFile from "@/components/UploadFile";

const ExpiredFiles = () => {
  const { contextMenu, setContextMenu } = useContextMenu();
  const { selected, setSelected } = useDrive();
  const {
    data: expiredFiles,
    isLoading,
    setData,
  } = useExpiredOrAllFiles("EXPIRED");
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  useRenewDeals();
  const handleRightClick = (
    event: React.MouseEvent,
    file: FileType | FolderType
  ) => {
    event.preventDefault();

    let clickX = event.clientX;
    let clickY = event.clientY;
    setSelected(file);
    setContextMenu({ visible: true, x: clickX, y: clickY });
  };
  if (isLoading) return <Skeleton />;
  if (!isLoading && expiredFiles.files.length === 0) {
    return (
      <div className={classes["starred-page"]}>
        <div className={classes["files-container"]}>
          <h3>Expired Files</h3>
          <h3 style={{ marginTop: "1rem", color: "#000" }}>Nothing Expired</h3>
        </div>
      </div>
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
    <div className={classes["starred-page"]}>
      <SortHeader setData={setData} />
      <div className={classes["container-wrapper"]}>
        <div className={classes["files-container"]}>
          <StarredList
            starred={expiredFiles}
            handleListItemRightClick={handleRightClick}
          />
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
            <UploadFile folderId={"parent"} showStorage={true} />
          </div>
        )}
      </div>
      {contextMenu.visible && (
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
    </div>
  );
};

export default ExpiredFiles;
