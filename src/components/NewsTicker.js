import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Newspaper, ArrowRight } from "@phosphor-icons/react";
import { articlesApi } from "@/lib/api";
/**
 * Continuously sliding news ticker shown at the very top of the page,
 * above the navbar. Clicking any headline routes to the standalone /news page.
 */
export default function NewsTicker() {
    const [headlines, setHeadlines] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        articlesApi
            .list()
            .then((data) => {
            setHeadlines((data ?? []).slice(0, 6).map((a) => ({
                id: a.id,
                title: a.title,
                category: a.category,
            })));
        })
            .catch(() => {
            // ticker is non-critical – hide silently
        });
    }, []);
    if (headlines.length === 0)
        return null;
    // Duplicate the list so the -50% translate creates a seamless loop
    const track = [...headlines, ...headlines];
    return (_jsx("div", { className: "bg-blue-950 border-b border-blue-900/50", children: _jsxs("div", { className: "flex items-stretch overflow-hidden", children: [_jsxs("button", { onClick: () => navigate("/news"), className: "flex items-center gap-2 shrink-0 px-4 py-2.5 bg-blue-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-800 transition-colors", children: [_jsx(Newspaper, { size: 30, weight: "fill" }), _jsx("span", { className: "hidden sm:inline", children: "Latest News" })] }), _jsxs("div", { className: "relative flex-1 overflow-hidden", children: [_jsx("div", { className: "ticker-track flex items-center w-max", children: track.map((item, i) => (_jsxs("button", { onClick: () => navigate("/news"), className: "group flex items-center gap-2 px-8 py-2.5 text-sm text-blue-100 hover:text-white whitespace-nowrap transition-colors", children: [_jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" }), item.category && (_jsx("span", { className: "text-[10px] font-semibold uppercase tracking-wider text-blue-300 bg-blue-900/60 px-1.5 py-0.5 rounded", children: item.category })), _jsx("span", { className: "group-hover:underline underline-offset-2", children: item.title }), _jsx(ArrowRight, { size: 13, className: "opacity-0 group-hover:opacity-100 transition-opacity text-blue-300" })] }, `${item.id}-${i}`))) }), _jsx("div", { className: "pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-blue-950 to-transparent" }), _jsx("div", { className: "pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-blue-950 to-transparent" })] })] }) }));
}
