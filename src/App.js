import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import { getToken, verifyToken, signOut } from "@/lib/api";
import Navbar from "./components/Navbar";
import PublicViews from "./components/PublicViews";
import Footer from "./components/Footer";
import NewsPage from "./components/NewsPage";
import NewsTicker from "./components/NewsTicker";
import AnnouncementPage from "./components/AnnouncementPage";
import AdminAuth from "./components/Admin/AdminAuth";
import AdminDashboard from "./components/Admin/AdminDashboard";
function App() {
    const [adminUser, setAdminUser] = useState(null);
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
        return (_jsxs("div", { className: "min-h-screen bg-white text-gray-900 antialiased", children: [adminUser ? (_jsx(AdminDashboard, { user: adminUser, onSignOut: async () => {
                        await signOut();
                        setAdminUser(null);
                        navigate("/admin");
                    } })) : (_jsx(AdminAuth, { onAuthenticated: (user) => setAdminUser(user), onBack: () => navigate("/") })), _jsx(Toaster, { position: "top-right", richColors: true, closeButton: true, toastOptions: { style: { fontFamily: "inherit" } } })] }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-white text-gray-900 antialiased", children: [location.pathname === "/" && _jsx(NewsTicker, {}), _jsx(Navbar, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "News", element: _jsx(NewsPage, {}) }), _jsx(Route, { path: "/vacancy", element: _jsx(AnnouncementPage, { type: "vacancy" }) }), _jsx(Route, { path: "/bid", element: _jsx(AnnouncementPage, { type: "bid" }) }), _jsx(Route, { path: "*", element: _jsx(PublicViews, {}) })] }), _jsx(Footer, {}), _jsx(Toaster, { position: "top-right", richColors: true, closeButton: true, toastOptions: {
                    style: { fontFamily: "inherit" },
                } })] }));
}
export default App;
