import { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import { getToken, verifyToken, signOut } from "@/lib/api";
import Navbar from "./components/Navbar";
import PublicViews from "./components/PublicViews";
import Footer from "./components/Footer";
import NewsPage from "./components/NewsPage";
import AnnouncementPage from "./components/AnnouncementPage";
import AdminAuth from "./components/Admin/AdminAuth";
import AdminDashboard from "./components/Admin/AdminDashboard";

function App() {
  const [adminUser, setAdminUser] = useState<{ id: string; email: string } | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    const token = getToken();
    if (token) {
      verifyToken()
        .then(({ user }) => {
          setAdminUser({ id: user.id, email: user.email });
        })
        .catch(() => {
          // Token invalid – clear it silently
        });
    }
  }, []);

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-white text-gray-900 antialiased">
        {adminUser ? (
          <AdminDashboard
            user={adminUser}
            onSignOut={async () => {
              await signOut();
              setAdminUser(null);
              navigate("/admin");
            }}
          />
        ) : (
          <AdminAuth
            onAuthenticated={(user) => setAdminUser(user)}
            onBack={() => navigate("/")}
          />
        )}
        <Toaster position="top-right" richColors closeButton toastOptions={{ style: { fontFamily: "inherit" } }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased">
      <Navbar />
      <Routes>
        <Route path="/news" element={<NewsPage />} />
        <Route path="/vacancy" element={<AnnouncementPage type="vacancy" />} />
        <Route path="/bid" element={<AnnouncementPage type="bid" />} />
        <Route path="*" element={<PublicViews />} />
      </Routes>
      <Footer />
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: { fontFamily: "inherit" },
        }}
      />
    </div>
  );
}

export default App;