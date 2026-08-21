import { BrowserRouter, Route, Routes } from "react-router";

import Login from "@/pages/Login";
import Test from "@/pages/Test";
import RoomChat from "@/pages/RoomChat";

import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicRoute from "@/routes/PublicRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes accessibles uniquement sans session */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Routes accessibles uniquement avec une session */}
        <Route element={<ProtectedRoute />}>
          <Route path="/test" element={<Test />} />
          <Route path="/rooms/:roomId" element={<RoomChat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}