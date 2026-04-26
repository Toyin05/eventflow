interface Props {
  open: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  loading?: boolean;
}

export default function ConfirmModal({
  open,
  title,
  message,
  onCancel,
  onConfirm,
  confirmLabel = "Delete",
  loading,
}: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="card-glow relative w-full max-w-md p-6">
        <h3 className="font-display text-lg font-semibold text-[color:var(--color-text-primary)]">{title}</h3>
        <p className="mt-2 text-sm text-[color:var(--color-text-muted)]">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="btn-outline">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-500/30 transition-colors hover:bg-red-600 disabled:opacity-60"
          >
            {loading ? "Working..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
