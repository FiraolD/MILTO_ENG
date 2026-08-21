import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
export function Teleprompter({ messages, speed = 2000, className, }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(false);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % messages.length);
                setIsVisible(true);
            }, 300);
        }, speed);
        return () => clearInterval(interval);
    }, [messages.length, speed]);
    return (_jsx("div", { className: cn("relative h-8 overflow-hidden", className), children: _jsx("div", { className: cn("absolute inset-0 flex items-center transition-all duration-300 ease-in-out", isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-full"), children: _jsx("div", { className: "whitespace-nowrap text-lg font-mono text-muted-foreground", children: messages[currentIndex] }) }) }));
}
export function ScrollingText({ text, speed = 50, className, }) {
    return (_jsx("div", { className: cn("relative overflow-hidden", className), children: _jsx("div", { className: "whitespace-nowrap", style: {
                animation: `scroll-left ${(text.length / speed) * 2}s linear infinite`,
            }, children: text }) }));
}
