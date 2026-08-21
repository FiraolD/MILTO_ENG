import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeSlash, ShieldCheck, ArrowLeft } from "@phosphor-icons/react";
import { login } from "@/lib/api";
import { toast } from "sonner";
export default function AdminAuth({ onAuthenticated, onBack }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await login(email, password);
            if (data.user) {
                onAuthenticated({ id: data.user.id, email: data.user.email });
                toast.success("Welcome back, Admin!");
            }
        }
        catch (err) {
            toast.error(err.message || "Authentication failed");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4", children: [_jsxs(motion.button, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, onClick: onBack, className: "absolute top-6 left-6 flex items-center gap-2 text-sm text-gray-600 hover:text-blue-900 transition-colors", children: [_jsx(ArrowLeft, { size: 18 }), " Back to Site"] }), _jsx(motion.div, { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: "easeOut" }, className: "w-full max-w-md", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-blue-100/60 p-8 sm:p-10", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "w-14 h-14 rounded-2xl bg-blue-900 flex items-center justify-center mx-auto mb-4", children: _jsx(ShieldCheck, { size: 28, weight: "fill", className: "text-white" }) }), _jsx("h1", { className: "text-2xl font-bold text-blue-900", children: "Admin Access" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Sign in to manage your site content" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email" }), _jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm", placeholder: "admin@miltoengineering.com" })] }), _jsxs("div", { className: "relative", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Password" }), _jsx("input", { type: showPw ? "text" : "password", required: true, value: password, onChange: (e) => setPassword(e.target.value), className: "w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm", placeholder: "Enter your password" }), _jsx("button", { type: "button", onClick: () => setShowPw(!showPw), className: "absolute right-4 top-[38px] text-gray-400 hover:text-gray-600", children: showPw ? _jsx(EyeSlash, { size: 20 }) : _jsx(Eye, { size: 20 }) })] }), _jsx(motion.button, { whileHover: { scale: 1.01 }, whileTap: { scale: 0.99 }, type: "submit", disabled: loading, className: "w-full py-3.5 bg-blue-900 text-white font-semibold rounded-xl hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-60 flex items-center justify-center gap-2", children: loading ? (_jsx("span", { className: "w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" })) : ("Sign In") })] })] }) })] }));
}
