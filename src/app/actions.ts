'use server';

import { roastUser } from '@/ai/flows/roast-bot-flow';

type RoastState = {
  roast?: string;
  error?: string;
};

export async function getRoast(
  prevState: RoastState,
  formData: FormData
): Promise<RoastState> {
  const topic = formData.get('topic') as string;

  if (!topic) {
    return { error: 'You need to give me something to roast, you waste of space.' };
  }

  try {
    const { roast } = await roastUser({ topic });
    return { roast };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `Even the server is tired of you. Error: ${errorMessage}` };
  }
}
