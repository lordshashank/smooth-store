import React, { useState, useCallback } from "react";
import styles from "@/styles/ui/Notification.module.css";
import { Notification } from "@/contexts/NotificationContext";

const colors: { [key: string]: string } = {
  SUCCESS: "#2ecc71",
  ERROR: "#e74c3c",
  INFO: "#3498db",
  WARN: "#f1c40f",
};

interface NotificationProps {
  setNotification: React.Dispatch<React.SetStateAction<Notification[]>>;
  id: string;
  type: string;
  message: string;
}
const NotificationCard: React.FC<NotificationProps> = (props) => {
  const [width, setWidth] = useState(0);
  const [exit, setExit] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();
  const setNotification = props.setNotification;

  const handleStartTimer = () => {
    const id = setInterval(() => {
      setWidth((prev) => {
        if (prev < 100) {
          return prev + 0.5;
        }
        clearInterval(id);
        return prev;
      });
    }, 20);
    setIntervalId(id);
  };
  const handlePauseTimer = () => {
    clearInterval(Number(intervalId) - 1);
    clearInterval(intervalId);
  };

  React.useEffect(() => {
    if (width === 100) {
      setExit(true);
      handlePauseTimer();
      setTimeout(() => {
        setNotification((prev) => prev.filter((note) => note.id !== props.id));
      }, 400);
    }
  }, [width]);
  React.useEffect(() => {
    if (!intervalId) handleStartTimer();
  }, []);
  return (
    <div
      onMouseEnter={handlePauseTimer}
      onMouseLeave={handleStartTimer}
      className={`${styles["notification-item"]} ${exit && styles.exit}`}
    >
      <p style={{ color: `${colors[props.type]}` }}>{props.message}</p>
      <div
        style={{ backgroundColor: `${colors[props.type]}`, width: `${width}%` }}
        className={styles["bar"]}
      ></div>
    </div>
  );
};

export default NotificationCard;
