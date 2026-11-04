import { EmptyState, Skeleton } from "../ui/Feedback";
import { Button } from "../ui/Button";
import { AlertCircle, FolderOpen, Plus, Search, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import type { Form, FormsListProps } from "../../types/form";
import FormCard from "./FormCard";

const GRID_CLASS = "grid gap-5 sm:grid-cols-2 lg:grid-cols-3";

function SkeletonGrid({ count = 6 }: Readonly<{ count?: number }>) {
  return (
    <div className={GRID_CLASS}>
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className="h-56 rounded-2xl" />
      ))}
    </div>
  );
}

function EmptyForms({ searching }: Readonly<{ searching: boolean }>) {
  const navigate = useNavigate();

  if (searching) {
    return (
      <EmptyState
        icon={Search}
        title="No forms match your search"
        description="Try a different keyword or clear the filter."
      />
    );
  }

  return (
    <EmptyState
      icon={FolderOpen}
      title="No forms here yet"
      description="Create your first form from scratch or let AI draft one for you."
      action={
        <div className="flex gap-2">
          <Button onClick={() => navigate("/builder/new")}>
            <Plus className="h-4 w-4" /> Blank form
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/builder/new?ai=1")}
          >
            <Sparkles className="h-4 w-4" /> Use AI
          </Button>
        </div>
      }
    />
  );
}

export function FormsList({
  forms,
  loading,
  error,
  searching,
  onRetry,
  onDuplicate,
  onDelete,
  onPatch,
}: Readonly<FormsListProps>) {
  if (loading) return <SkeletonGrid />;

  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Couldn't load your forms"
        description={error}
        action={<Button onClick={onRetry}>Try again</Button>}
      />
    );
  }

  if (forms.length === 0) return <EmptyForms searching={searching} />;

  return (
    <div className={GRID_CLASS}>
      {forms.map((f: Form) => (
        <FormCard
          key={f._id}
          form={f}
          onDuplicate={onDuplicate}
          onRequestDelete={onDelete}
          onPatch={onPatch}
        />
      ))}
    </div>
  );
}
