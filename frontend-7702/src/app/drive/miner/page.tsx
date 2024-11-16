"use client";
import { useState, useEffect } from "react";
import styles from "@/styles/MinerPage.module.css";
import RegisterModal from "@/components/miner/RegisterModal";
import { useReadContract } from "wagmi";
import { formatEther } from "viem";
import { convertBytesToMinerId } from "@/utils/helpers";
import { contractTypeAddress, abi } from "@/../constants";
import { Account } from "@/modules/Account";
import AccountDetails from "@/components/home/AccountDetails";
import AccountInitialization from "@/components/home/AccountInitialization";

const CONTRACT_ADDRESS = contractTypeAddress.SmoothStore;
const CONTRACT_ABI = abi.SmoothStore;

export interface Miner {
  token: string;
  amountPerByte: bigint;
  location: string;
  retrieval: boolean;
  minerId: `0x${string}`;
  active: boolean;
}

const Page = () => {
  const [registerModal, setRegisterModal] = useState(false);
  const [miners, setMiners] = useState<Miner[]>([]);
  const [showMiners, setShowMiners] = useState(false);
  const { data: account } = Account.useQuery();

  // Fetch miners details
  const { data: minersData, refetch: refetchMiners } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getMinersArray",
    // args: ["1"],
  });

  console.log(minersData);
  useEffect(() => {
    if (minersData) {
      setMiners(minersData as Miner[]);
    }
  }, [minersData]);

  const handleRegisterOpen = () => {
    setRegisterModal(true);
  };

  const handleRegisterClose = () => {
    setRegisterModal(false);
  };

  // Utility function to truncate address
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Utility function to format amount
  const formatAmount = (amount: bigint) => {
    return `${formatEther(amount)} ETH`;
  };

  const handleShowMiners = () => {
    setShowMiners(true);
  };

  return (
    <div className={styles.container}>
      {registerModal && (
        <RegisterModal
          account={account}
          onClose={handleRegisterClose}
          handleShowMiners={handleShowMiners}
        />
      )}
      <div className={styles.header}>
        <h1>Miners</h1>
        <div className={styles.buttons}>
          {account?.address ? (
            <AccountDetails account={account} />
          ) : (
            <AccountInitialization />
          )}
          <button onClick={handleRegisterOpen}>Register</button>
        </div>
      </div>

      <div className={styles.minersTable}>
        <div className={styles.tableHeader}>
          <div>Token</div>
          <div>Amount/Byte</div>
          <div>Location</div>
          <div>Miner ID</div>
          <div>Retrieval</div>
        </div>

        {miners.length === 0 ? (
          <div className={styles.noMiners}>No miners registered yet</div>
        ) : showMiners ? (
          miners.map((miner, index) => (
            <div key={index} className={styles.minerRow}>
              <div title={miner.token}>{truncateAddress(miner.token)}</div>
              <div>{formatAmount(miner.amountPerByte)}</div>
              <div>{miner.location}</div>
              <div>{convertBytesToMinerId(miner.minerId)}</div>
              <div>
                <span className={styles.retrievalStatus}>
                  {miner.retrieval ? "Yes" : "No"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noMiners}>No miners registered yet</div>
        )}
      </div>
    </div>
  );
};

export default Page;
