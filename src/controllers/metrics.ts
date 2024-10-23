import { Request, Response } from "express";
import leadsData from "../data/leads.json";
import campaignsData from "../data/campaigns.json";
export const getMetricsController = async (req: Request, res: Response) => {
  try {
    const leads = leadsData.leads; // Fetch leads from the imported JSON
    const campaigns = campaignsData.campaigns; // Fetch campaigns from the imported JSON

    // Calculate metrics for each campaign
    const metrics = campaigns.map((campaign) => {
      const campaignLeads = leads.filter(
        (lead) => lead.campaignId === campaign.id
      ); // Filter leads for the campaign
      const totalLeads = campaignLeads.length; // Total leads for the campaign
      const budgetPerLead =
        totalLeads > 0 ? (campaign.budget / totalLeads).toFixed(2) : "0.00"; // Calculate budget per lead
      const leadSources = [
        ...new Set(campaignLeads.map((lead) => lead.source)),
      ]; // Unique lead sources

      return {
        campaignId: campaign.id,
        campaignName: campaign.name,
        totalLeads,
        budget: campaign.budget,
        budgetPerLead,
        leadSources,
      };
    });

    // Send the metrics as a response
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
