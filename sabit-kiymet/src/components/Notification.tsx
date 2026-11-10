interface NotificationProps {
  message: string;
  onClose: () => void;
}

function Notification({ message, onClose }: NotificationProps) {
  return (
    <div className="notification notification--success">
      <span>{message}</span>
      <button onClick={onClose}>×</button>
    </div>
  );
}

export default Notification;