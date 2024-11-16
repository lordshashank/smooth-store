import React, { useState } from "react";
import Modal from "./ui/Modal";
import classes from "@/styles/NewFolderModal.module.css";
import Link from "next/link";
import { useCreateNewFolder } from "@/hooks/useCreateNewFolder";
import SubmitButton from "./SubmitButton";
import { useRouter, useParams } from "next/navigation";

const NewFolderModal: React.FC = () => {
  const router = useRouter();
  const { folderId } = useParams();
  const parentId = useParams().folderId.toString();
  const [folderName, setFolderName] = useState("");
  const { handleCreateNewFolder, isLoading } = useCreateNewFolder(parentId);

  const modalCloseHandler = () => {
    router.back();
  };

  return (
    <Modal onClose={modalCloseHandler}>
      <h2>New Folder</h2>
      <form className={classes.form} action={handleCreateNewFolder}>
        <input
          name="folder"
          type="text"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="Folder Name"
          required
        />
        <div className={classes["modal-buttons"]}>
          <Link href={`/drive/folders/${parentId}?new=false`}>Cancel</Link>
          <SubmitButton />
        </div>
      </form>
    </Modal>
  );
};

export default NewFolderModal;
