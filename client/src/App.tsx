import { Navigate, Route, Routes } from "react-router";
import { Suspense } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import { GuestRoute, ProtectedRoute } from "./components/auth/RouteGuards";
import { PageLoader } from "./components/ui/PageLoader";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Suspense fallback={<PageLoader fullScreen />}>
      <Routes>
        {/* Public auth */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
