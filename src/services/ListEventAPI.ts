import { APIs } from '@/config/httpConfig/apis';
import { http } from '@/helper/http';
import { ResOverviewEvent, EventInfo, ListEventIds, IEvent } from '@/interfaces/interfaceListEvent';
import { AxiosResponse } from 'axios';
import { from } from 'rxjs';

export const getOverviewEvent = () => from(http.get<ResOverviewEvent>(APIs.GET_OVERVIEW_EVENT));

export const getEventStatus = (options: IEvent) => {
  const commonParams =
    '?type=' +
    options.type +
    '&page=' +
    options.page +
    '&limit=' +
    options.limit +
    '&start-date=' +
    options.startDate +
    '&end-date=' +
    options.endDate +
    '&node-id=' +
    options.nodeID +
    '&status=' +
    options.status +
    '&sort=created_at' +
    '&order=' +
    options.order;

  if (options.type == 1) {
    return from(http.get<EventInfo>(APIs.GET_EVENT_STATUS + commonParams));
  }

  if (options.type == 2) {
    return from(
      http.get<EventInfo>(
        APIs.GET_EVENT_STATUS +
          commonParams +
          '&cooperation-class=' +
          options.cooperationClass +
          '&message-type=' +
          options.messageType +
          '&communication-class=' +
          options.communicationClass +
          '&communication-method=' +
          options.communicationMethod +
          '&session-id=' +
          options.sessionID,
      ),
    );
  }

  return from(http.get<EventInfo>(APIs.GET_EVENT_STATUS + commonParams));
};

export const getSensorEvent = (options: IEvent) => {
  const commonParams = '?page=' + options.page + '&limit=' + options.limit;

  return from(http.get<EventInfo>(APIs.GET_DOOR_STATUS + commonParams));
};

export const getEvent = (options: IEvent) => {
  const url = `${APIs.GET_EVENT_STATUS}?${options}`;
  return from(http.get<AxiosResponse>(url));
};

export const downloadEvents = (payload: ListEventIds) =>
  from(
    http.post<ListEventIds>(APIs.DOWNLOAD, payload, {
      responseType: 'blob',
    }),
  );

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
