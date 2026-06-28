import type { ReactNode } from "react";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Window {}
}

export type RootLayoutProps = {
  children: ReactNode;
};

export type PageProps<TParams = Record<string, string>> = {
  params: Promise<TParams>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
