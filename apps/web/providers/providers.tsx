"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import React from "react";
import { RickrollAudioProvider } from "@/providers/rickroll-audio-provider";

/**
 * Create a QueryClient instance with default options
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

interface ProvidersProps {
  children: React.ReactNode;
  rickrollAudioUrl: string | null;
}

/**
 * Combined providers component
 * Wraps the app with TanStack Query and Nuqs providers
 */
export function Providers({ children, rickrollAudioUrl }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <RickrollAudioProvider audioUrl={rickrollAudioUrl}>
          {children}
        </RickrollAudioProvider>
      </NuqsAdapter>
    </QueryClientProvider>
  );
}
