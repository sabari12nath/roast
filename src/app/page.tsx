'use client';

import { useState, useEffect, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { Upload, Mars, Venus, Loader2, UserCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { predictGender } from './actions';
import { cn } from '@/lib/utils';

type PredictionState = {
  gender?: 'Male' | 'Female' | 'Uncertain';
  error?: string;
};

const initialState: PredictionState = {};

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={disabled || pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Predicting...
        </>
      ) : (
        'Predict Gender'
      )}
    </Button>
  );
}

function ResultCard({ state }: { state: PredictionState }) {
  const getResultContent = () => {
    switch (state.gender) {
      case 'Male':
        return {
          icon: <Mars className="h-16 w-16 text-blue-500" />,
          text: 'Male',
        };
      case 'Female':
        return {
          icon: <Venus className="h-16 w-16 text-pink-500" />,
          text: 'Female',
        };
      default:
        return {
          icon: <UserCircle2 className="h-16 w-16 text-muted-foreground" />,
          text: 'Could not determine',
        };
    }
  };

  const { icon, text } = getResultContent();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Prediction Result</CardTitle>
        <CardDescription>Perceived gender based on the image.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4 pt-2">
        {icon}
        <p className="text-2xl font-bold">{text}</p>
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
      <CardContent className="flex flex-col items-center justify-center space-y-4 pt-2">
        <Skeleton className="h-16 w-16 rounded-full" />
        <Skeleton className="h-8 w-32" />
      </CardContent>
    </Card>
  );
}

function FormContent() {
  const [state, formAction, pending] = useActionState(predictGender, initialState);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: state.error,
      });
    }
    if (state?.gender !== undefined) {
      setShowResult(true);
    }
  }, [state, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setShowResult(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setImagePreview(null);
    setShowResult(false);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  return (
    <form action={formAction} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
          <CardDescription>Select an image to analyze for perceived gender.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className="flex h-48 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border text-center hover:bg-muted/50"
            onClick={() => fileInputRef.current?.click()}
          >
            <Input
              ref={fileInputRef}
              id="image"
              name="image"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={pending}
            />
            {imagePreview ? (
              <div className="relative h-full w-full">
                <Image src={imagePreview} alt="Image preview" layout="fill" objectFit="contain" className="rounded-md" />
                 <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-background/50 hover:bg-background/80" onClick={(e) => { e.stopPropagation(); handleReset()}}>
                    <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2 text-muted-foreground">
                <Upload className="h-8 w-8" />
                <p>Click or drag to upload</p>
              </div>
            )}
          </div>
          <SubmitButton disabled={!imagePreview} />
        </CardContent>
      </Card>

      <div className={cn("transition-opacity duration-500 ease-in-out", showResult || pending ? "opacity-100" : "opacity-0")}>
        {pending ? <LoadingCard /> : showResult && <ResultCard state={state} />}
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
            ClarityAI
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Discover the perceived gender from an image.
          </p>
        </div>
        <FormContent/>
      </div>
    </main>
  );
}
