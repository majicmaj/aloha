import { ModelManagerPage } from "./pages/ModelManagerPage";
import { Chat } from "./pages/Chat";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { MessageSquare, Blocks } from "lucide-react";

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`p-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
        isActive ? "bg-gray-200 dark:bg-gray-700" : ""
      }`}
    >
      {children}
    </Link>
  );
}

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <nav className="w-20 border-r border-gray-200 dark:border-gray-800 p-2 flex flex-col items-center gap-4">
          <NavLink to="/">
            <MessageSquare />
          </NavLink>
          <NavLink to="/models">
            <Blocks />
          </NavLink>
        </nav>
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/models" element={<ModelManagerPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
