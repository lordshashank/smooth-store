"use client";
import React, { createContext, useState, useContext, use } from "react";
import { FileType } from "@/types/driveTypes";
import { useTotalRenewDealsCount } from "@/hooks/useTotalRenewDealsCount";
import { Miner } from "@/app/drive/miner/page";
export interface FileData {
  file: File;
  size: number;
  startDate: string;
  endDate: string;
  folderId: string;
  miner: Miner;
}
interface FilesContextProps {
  files: FileData[];
  renewFiles: FileType[];
  setRenewFiles: React.Dispatch<React.SetStateAction<FileType[]>>;
  setFiles: React.Dispatch<React.SetStateAction<FileData[]>>;
  totalRenewDealsCount: number;
  setTotalRenewDealsCount: React.Dispatch<React.SetStateAction<number>>;
}

const FilesContext = createContext<FilesContextProps | undefined>(undefined);

export const FilesProvider = ({ children }: { children: React.ReactNode }) => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [renewFiles, setRenewFiles] = useState<FileType[]>([]);
  const { totalRenewDealsCount, setTotalRenewDealsCount } =
    useTotalRenewDealsCount();

  console.log(files);

  return (
    <FilesContext.Provider
      value={{
        files,
        setFiles,
        renewFiles,
        setRenewFiles,
        totalRenewDealsCount: totalRenewDealsCount + files.length,
        setTotalRenewDealsCount,
      }}
    >
      {children}
    </FilesContext.Provider>
  );
};

export const useFiles = () => {
  const context = useContext(FilesContext);
  if (context === undefined) {
    throw new Error("useFiles must be used within a FilesProvider");
  }
  return context;
};
