"use client";
import classes from "@/styles/User.module.css";

import { Account } from "@/modules/Account";
import AccountDetails from "./home/AccountDetails";
import AccountInitialization from "./home/AccountInitialization";
const User = () => {
  const { data: account } = Account.useQuery();
  return (
    <div className={`${classes.container} ${classes.trapezium}`}>
      {/* <ConnectButton showBalance={false} chainStatus="icon" /> */}
      {!account ? (
        <AccountInitialization showDrive={false} />
      ) : (
        <AccountDetails account={account} />
      )}
    </div>
  );
};

export default User;
