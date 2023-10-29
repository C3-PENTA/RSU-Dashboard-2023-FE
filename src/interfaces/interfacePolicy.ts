export interface IPolicyUpdate {
  policyName?: string;
  description?: string;
  cpuThresholdSelf?: number;
  cpuThreshDist?: number;
  numTargets?: number;
  isActivated?: boolean;
}

export interface IPolicy extends IPolicyUpdate {
  policyID: string;
  assignedNodes: INodeByPolicy[];
  unAssignedNodes: INodeByPolicy[];
}

export interface INodeByPolicy {
  nodeID: string;
  rsuID: string;
}
