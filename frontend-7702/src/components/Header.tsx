"use client";
import classes from "../styles/Header.module.css";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/logo.svg";
import { useState } from "react";
import { useWindowScroll } from "@/hooks/useWindowScroll";
import { usePathname } from "next/navigation";
import { RxHamburgerMenu } from "react-icons/rx";
import { AiOutlineClose } from "react-icons/ai";
import { navLinks } from "@/utils/navLinks";

const Header = () => {
  const [show, setShow] = useState<Boolean>(false);
  const pathname = usePathname();
  const { isScroll } = useWindowScroll();
  const hideNav = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if ((event.target as HTMLElement).id === "link") setShow(false);
  };
  const activeClassName = (path: string) =>
    pathname === path ? classes.active : "";
  return (
    <header
      className={`${classes.header} ${
        isScroll ? classes["header-background"] : ""
      }`}
    >
      <Link href={"/home"} className={classes.logo}>
        <Image src={logo} width={26} height={26} alt="logo" />
        <h1 className={classes["logo-text"]}>Smooth Store</h1>
      </Link>
      <div className={classes.hamburger}>
        {show ? (
          <AiOutlineClose size={30} onClick={() => setShow(false)} />
        ) : (
          <RxHamburgerMenu size={30} onClick={() => setShow(true)} />
        )}
      </div>

      <nav
        className={`${classes.navigation} ${show ? classes.active : ""}`}
        onClick={hideNav}
      >
        <ul>
          {navLinks.map((navLink) => (
            <li key={navLink.url}>
              <Link
                id="link"
                className={activeClassName(navLink.url)}
                href={navLink.url}
              >
                {navLink.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
