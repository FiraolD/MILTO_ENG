import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeSlash, ShieldCheck, ArrowLeft } from "@phosphor-icons/react";
import { login } from "@/lib/api";
import { toast } from "sonner";

interface AdminAuthProps {
  onAuthenticated: (user: { id: string; email: string }) => void;
  onBack: () => void;
}

export default function AdminAuth({ onAuthenticated, onBack }: AdminAuthProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      if (data.user) {
        onAuthenticated({ id: data.user.id, email: data.user.email });
        toast.success("Welcome back, Admin!");
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-gray-600 hover:text-blue-900 transition-colors"
      >
        <ArrowLeft size={18} /> Back to Site
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-blue-100/60 p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-900 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={28} weight="fill" className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-blue-900">Admin Access</h1>
            <p className="text-sm text-gray-500 mt-1">
              Sign in to manage your site content
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                placeholder="admin@miltoengineering.com"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type={showPw ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-[38px] text-gray-400 hover:text-gray-600"
              >
                {showPw ? <EyeSlash size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-900 text-white font-semibold rounded-xl hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>

        </div>
      </motion.div>
    </div>
  );
}