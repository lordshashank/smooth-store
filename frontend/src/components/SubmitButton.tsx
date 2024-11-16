"use client";
import { useFormStatus } from "react-dom";
import classes from "@/styles/NewFolderModal.module.css";
const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <div className={classes["spinner-wrapper"]}>
          <div style={{ width: "30px", height: "30px" }} className="spin"></div>
        </div>
      ) : (
        <button type="submit">Create</button>
      )}
    </>
  );
};

export default SubmitButton;
