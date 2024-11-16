import React, { useState } from "react";
import { useDrive } from "@/contexts/DriveContext";
import Modal from "./ui/Modal";
import classes from "@/styles/NewFolderModal.module.css";

interface RenameModalProps {
  oldName: string;
  renameFunc: (folderName: string) => {};
}

const RenameModal: React.FC<RenameModalProps> = ({ oldName, renameFunc }) => {
  const [folderName, setFolderName] = useState(oldName);
  const { closeRenameModal } = useDrive();

  return (
    <Modal onClose={closeRenameModal}>
      <h2>Rename</h2>
      <input
        type="text"
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
        placeholder="Folder Name"
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            renameFunc(folderName.trim());
          }
        }}
      />
      <div className={classes["modal-buttons"]}>
        <button onClick={closeRenameModal}>Cancel</button>
        <button
          onClick={() => {
            renameFunc(folderName.trim());
          }}
        >
          Rename
        </button>
      </div>
    </Modal>
  );
};

export default RenameModal;
