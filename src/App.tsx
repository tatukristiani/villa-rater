import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useStore } from "./store/store";
import Navbar from "./components/Navbar";
import Login from "./routes/Login";
import Home from "./routes/Home";
import CreateGroup from "./routes/CreateGroup";
import JoinGroup from "./routes/JoinGroup";
import GroupLobby from "./routes/GroupLobby";
import GroupRate from "./routes/GroupRate";
import GroupResults from "./routes/GroupResults";

export default function App() {
  const { user, initAuth } = useStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  if (!user) {
    return (
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-group" element={<CreateGroup />} />
            <Route path="/join" element={<JoinGroup />} />
            <Route path="/group/:id/lobby" element={<GroupLobby />} />
            <Route path="/group/:id/rate" element={<GroupRate />} />
            <Route path="/group/:id/results" element={<GroupResults />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
