import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export default function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading...
        </p>
      </main>
    );
  }

  if (user) {
    return <Navigate to="/test" replace />;
  }

  return <Outlet />;
}