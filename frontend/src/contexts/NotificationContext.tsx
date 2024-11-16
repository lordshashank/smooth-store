"use client";
import React from "react";
import { useState } from "react";
import { createContext } from "react";
import NotificationCard from "@/components/ui/Notification";
import styles from "@/styles/ui/Notification.module.css";

interface NotificationContextProps {
  onPresent: (content: Content) => void;
}

type NotificationType = "ERROR" | "SUCCESS" | "INFO" | "WARN";
export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
}
export type Content = {
  type: NotificationType;
  message: string;
};

export const Context = createContext<NotificationContextProps>({
  onPresent: () => {},
});

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notification, setNotification] = useState<Notification[]>([]);
  const handlePresent = (content: Content) => {
    setNotification((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: content.type,
        message: content.message,
      },
    ]);
  };

  return (
    <Context.Provider
      value={{
        onPresent: handlePresent,
      }}
    >
      <div className={styles["notification-wrapper"]}>
        {notification.map((note) => (
          <NotificationCard
            setNotification={setNotification}
            key={note.id}
            {...note}
          />
        ))}
      </div>

      {children}
    </Context.Provider>
  );
};

export default NotificationProvider;
