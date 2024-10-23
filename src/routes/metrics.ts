import { Router } from "express";
import { getMetricsController } from "../controllers/metrics";

const metricRoutes=Router();

metricRoutes.get("/get-metrics",getMetricsController)

export default metricRoutes;