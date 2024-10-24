import { Request, Response } from "express";
import prisma from "../lib/prisma";
import leadsData from "../data/leads.json";
export const getAllLeadsController = async (req: Request, res: Response) => {
  try {
    for (const lead of leadsData.leads) {
      
      const existingLead = await prisma.lead.findUnique({
        where: {
          email: lead.email,
        },
      });

      
      if (!existingLead) {
        await prisma.lead.create({
          data: {
            name: lead.name,
            email: lead.email,
            source: lead.source,
            createdAt: new Date(lead.createdAt), 
            campaignId: lead.campaignId, 
          },
        });
      } else {
        console.log(`Lead with email ${lead.email} already exists.`);
      }
    }

    res.status(201).json({ message: "Leads imported successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};
