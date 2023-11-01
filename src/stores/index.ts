import { create } from 'zustand';
import { IStore } from '@/interfaces/interfaceCommon';
import { createSystemSlice } from './systemStore';
import { createEdgeConnectionStatusSlice } from './edgeConnectionStore';
import { createEventSlice } from './eventStore';
import { createNodeSlice } from './diagramStore';

const useGlobalStore = create<IStore>()((...helpers) => ({
  ...createSystemSlice(...helpers),
  ...createEdgeConnectionStatusSlice(...helpers),
  ...createNodeSlice(...helpers),
  ...createEventSlice(...helpers),
}));
export default useGlobalStore;
