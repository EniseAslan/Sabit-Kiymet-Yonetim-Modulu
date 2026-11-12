interface NotificationProps {
  message: string;
  onClose: () => void;
  type?: 'success' | 'error';
}

function Notification({
  message,
  onClose,
  type = 'success',
}: NotificationProps) {
  return (
    <div className={`notification notification--${type}`} role="alert">
      <span>{message}</span>
      <button onClick={onClose} aria-label="Kapat">
        ×
      </button>
    </div>
  );
}

export default Notification;