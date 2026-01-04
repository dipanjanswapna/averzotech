
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const DemandForecastInputSchema = z.object({
  vendorId: z.string().describe('The unique identifier for the vendor.'),
  topSellingProducts: z.array(z.object({
    productName: z.string(),
    category: z.string(),
    unitsSoldLast30Days: z.number(),
  })).describe('A list of the vendor\'s top-selling products in the last 30 days.'),
  upcomingCampaigns: z.array(z.object({
    name: z.string(),
    type: z.string().describe('Type of campaign, e.g., "Mega Sale", "Seasonal", "Holiday".'),
  })).describe('A list of upcoming major sales campaigns on the platform.'),
});
export type DemandForecastInput = z.infer<typeof DemandForecastInputSchema>;

const DemandForecastOutputSchema = z.object({
  seasonalAlerts: z.array(z.string()).describe('Alerts related to upcoming seasons and the types of products that will be in demand.'),
  campaignForecasts: z.array(z.string()).describe('Forecasts related to upcoming sales campaigns, specifying which products might see a surge.'),
  actionableSuggestions: z.array(z.string()).describe('Specific, actionable suggestions for the vendor, such as "Double the stock for T-Shirts" or "Introduce a new color for Winter Hoodies".'),
});
export type DemandForecastOutput = z.infer<typeof DemandForecastOutputSchema>;

const prompt = ai.definePrompt({
  name: 'demandForecastPrompt',
  input: { schema: DemandForecastInputSchema },
  output: { schema: DemandForecastOutputSchema },
  prompt: `You are an expert e-commerce demand forecasting analyst for Averzo, a major online marketplace in Bangladesh. Your task is to provide actionable insights to a vendor based on their sales data and upcoming platform events. The current month is {{moment format="MMMM"}}.

  **Vendor's Top Selling Products (Last 30 Days):**
  {{#each topSellingProducts}}
  - **{{productName}}** (Category: {{category}}): {{unitsSoldLast30Days}} units sold.
  {{else}}
  - No significant sales data in the last 30 days.
  {{/each}}

  **Upcoming Platform-Wide Campaigns:**
  {{#each upcomingCampaigns}}
  - **{{name}}** (Type: {{type}})
  {{/each}}

  **Analysis and Recommendations:**
  Based on the provided data and the current month, generate the following for the vendor:

  1.  **Seasonal Alerts:** Identify upcoming seasons or holidays in Bangladesh (e.g., Winter, Eid, Pohela Boishakh) relevant to the current date. Suggest 1-2 product categories that will be in high demand. For example: "Winter is approaching. Demand for hoodies, jackets, and moisturizers is expected to increase by 80%."

  2.  **Campaign Forecasts:** Look at the upcoming campaigns. For each campaign, predict which of the vendor's top-selling products are likely to see a surge in demand. Be specific. For example: "For the '11.11 Mega Sale', expect demand for your '{{topSellingProducts.0.productName}}' to triple."

  3.  **Actionable Suggestions:** Provide 2-3 clear, direct, and actionable pieces of advice for the vendor. These should be based on jejich data and the forecasts. Be encouraging and use strong action verbs. For example: "Double the stock of your top-selling T-Shirts immediately." or "Consider introducing a new dark color variant for your '{{topSellingProducts.0.productName}}' for the upcoming winter season."

  **Output Format:**
  Your entire response must be a valid JSON object that conforms to the output schema. Ensure all suggestions are concise and easy for a vendor to understand and act upon.
  `,
});

export async function generateDemandForecast(input: DemandForecastInput): Promise<DemandForecastOutput> {
    // In a real-world scenario, you might fetch more data here,
    // like historical sales for 동일한 기간 from the previous year.
  const { output } = await prompt(input);
  return output || { seasonalAlerts: [], campaignForecasts: [], actionableSuggestions: [] };
}
