import classes from "@/styles/ui/Dropdown.module.css";
import { GoPlus } from "react-icons/go";
import Image from "next/image";
import { down } from "../../../public";

interface DropdownMenuProps {
  children: React.ReactNode;
  menuFor: "new" | "sort";
  top: string;
  contentWidth: string;
  left?: string;
}
const DropdownMenu: React.FC<DropdownMenuProps> = ({
  children,
  menuFor,
  top,
  contentWidth,
  left,
}) => {
  return (
    <div className={classes.dropdown}>
      <button className={classes["dropdown-btn"]}>
        {menuFor === "new" ? (
          <>
            <GoPlus color={"#fff"} size={20} /> <p>new</p>
          </>
        ) : (
          <>
            Sort by <Image src={down} height={20} width={20} alt="down" />
          </>
        )}
      </button>
      <ul
        className={classes["dropdown-content"]}
        style={{ width: contentWidth, top: top, left: left ? left : "0" }}
      >
        {children}
      </ul>
    </div>
  );
};

export default DropdownMenu;
