import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated")({
  component: AuthGate,
});

function AuthGate() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.href });

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login", search: { redirect: path } });
  }, [user, loading, navigate, path]);

  if (loading || !user) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="h-8 w-8 text-gold animate-spin mx-auto" />
      </div>
    );
  }
  return <Outlet />;
}
