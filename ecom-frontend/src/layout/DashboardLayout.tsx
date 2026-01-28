import { type ReactNode } from "react";
import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

const menuItems = [
  { label: "Orders", path: "/dashboard/orders" },
  // Future: Add more sections here
];

type DashboardLayoutProps = {
  children?: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`transition-all duration-200 bg-white shadow h-full ${sidebarOpen ? "w-64" : "w-16"}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-bold text-lg">
            {sidebarOpen ? "Dashboard" : "D"}
          </span>
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="ml-2 p-1 rounded hover:bg-gray-200"
          >
            {sidebarOpen ? "<" : ">"}
          </button>
        </div>
        <nav className="mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-2 rounded transition-colors mb-1 ${location.pathname.startsWith(item.path) ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}`}
            >
              {sidebarOpen ? item.label : item.label[0]}
            </Link>
          ))}
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">{children ?? <Outlet />}</main>
    </div>
  );
}
