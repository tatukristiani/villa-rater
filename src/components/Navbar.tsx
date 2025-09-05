import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../store/store";

export default function Navbar() {
  const { user, currentGroup, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-xl font-bold text-blue-600 dark:text-blue-400"
          >
            🏝️ Villa Rater
          </Link>

          <div className="flex items-center gap-4">
            {currentGroup && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {currentGroup.name}
              </span>
            )}
            {user && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{user.username}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
