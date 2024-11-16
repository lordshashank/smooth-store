"use client";
import classes from "@/styles/User.module.css";

import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { ConnectButton } from "@rainbow-me/rainbowkit";
const User = () => {
  return (
    <div className={`${classes.container} ${classes.trapezium}`}>
      {/* <ConnectButton showBalance={false} chainStatus="icon" /> */}
      <DynamicWidget />
    </div>
  );
};

export default User;
