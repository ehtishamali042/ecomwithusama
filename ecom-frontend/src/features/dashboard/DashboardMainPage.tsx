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

const DashboardMainPage = () => {
  const { user } = useAuthStore();
  const { isLoggingOut, handleLogout } = useLogout();

  return (
    <div className="min-h-screen bg-base-200  ">
      <div className="w-full space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>
              Welcome,{" "}
              {user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : user?.email}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Your e-commerce admin dashboard.</CardDescription>
          </CardContent>
        </Card>
        <div className="flex justify-end mt-8">
          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-50"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardMainPage;
