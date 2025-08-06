import { Router } from "express"
import authRoutes from "./authroute";
import settingsRouter from "./settingsRoute";
import uploadRoutes from "./uploadRoute";
import strategicObjectiveRouter from "./strategicObjectiveAndKpiRoute";
import projectManagementRouter from "./projectManagementRoute";

const rootRoutes: Router = Router();


rootRoutes.use("/auth", authRoutes);
rootRoutes.use("/settings", settingsRouter);
rootRoutes.use("/upload", uploadRoutes);
rootRoutes.use("/strategic-objectivesAndKpi", strategicObjectiveRouter);
rootRoutes.use("/projectManagement", projectManagementRouter);

export default rootRoutes;
