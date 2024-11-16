import classes from "@/styles/FilesListItem.module.css";
import { FolderType } from "@/types/driveTypes";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { folder as folderIcon } from "../../public";
import { getFormattedDate } from "@/utils/getFormattedDate";
import { useDrive } from "@/contexts/DriveContext";

interface FoldersListItemProps {
  folder: FolderType;
  handleListItemRightClick: (
    event: React.MouseEvent,
    folder: FolderType
  ) => void;
}
const FoldersListItem: React.FC<FoldersListItemProps> = ({
  folder,
  handleListItemRightClick,
}) => {
  const router = useRouter();
  const { selected, setSelected } = useDrive();
  const isSelected = selected?._id === folder._id;
  return (
    <li
      className={`${classes["files-list-item"]} ${
        isSelected ? classes["active-file"] : ""
      }`}
      key={folder._id.toString()}
      onDoubleClick={() => router.push(`/drive/folders/${folder._id}`)}
      onClick={() => setSelected(folder)}
      onContextMenu={(event) => handleListItemRightClick(event, folder)}
    >
      <Image src={folderIcon} alt="file" width={20} height={20} />
      <div className={classes["heading-wrapper"]}>
        <h4>{folder.name}</h4>
      </div>
      <p className={classes["folder-last-modified"]}>
        {getFormattedDate(folder.updated_at)}
      </p>

      {/* <button
        className={classes["file-actions"]}
        onClick={handleFileActionsClick}
      >
        <SlOptionsVertical size={25} fill={"#000"} />
      </button> */}
    </li>
  );
};

export default FoldersListItem;
