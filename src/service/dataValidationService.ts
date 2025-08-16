import { PrismaClient } from "@prisma/client";
import {
  IProjectValidation,
  IProjectValidationView,
  IPValidationSummary,
} from "../interface/dataValidationInterface";

const prisma = new PrismaClient();

export class ProjectValidationService {
  /**
   * Get all project validations from the view
   */
  async getAllValidations(): Promise<IProjectValidationView[]> {
    return prisma.$queryRaw<IProjectValidationView[]>`
      SELECT * FROM project_validation_view
      ORDER BY createAt DESC
    `;
  }

  /**
   * Get project validation Summary
   */

  async getSummary() {
    const outcomes = await prisma.$queryRaw<any[]>`
    SELECT * FROM project_validation_summary_view
  `;

    const data: IPValidationSummary[] = outcomes.map((item) => ({
      pendingReview: item.pendingReview ? Number(item.pendingReview) : 0,
      approved: item.approved ? Number(item.pendingReview) : 0,
      rejected: item.rejected ? Number(item.pendingReview) : 0,
      totalSubmissions: Number(item.totalSubmissions),
    }));
    return data[0];
  }

  /**
   * Get a single project validation by ID
   */
  async getValidationById(id: string): Promise<IProjectValidationView | null> {
    const results = await prisma.$queryRaw<IProjectValidationView[]>`
      SELECT * FROM project_validation_view
      WHERE projectValidationId = ${id}
      LIMIT 1
    `;
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Create or Update a Project Validation
   * @param data - object containing project validation details
   * @param isCreate - true to create, false to update
   */
  async createOrUpdateValidation(
    data: IProjectValidation,
    isCreate: boolean
  ): Promise<IProjectValidationView | null> {
    if (isCreate) {
      // CREATE in base table
      const created = await prisma.projectValidation.create({
        data: {
          submissionName: data.submissionName as string,
          projectId: data.projectId ?? null,
          submittedBy: data.submittedBy ?? null,
          status: "PENDING", // Default status for new submissions
          type: data.type ?? null,
        },
      });

      // Fetch from view for full details
      const results = await prisma.$queryRaw<IProjectValidationView[]>`
        SELECT * FROM project_validation_view
        WHERE projectValidationId = ${created.projectValidationId}
        LIMIT 1
      `;
      return results.length > 0 ? results[0] : null;
    } else {
      if (!data.projectValidationId) {
        throw new Error("projectValidationId is required for update");
      }

      // UPDATE in base table
      await prisma.projectValidation.update({
        where: { projectValidationId: data.projectValidationId },
        data: {
          submissionName: data.submissionName,
          projectId: data.projectId ?? null,
          submittedBy: data.submittedBy ?? null,
          status: data.status?.toLowerCase() ?? "PENDING", // Default to PENDING if not provided
          type: data.type ?? null,
          updateAt: new Date(),
        },
      });

      // Fetch updated data from view
      const results = await prisma.$queryRaw<IProjectValidationView[]>`
        SELECT * FROM project_validation_view
        WHERE projectValidationId = ${data.projectValidationId}
        LIMIT 1
      `;
      return results.length > 0 ? results[0] : null;
    }
  }

  /**
   * Delete a project validation by ID
   */
  async deleteValidation(id: string): Promise<void> {
    const result = await prisma.projectValidation.delete({
      where: { projectValidationId: id },
    });
  }
}
