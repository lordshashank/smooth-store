import classes from "@/styles/shopping-cart/ShoppingList.module.css";
import { useFiles } from "@/contexts/fileContext";
import { useReadContract } from "wagmi";
import ShoppingListItem from "./ShoppingListItem";
import { contractTypeAddress, abi } from "@/../constants";
import { Miner } from "@/app/drive/miner/page";
import { useEffect } from "react";

const CONTRACT_ADDRESS = contractTypeAddress.SmoothStore;
const CONTRACT_ABI = abi.SmoothStore;

const ShoppingList = () => {
  const { files, setFiles } = useFiles();

  const { data: minersData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getMinersArray",
  });

  useEffect(() => {
    if (minersData) {
      setFiles((prevFiles) => {
        return prevFiles.map((file) => {
          return {
            ...file,
            miner: (minersData as Miner[])[0],
          };
        });
      });
    }
  }, [minersData]);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const startDateHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value;
    const fileId = event.target.dataset.id;

    setFiles((prevFiles) => {
      const fileIndex = prevFiles.findIndex(
        (fileData) => fileData.file.lastModified.toString() === fileId
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

    setFiles((prevFiles) => {
      const fileIndex = prevFiles.findIndex(
        (fileData) => fileData.file.lastModified.toString() === fileId
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
      {files.length > 0 &&
        files.map((fileData) => {
          return (
            <ShoppingListItem
              key={fileData.file.lastModified}
              fileData={fileData}
              startDateHandler={startDateHandler}
              endDateHandler={endDateHandler}
              removeFile={removeFile}
              tomorrow={tomorrow}
              minersData={minersData as Miner[]}
            />
          );
        })}
    </ul>
  );
};

export default ShoppingList;
