import { useNavigate } from "react-router-dom";
import { useLogout } from "../../react-query/mutations/auth";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

const DashboardScreen = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={handleLogout} disabled={logoutMutation.isPending}>
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user?.email}</CardTitle>
            <CardDescription>Your e-commerce admin dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Dashboard content goes here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardScreen;
