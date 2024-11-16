"use client";

import styles from "@/styles/home/AccountDetails.module.css";
import { useReadContract } from "wagmi";
import { formatEther } from "viem";

import { ExperimentERC20 } from "@/contracts";
import { Account } from "@/modules/Account";
import { client } from "../providers/NoneProviders";

const AccountDetails = ({
  account,
}: {
  account: Account.Account | undefined;
}) => {
  console.log(account?.address);
  const { data: expBalance } = useReadContract({
    ...ExperimentERC20,
    functionName: "balanceOf",
    args: [account?.address as `0x${string}`],
    query: {
      refetchInterval: 1000 * 120,
    },
  });

  console.log(expBalance);

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <code>{truncateAddress(account?.address)}</code>
      </div>
      <div className={styles.box}>
        {typeof expBalance === "bigint" && (
          <code>{formatEth(expBalance)} EXP (ERC20)</code>
        )}
      </div>
    </div>
  );
};

const numberIntl = new Intl.NumberFormat("en-US", {
  maximumSignificantDigits: 6,
});

export function formatEth(wei: bigint) {
  return numberIntl.format(Number(formatEther(wei)));
}

// write a function which shows the address in the format of 0x1234...5678
export function truncateAddress(address: string | undefined) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default AccountDetails;
