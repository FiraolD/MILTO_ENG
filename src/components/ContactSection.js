import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Envelope, PaperPlaneRight, SpinnerGap } from "@phosphor-icons/react";
import { toast } from "sonner";
import { api } from "../lib/api";
export function ContactSection() {
    const [form, setForm] = useState({ name: "", email: "", phone: "", organization: "", subject: "", message: "" });
    const [submitted, setSubmitted] = useState(false);
    const [sending, setSending] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            await api.post("/inquiries", {
                name: form.name,
                email: form.email,
                phone: form.phone || "",
                organization: form.organization || "",
                subject: form.subject,
                message: form.message,
            });
            setSubmitted(true);
            toast.success("Message sent successfully! We'll get back to you within 24 hours.");
            setTimeout(() => {
                setSubmitted(false);
                setForm({ name: "", email: "", phone: "", organization: "", subject: "", message: "" });
            }, 5000);
        }
        catch (err) {
            toast.error(err.message || "Failed to send message. Please try again.");
        }
        finally {
            setSending(false);
        }
    };
    return (_jsx("section", { id: "contact", className: "py-20 lg:py-28 bg-white", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16", children: [_jsxs(motion.div, { initial: { opacity: 0, x: -30 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true, margin: "-100px" }, transition: { duration: 0.6 }, children: [_jsx("span", { className: "inline-block text-xs font-semibold uppercase tracking-widest text-blue-600 mb-4", children: "Get in Touch" }), _jsx("h2", { className: "text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-950 leading-tight mb-6", children: "Let's Discuss Your Project" }), _jsx("p", { className: "text-base sm:text-lg text-gray-600 leading-relaxed mb-10", children: "Whether you need water resources assessment, geotechnical investigation, or environmental consulting, our team is ready to help." }), _jsx("div", { className: "space-y-5", children: [
                                    { icon: MapPin, label: "Head Office", value: "Addis Ababa, Bole Subcity, Werda 03, Abate Building, Office Number 208", href: 'https://maps.app.goo.gl/qxMLqHUzF6rHnBAQ8' },
                                    { icon: Phone, label: "Phone", value: +251901000960, href: `tel:${"+251901000960"}` },
                                    { icon: Envelope, label: "Email", value: "miltoengineeringplc@gmail.com", href: `mailto:${"miltoengineeringplc@gmail.com"}` },
                                ].map((item) => (_jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0", children: _jsx(item.icon, { size: 20 }) }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-blue-950 text-sm", children: item.label }), item.href ? (_jsx("a", { href: item.href, className: "text-sm text-blue-600 hover:text-blue-700 mt-0.5 block transition-colors", children: item.value })) : (_jsx("p", { className: "text-sm text-gray-600 mt-0.5", children: item.value }))] })] }, item.label))) })] }), _jsx(motion.div, { initial: { opacity: 0, x: 30 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true, margin: "-100px" }, transition: { duration: 0.6 }, className: "bg-gray-50 rounded-2xl border border-gray-200 p-6 sm:p-8", children: submitted ? (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, className: "h-full flex flex-col items-center justify-center text-center py-12", children: [_jsx("div", { className: "w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4", children: _jsx(PaperPlaneRight, { size: 28, weight: "fill" }) }), _jsx("h3", { className: "text-xl font-bold text-blue-950 mb-2", children: "Message Sent!" }), _jsx("p", { className: "text-sm text-gray-600", children: "Thank you for reaching out. We'll get back to you within 24 hours." })] })) : (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1.5", children: ["Full Name ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", required: true, value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }), className: "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all", placeholder: "Your name" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1.5", children: ["Email ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "email", required: true, value: form.email, onChange: (e) => setForm({ ...form, email: e.target.value }), className: "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all", placeholder: "your@email.com" })] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1.5", children: "Phone" }), _jsx("input", { type: "tel", value: form.phone, onChange: (e) => setForm({ ...form, phone: e.target.value }), className: "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all", placeholder: "your phone number" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1.5", children: "Organization" }), _jsx("input", { type: "text", value: form.organization, onChange: (e) => setForm({ ...form, organization: e.target.value }), className: "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all", placeholder: "Company or institution" })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1.5", children: ["Subject ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", required: true, value: form.subject, onChange: (e) => setForm({ ...form, subject: e.target.value }), className: "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all", placeholder: "Project inquiry" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1.5", children: ["Message ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("textarea", { required: true, rows: 4, value: form.message, onChange: (e) => setForm({ ...form, message: e.target.value }), className: "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none", placeholder: "Tell us about your project" })] }), _jsxs("button", { type: "submit", disabled: sending, className: "w-full flex items-center justify-center gap-2 px-8 py-3 bg-blue-900 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-all shadow-sm", children: [sending ? (_jsx(SpinnerGap, { size: 18, className: "animate-spin" })) : (_jsx(PaperPlaneRight, { size: 18 })), sending ? "Sending..." : "Send Message"] })] })) })] }) }) }));
}
