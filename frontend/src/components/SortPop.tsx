import classes from "@/styles/SortPop.module.css";
import DropdownMenu from "./ui/DropdownMenu";

interface SortPopProps {
  handleSort: (value: string) => void;
}

const sortOptions = [
  {
    name: "Size",
    value: "size",
  },
  {
    name: "Start Date",
    value: "startDate",
  },
  {
    name: "End Date",
    value: "endDate",
  },
  {
    name: "Created At",
    value: "created_at",
  },
];

const SortPop: React.FC<SortPopProps> = ({ handleSort }) => {
  return (
    <DropdownMenu menuFor="sort" top="44px" contentWidth="150px" left="-10px">
      {sortOptions.map((option, index) => (
        <li key={index}>
          <button
            className={classes["new-folder-btn"]}
            onClick={() => handleSort(option.value)}
          >
            {option.name}
          </button>
        </li>
      ))}
    </DropdownMenu>
  );
};

export default SortPop;
