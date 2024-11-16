"use client";
import React, { useRef, useState } from "react";
import classes from "@/styles/UploadFile.module.css";
import Image from "next/image";
import { uploadIcon } from "../../public";
import { FileData, useFiles } from "@/contexts/fileContext";
import { MdClose } from "react-icons/md";
import { addDays, addYears } from "date-fns";
import Link from "next/link";
import { useTotalStorage } from "@/hooks/useTotalStorage";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import useNotification from "@/hooks/useNotification";
import { useRemoveFileFromCart } from "@/hooks/useRemoveFileFromCart";
import { useAccount } from "wagmi";
import CryptoJS from "crypto-js";
interface UploadFileProps {
  folderId: string;
  showStorage: boolean;
}

const UploadFile: React.FC<UploadFileProps> = ({ folderId, showStorage }) => {
  const { files, setFiles, renewFiles } = useFiles();
  const [drag, setDrag] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const fileInput = useRef<HTMLInputElement>(null);
  const { usedStorage, isLoading } = useTotalStorage();
  const { showNotification } = useNotification();
  const { address: userAccount } = useAccount();
  const { removeFileFromCart } = useRemoveFileFromCart();
  const percentageUsed = (
    (usedStorage / (15 * Math.pow(1024, 3))) *
    100
  ).toFixed(2);
  const availableStorage = 100 - Number(percentageUsed);

  async function encryptFileData(file: File, key: string): Promise<File> {
    const reader = new FileReader();
    return await new Promise<File>((resolve, reject) => {
      reader.onload = () => {
        const fileData = reader.result as string;
        const encrypted = CryptoJS.AES.encrypt(fileData, key).toString();
        const encryptedBlob = new Blob([encrypted], { type: file.type });
        const encryptedFile = new File([encryptedBlob], file.name, {
          type: file.type,
          lastModified: file.lastModified,
        });
        resolve(encryptedFile);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function onDrag(e: React.DragEvent) {
    e.preventDefault();
    setDrag(true);
  }

  function onLeave(e: React.DragEvent) {
    e.preventDefault();
    setDrag(false);
  }

  function dropFiles(e: React.DragEvent) {
    e.preventDefault();

    setDrag(false);

    let i;

    for (const file of Array.from(e.dataTransfer.files)) {
      // if (file.size < 512 * 1024) {
      //   showNotification({
      //     type: "ERROR",
      //     message: "File size should be greater than 512KB",
      //   });
      //   continue;
      // }
      for (i = 0; i < files.length; i++) {
        if (file.name === files[i].file.name) break;
      }

      if (i === files.length) {
        const startDate = addDays(new Date(), 3).toISOString().split("T")[0];
        const endDate = addYears(new Date(startDate), 3.4)
          .toISOString()
          .split("T")[0];
        setFiles((files) =>
          files.concat({
            file: file,
            size: file.size,
            startDate: startDate,
            endDate: endDate,
            folderId: folderId,
          })
        );
      }
    }
  }
  async function addFiles() {
    let i;
    if (fileInput.current && fileInput.current.files) {
      for (const file of Array.from(fileInput.current.files)) {
        // if (file.size < 512 * 1024) {
        //   showNotification({
        //     type: "ERROR",
        //     message: "File size should be greater than 512KB",
        //   });
        //   continue;
        // }
        for (i = 0; i < files.length; i++) {
          if (file.name === files[i].file.name) break;
        }
        if (i === files.length) {
          const startDate = addDays(new Date(), 3).toISOString().split("T")[0];
          const endDate = addYears(new Date(startDate), 3.4)
            .toISOString()
            .split("T")[0];
          // let encryptedFileData: File;
          // if (userAccount) {
          //   encryptedFileData = await encryptFileData(
          //     file,
          //     userAccount.toString()
          //   );
          // } else {
          //   showNotification({
          //     type: "ERROR",
          //     message: "User account is not available.",
          //   });
          // }
          setFiles((files) =>
            files.concat({
              file: file,
              size: file.size,
              startDate: startDate,
              endDate: endDate,
              folderId: folderId,
            })
          );
        }
      }
    }
  }

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
    <>
      <div className={classes["upload-container"]}>
        {showStorage && (
          <button
            className={classes["close-btn"]}
            onClick={() => {
              router.push(`${pathname}?status=none`);
            }}
          >
            <MdClose size={15} fill={"#fff"} />
          </button>
        )}
        <div
          className={classes.input_field}
          onDrop={dropFiles}
          onDragOver={onDrag}
          onDragLeave={onLeave}
        >
          <div className={classes.input}>
            <Image
              src={uploadIcon}
              alt="upload file"
              className={classes["upload-logo"]}
            />
            <p className={classes["upload-text"]}>UPLOAD FILE</p>
            <p className={classes.or}>OR</p>
            <div className={classes["file-input-container"]}>
              <input
                ref={fileInput}
                type="file"
                className={classes["file-input"]}
                id="file-input"
                multiple
                onChange={addFiles}
              />
              <label
                htmlFor="file-input"
                className={classes["file-input-label"]}
              >
                Browse Files
              </label>
            </div>
          </div>
        </div>
        {showStorage && (
          <div className={classes["storage-box"]}>
            {isLoading ? (
              <div className={classes["spin-wrapper"]}>
                <div className="spin"></div>
              </div>
            ) : (
              <>
                <div className={classes["storage-box-header"]}>
                  <p>Your Storage</p>
                  <p>{availableStorage.toString()}% left</p>
                </div>
                <progress value={percentageUsed} max={100}></progress>
              </>
            )}
          </div>
        )}

        <div className={classes["uploaded-file-container"]}>
          {renewFiles.length > 0 && (
            <>
              <h4>Renewal</h4>
              <ul className={classes["uploaded-file-list"]}>
                {renewFiles.map((fileData, index) => {
                  return (
                    <li className={classes.files} key={fileData._id}>
                      <a href={"#"}>{fileData.name}</a>
                      <button
                        key={fileData._id}
                        className={classes.close}
                        onClick={() => {
                          removeFileFromCart(fileData._id);
                        }}
                      ></button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          {files.length > 0 && (
            <>
              <h4>Uploads</h4>
              <ul className={classes["uploaded-file-list"]}>
                {files.map((fileData, index) => {
                  const file = fileData.file;
                  return (
                    <li className={classes.files} key={file.lastModified}>
                      <a
                        href={URL.createObjectURL(file)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {file.name}
                      </a>
                      <button
                        key={file.lastModified}
                        data-key={file.lastModified}
                        className={classes.close}
                        onClick={removeFile}
                      ></button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
        {files.length + renewFiles.length > 0 && (
          <Link
            href={"/drive/shopping-cart"}
            className={classes["upload-button"]}
          >
            View Uploads
          </Link>
        )}
      </div>
    </>
  );
};

export default UploadFile;
