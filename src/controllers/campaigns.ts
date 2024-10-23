import { Request, Response } from "express";
import prisma from "../lib/prisma";
import campaignsData from "../data/campaigns.json";
import nodemailer from "nodemailer";

interface Campaign {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  budget: number;
  createdAt: string;
}

export const getAllCampaginsController = async (
  req: Request,
  res: Response
) => {
  try {
    for (const campaign of campaignsData.campaigns) {
      // Check if a campaign with the same id already exists
      const existingCampaign = await prisma.campaign.findUnique({
        where: {
          id: campaign.id,
        },
      });

      // If no existing campaign, create a new one
      if (!existingCampaign) {
        await prisma.campaign.create({
          data: {
            name: campaign.name,
            startDate: new Date(campaign.startDate), // Convert string to Date
            endDate: new Date(campaign.endDate), // Convert string to Date
            budget: campaign.budget,
            createdAt: new Date(campaign.createdAt), // Convert string to Date
          },
        });
      } else {
        console.log(`Campaign with id ${campaign.id} already exists.`);
      }
    }

    res.status(201).json({ message: "Campaigns imported successfully" });
  } catch (error) {}
};

export const campaignBudgetAlertController = async (
  req: Request,
  res: Response
) => {
  try {
    const { campaignId, threshold } = req.body; // Extract campaignId and threshold from the request body
    const campaign = campaignsData.campaigns.find((c) => c.id === campaignId);

    if (!campaign) {
      res.status(404).send({
        success: false,
        message: "Campaign not found",
      });
    }

    const spentBudget = calculateSpentBudget(campaign!); // Implement your budget calculation logic
    const exceedThreshold = threshold || 0.9; // Default threshold is 90% if not provided

    if (spentBudget > exceedThreshold * campaign?.budget!) {
      // Send an email notification if the budget exceeds the threshold
      await sendEmailNotification(campaign!, spentBudget, exceedThreshold);

      res.status(200).send({
        success: true,
        message: `Email alert sent: Campaign ${campaign?.name} has exceeded ${
          exceedThreshold * 100
        }% of its budget`,
      });
    }

    res.status(200).send({
      success: true,
      message: `Campaign ${campaign?.name} is within budget`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const calculateSpentBudget = (campaign: Campaign): number => {
  // For now, assume that we have spent a certain portion of the budget
  return 0.95 * campaign.budget; // Example: 95% of the budget spent
};
const sendEmailNotification = async (
  campaign: Campaign,
  spentBudget: number,
  threshold: number
): Promise<void> => {
  // Configure Nodemailer transport using environment variables
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Define the email content
  const mailOptions: nodemailer.SendMailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_RECIPIENT, // Load recipient from env
    subject: `Budget Alert for Campaign: ${campaign.name}`,
    text: `The campaign "${campaign.name}" has exceeded ${
      threshold * 100
    }% of its budget.\n
           Budget: $${campaign.budget}\n
           Spent: $${spentBudget}\n
           Please take action accordingly.`,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};
