import classes from "@/styles/ActionModal.module.css";
import { MdCreateNewFolder, MdDriveFolderUpload } from "react-icons/md";
import { useParams, useRouter } from "next/navigation";
import DropdownMenu from "./ui/DropdownMenu";

const ActionModal = () => {
  const { folderId } = useParams();
  const router = useRouter();

  const handleCreateNewFolder = () => {
    router.push(`/drive/folders/${folderId}?new=true`);
  };
  const handleUploadFile = () => {
    router.push(`/drive/folders/${folderId}?status=upload`);
  };
  return (
    <DropdownMenu menuFor="new" top="44px" contentWidth="200px">
      <li>
        <button
          className={classes["new-folder-btn"]}
          onClick={handleCreateNewFolder}
        >
          <MdCreateNewFolder size={30} />
          Create New Folder
        </button>
      </li>
      <li>
        <button
          className={classes["new-folder-btn"]}
          onClick={handleUploadFile}
        >
          <MdDriveFolderUpload size={30} />
          Upload File
        </button>
      </li>
    </DropdownMenu>
  );
};

export default ActionModal;
