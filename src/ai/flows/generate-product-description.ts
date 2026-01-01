
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateDescriptionInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  brand: z.string().describe('The brand of the product.'),
  keywords: z.array(z.string()).describe('A list of keywords related to the product.'),
  specifications: z.array(z.object({
    label: z.string(),
    value: z.string(),
  })).describe('A list of product specifications.'),
  colors: z.array(z.string()).describe('Available colors for the product.'),
  sizes: z.array(z.string()).describe('Available sizes for the product.'),
});
export type GenerateDescriptionInput = z.infer<typeof GenerateDescriptionInputSchema>;

const prompt = ai.definePrompt({
  name: 'productDescriptionPrompt',
  input: { schema: GenerateDescriptionInputSchema },
  output: { schema: z.string() },
  prompt: `You are an expert e-commerce copywriter. Your task is to generate a compelling and SEO-friendly product description in about 80-120 words.

  **Product Details:**
  - **Name:** {{{productName}}}
  - **Brand:** {{{brand}}}
  - **Keywords:** {{#each keywords}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  {{#if specifications.length}}
  - **Specifications:**
    {{#each specifications}}
    - {{{this.label}}}: {{{this.value}}}
    {{/each}}
  {{/if}}
  {{#if colors.length}}
  - **Available Colors:** {{#each colors}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  {{/if}}
  {{#if sizes.length}}
  - **Available Sizes:** {{#each sizes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  {{/if}}

  **Instructions:**
  1.  Start with a strong, captivating opening sentence.
  2.  Write a descriptive paragraph (3-4 sentences) highlighting the key features and benefits. Use the provided keywords and specifications naturally.
  3.  If specifications are available, create a bulleted list of 2-3 most important features.
  4.  Mention the variety of colors and sizes if available.
  5.  The tone should be persuasive and professional.
  6.  The output must be a single block of text (the description only). Do not include any titles or headings like "Description:".
  `,
});

export async function generateProductDescription(input: GenerateDescriptionInput): Promise<string> {
  const { output } = await prompt(input);
  return output || '';
}
