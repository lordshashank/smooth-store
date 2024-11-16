"use client";
import styles from "@/styles/home/Landing.module.css";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import Image from "next/image";
import Link from "next/link";

export default function Landing() {
  return (
    <div className={styles.container}>
      <Image
        className={styles.swatch}
        src={"/swatch.png"}
        width={1024}
        height={1024}
        alt="bg"
      />
      <Image
        className={styles.dots}
        src={"/dots.png"}
        width={1024}
        height={1024}
        alt="bg"
      />
      <Image
        className={styles.abstract}
        src={"/realistic-abstract.png"}
        width={1456}
        height={816}
        alt="bg"
      />
      <div className={styles.hero}>
        <Link href={"/home"} className={styles.logo}>
          <Image src={"/logo.svg"} width={14} height={26} alt="logo" />
          <h1 className={styles["logo-text"]}>Smooth Store</h1>
        </Link>
        <div className={styles.content}>
          <div className={styles.faucets}>
            Add calibration net to you metamask{" "}
            <Link href={""}>
              <span className={styles.highlight}>here</span>
            </Link>{" "}
            .Want some fil tokens?
            <Link href={""}>
              <span className={styles.highlight}> Click here</span>
            </Link>{" "}
            to get some.
          </div>
          <h1 className={styles.heading}>Decentralized File Storage</h1>
          <p className={styles.description}>
            SmoothStore is a decentralized application (dApp) designed to
            seamlessly onboard users to decentralized storage solutions. It
            allows users to store their files securely across various storage
            providers in the network while ensuring data privacy and user
            convenience. The core highlight of SmoothStore is the integration of
            EIP-7702, which revolutionizes UX in the Web3 space.
          </p>
        </div>
        <div className={styles.actions}>
          <DynamicWidget />
          <Link href={"/drive/folders/parent"} className={styles.btn}>
            Open Drive
          </Link>
        </div>
      </div>
    </div>
  );
}
