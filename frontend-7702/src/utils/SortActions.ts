import { SetStateAction } from "react";
import { DataType } from "@/hooks/useExpiredOrAllFiles";
type SetStateType = React.Dispatch<SetStateAction<DataType>>;
// Sorting function for size
export const sortFilesBySize = (setState: SetStateType) => {
  setState((prevDrive) => ({
    ...prevDrive,
    files: [...prevDrive.files].sort((a, b) => a.size - b.size),
  }));
};

// Sorting function for startDate
export const sortFilesByStartDate = (setState: SetStateType) => {
  setState((prevDrive) => ({
    ...prevDrive,
    files: [...prevDrive.files].sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    ),
  }));
};

// Sorting function for endDate
export const sortFilesByEndDate = (setState: SetStateType) => {
  setState((prevDrive) => ({
    ...prevDrive,
    files: [...prevDrive.files].sort(
      (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
    ),
  }));
};

// Sorting function for created_at
export const sortFilesByCreatedAt = (setState: SetStateType) => {
  setState((prevDrive) => ({
    ...prevDrive,
    files: [...prevDrive.files].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    ),
  }));
};
