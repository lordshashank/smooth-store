"use client";
import { FormEvent, useState, useEffect } from "react";
import styles from "@/styles/MinerRegisterModal.module.css";
import Modal from "../ui/Modal";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { parseEther, encodeFunctionData, erc20Abi } from "viem";
import { convertMinerIdToBytes, isValidMinerId } from "@/utils/helpers";
import { contractTypeAddress, abi } from "@/../constants";
import { Account } from "@/modules/Account";
import { client } from "../providers/NoneProviders";
import useSmoothStore from "@/hooks/useSmoothStore";

const CONTRACT_ADDRESS = contractTypeAddress.SmoothStore;
const CONTRACT_ABI = abi.SmoothStore;

interface RegisterModalProps {
  onClose: () => void;
  handleShowMiners: () => void;
  account?: Account.Account;
}

interface MinerData {
  token: string;
  amountPerByte: string;
  location: string;
  retrieval: boolean;
  minerId: string;
}

const RegisterModal = ({
  onClose,
  account,
  handleShowMiners,
}: RegisterModalProps) => {
  const [formData, setFormData] = useState<MinerData>({
    token: "",
    amountPerByte: "",
    location: "",
    retrieval: false,
    minerId: "",
  });
  const [isApproving, setIsApproving] = useState(false);
  const [minerIdError, setMinerIdError] = useState<string>("");

  const { approveAndRegisterMiner } = useSmoothStore({ account });

  // Read STAKE constant from contract
  const { data: stakeAmount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "STAKE",
  });

  console.log(stakeAmount);

  const {
    data: hash,
    mutateAsync: execute,
    isPending: isExecuting,
  } = Account.useExecute({
    client,
  });

  // Write contract hooks for approve and register
  const { data: txHash, isPending, writeContractAsync } = useWriteContract();

  // Wait for transaction receipt
  const { isLoading: isWaiting, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!account) return;
    try {
      const minerIdBytes = convertMinerIdToBytes(formData.minerId);
      console.log(minerIdBytes);

      if (!stakeAmount) return;

      // Validate miner ID format
      if (!isValidMinerId(formData.minerId)) {
        setMinerIdError(
          "Invalid miner ID format. Must start with 't0' followed by numbers."
        );
        return;
      }
      const response = await approveAndRegisterMiner(
        account.address,
        CONTRACT_ADDRESS,
        "100000000000000000000",
        formData.token,
        parseEther(formData.amountPerByte || "0"),
        formData.location,
        formData.retrieval,
        minerIdBytes
      );

      setTimeout(() => {
        handleShowMiners();
        onClose();
      }, 10000);

      // await writeContractAsync({
      //   address: formData.token as `0x${string}`,
      //   abi: erc20Abi,
      //   functionName: "approve",
      //   args: [CONTRACT_ADDRESS, stakeAmount as any],
      // });

      // // add 20 seconds timeout to allow for approval transaction to be mined
      // await new Promise((resolve) => setTimeout(resolve, 20000));

      // await writeContractAsync({
      //   address: CONTRACT_ADDRESS,
      //   abi: CONTRACT_ABI,
      //   functionName: "registerMiner",
      //   args: [
      //     formData.token,
      //     parseEther(formData.amountPerByte || "0"),
      //     formData.location,
      //     formData.retrieval,
      //     minerIdBytes,
      //   ],
      // });
      // await execute({
      //   account,
      //   calls: [
      //     {
      //       to: formData.token as `0x${string}`,
      //       data: encodeFunctionData({
      //         abi: erc20Abi,
      //         functionName: "approve",
      //         args: [CONTRACT_ADDRESS, stakeAmount as any],
      //       }),
      //     },
      //     {
      //       to: CONTRACT_ADDRESS,
      //       data: encodeFunctionData({
      //         abi: CONTRACT_ABI,
      //         functionName: "registerMiner",
      //         args: [
      //           formData.token,
      //           parseEther(formData.amountPerByte || "0"),
      //           formData.location,
      //           formData.retrieval,
      //           minerIdBytes,
      //         ],
      //       }),
      //     },
      //   ],
      // });
    } catch (error) {
      console.error("Error registering miner:", error);
    }
  };

  // Close modal on successful registration
  useEffect(() => {
    if (isSuccess && isApproving) {
      onClose();
    }
  }, [isSuccess, isApproving, onClose]);

  const isLoading = isPending || isWaiting;
  const buttonText = isApproving ? "Register Miner" : "Approve Token";

  return (
    <Modal onClose={onClose} bg={"#0A1330"}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Miner Details</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles["input-field-container"]}>
            <label htmlFor="token">Token Address</label>
            <input
              type="text"
              id="token"
              value={formData.token}
              onChange={handleChange}
              required
              disabled={isApproving}
            />
          </div>
          <div className={styles["input-field-container"]}>
            <label htmlFor="amountPerByte">Amount per Byte</label>
            <input
              type="text"
              id="amountPerByte"
              value={formData.amountPerByte}
              onChange={handleChange}
              required
              disabled={isApproving}
            />
          </div>
          <div className={styles["input-field-container"]}>
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={handleChange}
              required
              disabled={isApproving}
            />
          </div>
          <div className={styles["input-field-container"]}>
            <div className={styles.retrieval}>
              <label htmlFor="retrieval">Retrieval</label>
              <input
                type="checkbox"
                id="retrieval"
                checked={formData.retrieval}
                onChange={handleChange}
                disabled={isApproving}
              />
            </div>
          </div>
          <div className={styles["input-field-container"]}>
            <label htmlFor="minerId">Miner Id</label>
            <input
              type="text"
              id="minerId"
              value={formData.minerId}
              onChange={handleChange}
              placeholder="e.g., t0116147"
              required
              disabled={isApproving}
            />
            {minerIdError && (
              <div className={styles["error-message"]}>{minerIdError}</div>
            )}
          </div>
          <div className={styles["button-container"]}>
            <button type="submit" disabled={isLoading || Boolean(minerIdError)}>
              {isLoading ? "Processing..." : buttonText}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default RegisterModal;
