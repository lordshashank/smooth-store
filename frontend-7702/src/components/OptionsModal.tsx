import { MdCreateNewFolder, MdDriveFolderUpload } from "react-icons/md";
import classes from "@/styles/NewModal.module.css";
import { useDrive } from "@/contexts/DriveContext";
import { useRouter } from "next/navigation";
import {
  MdOutlineStar,
  MdOutlineStarBorder,
  MdOutlineViewInAr,
} from "react-icons/md";
import CID from "cids";
import { useDealId } from "@/hooks/useDealId";
import useNotification from "@/hooks/useNotification";

interface NewModalProps {
  top: number;
  left: number;
  oldName: string | undefined;
  fileCid: string;
  isFile: boolean | undefined;
  folderId: string | undefined;
  setShowModal: React.Dispatch<
    React.SetStateAction<{ visible: boolean; x: number; y: number }>
  >;
  starred: boolean | undefined;
}
const OptionsModal: React.FC<NewModalProps> = ({
  top,
  left,
  oldName,
  fileCid,
  isFile,
  folderId,
  setShowModal,
  starred,
}) => {
  const router = useRouter();
  const { openRenameModal, starFile } = useDrive();
  const { getDealId } = useDealId();
  const { showNotification } = useNotification();
  const handleOpenFolder = () => {
    router.push(`/drive/folders/${folderId}`);
    setShowModal({ visible: false, x: 0, y: 0 });
  };
  const handleRenameModal = () => {
    if (!oldName || isFile === undefined) return;
    openRenameModal(oldName, isFile);
    setShowModal({ visible: false, x: 0, y: 0 });
  };
  const handleOpenFilfox = async () => {
    if (fileCid === "0") return;
    const cid = new CID(fileCid);
    const response = await getDealId(cid);
    if (Number(response) === 0) {
      showNotification({ type: "ERROR", message: "Deal Not Found!" });
      return;
    }
    const url = `https://calibration.filfox.info/en/deal/${Number(
      response
    ).toString()}`;
    if (window !== undefined) window.open(url, "_blank");
  };
  return (
    <div
      style={{
        position: "fixed",
        top: top,
        left: left,
      }}
      className={classes["context-menu"]}
    >
      <ul className={classes["options-menu"]}>
        <li>
          {folderId ? (
            <button
              className={classes["new-folder-btn"]}
              onClick={handleOpenFolder}
              disabled={!folderId}
            >
              <MdCreateNewFolder size={30} />
              Open
            </button>
          ) : (
            <button
              onClick={handleOpenFilfox}
              className={classes["new-folder-btn"]}
            >
              <MdOutlineViewInAr size={30} />
              View Deal
            </button>
          )}
        </li>
        <li>
          <button
            className={classes["new-folder-btn"]}
            onClick={handleRenameModal}
            disabled={folderId ? false : true}
          >
            <MdDriveFolderUpload size={30} />
            Rename
          </button>
        </li>
        <li>
          <button
            className={classes["new-folder-btn"]}
            onClick={() => {
              if (!oldName || isFile === undefined || starred === undefined)
                return;
              starFile(oldName, isFile, starred);
            }}
          >
            {starred ? (
              <>
                <MdOutlineStar size={30} /> Starred
              </>
            ) : (
              <>
                <MdOutlineStarBorder size={30} /> Star
              </>
            )}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default OptionsModal;
