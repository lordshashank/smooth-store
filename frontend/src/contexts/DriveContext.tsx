"use client";
import React, {
  createContext,
  useState,
  useContext,
  SetStateAction,
} from "react";
import { FileType, FolderType } from "@/types/driveTypes";

import RenameModal from "@/components/RenameModal";
import useNotification from "@/hooks/useNotification";
import { useAccount } from "wagmi";
import { capitalizeFirstLetter } from "@/utils/helpers";

interface Drive {
  files: FileType[];
  folders: FolderType[];
}
interface DriveContextProps {
  drive: Drive;
  setDrive: React.Dispatch<SetStateAction<Drive>>;
  selected: FileType | FolderType | undefined;
  setSelected: React.Dispatch<
    SetStateAction<FileType | FolderType | undefined>
  >;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  openRenameModal: (oldName: string, isFile: boolean) => void;
  closeRenameModal: () => void;
  createFolder: (folderName: string, parentId: string) => void;
  getDriveData: (folder_id: string) => void;
  renameFile: (newName: string, oldName: string) => void;
  renameFolder: (newName: string, oldName: string) => void;
  starFile: (name: string, isFile: boolean, starred: boolean) => void;
  sortFilesBySize: () => void;
  sortFilesByStartDate: () => void;
  sortFilesByEndDate: () => void;
  sortFilesByCreatedAt: () => void;
}

const DriveContext = createContext<DriveContextProps>({
  drive: { files: [], folders: [] },
  setDrive: () => {},
  selected: undefined,
  setSelected: () => {},
  isModalOpen: false,
  openModal: () => {},
  closeModal: () => {},
  openRenameModal: () => {},
  closeRenameModal: () => {},
  createFolder: () => {},
  getDriveData: () => {},
  renameFile: () => {},
  renameFolder: () => {},
  starFile: () => {},
  sortFilesBySize: () => {},
  sortFilesByStartDate: () => {},
  sortFilesByEndDate: () => {},
  sortFilesByCreatedAt: () => {},
});

export const DriveProvider = ({ children }: { children: React.ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [oldName, setOldName] = useState<{ name: string; isFile: boolean }>({
    name: "",
    isFile: false,
  });
  const [drive, setDrive] = useState<{
    files: FileType[];
    folders: FolderType[];
  }>({ files: [], folders: [] });
  const [selected, setSelected] = useState<FileType | FolderType>();
  const { showNotification } = useNotification();
  const { address } = useAccount();
  const userAccount = address?.toLowerCase();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openRenameModal = (oldName: string, isFile: boolean) => {
    setOldName({ name: oldName, isFile });
    setIsRenameModalOpen(true);
  };

  const closeRenameModal = () => {
    setIsRenameModalOpen(false);
  };

  const renameFolder = async (newName: string) => {
    if (newName === oldName.name) {
      showNotification({
        type: "INFO",
        message: "Folder Name Cannot Be Same!",
      });
      return;
    }
    try {
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userAccount}/folders/rename`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newName, oldName: oldName.name }),
        }
      );
      const response = await data.json();
      if (response.success) {
        setDrive((prev) => ({
          ...prev,
          folders: prev.folders.map((folder) =>
            folder.name === oldName.name ? response.data : folder
          ),
        }));
        showNotification({ type: "SUCCESS", message: "Folder Renamed!" });
        closeRenameModal();
      } else
        showNotification({ type: "ERROR", message: "Something Went Wrong!" });
    } catch (err) {
      showNotification({ type: "ERROR", message: "Something Went Wrong!" });
      console.log(err);
    }
  };
  const renameFile = async (newName: string) => {
    if (newName === oldName.name) {
      showNotification({
        type: "INFO",
        message: "File Name Cannot Be Same!",
      });
      return;
    }
    try {
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userAccount}/files/rename`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newName, oldName: oldName.name }),
        }
      );
      const response = await data.json();
      if (response.success) {
        setDrive((prev) => ({
          ...prev,
          files: prev.files.map((file) =>
            file.name === oldName.name ? response.data : file
          ),
        }));
        showNotification({ type: "SUCCESS", message: "File Rename!" });
        closeRenameModal();
      } else
        showNotification({ type: "ERROR", message: "Something Went Wrong!" });
    } catch (err) {
      showNotification({ type: "ERROR", message: "Something Went Wrong!" });
      console.log(err);
    }
  };
  const starFile = async (name: string, isFile: boolean, starred: boolean) => {
    try {
      const path = isFile ? "file" : "folder";
      const an = starred ? "unstar" : "star";
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userAccount}/${path}/${an}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileName: name }),
        }
      );
      const response = await data.json();
      if (response.success) {
        const toUpdate = isFile ? "files" : "folders";
        setDrive((prev) => ({
          ...prev,
          [toUpdate]: prev[toUpdate].map((file) =>
            file.name === response.data.name ? response.data : file
          ),
        }));
        showNotification({
          type: "SUCCESS",
          message: `${capitalizeFirstLetter(path)} ${capitalizeFirstLetter(
            an
          )}red!`,
        });
      } else
        showNotification({ type: "ERROR", message: "Something Went Wrong!" });
    } catch (err) {
      showNotification({ type: "ERROR", message: "Something Went Wrong!" });
      console.log(err);
    }
  };

  const createFolder = async (folderName: string, parentId: string) => {
    if (!folderName) return;
    try {
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userAccount}/folders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ folderName, parentId }),
        }
      );
      const response = await data.json();
      if (response.success) {
        setDrive({
          files: response.files,
          folders: response.folders,
        });
        showNotification({
          type: "SUCCESS",
          message: "Folder Created Successfully!",
        });
        closeModal();
      } else
        showNotification({ type: "ERROR", message: "Something Went Wrong!" });
    } catch (err) {
      showNotification({ type: "ERROR", message: "Something Went Wrong!" });
      console.log(err);
    }
  };
  const getDriveData = async (folder_id: string) => {
    try {
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userAccount}/${folder_id}/files`
      );
      const response = await data.json();
      if (response.success)
        setDrive({ files: response.files, folders: response.folders });
    } catch (err) {
      console.log(err);
    }
  };
  // Sorting function for size
  const sortFilesBySize = () => {
    setDrive((prevDrive) => ({
      ...prevDrive,
      files: [...prevDrive.files].sort((a, b) => a.size - b.size),
    }));
  };

  // Sorting function for startDate
  const sortFilesByStartDate = () => {
    setDrive((prevDrive) => ({
      ...prevDrive,
      files: [...prevDrive.files].sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      ),
    }));
  };

  // Sorting function for endDate
  const sortFilesByEndDate = () => {
    setDrive((prevDrive) => ({
      ...prevDrive,
      files: [...prevDrive.files].sort(
        (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
      ),
    }));
  };

  // Sorting function for created_at
  const sortFilesByCreatedAt = () => {
    setDrive((prevDrive) => ({
      ...prevDrive,
      files: [...prevDrive.files].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      ),
    }));
  };

  return (
    <DriveContext.Provider
      value={{
        drive,
        setDrive: setDrive,
        selected,
        setSelected,
        isModalOpen,
        openModal,
        closeModal,
        openRenameModal,
        closeRenameModal,
        createFolder,
        getDriveData,
        renameFile,
        renameFolder,
        starFile,
        sortFilesBySize,
        sortFilesByStartDate,
        sortFilesByEndDate,
        sortFilesByCreatedAt,
      }}
    >
      {isRenameModalOpen && (
        <RenameModal
          oldName={oldName.name}
          renameFunc={oldName.isFile ? renameFile : renameFolder}
        />
      )}
      {children}
    </DriveContext.Provider>
  );
};

export const useDrive = () => {
  const context = useContext(DriveContext);
  if (context === undefined) {
    throw new Error("useFiles must be used within a FilesProvider");
  }
  return context;
};
