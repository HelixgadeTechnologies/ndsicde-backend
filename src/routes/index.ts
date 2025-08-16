import { Router } from "express"
import authRoutes from "./authroute";
import settingsRouter from "./settingsRoute";
import uploadRoutes from "./uploadRoute";
import strategicObjectiveRouter from "./strategicObjectiveAndKpiRoute";
import projectManagementRouter from "./projectManagementRoute";
import userManagementRoutes from "./userManagementRoute";
import auditLogRouter from "./auditlogRoute";
import dataValidationRouter from "./dataValidationRoute";

const rootRoutes: Router = Router();


rootRoutes.use("/auth", authRoutes);
rootRoutes.use("/settings", settingsRouter);
rootRoutes.use("/upload", uploadRoutes);
rootRoutes.use("/strategic-objectivesAndKpi", strategicObjectiveRouter);
rootRoutes.use("/projectManagement", projectManagementRouter);
rootRoutes.use("/userManagement", userManagementRoutes);
rootRoutes.use("/auditLog", auditLogRouter);
rootRoutes.use("/dataValidation", dataValidationRouter);

export default rootRoutes;
