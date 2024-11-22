import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";

type ConfirmProps = {
  isOpen: boolean;
  onConfirm: (inputValue?: string) => void;
  onCancel: () => void;
  message: string;
  showInput?: boolean;
  inputPlaceholder?: string;
};

const Confirm: React.FC<ConfirmProps> = ({ isOpen, onConfirm, onCancel, message, showInput = false, inputPlaceholder = "Type 'DELETE' to confirm", }) => {
  // Only render the modal when isOpen is true
  const [inputValue, setInputValue] = useState("");
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (showInput && inputValue.toLocaleLowerCase() !== "delete") {
      alert("Please type 'DELETE' to confirm.");
      return;
    }
    onConfirm(inputValue);  // Pass the input value when confirming
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onCancel}>
      {/* Overlay can be uncommented if needed */}
      {/* <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" /> */}

      <motion.div
        className="fixed inset-0 flex justify-center items-center z-50"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <Dialog.Content className="bg-white p-6 rounded-lg shadow-lg w-80">
          {/* Add DialogTitle for accessibility */}
          <Dialog.Title className="sr-only">Confirmation Dialog</Dialog.Title> {/* sr-only hides the title visually */}

          <p className="text-gray-800 text-lg font-medium mb-4">{message}</p>

          {/* Optional input field */}
          {showInput && (
            <div className="mb-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full  p-2 border border-gray-300 rounded-md"
                placeholder={inputPlaceholder}
              />
            </div>
          )}

          <div className="flex justify-between">
            <button
              className="bg-gray-300 text-gray-800 rounded-lg px-4 py-2 w-24"
              onClick={onCancel} // Close the dialog
            >
              Cancel
            </button>
            <button
              className="bg-red-500 text-white rounded-lg px-4 py-2 w-24"
              onClick={handleConfirm} // Trigger the confirmation action
            >
              Confirm
            </button>
          </div>
        </Dialog.Content>
      </motion.div>
    </Dialog.Root>
  );
};

export default Confirm;
