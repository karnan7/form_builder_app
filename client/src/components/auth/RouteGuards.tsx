import { Navigate, Outlet, useLocation, type Location } from "react-router";
import { PageLoader } from "../ui/PageLoader";
import { useAuth } from "../../context/auth";

interface RedirectState {
  from?: Location;
}

export function ProtectedRoute() {
  const { isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) return <PageLoader fullScreen />;
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location } satisfies RedirectState}
      />
    );
  }

  return <Outlet />;
}

export function GuestRoute() {
  const { isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) return <PageLoader fullScreen />;

  if (isAuthenticated) {
    const from = (location.state as RedirectState | null)?.from;

    const destination = from
      ? `${from.pathname}${from.search}${from.hash}`
      : "/dashboard";

    return <Navigate to={destination} replace />;
  }

  return <Outlet />;
}
