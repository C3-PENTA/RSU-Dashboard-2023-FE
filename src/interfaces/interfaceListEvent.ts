import { IPaginationData } from './interfaceCommon';

export interface IListEventForm extends IPaginationData {
  keyword: string;
  lastRecordCreatedTime?: string;
  dateRange: [Date | null, Date | null];
  categoryID: string[];
}

export interface IListEventResData extends IPaginationData {
  listEvent: IListEvent[];
}

export interface IEvent {
  [key: string]: any;
  type: number;
  page: number;
  limit: number;
  startDate?: string;
  endDate?: string;
  nodeID?: string;
  status?: number;
  drivingNegotiation?: string;
  messageType?: string;
  order?: string;
}

export interface IFile {
  id: string;
  fileName: string;
  fileType: string;
  path: string;
}

export interface ISocketEvent {
  id: string;
  sendNodeId: string;
  receiveNodeId: string;
  status: number;
  label: number;
  createdAt?: string;
  updatedAt?: string;
  animated?: boolean;
}

export interface IListEvent {
  id: string;
  sendNode: string;
  receiveNode: string;
  file?: IFile;
  status?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IListEventRes {
  createdAt: string;
  updatedAt?: string;
  id: string;
  fileType: string;
  receiveNodeId: string;
  receiveNode: string;
  sendNodeId: string;
  sendNode: string;
  status: string;
  policyName: string;
}

export interface IListEventPage {
  events: IListEventRes[];
  totalPage: number;
  currentPage: number;
  hasNextPage: boolean;
}

export interface ResOverviewEvent {
  total: number;
  numberOfFailed: number;
  numberOfSucceed: number;
}

export interface ResHistoricalEvent {
  id: string;
  sendNodeId: string;
  receiveNodeId: string;
  label: number;
  status: number;
}

export interface AvailabilityEvent {
  id: string;
  name: string;
  status: number;
  dns: string;
  latitude: number;
  longtitude: number;
}

export interface EventInfo {
  events: [];
  meta: {
    currentPage: string;
    totalPages: number;
    totalItems: number;
    perPage: string;
  };
}

export interface ListEventIds {
  type: number;
  eventIds: string[];
  log: boolean;
}

export interface MetaData {
  nodeList: { [nodeName: string]: string };
  eventStatus: { [event: string]: number };
  drivingNegotiationsClass: { [negotiation: string]: number };
  networkStatus: { [status: string]: number };
  communicationMethod: { [method: string]: number };
  messageType: { [type: string]: number };
  nodeType: { [type: string]: number };
}

export interface INotificationEventSocket {
  nodeID: string;
  detail: string;
}

export interface IEdgeConnectionStatus {
  status: string;
}
