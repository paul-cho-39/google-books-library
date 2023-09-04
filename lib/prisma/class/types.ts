import { PrismaClient } from "@prisma/client";

export type Data = {
  id: string;
  title: string;
  subtitle: string;
  publishedDate: Date;
  language: string;
  pageCount: number;
};

//   all prismaclient types
type IgnorePrismaBuiltins<S extends string> = string extends S
  ? string
  : S extends ""
  ? S
  : S extends `$${infer T}`
  ? never
  : S;

export type PrismaModelName = IgnorePrismaBuiltins<keyof PrismaClient>;
