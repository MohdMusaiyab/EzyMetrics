import { Router } from "express";
import { getAllLeadsController } from "../controllers/leads";

const leadRoutes=Router();


leadRoutes.get("/get-all-leads",getAllLeadsController)
export default leadRoutes;