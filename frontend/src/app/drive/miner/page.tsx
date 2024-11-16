"use client";
import { useState, useEffect } from "react";
import styles from "@/styles/MinerPage.module.css";
import RegisterModal from "@/components/miner/RegisterModal";
import { useReadContract } from "wagmi";
import { formatEther } from "viem";
import { convertBytesToMinerId } from "@/utils/helpers";
import { contractTypeAddress, abi } from "@/../constants";

const CONTRACT_ADDRESS = contractTypeAddress.SmoothStoreOP;
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

  return (
    <div className={styles.container}>
      {registerModal && <RegisterModal onClose={handleRegisterClose} />}
      <div className={styles.header}>
        <h1>Miners ({miners?.length || 0})</h1>
        <button onClick={handleRegisterOpen}>Register</button>
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
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default Page;
