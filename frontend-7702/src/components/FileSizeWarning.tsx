import classes from "@/styles/FileSizeWarning.module.css";
const FileSizeWarning = () => {
  return (
    <div className={classes["file-size-warning"]}>
      <p>
        <strong>Warning:</strong> The file size should be greater than 512 KB.
      </p>
    </div>
  );
};

export default FileSizeWarning;
