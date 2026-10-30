export type FormFilter =
  | "all"
  | "published"
  | "draft"
  | "favorites"
  | "archived";

export interface Form {
  _id: string;
  title: string;
  description?: string;
  status: "draft" | "published";
  isArchived: boolean;
  responseCount?: number;
  views?: number;
}

export interface ListParams {
  search?: string;
  filter?: FormFilter;
}

export type FormUpdate = Partial<
  Pick<Form, "title" | "description" | "status" | "isArchived">
>;

export interface FormStats {
  total: number; // non-archived forms
  published: number; // non-archived, status "published"
  draft: number; // non-archived, status "draft"
  responses: number; // sum across all forms, including archived
  views: number; // sum across all forms, including archived
}

export const EMPTY_STATS: FormStats = {
  total: 0,
  published: 0,
  draft: 0,
  responses: 0,
  views: 0,
};
