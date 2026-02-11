import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "./alert-dialog";

interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
  onConfirm: () => void;
}

const variantStyles = {
  danger: "bg-red-600 text-white hover:bg-red-700",
  warning: "bg-amber-600 text-white hover:bg-amber-700",
  default: "bg-indigo-600 text-white hover:bg-indigo-700",
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
}) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent className="bg-slate-800 border-slate-700">
      <AlertDialogHeader>
        <AlertDialogTitle className="text-white">{title}</AlertDialogTitle>
        <AlertDialogDescription className="text-slate-400">
          {description}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600 hover:text-white">
          {cancelLabel}
        </AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm} className={variantStyles[variant]}>
          {confirmLabel}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default ConfirmModal;
