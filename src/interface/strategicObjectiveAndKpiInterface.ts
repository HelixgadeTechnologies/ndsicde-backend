export interface IStrategicObjective {
  strategicObjectiveId: string;
  statement?: string;
  thematicAreas?: string;
  pillarLead?: string;
  status?: string;
  createAt?: Date;
  updateAt?: Date;
}
export interface IKpi {
  kpiId: string;
  statement?: string;
  definition?: string;
  type?: string;
  specificAreas?: string;
  unitOfMeasure?: string;
  itemInMeasure?: string;
  disaggregation?: string;
  baseLine?: string;
  target?: string;
  strategicObjectiveId?: string;
  strategicObjective?: IStrategicObjective;
  createAt?: Date;
  updateAt?: Date;
}

export interface IStrategicObjectiveView {
  strategicObjectiveId: string;
  statement?: string;
  thematicAreas?: string;
  pillarLead?: string;
  status?: string;
  createAt?: Date;
  updateAt?: Date;
  listedKpi?: number;
}
