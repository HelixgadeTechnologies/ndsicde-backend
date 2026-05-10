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
  statement?: string | null;
  definition?: string | null;
  specificArea?: string | null;
  unitOfMeasure?: string | null;
  itemInMeasure?: string | null;
  baseLineDate?: Date | null;
  cumulativeValue?: number | null;
  baselineNarrative?: string | null;
  targetDate?: Date | null;
  cumulativeTarget?: number | null;
  targetNarrative?: string | null;
  targetType?: string | null;
  responsiblePersons?: string | null;
  type?: string | null;
  strategicObjectiveId?: string | null;
  strategicObjective?: IStrategicObjective;
  kpiDisaggregation?: IKpiDisaggregation[];
  createAt?: Date;
  updateAt?: Date;
}

export interface IKpiDisaggregation {
  kpiDisaggregationId: string;
  kpiId: string;
  type?: string;
  category?: string;
  target?: number;
  baseline?: number;
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
