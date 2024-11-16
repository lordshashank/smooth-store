import classes from "@/styles/ui/Modal.module.css";

const Modal = ({
  children,
  onClose,
  bg = "rgba(0, 0, 0, 0.3)",
}: {
  children: React.ReactNode;
  onClose: () => void;
  bg?: string;
}) => {
  const closeHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).id == "modal") {
      onClose();
    }
  };
  return (
    <div className={classes.modal} id="modal" onClick={closeHandler}>
      <div className={classes["modal-content"]} style={{ backgroundColor: bg }}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
