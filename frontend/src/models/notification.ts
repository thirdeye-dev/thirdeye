import Alert from "./alert";

enum NotificationType {
  EMAIL = "EMAIL",
  SMS = "SMS",
  WEBHOOK = "WEBHOOK",
}

enum NotificationStatus {
  PENDING = "PENDING",
  SENT = "SENT",
  FAILED = "FAILED",
}

interface Notification {
  id: number;
  alert: Alert;
  notification_type: NotificationType;
  notification_body: string;
  notification_target: string;
  trigger_transaction_hash: string;
  meta_logs: string;
  status: NotificationStatus;
}
