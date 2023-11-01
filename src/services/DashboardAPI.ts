import { APIs } from '@/config/httpConfig/apis';
import { http } from '@/helper/http';
import {
  IResponseSummaryEventStatus,
  IRsuNodes,
  ISummarySystemStatus,
  INodeData,
} from '@/interfaces/interfaceDashboard';
import { from } from 'rxjs';

export const getRSUInformation = () => from(http.get<IRsuNodes>(APIs.GET_LIST_NODE_OF_RSU));
export const getSystemStatusSummary = () =>
  from(http.get<ISummarySystemStatus[]>(APIs.GET_AVAIL_EVENT + '?type=1'));
export const getEventStatusSummary = (time: string) =>
  from(
    http.get<IResponseSummaryEventStatus>(APIs.GET_EVENT_STATUS_SUMMARY + `?time_range=${time}`),
  );
export const getListRSU = () => from(http.get<INodeData>(APIs.GET_LIST_NODE_OF_RSU));
