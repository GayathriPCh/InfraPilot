import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-white hover:text-slate-200">
            🏗️ InfraPilot
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {user && (
              <>
                <Link to="/builder">
                  <Button
                    variant={isActive("/builder") ? "default" : "ghost"}
                    size="sm"
                  >
                    Builder
                  </Button>
                </Link>
                <Link to="/history">
                  <Button
                    variant={isActive("/history") ? "default" : "ghost"}
                    size="sm"
                  >
                    History
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="text-sm text-slate-400 mr-2">{user.email}</span>
                <Link to="/history">
                  <Button variant="default" size="sm" className="hidden sm:inline-flex bg-blue-600 text-white hover:bg-blue-700">
                    Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="default" size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
