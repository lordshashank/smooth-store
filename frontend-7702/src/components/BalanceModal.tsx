import Modal from "./ui/Modal";
import styles from "@/styles/BalanceModal.module.css";
import Link from "next/link";
import { useChains, useAccount } from "wagmi";
import { useChainModal } from "@rainbow-me/rainbowkit";

type BalanceModalProps = {
  onClose: () => void;
  isChainSupported: boolean;
};

const BalanceModal: React.FC<BalanceModalProps> = ({
  onClose,
  isChainSupported,
}) => {
  const { openChainModal } = useChainModal();

  return (
    <Modal onClose={onClose}>
      {isChainSupported ? (
        <>
          <h2 className={styles.heading}>Insufficient Amount</h2>
          <div className={styles.content}>
            <div className={styles.words}>
              Want some Tokens?{" "}
              <Link href="https://google.com/">Click here</Link> to get some
            </div>
            <div className={styles.close}>
              <button onClick={onClose}>Close</button>
            </div>
          </div>
        </>
      ) : (
        <>
          <h2 className={styles.heading}>Wrong Network</h2>
          <div className={styles.content}>
            <div className={styles.words}>
              Please switch to an Supported network
            </div>
            <div className={styles.close}>
              <button onClick={onClose}>Close</button>
              <button onClick={openChainModal}>Switch</button>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default BalanceModal;
