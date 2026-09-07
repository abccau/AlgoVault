import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

/* ─── Types ─── */
interface ConfirmOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning';
}

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

/* ─── Context ─── */
const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export const useConfirm = () => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within <ConfirmProvider>');
  return ctx;
};

interface PendingConfirm {
  options: ConfirmOptions;
  resolve: (value: boolean) => void;
}

/* ─── Provider ─── */
export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pending, setPending] = useState<PendingConfirm | null>(null);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setPending({ options, resolve });
    });
  }, []);

  const handleResponse = (value: boolean) => {
    pending?.resolve(value);
    setPending(null);
  };

  const isDanger = pending?.options.variant === 'danger' || !pending?.options.variant;
  const accentColor = isDanger ? '#ef4444' : '#f59e0b';
  const accentBg    = isDanger ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)';
  const accentBorder= isDanger ? 'rgba(239,68,68,0.3)'  : 'rgba(245,158,11,0.3)';

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {pending && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(6px)',
            animation: 'fadein 0.15s ease',
          }}
          onClick={() => handleResponse(false)}
        >
          <style>{`@keyframes fadein { from{opacity:0} to{opacity:1} } @keyframes scalein { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }`}</style>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: 360,
              borderRadius: 20,
              background: '#0d1117',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.75)',
              overflow: 'hidden',
              animation: 'scalein 0.18s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '20px 20px 0 20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: accentBg,
                border: `1px solid ${accentBorder}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {isDanger
                  ? <Trash2 size={18} style={{ color: accentColor }} />
                  : <AlertTriangle size={18} style={{ color: accentColor }} />
                }
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#f0f4fc',
                  margin: 0,
                  lineHeight: 1.3,
                }}>
                  {pending.options.title || (isDanger ? 'Confirm Delete' : 'Confirm Action')}
                </h3>
                <p style={{
                  fontSize: 12.5,
                  color: '#94a3b8',
                  marginTop: 6,
                  lineHeight: 1.55,
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {pending.options.message}
                </p>
              </div>
              <button
                onClick={() => handleResponse(false)}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: 'rgba(255,255,255,0.3)', padding: 2, borderRadius: 6,
                  display: 'flex', alignItems: 'center', flexShrink: 0,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
              >
                <X size={15} />
              </button>
            </div>

            {/* Separator */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '18px 0 0' }} />

            {/* Footer */}
            <div style={{
              padding: '14px 20px',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 8,
            }}>
              <button
                onClick={() => handleResponse(false)}
                style={{
                  padding: '7px 18px',
                  borderRadius: 10,
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#94a3b8',
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
                  (e.currentTarget as HTMLElement).style.color = '#f0f4fc';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = '#94a3b8';
                }}
              >
                {pending.options.cancelLabel || 'Cancel'}
              </button>
              <button
                onClick={() => handleResponse(true)}
                style={{
                  padding: '7px 18px',
                  borderRadius: 10,
                  background: accentBg,
                  border: `1px solid ${accentBorder}`,
                  color: accentColor,
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = isDanger
                    ? 'rgba(239,68,68,0.22)' : 'rgba(245,158,11,0.22)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = accentBg;
                }}
              >
                {pending.options.confirmLabel || (isDanger ? 'Delete' : 'Confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};
