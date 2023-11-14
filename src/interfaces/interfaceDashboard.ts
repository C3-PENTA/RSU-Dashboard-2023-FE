export interface IRsuNodes {
  nodes: IRsuData[];
  count: number;
}

export interface IRsuData {
  id: string;
  rsuID: string;
  name: string;
  status: boolean;
  latitude: string;
  longitude: string;
  createdAt: string;
  updatedAt: string;
}

export interface INodeData {
  nodes: IRsuData[];
}

export interface ISummarySystemStatus {
  nodeID: string;
  rsuID: string;
  rsuName: string;
  nodeStatus: number;
  cpuUsage: number;
  cpuTemp: number;
  ramUsage: number;
  diskUsage: number;
  networkSpeed: number;
  networkUsage: number;
  networkStatus: number;
  detail: string;
  status: number;
  createdAt: string;
}

export interface ISummaryEventStatus {
  nodeId: string;
  customId: string;
  totalAvailabilityNormal: number;
  totalCommunicationNormal: number;
  totalAvailabilityError: number;
  totalCommunicationError: number;
  percentAvailabilityError: number;
  percentAvailabilityNormal: number;
  percentCommunicationError: number;
  percentCommunicationNormal: number;
  percentTotalAvailability: number;
  percentTotalCommunication: number;
}

export interface IResponseSummaryEventStatus {
  summary: ISummaryEventStatus[];
}

export interface IPositions {
  id: string;
  content: string;
  latlng: kakao.maps.LatLng;
}

export interface IMapProps {
  data: IRsuData[];
}

export interface ISummaryEventStatusProps {
  summaryEventStatus: string;
}

export interface ISummarySystemStatusProps {
  summarySystemStatus: ISummarySystemStatus[];
}
