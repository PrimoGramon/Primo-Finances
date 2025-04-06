import { ReactNode } from "react";

export function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl bg-white p-4 shadow">{children}</div>;
}

export function CardContent({ children }: { children: ReactNode }) {
  return <div className="mt-2">{children}</div>;
}