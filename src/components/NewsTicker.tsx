import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Newspaper, ArrowRight } from "@phosphor-icons/react";
import { articlesApi } from "@/lib/api";

interface TickerArticle {
  id: string;
  title: string;
  category: string;
}

/**
 * Continuously sliding news ticker shown between the navbar and the hero.
 * Clicking any headline routes to the standalone /news page.
 */
export default function NewsTicker() {
  const [headlines, setHeadlines] = useState<TickerArticle[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    articlesApi
      .list()
      .then((data) => {
        setHeadlines(
          (data ?? []).slice(0, 6).map((a) => ({
            id: a.id,
            title: a.title,
            category: a.category,
          }))
        );
      })
      .catch(() => {
        // ticker is non-critical – hide silently
      });
  }, []);

  if (headlines.length === 0) return null;

  // Duplicate the list so the -50% translate creates a seamless loop
  const track = [...headlines, ...headlines];

  return (
    <div className="mt-16 lg:mt-20 bg-blue-950 border-b border-blue-900/50">
      <div className="flex items-stretch overflow-hidden">
        {/* Label */}
        <button
          onClick={() => navigate("/news")}
          className="flex items-center gap-2 shrink-0 px-4 py-2.5 bg-blue-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-800 transition-colors"
        >
          <Newspaper size={15} weight="fill" />
          <span className="hidden sm:inline">Latest News</span>
        </button>

        {/* Sliding track */}
        <div className="relative flex-1 overflow-hidden">
          <div className="ticker-track flex items-center w-max">
            {track.map((item, i) => (
              <button
                key={`${item.id}-${i}`}
                onClick={() => navigate("/news")}
                className="group flex items-center gap-2 px-6 py-2.5 text-sm text-blue-100 hover:text-white whitespace-nowrap transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                {item.category && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-300 bg-blue-900/60 px-1.5 py-0.5 rounded">
                    {item.category}
                  </span>
                )}
                <span className="group-hover:underline underline-offset-2">{item.title}</span>
                <ArrowRight
                  size={13}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-300"
                />
              </button>
            ))}
          </div>
          {/* Edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-blue-950 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-blue-950 to-transparent" />
        </div>
      </div>
    </div>
  );
}
