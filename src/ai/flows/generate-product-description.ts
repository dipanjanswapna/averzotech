
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateDescriptionInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  brand: z.string().describe('The brand of the product.'),
  keywords: z.array(z.string()).describe('A list of keywords related to the product.'),
});
export type GenerateDescriptionInput = z.infer<typeof GenerateDescriptionInputSchema>;

const prompt = ai.definePrompt({
  name: 'productDescriptionPrompt',
  input: { schema: GenerateDescriptionInputSchema },
  output: { schema: z.string() },
  prompt: `You are an expert e-commerce copywriter. Your task is to generate a compelling and SEO-friendly product description.

  **Product Details:**
  - **Name:** {{{productName}}}
  - **Brand:** {{{brand}}}
  - **Keywords:** {{#each keywords}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  **Instructions:**
  1. Write a captivating and descriptive paragraph that highlights the key features and benefits of the product.
  2. Incorporate the provided keywords naturally into the description.
  3. The tone should be persuasive and professional.
  4. The output should be a single block of text (the description only). Do not include any titles or headings.
  5. The description should be between 50 and 100 words.`,
});

export async function generateProductDescription(input: GenerateDescriptionInput): Promise<string> {
  const { output } = await prompt(input);
  return output || '';
}
