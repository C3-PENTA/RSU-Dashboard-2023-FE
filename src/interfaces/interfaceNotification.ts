export interface INotification {
  id: string;
  nodeId: string;
  detail: string;
  createAt: string;
}

export interface INotifications {
  notification: INotification[];
}
