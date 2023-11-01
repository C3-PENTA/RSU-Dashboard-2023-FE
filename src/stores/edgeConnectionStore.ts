import { StateCreator } from 'zustand';
import { IEdgeConnectionStatusStore } from '@/interfaces/interfaceCommon';
import { EdgeSystemConnection } from '@/constants';

export const createEdgeConnectionStatusSlice: StateCreator<IEdgeConnectionStatusStore> = (set) => ({
  isEdgeConnected: EdgeSystemConnection.Unknown,
  setEdgeConnectionStatus: (value) => set(() => ({ isEdgeConnected: value })),
});
