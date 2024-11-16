import classes from "@/styles/SelectedMenu.module.css";
import Image from "next/image";
import { MdClose } from "react-icons/md";
import { info } from "../../public";
import { FolderType, FileType } from "@/types/driveTypes";

interface SelectedMenuProps {
  setShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
  setSelected: React.Dispatch<
    React.SetStateAction<FileType | FolderType | undefined>
  >;
}
const SelectedMenu: React.FC<SelectedMenuProps> = ({
  setSelected,
  setShowInfo,
}) => {
  return (
    <div className={classes.selected}>
      <div
        className={classes["close-icon"]}
        onClick={() => {
          setShowInfo(false);
          setSelected(undefined);
        }}
      >
        <MdClose fill="#000" size={25} />
      </div>

      <p>1 selected</p>
      <div className={classes.info} onClick={() => setShowInfo(true)}>
        <Image src={info} alt="info" />
      </div>
    </div>
  );
};

export default SelectedMenu;
