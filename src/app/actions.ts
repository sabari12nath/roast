'use server';

import { generateAltText } from '@/ai/flows/generate-alt-text';

type PredictionState = {
  gender?: 'Male' | 'Female' | 'Uncertain';
  error?: string;
};

export async function predictGender(
  prevState: PredictionState,
  formData: FormData
): Promise<PredictionState> {
  const imageFile = formData.get('image') as File;

  if (!imageFile || imageFile.size === 0) {
    return { error: 'Please select an image file.' };
  }

  try {
    const buffer = await imageFile.arrayBuffer();
    const photoDataUri = `data:${imageFile.type};base64,${Buffer.from(buffer).toString('base64')}`;

    const { altText } = await generateAltText({ photoDataUri });

    const lowerCaseAltText = altText.toLowerCase();

    if (/\b(man|male|boy|gentleman)\b/.test(lowerCaseAltText)) {
      return { gender: 'Male' };
    }
    if (/\b(woman|female|girl|lady)\b/.test(lowerCaseAltText)) {
      return { gender: 'Female' };
    }

    return { gender: 'Uncertain' };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `Failed to process image: ${errorMessage}` };
  }
}
