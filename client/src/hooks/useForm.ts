import { useCallback, useEffect, useState } from "react";
import type { Form, FormUpdate, ListParams } from "../types/form";
import { formApi } from "../services/formApi";
import { toast } from "sonner";
import { getErrorMessage } from "../lib/errors";

export interface UseFormsOptions extends ListParams {
  /** Called after a successful delete/duplicate/update so a parent can refresh aggregates. */
  onMutate?: () => void;
}
export function useForms({
  search = "",
  filter = "all",
  onMutate,
}: UseFormsOptions = {}) {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const result = await formApi.list({ search, filter });
      setForms(result);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  }, [search, filter]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const remove = useCallback(
    async (id: string) => {
      setForms((prev) => prev.filter((f) => f._id !== id));
      try {
        await formApi.remove(id);
        toast.success("Form Deleted");
        onMutate?.();
      } catch (error) {
        toast.error(getErrorMessage(error));
        void loadAll();
      }
    },
    [loadAll, onMutate],
  );

  const duplicate = useCallback(async (id: string) => {
    try {
      const copy = await formApi.duplicate(id);
      setForms((prev) => [copy, ...prev]);
      toast.success("Form duplicated");
      onMutate?.();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }, []);

  const patch = useCallback(async (id: string, updates: FormUpdate) => {
    setForms((prev) =>
      prev.map((f) => (f._id === id ? { ...f, ...updates } : f)),
    );
    try {
      await formApi.update(id, updates);
      toast.success("Form updated");
      onMutate?.();
    } catch (error) {
      toast.error(getErrorMessage(error));
      void loadAll();
    }
  }, []);

  return {
    forms,
    loading,
    error,
    reload: loadAll,
    remove,
    duplicate,
    patch,
    setForms,
  };
}
