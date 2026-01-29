import { useAuthStore } from "../../store/authStore";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useLogout } from "@/hooks/useLogout";

const DashboardScreen = () => {
  const { user } = useAuthStore();
  const { isLoggingOut, handleLogout } = useLogout();

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
          <Button
            variant="outline"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
