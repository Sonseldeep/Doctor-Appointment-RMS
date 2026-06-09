"use client";

import React, { createContext, useContext } from "react";

type OnOpenChange = (open: boolean) => void;

type AlertDialogContextType = {
  onOpenChange?: OnOpenChange;
};

const AlertDialogContext = createContext<AlertDialogContextType | null>(null);

export function AlertDialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange?: OnOpenChange;
  children: React.ReactNode;
}) {
  return (
    <AlertDialogContext.Provider value={{ onOpenChange }}>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => onOpenChange?.(false)}
            aria-hidden
          />
          <div className="relative z-10 w-full max-w-lg p-4">{children}</div>
        </div>
      ) : null}
    </AlertDialogContext.Provider>
  );
}

export function AlertDialogContent({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="mx-auto rounded-lg bg-white shadow-lg ring-1 ring-black/5"
    >
      {children}
    </div>
  );
}

export function AlertDialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="px-6 py-4 border-b">{children}</div>;
}

export function AlertDialogTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold">{children}</h3>;
}

export function AlertDialogDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground mt-1">{children}</p>;
}

/**
 * A cancel button that closes the dialog via context.onOpenChange(false)
 */
export function AlertDialogCancel({ children }: { children?: React.ReactNode }) {
  const ctx = useContext(AlertDialogContext);
  return (
    <button
      type="button"
      onClick={() => ctx?.onOpenChange?.(false)}
      className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
    >
      {children ?? "Cancel"}
    </button>
  );
}

/**
 * Action button runs provided onClick then closes dialog (if context present).
 */
export function AlertDialogAction({
  children,
  onClick,
  className,
}: {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const ctx = useContext(AlertDialogContext);

  const handle = () => {
    try {
      onClick?.();
    } finally {
      ctx?.onOpenChange?.(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handle}
      className={className ?? "px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"}
    >
      {children}
    </button>
  );
}