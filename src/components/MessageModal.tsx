import React from "react";

interface MessageModalProps {
  title: string;
  message: string;
  onClose: () => void;
  variant?: "success" | "error";
}

const MessageModal: React.FC<MessageModalProps> = ({
  title,
  message,
  onClose,
  variant = "success",
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 pt-12">
      <div
        className={` bg-mu-bgGray rounded-lg p-6 max-w-md w-full shadow-lg border `}
      >
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <pre className="whitespace-pre-wrap mb-6">{message}</pre>
        <button onClick={onClose} className="secondary-button w-full">
          Fechar
        </button>
      </div>
    </div>
  );
};

export default MessageModal;
