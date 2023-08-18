export interface IPolicyUpdate {
  name?: string;
  description?: string;
  cpu_limit?: number;
  cpu_thresh?: number;
  num_edges?: number;
  is_activated?: boolean;
}

export interface IPolicy extends IPolicyUpdate {
  id: string;
  assignedNodes: INodeByPolicy[];
  unAssignedNodes: INodeByPolicy[];
}

export interface INodeByPolicy {
  nodeId: string;
  nodeName: string;
  policyId: string;
  policyName: string;
  is_activated: boolean;
}
