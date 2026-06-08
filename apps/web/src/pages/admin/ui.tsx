import { useCallback, useState } from 'react';

export type AlertType = 'success' | 'error' | 'info' | 'warning';

export interface AlertItem {
  id: number;
  message: string;
  type: AlertType;
}

export function useAlerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const showAlert = useCallback((message: string, type: AlertType = 'success') => {
    const id = Date.now() + Math.random();
    setAlerts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, 3000);
  }, []);

  return { alerts, showAlert };
}

export function AlertStack({ alerts }: { alerts: AlertItem[] }) {
  return (
    <div id="alertContainer">
      {alerts.map((a) => (
        <div key={a.id} className={`alert alert-${a.type === 'warning' ? 'info' : a.type}`}>
          {a.message}
        </div>
      ))}
    </div>
  );
}

export function Loader({ show, text }: { show: boolean; text: string }) {
  return (
    <div className={`loading-overlay${show ? ' active' : ''}`}>
      <div className="spinner" />
      <div className="loading-text">{text}</div>
    </div>
  );
}
