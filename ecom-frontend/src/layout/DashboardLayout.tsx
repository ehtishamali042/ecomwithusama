import { type ReactNode } from "react";
import { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { dashboardMenuItems } from "./utils";
import { useLogout } from "@/hooks/useLogout";

type DashboardLayoutProps = {
  children?: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { isLoggingOut, handleLogout } = useLogout();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [userMenuOpen]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`transition-all duration-300 ease-in-out bg-white shadow-xl h-full flex flex-col ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Logo/Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 h-16">
          {sidebarOpen && (
            <span className="font-bold text-lg text-gray-800 whitespace-nowrap">
              MyApp
            </span>
          )}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className={`p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)] focus:ring-offset-1 ${!sidebarOpen ? "mx-auto" : ""}`}
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4h18M3 12h18M3 20h18"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <div className="space-y-1">
            {dashboardMenuItems.map((item) => {
              const active =
                location.pathname === item.path ||
                (item.path !== "/dashboard" &&
                  location.pathname.startsWith(item.path));

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    group flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium 
                    transition-all duration-200 relative overflow-hidden
                    ${
                      active
                        ? "bg-[rgba(20,184,166,0.08)] text-[color:var(--color-primary)] shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                    ${!sidebarOpen ? "justify-center" : ""}
                    focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)] focus:ring-offset-1
                  `}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  {/* Active indicator */}
                  {active && (
                    <span
                      className="absolute left-0 top-0 bottom-0 w-1"
                      style={{ background: "var(--color-primary)" }}
                    />
                  )}

                  {/* Icon */}
                  <span
                    className={`flex-shrink-0 ${active ? "text-[color:var(--color-primary)]" : ""}`}
                  >
                    {item.icon}
                  </span>

                  {/* Label */}
                  {sidebarOpen && (
                    <span className="truncate text-sm">{item.label}</span>
                  )}

                  {/* Hover indicator for collapsed state */}
                  {!sidebarOpen && (
                    <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile */}
        <div
          className="mt-auto p-3 border-t border-gray-100 relative"
          ref={menuRef}
        >
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors ${
              !sidebarOpen ? "justify-center" : ""
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-sm">
              JD
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0 text-left">
                <div className="font-semibold text-sm text-gray-800 truncate">
                  John Doe
                </div>
                <div className="text-xs text-gray-500 truncate">
                  john@example.com
                </div>
              </div>
            )}
            {sidebarOpen && (
              <svg
                className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${
                  userMenuOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </button>

          {/* Popup Menu */}
          {userMenuOpen && (
            <div
              className={`absolute bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 ${
                sidebarOpen
                  ? "bottom-full left-3 right-3 mb-2"
                  : "bottom-full left-2 mb-2 w-56"
              }`}
            >
              <Link
                to="/dashboard/settings"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setUserMenuOpen(false)}
              >
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Settings
              </Link>
              <button
                disabled={isLoggingOut}
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">{children ?? <Outlet />}</div>
      </main>
    </div>
  );
}
