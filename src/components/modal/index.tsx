import styles from "./index.module.css";

interface ModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export function Modal({ isOpen, message, onClose }: ModalProps) {
  if (!isOpen) return null; // Don't render if modal is closed

  return (
    <div className={styles["modal-overlay"]}>
      <div className={styles["modal-content"]}>
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
}
