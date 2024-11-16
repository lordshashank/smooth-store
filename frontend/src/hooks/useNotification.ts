import { useContext } from "react";
import { Context } from "@/contexts/NotificationContext";
import { Content } from "@/contexts/NotificationContext";

const useNotification = () => {
  const { onPresent } = useContext(Context);

  const showNotification = (modalContent: Content) => {
    onPresent(modalContent);
  };
  return { showNotification };
};

export default useNotification;
