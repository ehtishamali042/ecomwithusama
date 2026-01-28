import { useNavigate } from "react-router-dom";
import { useLogout } from "../../react-query/mutations/auth";
import fetcher from "../../api/fetcher";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

const LogoutButton = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      logout();
      // Remove accessToken from localStorage and fetcher
      localStorage.removeItem("accessToken");
      fetcher.setAccessToken(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      disabled={logoutMutation.isPending}
    >
      {logoutMutation.isPending ? "Logging out..." : "Logout"}
    </Button>
  );
};

const DashboardScreen = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
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
        {/* Separate Logout Button Component */}
        <div className="flex justify-end mt-8">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
