import { Request, Response } from "express";
import leadsData from "../data/leads.json";
import campaignsData from "../data/campaigns.json";
import { createObjectCsvWriter } from "csv-writer";
import jsPDF from "jspdf";

export const getLeadsReportController = async (req: Request, res: Response) => {
  try {
    const csvWriter = createObjectCsvWriter({
      path: "leads_report.csv", // This path is still the same for writing the file
      header: [
        { id: "id", title: "ID" },
        { id: "name", title: "Name" },
        { id: "email", title: "Email" },
        { id: "source", title: "Source" },
        { id: "createdAt", title: "Created At" },
        { id: "campaignId", title: "Campaign ID" },
      ],
    });

    // Prepare the data for CSV
    const csvData = leadsData.leads.map((lead) => ({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      source: lead.source,
      createdAt: lead.createdAt,
      campaignId: lead.campaignId,
    }));

    // Write data to CSV
    await csvWriter.writeRecords(csvData);

    // Generate a dynamic filename
    const timestamp = new Date().toISOString().replace(/[:.-]/g, "_");
    const filename = `leads_report_${timestamp}.csv`;

    // Send the CSV file as a response with a dynamic filename
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
      path: "campaigns_report.csv", // Path to save the CSV file
      header: [
        { id: "id", title: "ID" },
        { id: "name", title: "Name" },
        { id: "startDate", title: "Start Date" },
        { id: "endDate", title: "End Date" },
        { id: "budget", title: "Budget" },
        { id: "createdAt", title: "Created At" },
      ],
    });

    // Prepare the data for CSV
    const csvData = campaignsData.campaigns.map((campaign) => ({
      id: campaign.id,
      name: campaign.name,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      budget: campaign.budget,
      createdAt: campaign.createdAt,
    }));

    // Write data to CSV
    await csvWriter.writeRecords(csvData);

    // Generate a dynamic filename for download
    const timestamp = new Date().toISOString().replace(/[:.-]/g, "_");
    const filename = `campaigns_report_${timestamp}.csv`;

    // Send the CSV file as a response
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
    const leads = leadsData.leads; // Fetch leads from the imported JSON
    const campaigns = campaignsData.campaigns; // Fetch campaigns from the imported JSON

    // Calculate metrics for each campaign (same logic from your metrics controller)
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

    // Initialize jsPDF instance
    const doc = new jsPDF();

    // Set document title and add metadata
    doc.setFontSize(18);
    doc.text("Campaign Metrics Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    // Add some space
    doc.text(" ", 14, 40);

    // Add the metrics data to the PDF
    metrics.forEach((metric, index) => {
      const startY = 40 + index * 20; // Space out the metrics

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

    // Generate a filename for the PDF report
    const timestamp = new Date().toISOString().replace(/[:.-]/g, "_");
    const filename = `metrics_report_${timestamp}.pdf`;

    // Output the PDF as a downloadable file
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
