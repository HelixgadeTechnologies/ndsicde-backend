import { PrismaClient } from "@prisma/client";
import { Project } from "@prisma/client"; // Optional interface import
import { IProjectStatus, IProjectView } from "../interface/projectManagementInterface";

const prisma = new PrismaClient();

export const saveProject = async (data: Partial<Project>, isCreate: boolean) => {
  if (isCreate) {
    return await prisma.project.create({
      data: {
        budgetCurrency: data.budgetCurrency ?? null,
        totalBudgetAmount: data.totalBudgetAmount ?? null,
        startDate: data.startDate ?? undefined,
        endDate: data.endDate ?? undefined,
        country: data.country ?? null,
        state: data.state ?? null,
        localGovernment: data.localGovernment ?? null,
        community: data.community ?? null,
        thematicAreasOrPillar: data.thematicAreasOrPillar ?? null,
        status: data.status ?? null,
        strategicObjectiveId: data.strategicObjectiveId ?? null,
      },
    });
  }

  return await prisma.project.update({
    where: { projectId: data.projectId },
    data: {
      budgetCurrency: data.budgetCurrency ?? null,
      totalBudgetAmount: data.totalBudgetAmount ?? null,
      startDate: data.startDate ?? undefined,
      endDate: data.endDate ?? undefined,
      country: data.country ?? null,
      state: data.state ?? null,
      localGovernment: data.localGovernment ?? null,
      community: data.community ?? null,
      thematicAreasOrPillar: data.thematicAreasOrPillar ?? null,
      status: data.status ?? null,
      strategicObjectiveId: data.strategicObjectiveId ?? null,
      updateAt: new Date(),
    },
  });
};

export const getAllProjects = async () => {
  const projects:Array<IProjectView> = await prisma.$queryRaw`
  SELECT * FROM project_view
`;
  return projects;
};
export const getProjectsStatus = async () => {
  const outcomes: Array<IProjectStatus> = await prisma.$queryRaw`
    SELECT * FROM project_status_summary_view
  `;
  return outcomes[0];
};

export const getProjectById = async (projectId: string) => {
  return await prisma.project.findUnique({
    where: { projectId },
  });
};

export const deleteProject = async (projectId: string) => {
  return await prisma.project.delete({
    where: { projectId },
  });
};
