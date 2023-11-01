import { Path } from '@/config/path';
import { LazyExoticComponent } from 'react';
import { Socket } from 'socket.io-client';
import { IEdgeConnectionStatus, ISocketEvent } from './interfaceListEvent';

/**
 * Get all 'values' of `T` interface
 */
export type TypesOf<T> = T[keyof T];
export type Constructor<T> = { new (...args: any[]): T };

export interface IRoute {
  path: Path;
  component: LazyExoticComponent<() => JSX.Element>;
}

export type TSupportedLangCode = 'en' | 'ko';

export interface ILanguageConfig {
  lang: TSupportedLangCode;
  img: string;
  alt?: string;
  tooltip?: string;
}

export interface IPaginationData {
  hasNext?: boolean;
  size?: number;
  currentPage?: number;
  totalPages?: number;
  totalRecords?: number;
}

export interface IPagination {
  pageSizePool: number[];
}

export interface ISystemStore {
  socket: Socket;
  isAFK: boolean;
  setIsAFK: (value: boolean) => void;
}

export interface INodeStore {
  nodeData: any;
  setNodeData: (newState: any) => void;
}

export interface IEventStore {
  communicationEvent: ISocketEvent[];
  setCommunicationEvent: (newState?: ISocketEvent[]) => void;
}

export interface IEdgeConnectionStatusStore {
  isEdgeConnected: string;
  setEdgeConnectionStatus: (newState?: string) => void;
}

export interface IHelperStatus {
  key: string;
  status: string;
  label: string;
  color: string;
}

export interface IStore extends ISystemStore, INodeStore, IEventStore, IEdgeConnectionStatusStore {}

export interface ISharedVariable {
  variable_name: string;
  value: string;
  timestamp: Date;
}
