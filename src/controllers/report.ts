import { Request, Response } from "express";
import leadsData from "../data/leads.json";
import campaignsData from "../data/campaigns.json";
import { createObjectCsvWriter } from "csv-writer";
import jsPDF from "jspdf";

export const getLeadsReportController = async (req: Request, res: Response) => {
  try {
    const csvWriter = createObjectCsvWriter({
      path: "leads_report.csv", 
      header: [
        { id: "id", title: "ID" },
        { id: "name", title: "Name" },
        { id: "email", title: "Email" },
        { id: "source", title: "Source" },
        { id: "createdAt", title: "Created At" },
        { id: "campaignId", title: "Campaign ID" },
      ],
    });

    
    const csvData = leadsData.leads.map((lead) => ({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      source: lead.source,
      createdAt: lead.createdAt,
      campaignId: lead.campaignId,
    }));

    
    await csvWriter.writeRecords(csvData);

    
    const timestamp = new Date().toISOString().replace(/[:.-]/g, "_");
    const filename = `leads_report_${timestamp}.csv`;

    
    res.download("leads_report.csv", filename, (err) => {
      if (err) {
        console.error("Error sending the file:", err);
        res
          .status(500)
          .send({ success: false, message: "Error downloading the file." });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getCampaignsReportController = async (
  req: Request,
  res: Response
) => {
  try {
    const csvWriter = createObjectCsvWriter({
      path: "campaigns_report.csv", 
      header: [
        { id: "id", title: "ID" },
        { id: "name", title: "Name" },
        { id: "startDate", title: "Start Date" },
        { id: "endDate", title: "End Date" },
        { id: "budget", title: "Budget" },
        { id: "createdAt", title: "Created At" },
      ],
    });

    
    const csvData = campaignsData.campaigns.map((campaign) => ({
      id: campaign.id,
      name: campaign.name,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      budget: campaign.budget,
      createdAt: campaign.createdAt,
    }));

    
    await csvWriter.writeRecords(csvData);

    
    const timestamp = new Date().toISOString().replace(/[:.-]/g, "_");
    const filename = `campaigns_report_${timestamp}.csv`;

    
    res.download("campaigns_report.csv", filename, (err) => {
      if (err) {
        console.error("Error sending the file:", err);
        res
          .status(500)
          .send({ success: false, message: "Error downloading the file." });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getMetricsReportController = async (
  req: Request,
  res: Response
) => {
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

    
    const doc = new jsPDF();

    
    doc.setFontSize(18);
    doc.text("Campaign Metrics Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    
    doc.text(" ", 14, 40);

    
    metrics.forEach((metric, index) => {
      const startY = 40 + index * 20; 

      doc.setFontSize(14);
      doc.text(`Campaign Name: ${metric.campaignName}`, 14, startY);
      doc.setFontSize(12);
      doc.text(`Total Leads: ${metric.totalLeads}`, 14, startY + 6);
      doc.text(`Budget: $${metric.budget}`, 14, startY + 12);
      doc.text(`Budget per Lead: $${metric.budgetPerLead}`, 14, startY + 18);
      doc.text(
        `Lead Sources: ${metric.leadSources.join(", ")}`,
        14,
        startY + 24
      );
    });

    
    const timestamp = new Date().toISOString().replace(/[:.-]/g, "_");
    const filename = `metrics_report_${timestamp}.pdf`;

    
    const pdfBuffer = doc.output("arraybuffer");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};
