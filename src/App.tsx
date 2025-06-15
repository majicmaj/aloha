import { ModelManagerPage } from "./pages/ModelManagerPage";
import { SettingsPage } from "./pages/SettingsPage";
import { Chat } from "./pages/Chat";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Blocks, Plus, Trash2, Edit, Search, Settings } from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./lib/db";
import { Chat as ChatType } from "./lib/db";
import { useState, useMemo } from "react";
import { Logo } from "./assets/Logo";
import { cn } from "./utils/cn";

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

function ChatListItem({ chat }: { chat: ChatType }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(chat.title);
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === `/chat/${chat.id}`;

  const handleSave = async () => {
    if (title.trim() === "") {
      setTitle(chat.title);
    } else {
      await db.chats.update(chat.id, { title });
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this chat?")) {
      await db.chats.delete(chat.id);
      if (isActive) {
        navigate("/");
      }
    }
  };

  return (
    <Link
      to={`/chat/${chat.id}`}
      className={`group block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 truncate ${
        isActive ? "bg-gray-200 dark:bg-gray-700" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            className="bg-transparent w-full focus:outline-none"
            autoFocus
            onClick={(e) => e.preventDefault()}
          />
        ) : (
          <span className="truncate">{chat.title}</span>
        )}
        <div className="hidden group-hover:flex items-center">
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsEditing(true);
            }}
            className="p-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className="p-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}

function ChatList() {
  const [searchTerm, setSearchTerm] = useState("");
  const chats = useLiveQuery(
    () => db.chats.orderBy("updatedAt").reverse().toArray(),
    []
  );

  const filteredChats = useMemo(() => {
    if (!chats) return [];
    return chats.filter(
      (chat) =>
        chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.messages.some((msg) =>
          msg.content.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [chats, searchTerm]);

  return (
    <>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search chats..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 p-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex-1 overflow-y-auto -mr-4 pr-4">
        {filteredChats?.map((chat) => (
          <ChatListItem key={chat.id} chat={chat} />
        ))}
      </div>
    </>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <Router>
      <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        {sidebarOpen && (
          <div
            className="fixed border inset-0 bg-black/50 z-30 lg:hidden"
            onClick={toggleSidebar}
          ></div>
        )}
        <nav
          className={cn(
            "w-64 border-r bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-800 p-2 flex flex-col fixed inset-y-0 left-0 z-40 lg:static lg:translate-x-0 transform transition-transform",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between mb-3 pl-2">
            <Logo />
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
          <div className="mt-auto flex flex-col gap-2 border-t pt-1 border-gray-200 dark:border-slate-700">
            <NavLink to="/models">
              <Blocks className="mr-2" /> Models
            </NavLink>
            <NavLink to="/settings">
              <Settings className="mr-2" /> Settings
            </NavLink>
          </div>
        </nav>
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Chat toggleSidebar={toggleSidebar} />} />
            <Route
              path="/chat/:id"
              element={<Chat toggleSidebar={toggleSidebar} />}
            />
            <Route
              path="/models"
              element={<ModelManagerPage toggleSidebar={toggleSidebar} />}
            />
            <Route
              path="/settings"
              element={<SettingsPage toggleSidebar={toggleSidebar} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
