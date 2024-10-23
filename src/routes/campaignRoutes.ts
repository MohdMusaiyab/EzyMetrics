import { Router } from "express";
import { campaignBudgetAlertController, getAllCampaginsController } from "../controllers/campaigns";

const campaignRoutes = Router();

campaignRoutes.get("/get-all-campaigns",getAllCampaginsController);

campaignRoutes.post("/budget-alert",campaignBudgetAlertController);


export default campaignRoutes;