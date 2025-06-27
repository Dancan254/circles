import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/app/Navbar";
import Circle from "./pages/Circle";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-background text-foreground h-screen w-screen">
        <BrowserRouter>
          <div className="my-0 max-w-screen-2xl mx-auto">
            <Navbar />
          </div>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/circle/:address" element={<Circle />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
