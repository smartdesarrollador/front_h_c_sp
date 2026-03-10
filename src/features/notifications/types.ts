export type NotificationCategory = 'billing' | 'security' | 'services' | 'system'
export type NotificationFilter = 'all' | NotificationCategory

export interface HubNotification {
  id: string
  category: NotificationCategory
  title: string
  message: string
  read: boolean
  created_at: string
}
