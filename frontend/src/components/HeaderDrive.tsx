"use client";
import classes from "../styles/Header.module.css";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/logo.svg";
import User from "./User";
const HeaderDrive = () => {
  return (
    <header className={classes["header-drive"]}>
      <Link href={"/"} className={classes.logo}>
        <Image src={logo} width={35} height={35} alt="logo" />
        <h1 className={classes["logo-text"]}>SmoothStore</h1>
      </Link>

      <User />
    </header>
  );
};

export default HeaderDrive;
