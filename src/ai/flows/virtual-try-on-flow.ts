
'use server';

/**
 * @fileOverview A virtual try-on AI agent.
 *
 * - tryOnProduct: A function that handles the virtual try-on process.
 * - VirtualTryOnInput - The input type for the tryOnProduct function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VirtualTryOnInputSchema = z.object({
  userImage: z
    .string()
    .describe(
      "A photo of the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  productImage: z
    .string()
    .describe(
      "A photo of the product (e.g., a t-shirt on a white background), as a data URI or a public URL."
    ),
});
export type VirtualTryOnInput = z.infer<typeof VirtualTryOnInputSchema>;

export async function tryOnProduct(input: VirtualTryOnInput): Promise<string> {
    const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: [
            { media: { url: input.userImage } },
            { media: { url: input.productImage } },
            { text: `Virtually place the clothing item from the second image onto the person in the first image. 
            The person should be wearing the clothing item. The final image should be realistic and maintain the person's pose and background.
            Ensure the clothing fits naturally on the person.` },
        ],
        config: {
            responseModalities: ['IMAGE'],
        },
    });

    if (!media?.url) {
        throw new Error("AI failed to generate an image.");
    }
    
    return media.url;
}

    