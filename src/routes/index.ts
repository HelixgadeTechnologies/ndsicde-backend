import { Router } from "express";
import authRoutes from "./authroute";
import settingsRouter from "./settingsRoute";
import uploadRoutes from "./uploadRoute";
import strategicObjectiveRouter from "./strategicObjectiveAndKpiRoute";
import projectManagementRouter from "./projectManagementRoute";
import userManagementRoutes from "./userManagementRoute";
import requestRouter from "./requestRoute";
import managementAndStaffRouter from "./managementAndStaffRoute";
import financialDashboardRouter from "./financialDashboardRoute";

const rootRoutes: Router = Router();

rootRoutes.use("/auth", authRoutes);
rootRoutes.use("/settings", settingsRouter);
rootRoutes.use("/upload", uploadRoutes);
rootRoutes.use("/strategic-objectivesAndKpi", strategicObjectiveRouter);
rootRoutes.use("/projectManagement", projectManagementRouter);
rootRoutes.use("/userManagement", userManagementRoutes);
rootRoutes.use("/request", requestRouter);
rootRoutes.use("/managementAndStaff", managementAndStaffRouter);
rootRoutes.use("/financial-dashboard", financialDashboardRouter);

export default rootRoutes;
