import { Link } from "react-router-dom";
import { useStore } from "../store/store";

export default function Home() {
  const { user } = useStore();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Create a new rating group or join an existing one
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link
          to="/create-group"
          className="card hover:shadow-lg transition-shadow"
        >
          <div className="text-center">
            <div className="text-4xl mb-4">🏝️</div>
            <h2 className="text-xl font-bold mb-2">Create Group</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Start a new villa rating session with custom filters
            </p>
          </div>
        </Link>

        <Link to="/join" className="card hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="text-4xl mb-4">👥</div>
            <h2 className="text-xl font-bold mb-2">Join Group</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Enter a join code to join an existing group
            </p>
          </div>
        </Link>
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={() => {
            const username = prompt("Enter new username:", user?.username);
            if (username && username !== user?.username) {
              useStore.getState().updateUsername(username);
            }
          }}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Change Username
        </button>
      </div>
    </div>
  );
}
