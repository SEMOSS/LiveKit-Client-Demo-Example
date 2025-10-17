"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../@providers/components/ui/card";
import { Button } from "../../@providers/components/ui/button";
import { Badge } from "../../@providers/components/ui/badge";
import { X } from "lucide-react";

interface TranscriptionPanelProps {
  transcriptionText: string;
  onClear: () => void;
}

export function TranscriptionPanel({
  transcriptionText,
  onClear,
}: TranscriptionPanelProps) {
  if (!transcriptionText) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)] shadow-2xl border-primary/20 animate-in slide-in-from-bottom-5 duration-300">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <CardTitle className="text-lg font-bold">
            Live Transcription
          </CardTitle>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClear}
          className="h-8 w-8 rounded-full"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="bg-gradient-to-br from-background to-muted/30 rounded-lg p-4 border border-primary/10 shadow-inner">
            <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              <p className="text-sm leading-relaxed text-foreground/90 animate-in fade-in duration-500">
                {transcriptionText}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-end">
          <Badge variant="secondary" className="text-xs">
            {transcriptionText.split(" ").length} words
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
