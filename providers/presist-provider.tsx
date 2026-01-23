"use client";

import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "@/redux/store";

interface PersistProvidersProps {
  children: React.ReactNode;
}

export function PersistProviders({ children }: PersistProvidersProps) {
  return <PersistGate loading={null} persistor={persistor}>{children}</PersistGate>;
}
