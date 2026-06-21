import {
  LayoutDashboard,
  CheckSquare,
  Clock,
  Users,
  LogOut,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm border-r">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">
            TaskMatrix
          </h1>
        </div>

        <nav className="p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-100 text-gray-900">
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-600">
            <CheckSquare size={18} />
            Tasks
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-600">
            <Users size={18} />
            Team
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-600">
            <Clock size={18} />
            Activity
          </button>
        </nav>

        <div className="absolute bottom-5 left-4 right-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Navbar */}
        <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Dashboard
            </h2>
            <p className="text-sm text-gray-500">
              Welcome back, Yogesh 👋
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">
              Y
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-gray-500 text-sm">
                Total Tasks
              </h3>
              <p className="text-3xl font-bold mt-2">24</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-gray-500 text-sm">
                Completed
              </h3>
              <p className="text-3xl font-bold mt-2 text-green-600">
                18
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-gray-500 text-sm">
                Pending
              </h3>
              <p className="text-3xl font-bold mt-2 text-orange-500">
                6
              </p>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Tasks */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-4">
                Recent Tasks
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <span>Design Landing Page</span>
                  <span className="text-green-600 text-sm">
                    Completed
                  </span>
                </div>

                <div className="flex justify-between items-center border-b pb-3">
                  <span>Build Authentication</span>
                  <span className="text-orange-500 text-sm">
                    In Progress
                  </span>
                </div>

                <div className="flex justify-between items-center border-b pb-3">
                  <span>Setup MongoDB</span>
                  <span className="text-red-500 text-sm">
                    Pending
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Deploy Application</span>
                  <span className="text-red-500 text-sm">
                    Pending
                  </span>
                </div>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-4">
                Upcoming Deadlines
              </h3>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium">
                    Authentication Module
                  </h4>
                  <p className="text-sm text-gray-500">
                    Due Tomorrow
                  </p>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium">
                    Dashboard UI
                  </h4>
                  <p className="text-sm text-gray-500">
                    Due in 3 Days
                  </p>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-medium">
                    Production Deployment
                  </h4>
                  <p className="text-sm text-gray-500">
                    Due in 5 Days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}