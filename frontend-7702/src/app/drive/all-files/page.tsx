"use client";
import classes from "@/styles/Starred.module.css";
import { FileType, FolderType } from "@/types/driveTypes";
import useContextMenu from "@/hooks/useContextMenu";
import OptionsModal from "@/components/OptionsModal";
import FileDetails from "@/components/FileDetails";
import StarredList from "@/components/StarredList";
import { useSearchParams } from "next/navigation";
import { useExpiredOrAllFiles } from "@/hooks/useExpiredOrAllFiles";
import { useDrive } from "@/contexts/DriveContext";
import Skeleton from "@/components/ui/Skeleton";
import SortHeader from "@/components/SortHeader";
import UploadFile from "@/components/UploadFile";
import { useRenewDeals } from "@/hooks/useRenewDeals";

const AllFiles = () => {
  const { contextMenu, setContextMenu } = useContextMenu();
  const { selected, setSelected } = useDrive();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const {
    data: allFiles,
    isLoading,
    setData,
  } = useExpiredOrAllFiles("ALLFILES");
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
  if (!isLoading && allFiles.files.length === 0) {
    return (
      <div className={classes["starred-page"]}>
        <div className={classes["files-container"]}>
          <h3>All Files</h3>
          <h3 style={{ marginTop: "1rem", color: "#000" }}>Nothing Found.</h3>
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
            starred={allFiles}
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

export default AllFiles;
