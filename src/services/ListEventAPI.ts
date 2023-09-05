import { APIs } from '@/config/httpConfig/apis';
import { http } from '@/helper/http';
import { ResOverviewEvent, EventInfo, ListEventIds } from '@/interfaces/interfaceListEvent';
import { from } from 'rxjs';

export const getOverviewEvent = () => from(http.get<ResOverviewEvent>(APIs.GET_OVERVIEW_EVENT));
export const getEventStatus = (
  type: number,
  page: number,
  limit: number,
  stDate?: string,
  edDate?: string,
  nodeID?: string,
  isError?: string,
  drivingNegotiation?: string,
  messageType?: string,
  order?: string,
) =>
  from(
    http.get<EventInfo>(
      APIs.GET_EVENT_STATUS +
        '?type=' +
        type +
        '&page=' +
        page +
        '&limit=' +
        limit +
        '&start-date=' +
        stDate +
        '&end-date=' +
        edDate +
        '&node-id=' +
        nodeID +
        '&status=' +
        isError +
        '&driving-negotiation-class=' +
        drivingNegotiation +
        '&message-type=' +
        messageType +
        '&sort=created_at' +
        '&order=' +
        order,
    ),
  );

export const downloadEvents = (payload: ListEventIds) =>
  from(
    http.post<ListEventIds>(APIs.DOWNLOAD, payload, {
      responseType: 'blob',
    }),
  );

export const getNewEvents = (type: number) =>
  from(http.get<any[]>(APIs.GET_NEW_EVENTS + '?type=' + type));

export const getStatusStartStop = () => from(http.get(APIs.GET_STATUS_START_STOP));

export const changeStatusGenerator = () => from(http.post(APIs.CHANGE_GENERATOR, {}));

export const deleteEvent = (type: number, deleteAll: string) =>
  from(http.delete(APIs.DELETE_EVENT + '?type=' + type + '&delete-all=' + deleteAll));

export const uploadEvent = (file: File) =>
  from(
    http.post(
      APIs.UPLOAD_EVENT,
      { file },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    ),
  );

export const getMetaData = () => from(http.get<any>(APIs.GET_METADATA));
