import type { Form, FormStats, FormUpdate, ListParams } from "../types/form";
import { api } from "./api";

export const formApi = {
  list: (params: ListParams = {}) =>
    api.get<Form[]>("/forms", { params }).then((r) => r.data),
  stats: () => api.get<FormStats>("/forms/stats").then((r) => r.data),
  remove: (id: string) => api.delete(`/forms/${id}`),
  duplicate: (id: string) =>
    api.post<Form>(`/forms/${id}/duplicate`).then((r) => r.data),
  update: (id: string, updates: FormUpdate) =>
    api.patch<Form>(`/forms/${id}`, updates).then((r) => r.data),
};
