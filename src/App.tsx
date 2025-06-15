import { ModelManagerPage } from "./pages/ModelManagerPage";
import { Chat } from "./pages/Chat";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { Blocks, Plus } from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./lib/db";

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`w-full p-2 flex items-center rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
        isActive ? "bg-gray-200 dark:bg-gray-700" : ""
      }`}
    >
      {children}
    </Link>
  );
}

function ChatList() {
  const chats = useLiveQuery(
    () => db.chats.orderBy("updatedAt").reverse().toArray(),
    []
  );
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const currentChatId = pathSegments[1] === "chat" ? pathSegments[2] : null;

  return (
    <div className="flex-1 overflow-y-auto -mr-4 pr-4">
      {chats?.map((chat) => (
        <Link
          to={`/chat/${chat.id}`}
          key={chat.id}
          className={`block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 truncate ${
            chat.id === currentChatId ? "bg-gray-200 dark:bg-gray-700" : ""
          }`}
        >
          {chat.title}
        </Link>
      ))}
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <nav className="w-64 border-r border-gray-200 dark:border-gray-800 p-2   flex flex-col">
          <div className="flex items-center justify-between mb-6 pl-2">
            <h1 className="text-xl font-bold">Aloha</h1>
            <Link
              to="/"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              title="New Chat"
            >
              <Plus />
            </Link>
          </div>
          <ChatList />
          <div className="mt-auto">
            <NavLink to="/models">
              <Blocks className="mr-2" /> Models
            </NavLink>
          </div>
        </nav>
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/chat/:id" element={<Chat />} />
            <Route path="/models" element={<ModelManagerPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
