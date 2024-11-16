import RenewListItem from "./RenewListItem";
import classes from "@/styles/shopping-cart/ShoppingList.module.css";
import { useFiles } from "@/contexts/fileContext";

const RenewList = () => {
  const { renewFiles, setFiles, setRenewFiles } = useFiles();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const startDateHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value;
    const fileId = event.target.dataset.id;

    setRenewFiles((prevFiles) => {
      const fileIndex = prevFiles.findIndex(
        (fileData) => fileData.cid.toString() === fileId
      );
      if (fileIndex !== -1) {
        const newFiles = [...prevFiles];
        newFiles[fileIndex] = { ...newFiles[fileIndex], startDate: newDate };

        if (newDate.length > 0) {
          const startDate = new Date(newDate);
          const endDate = new Date(startDate);
          endDate.setFullYear(endDate.getFullYear() + 3.4);
          newFiles[fileIndex] = {
            ...newFiles[fileIndex],
            endDate: endDate.toISOString().split("T")[0],
          };
        }

        return newFiles;
      }
      return prevFiles;
    });
  };

  const endDateHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value;
    const fileId = event.target.dataset.id;

    setRenewFiles((prevFiles) => {
      const fileIndex = prevFiles.findIndex(
        (fileData) => fileData.cid.toString() === fileId
      );
      if (fileIndex !== -1) {
        const newFiles = [...prevFiles];
        newFiles[fileIndex] = { ...newFiles[fileIndex], endDate: newDate };
        return newFiles;
      }
      return prevFiles;
    });
  };
  function removeFile(e: React.MouseEvent) {
    const target = e.target as HTMLElement;

    setFiles((files) => {
      const newArray = files.filter(
        (file) =>
          file.file.lastModified !== Number(target.getAttribute("data-key"))
      );
      return [...newArray];
    });
  }
  return (
    <ul className={classes["files-list"]}>
      {renewFiles.length > 0 &&
        renewFiles.map((fileData) => {
          return (
            <RenewListItem
              key={fileData.cid}
              file={fileData}
              startDateHandler={startDateHandler}
              endDateHandler={endDateHandler}
            />
          );
        })}
    </ul>
  );
};

export default RenewList;
