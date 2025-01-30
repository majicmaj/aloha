import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Chat } from "./pages/Chat";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Chat />
      </div>
    </QueryClientProvider>
  );
}

export default App;
