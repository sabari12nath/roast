'use server';

import { predictGender as predictGenderFlow } from '@/ai/flows/predict-gender-flow';

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

    const { gender } = await predictGenderFlow({ photoDataUri });

    return { gender };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `Failed to process image: ${errorMessage}` };
  }
}
