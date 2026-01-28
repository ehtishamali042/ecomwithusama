import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLogin } from "../../react-query/mutations/auth";
import { useAuthStore } from "../../store/authStore";
import fetcher from "../../api/fetcher";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

const LoginScreen = () => {
  const [email, setEmail] = useState("ehtishamali042@gmail.com");
  const [password, setPassword] = useState("password123");
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginMutation.mutateAsync({ email, password });
      setUser(response.user);
      if (response?.session?.accessToken) {
        localStorage.setItem("accessToken", response.session.accessToken);
        fetcher.setAccessToken(response.session.accessToken);
      }
      navigate("/dashboard");
    } catch {
      // Error handled in UI
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-bold">Welcome back</CardTitle>
            <CardDescription>Sign in to your admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label htmlFor="email" className="label">
                  <span className="label-text">Email</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  autoFocus
                />
              </div>

              <div className="form-control">
                <label htmlFor="password" className="label">
                  <span className="label-text">Password</span>
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>

              {loginMutation.isError && (
                <div className="alert alert-error py-2 text-sm">
                  <span>
                    {loginMutation.error?.message ||
                      "Login failed. Please try again."}
                  </span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
                isLoading={loginMutation.isPending}
              >
                Login
              </Button>
            </form>

            <p className="mt-6 text-center text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="link link-primary font-medium">
                Register
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginScreen;
