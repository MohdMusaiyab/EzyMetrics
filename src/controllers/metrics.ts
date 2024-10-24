import { Request, Response } from "express";
import leadsData from "../data/leads.json";
import campaignsData from "../data/campaigns.json";
export const getMetricsController = async (req: Request, res: Response) => {
  try {
    const leads = leadsData.leads; 
    const campaigns = campaignsData.campaigns; 

    
    const metrics = campaigns.map((campaign) => {
      const campaignLeads = leads.filter(
        (lead) => lead.campaignId === campaign.id
      ); 
      const totalLeads = campaignLeads.length; 
      const budgetPerLead =
        totalLeads > 0 ? (campaign.budget / totalLeads).toFixed(2) : "0.00"; 
      const leadSources = [
        ...new Set(campaignLeads.map((lead) => lead.source)),
      ]; 

      return {
        campaignId: campaign.id,
        campaignName: campaign.name,
        totalLeads,
        budget: campaign.budget,
        budgetPerLead,
        leadSources,
      };
    });

    
    res.status(200).json({
      success: true,
      metrics,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};
