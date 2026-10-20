import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/auth";
import { Field, Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { toast } from "sonner";
import AuthLayout from "../components/auth/AuthLayout";

interface LoginFormValues {
  email: string;
  password: string;
}

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitting(true);
    try {
      const user = await login(values);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      await navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = () => {
    setValue("email", "alex@timetoprogram.dev", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    setValue("password", "Test@1234", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <AuthLayout>
      <div className="mb-8 lg:hidden">
        <div className="flex justify-center">
          <Link to="/">
            <span className="text-2xl font-bold tracking-tight text-fg">
              FormNest <span className="text-brand-600">AI</span>
            </span>
          </Link>
        </div>
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-fg">
        Welcome back
      </h2>
      <p className="mt-1.5 text-sm text-muted">
        Log in to your FormNest AI workspace.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
        <Field label="Email" error={errors.email?.message}>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              className="pl-10"
              invalid={!!errors.email}
              {...register("email", { required: "Email is required" })}
            />
          </div>
        </Field>

        <Field label="Password" error={errors.password?.message}>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-10"
              invalid={!!errors.password}
              {...register("password", {
                required: "Password is required",
              })}
            />
          </div>
        </Field>

        <Button type="submit" size="lg" className="w-full" loading={submitting}>
          Log in
        </Button>
      </form>
      <button
        onClick={fillDemo}
        className="mt-3 w-full rounded-xl border border-dashed border-default py-2 text-xs font-medium text-muted hover:border-brand-300 hover:text-brand-600"
      >
        Fill demo credentials
      </button>
      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-brand-600 hover:underline"
        >
          Sign up free
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
