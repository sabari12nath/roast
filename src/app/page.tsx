'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getRoast } from './actions';
import { Skeleton } from '@/components/ui/skeleton';

type RoastState = {
  roast?: string;
  error?: string;
};

const initialState: RoastState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Thinking of how useless you are...
        </>
      ) : (
        'Roast Me'
      )}
    </Button>
  );
}

function ResultCard({ state }: { state: RoastState }) {
  if (!state.roast) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-6 w-6" /> Your Uselessness, Summarized
        </CardTitle>
        <CardDescription>Try not to cry.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-medium">{state.roast}</p>
      </CardContent>
    </Card>
  );
}

function LoadingCard() {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-6 w-3/5" />
          <Skeleton className="h-4 w-4/5" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

function FormContent() {
  const [state, formAction, pending] = useActionState(getRoast, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
  }, [state, toast]);

  return (
    <form action={formAction} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tell me what to roast</CardTitle>
          <CardDescription>
            Give me a topic. Your job, your life, your face. I don't care. I'll find a way to crush your spirit.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            id="topic"
            name="topic"
            placeholder="For example: 'my coding skills'"
            rows={3}
            disabled={pending}
          />
          <SubmitButton />
        </CardContent>
      </Card>

      <div className="transition-opacity duration-500 ease-in-out">
        {pending ? <LoadingCard /> : <ResultCard state={state} />}
      </div>
    </form>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
            Roast Bot
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            I'm here to tell you how useless you are.
          </p>
        </div>
        <FormContent />
      </div>
    </main>
  );
}
