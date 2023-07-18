export enum NotificationType {
  EMAIL = "EMAIL",
  SMS = "SMS",
  WEBHOOK = "WEBHOOK",
}

export enum NotificationStatus {
  PENDING = "PENDING",
  SENT = "SENT",
  FAILED = "FAILED",
}

export default interface Notification {
  id: number;
  alert_name: string;
  alert_description: string;
  contract_name: string;
  created_at: string;
  notification_type: NotificationType;
  notification_body: Map<string, string>;
  notification_target: string;
  trigger_transaction_hash: string;
  meta_logs: string;
  status: NotificationStatus;
}
