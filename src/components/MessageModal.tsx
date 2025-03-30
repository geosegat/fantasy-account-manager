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
  // Define classes para o título conforme a variante
  const titleClass = variant === "error" ? "text-red-600" : "text-mu-gold";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 pt-12">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
        <h2 className={`text-2xl font-bold mb-4 ${titleClass}`}>{title}</h2>
        <pre className="whitespace-pre-wrap text-gray-700 mb-6">{message}</pre>
        <button onClick={onClose} className="secondary-button w-full">
          Fechar
        </button>
      </div>
    </div>
  );
};

export default MessageModal;
