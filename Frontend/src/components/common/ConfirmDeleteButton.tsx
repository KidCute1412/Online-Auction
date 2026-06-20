import React from "react";
import Swal from "sweetalert2";

interface ConfirmDeleteButtonProps {
  onConfirm: () => Promise<any>;
  onSuccess: (data: any) => void;
  onError: (message: string) => void;
  className?: string;
  children: React.ReactNode;
}

const ConfirmDeleteButton: React.FC<ConfirmDeleteButtonProps> = ({
  onConfirm,
  onSuccess,
  onError,
  className,
  children,
}) => {
  const handleClick = () => {
    Swal.fire({
      title: "Are you sure you want to delete this item?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm()
          .then((data) => {
            if (data.code === "success") {
              onSuccess(data);
            } else {
              onError(data.message);
            }
          })
          .catch((error: any) => {
            onError(error.message || "An error occurred during deletion.");
          });
      }
    });
  };

  return (
    <button className={className} onClick={handleClick}>
      {children}
    </button>
  );
};

export default ConfirmDeleteButton;
