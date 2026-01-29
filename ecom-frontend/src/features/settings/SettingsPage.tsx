import { Link, Outlet } from "react-router-dom";

export default function SettingsPage() {
  return (
    <div className="max-w-2xlp-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="space-y-4 mb-8">
        <Link
          to="update-profile"
          className="block px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 font-medium"
        >
          Update Profile
        </Link>
      </div>
      <Outlet />
    </div>
  );
}
