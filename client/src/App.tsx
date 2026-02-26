import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import AnnouncementEditPage from "./pages/AnnouncementEditPage";
import type {ReactNode} from "react";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* redirect root */}
        <Route path="/" element={<Navigate to="/announcements" replace /> as ReactNode} />

        {/* list */}
        <Route path="/announcements" element={<AnnouncementsPage /> as ReactNode} />

        {/* create */}
        <Route
          path="/announcements/new"
          element={<AnnouncementEditPage mode="create" /> as ReactNode}
        />

        {/* edit */}
        <Route
          path="/announcements/:id"
          element={<AnnouncementEditPage mode="edit" /> as ReactNode}
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/announcements" replace /> as ReactNode} />
      </Routes>
    </BrowserRouter>
  );
}