// ToastContext.tsx
"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  open: boolean;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: Toast;
  setToast: React.Dispatch<React.SetStateAction<Toast>>;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<Toast>({
    open: false,
    message: "",
    type: "success",
  });

  // ✅ Add debug logging
  const setToastWithDebug = (newToast: React.SetStateAction<Toast>) => {
    console.log("🍞 ToastContext: Setting toast:", newToast);
    setToast(newToast);
  };

  return (
    <ToastContext.Provider value={{ toast, setToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
