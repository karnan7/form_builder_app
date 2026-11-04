import type { Form, FormUpdate } from "../../types/form";

const STRIP = [
  { color: "#0c8b7c", decor: "e" },
  { color: "#4f7cc0", decor: "b" },
  { color: "#7e6cc0", decor: "a" },
  { color: "#c79235", decor: "c" },
  { color: "#c2706a", decor: "d" },
  { color: "#2f9e8a", decor: "a" },
  { color: "#5e7fb8", decor: "c" },
  { color: "#b06ca0", decor: "b" },
];

interface FormCardProps {
  form: Form;
  onDuplicate: (id: string) => void;
  onRequestDelete: (form: Form) => void;
  onPatch: (id: string, data: FormUpdate) => void;
}
const FormCard = ({
  form,
  onDuplicate,
  onRequestDelete,
  onPatch,
}: FormCardProps) => {
  const hash = (s: string) =>
    [...s].reduce((h, c) => Math.trunc(h * 31 + (c.codePointAt(0) ?? 0)), 0);
  const strip = STRIP[Math.abs(hash(form._id)) % STRIP.length];
  return <div>FormCard</div>;
};

export default FormCard;
