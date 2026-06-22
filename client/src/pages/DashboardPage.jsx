import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f2ee]">
      <div className="bg-white rounded-md shadow-sm p-8 text-center">
        <h1 className="text-lg font-medium text-gray-800 mb-2">
          Welcome, {user?.name} 👋
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          You are logged in as <span className="font-medium">{user?.role}</span>
        </p>
        <button
          onClick={logout}
          className="px-4 py-2 bg-[#2f2f2f] text-white text-sm rounded-md hover:bg-black transition"
        >
          Log out
        </button>
      </div>
    </div>
  );
}