"use client";
import React, { use } from "react";
import classes from "@/styles/DriveSidebar.module.css";
import Image from "next/image";
import Link from "next/link";
import {
  priority,
  drive,
  star,
  trash,
  question,
  minerLogo,
  settings,
} from "../../public";
import { useRouter, usePathname } from "next/navigation";
import { FiLogOut } from "react-icons/fi";
import { useTotalStorage } from "@/hooks/useTotalStorage";
import { formatFileSize } from "@/utils/getFormattedSize";
import { useDisconnect, useAccount } from "wagmi";
import { useScroll } from "@/hooks/useScroll";

const DriveSidebar = () => {
  const pathname = usePathname();
  const { usedStorage, isLoading } = useTotalStorage();
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();
  const scroll = useScroll();
  const percentageUsed = (
    (usedStorage / (15 * Math.pow(1024, 3))) *
    100
  ).toFixed(2);
  const availableStorage = 15 * Math.pow(1024, 3) - usedStorage;

  const handleLogout = async () => {
    if (isConnected) {
      disconnect();
    }

    router.replace("/");
  };
  const margin = Math.max(0, 80 - scroll.y);
  const left = Math.min(0, -scroll.x);
  return (
    <div className={classes["nav-wrapper"]}>
      <div className={classes["logo-container"]}>
        <Link href={"/home"} className={classes.logo}>
          <Image src={"/logo.svg"} width={14} height={26} alt="logo" />
          <h1 className={classes["logo-text"]}>Smooth Store</h1>
        </Link>
        <Image
          src={"/icons/left-right.svg"}
          width={22}
          height={12}
          alt="logo"
        />
      </div>
      <ul className={classes.sidebar}>
        <li>
          <Link
            href={"/drive/all-files"}
            className={`${classes.row} ${
              pathname === "/drive/all-files" ? classes.active : ""
            }`}
          >
            <div className={classes.left}>
              <Image src={priority} alt="trash" width={14} height={14} />
              <p>All Files</p>
            </div>
            <div>
              <Image
                src={"/icons/chevron-right.svg"}
                width={12}
                height={12}
                alt={"right"}
              />
            </div>
          </Link>
        </li>
        <li>
          <Link
            href={"/drive/folders/parent"}
            className={`${classes.row} ${
              pathname.includes("/drive/folders/") ? classes.active : ""
            }`}
          >
            <div className={classes.left}>
              <Image src={drive} alt="trash" width={14} height={14} />
              <p>Drive</p>
            </div>
            <div>
              <Image
                src={"/icons/chevron-right.svg"}
                width={12}
                height={12}
                alt={"right"}
              />
            </div>
          </Link>
        </li>
        <li>
          <Link
            href={"/drive/starred"}
            className={`${classes.row} ${
              pathname === "/drive/starred" ? classes.active : ""
            }`}
          >
            <div className={classes.left}>
              <Image src={star} alt="trash" width={14} height={14} />
              <p>Starred</p>
            </div>
            <div>
              <Image
                src={"/icons/chevron-right.svg"}
                width={12}
                height={12}
                alt={"right"}
              />
            </div>
          </Link>
        </li>
        <li>
          <Link
            href={"/drive/expired"}
            className={`${classes.row} ${
              pathname === "/drive/expired" ? classes.active : ""
            }`}
          >
            <div className={classes.left}>
              <Image src={trash} alt="trash" width={14} height={14} />
              <p>Expired</p>
            </div>
            <div>
              <Image
                src={"/icons/chevron-right.svg"}
                width={12}
                height={12}
                alt={"right"}
              />
            </div>
          </Link>
        </li>
        <li>
          <Link
            href={"/drive/miner"}
            className={`${classes.row} ${
              pathname === "/drive/miner" ? classes.active : ""
            }`}
            style={{ overflow: "hidden" }}
          >
            <div className={classes.left}>
              <Image src={minerLogo} alt="trash" width={14} height={14} />
              <p>Miners</p>
            </div>
            <div>
              <Image
                src={"/icons/chevron-right.svg"}
                width={12}
                height={12}
                alt={"right"}
              />
            </div>
          </Link>
        </li>
      </ul>
      <ul className={classes["bottom-section"]}>
        <li>
          <Link
            href={"mailto:SmoothStore.web3@gmail.com"}
            className={classes.row}
            data-tooltip-id="help"
            data-tooltip-content={"Help"}
          >
            <div className={classes.left}>
              <Image src={settings} alt="trash" width={14} height={14} />
              <p>Help And Support</p>
            </div>
            <div>
              <Image
                src={"/icons/chevron-right.svg"}
                width={12}
                height={12}
                alt={"right"}
              />
            </div>
          </Link>
        </li>
        <li
          className={classes.row}
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
          data-tooltip-id="logout"
          data-tooltip-content={"Logout"}
        >
          <div className={classes.left}>
            <Image
              src={"/icons/logout.svg"}
              alt="logout"
              width={14}
              height={14}
            />
            <p>Logout</p>
          </div>
          <div>
            <Image
              src={"/icons/chevron-right.svg"}
              width={12}
              height={12}
              alt={"right"}
            />
          </div>
        </li>
        <li className={classes["storage-container"]}>
          <div className={classes.storage}>
            <progress value={percentageUsed} max={100}></progress>
          </div>
          <div>
            <p className={classes.used}>{formatFileSize(usedStorage)} Used</p>
            <p className={classes.percentage}>
              {percentageUsed}% used - {formatFileSize(availableStorage)} free
            </p>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default DriveSidebar;
