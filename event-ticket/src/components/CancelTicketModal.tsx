import { useState } from "react";

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  eventTitle: string;
}

export function CancelTicketModal({ isOpen, onClose, onConfirm, loading, eventTitle }: CancelModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred Backdrop */}
      <div
        className="absolute inset-0 bg-background/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-gradient-card p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>

          <h3 className="font-display text-xl font-bold">Unregister from Event?</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You are about to cancel your ticket for <span className="font-semibold text-foreground">"{eventTitle}"</span>.
            This action is irreversible and your spot will be given to someone else.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
            >
              Keep Ticket
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 rounded-xl bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground shadow-glow-destructive transition-transform hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? "Cancelling..." : "Yes, Unregister"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}