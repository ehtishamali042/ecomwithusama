import { type ReactNode } from "react";
import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

const menuItems = [
  {
    label: "Orders",
    path: "/dashboard/orders",
    icon: (
      <svg
        className="w-5 h-5 mr-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 7h18M3 12h18M3 17h18"
        />
      </svg>
    ),
  },
  // Add more sections here as needed
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
        className={`transition-all duration-200 bg-white shadow h-full flex flex-col ${sidebarOpen ? "w-64" : "w-20"}`}
      >
        {/* Logo/Header */}
        <div className="flex items-center justify-between p-4 border-b h-16">
          <span className="font-extrabold text-xl tracking-tight text-primary flex items-center">
            <svg
              className="w-7 h-7 mr-2 text-primary"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
            </svg>
            {sidebarOpen && <span>Dashboard</span>}
          </span>
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="ml-2 p-1 rounded hover:bg-gray-100 text-gray-500"
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              {sidebarOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              )}
            </svg>
          </button>
        </div>
        {/* Navigation */}
        <nav className="flex-1 mt-4 px-2 space-y-1">
          {menuItems.map((item) => {
            const active = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors mb-1
                  ${active ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-100 hover:text-primary"}
                  ${!sidebarOpen ? "justify-center" : ""}
                `}
              >
                {item.icon}
                {sidebarOpen && item.label}
              </Link>
            );
          })}
        </nav>
        {/* User Profile (bottom) */}
        <div className="mt-auto p-4 border-t flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 8-4 8-4s8 0 8 4" />
            </svg>
          </div>
          {sidebarOpen && (
            <div>
              <div className="font-semibold text-sm">User Name</div>
              <div className="text-xs text-gray-400">user@email.com</div>
            </div>
          )}
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">{children ?? <Outlet />}</main>
    </div>
  );
}
