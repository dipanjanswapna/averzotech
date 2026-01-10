'use server';
/**
 * @fileOverview An AI flow to find products similar to an uploaded image.
 *
 * - findSimilarProducts - A function that takes an image and a list of products and returns similar product IDs.
 * - FindSimilarProductsInput - The input type for the findSimilarProducts function.
 * - FindSimilarProductsOutput - The return type for the findSimilarProducts function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const FindSimilarProductsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a clothing item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  products: z.array(ProductSchema).describe('A list of available products in the store.'),
});

export type FindSimilarProductsInput = z.infer<typeof FindSimilarProductsInputSchema>;

const FindSimilarProductsOutputSchema = z.object({
  productIds: z.array(z.string()).describe('An array of product IDs that are visually similar to the item in the photo.'),
});

export type FindSimilarProductsOutput = z.infer<typeof FindSimilarProductsOutputSchema>;

const prompt = ai.definePrompt({
  name: 'findSimilarProductsPrompt',
  input: { schema: FindSimilarProductsInputSchema },
  output: { schema: FindSimilarProductsOutputSchema },
  prompt: `You are a fashion expert and a personal shopper. Your task is to find products from a given list that are visually similar to an item in a user-provided photo.

Analyze the user's photo to identify the main clothing item's style, color, pattern, and type (e.g., "red floral dress", "blue striped t-shirt", "denim jacket").

Then, compare this analysis against the provided list of products. Identify up to 5 products from the list that are the closest match. Consider the product name, description, and tags.

Return only the product IDs of the matching items. If no good matches are found, return an empty array.

**User's Photo:**
{{media url=photoDataUri}}

**Available Products:**
\`\`\`json
{{{json products}}}
\`\`\`
`,
});

export async function findSimilarProducts(input: FindSimilarProductsInput): Promise<FindSimilarProductsOutput> {
    const { output } = await prompt(input);
    return output || { productIds: [] };
}
