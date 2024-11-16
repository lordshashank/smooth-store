import { useDrive } from "@/contexts/DriveContext";
import classes from "@/styles/ContextMenu.module.css";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MdDriveFolderUpload, MdCreateNewFolder } from "react-icons/md";
interface CommonModalProps {
  top: number;
  left: number;
}
const CommonModal: React.FC<CommonModalProps> = ({ top, left }) => {
  const { openModal } = useDrive();
  const { folderId } = useParams();
  return (
    <ul
      style={{
        position: "fixed",
        top: top,
        left: left,
      }}
      className={classes["context-menu"]}
    >
      <li>
        <Link
          href={`/drive/folders/${folderId}?new=true`}
          className={classes["new-folder-btn"]}
          onClick={openModal}
        >
          <MdCreateNewFolder size={30} />
          Create New Folder
        </Link>
      </li>
      <li>
        <Link
          className={classes["new-folder-btn"]}
          href={`/drive/folders/${folderId}?status=upload`}
        >
          <MdDriveFolderUpload size={30} />
          Upload File
        </Link>
      </li>
    </ul>
  );
};

export default CommonModal;
