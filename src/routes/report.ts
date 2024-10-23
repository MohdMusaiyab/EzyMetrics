import { Router } from "express";
import { getCampaignsReportController, getLeadsReportController, getMetricsReportController } from "../controllers/report";

const reportRoutes=Router();

reportRoutes.get("/leads",getLeadsReportController);

reportRoutes.get("/campaigns",getCampaignsReportController);

reportRoutes.get("/metrics",getMetricsReportController);

export default reportRoutes;