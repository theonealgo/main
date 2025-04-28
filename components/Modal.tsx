import React from "react";

interface ModalProps {
  isOpen: boolean;
  imageUrl: string;
  closeModal: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, imageUrl, closeModal }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content">
        <img src={imageUrl} alt="Large view" className="modal-image" />
      </div>
    </div>
  );
};

export default Modal;