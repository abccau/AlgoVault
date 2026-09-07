import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

/* ─── Types ─── */
export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant, duration?: number) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

/* ─── Context ─── */
const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
};

/* ─── Styles per variant ─── */
const VARIANT_STYLE: Record<ToastVariant, { bg: string; border: string; icon: React.ReactNode; label: string }> = {
  success: {
    bg:     'rgba(21, 40, 26, 0.97)',
    border: 'rgba(34, 197, 94, 0.35)',
    icon:   <CheckCircle size={15} style={{ color: '#4ade80', flexShrink: 0 }} />,
    label:  '#4ade80',
  },
  error: {
    bg:     'rgba(40, 18, 18, 0.97)',
    border: 'rgba(239, 68, 68, 0.35)',
    icon:   <XCircle size={15} style={{ color: '#f87171', flexShrink: 0 }} />,
    label:  '#f87171',
  },
  warning: {
    bg:     'rgba(40, 33, 14, 0.97)',
    border: 'rgba(245, 158, 11, 0.35)',
    icon:   <AlertTriangle size={15} style={{ color: '#fbbf24', flexShrink: 0 }} />,
    label:  '#fbbf24',
  },
  info: {
    bg:     'rgba(13, 24, 40, 0.97)',
    border: 'rgba(56, 189, 248, 0.35)',
    icon:   <Info size={15} style={{ color: '#38bdf8', flexShrink: 0 }} />,
    label:  '#38bdf8',
  },
};

/* ─── Single Toast Item ─── */
const ToastItem: React.FC<{ toast: Toast; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  const s = VARIANT_STYLE[toast.variant];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        minWidth: 280,
        maxWidth: 420,
        padding: '11px 14px',
        borderRadius: 12,
        background: s.bg,
        border: `1px solid ${s.border}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(16px)',
        animation: 'toast-in 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Left accent bar */}
      <div style={{
        position: 'absolute',
        left: 0, top: 0, bottom: 0,
        width: 3,
        borderRadius: '12px 0 0 12px',
        background: s.label,
      }} />

      {s.icon}

      <p style={{
        flex: 1,
        fontSize: 12.5,
        fontWeight: 500,
        color: '#e2e8f0',
        lineHeight: 1.45,
        fontFamily: 'Inter, sans-serif',
      }}>
        {toast.message}
      </p>

      <button
        onClick={() => onDismiss(toast.id)}
        style={{
          background: 'transparent',
          border: 'none',
          padding: 2,
          cursor: 'pointer',
          color: 'rgba(255,255,255,0.3)',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
          borderRadius: 4,
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
      >
        <X size={13} />
      </button>
    </div>
  );
};

/* ─── Provider ─── */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((message: string, variant: ToastVariant = 'info', duration = 3500) => {
    const id = `toast-${++counterRef.current}`;
    setToasts(prev => [...prev, { id, message, variant, duration }]);
    setTimeout(() => dismiss(id), duration);
  }, [dismiss]);

  const ctx: ToastContextValue = {
    toast,
    success: (msg) => toast(msg, 'success'),
    error:   (msg) => toast(msg, 'error'),
    warning: (msg) => toast(msg, 'warning'),
    info:    (msg) => toast(msg, 'info'),
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}

      {/* Toast stack portal */}
      <div style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        pointerEvents: 'none',
      }}>
        <style>{`
          @keyframes toast-in {
            from { opacity: 0; transform: translateY(12px) scale(0.95); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
        {toasts.map(t => (
          <div key={t.id} style={{ pointerEvents: 'auto' }}>
            <ToastItem toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
