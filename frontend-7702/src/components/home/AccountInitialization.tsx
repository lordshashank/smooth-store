"use client";

import Link from "next/link";
import styles from "@/styles/home/AccountInitialization.module.css";
import type { BaseError } from "viem";

import { client } from "@/components/providers/NoneProviders";
import { Account } from "@/modules/Account";
import { useAccount } from "wagmi";

function AccountInitialization({ showDrive = true }: { showDrive?: boolean }) {
  const { data: hash, ...createMutation } = Account.useCreate({
    client,
  });
  const loadMutation = Account.useLoad({ client });

  const { data: account } = Account.useQuery();

  console.log(account);

  const { address } = useAccount();
  console.log(address);

  const isPending = createMutation.isPending || loadMutation.isPending;
  const error = createMutation.error || loadMutation.error;

  return (
    <div className={styles.container}>
      <div className={styles.actions}>
        <button
          className={styles["connect-button"]}
          disabled={isPending}
          onClick={() => createMutation.mutate()}
          type="button"
        >
          Register
        </button>
        <button
          className={styles["connect-button"]}
          disabled={isPending}
          onClick={() => loadMutation.mutate()}
          type="button"
        >
          Sign In
        </button>
      </div>

      {/* {hash && (
        <p>
          Account created!{" "}
          <a
            href={`${client.chain.blockExplorers.default.url}/tx/${hash}`}
            target="_blank"
            rel="noreferrer"
          >
            Explorer
          </a>
        </p>
      )} */}
      {error && (
        <p className={styles["error-msg"]}>
          {(error as BaseError).shortMessage ?? error.message}
        </p>
      )}
    </div>
  );
}

export default AccountInitialization;
