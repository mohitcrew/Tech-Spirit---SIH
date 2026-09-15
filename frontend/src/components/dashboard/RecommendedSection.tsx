import React, { useState } from 'react';
import { Bookmark, Star, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { recommendations, Recommendation } from '../../data/capacityConnectData';

export const RecommendedSection: React.FC = () => {
  const [items, setItems] = useState<Recommendation[]>(recommendations);

  const toggleBookmark = (id: string) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item))
    );
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Recommended For You
          </h2>
          <p className="text-xs text-slate-500">
            Tailored specifically to your completed milestones & active competency goals
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {items.map(rec => (
          <div
            key={rec.id}
            className="cc-card p-5 flex flex-col justify-between group"
          >
            <div>
              {/* Header: Reason pill & Bookmark */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-[10px] font-bold text-blue-700">
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  <span className="truncate max-w-[200px]">{rec.reason}</span>
                </span>
                <button
                  onClick={() => toggleBookmark(rec.id)}
                  className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                    rec.isBookmarked
                      ? 'bg-amber-50 text-amber-500'
                      : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                  }`}
                  title={rec.isBookmarked ? 'Remove bookmark' : 'Bookmark course'}
                >
                  <Bookmark className={`w-4 h-4 ${rec.isBookmarked ? 'fill-amber-500' : ''}`} />
                </button>
              </div>

              {/* Title & Instructor */}
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1.5">
                {rec.title}
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Instructor: <span className="font-medium text-slate-700">{rec.instructor}</span>
              </p>
            </div>

            {/* Meta tags & Action */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                <span className="flex items-center gap-1 font-semibold text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{rec.rating}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{rec.duration}</span>
                </span>
                <span className="bg-slate-100 px-2 py-0.5 rounded-md text-[11px] font-medium text-slate-600">
                  {rec.difficulty}
                </span>
              </div>

              <button className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-blue-600 hover:text-white text-blue-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 group-hover:shadow-xs">
                <span>View Syllabus</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
