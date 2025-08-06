export interface IProject {
  projectId: string;
  budgetCurrency?: string;
  totalBudgetAmount?: string;
  startDate?: Date;
  endDate?: Date;
  country?: string;
  state?: string;
  localGovernment?: string;
  community?: string;
  thematicAreasOrPillar?: string;
  status?: string;
  strategicObjectiveId?: string;
  createAt?: Date;
  updateAt?: Date;
}

export interface IProjectStatus {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  onHoldProjects: number;
}

export interface IProjectView {
  projectId: string;
  budgetCurrency?: string;
  totalBudgetAmount?: string;
  startDate?: Date;
  endDate?: Date;
  country?: string;
  state?: string;
  localGovernment?: string;
  community?: string;
  thematicAreasOrPillar?: string;
  status?: string;
  strategicObjectiveId?: string;
  strategicObjectiveStatement?: string;
  createAt?: Date;
  updateAt?: Date;
}
