import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BookMarked, Search, Filter, Download, Bookmark, Video,
  FileText, Presentation, Sparkles, ExternalLink, ThumbsUp
} from 'lucide-react';
import { learnerService, KnowledgeItem } from '../../services/learnerService';

export default function Knowledge() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);

  const { data: resources = [], isLoading, refetch } = useQuery({
    queryKey: ['knowledgeResources'],
    queryFn: () => learnerService.getKnowledgeResources(),
  });

  const handleToggleBookmark = (id: string) => {
    learnerService.toggleBookmark(id);
    refetch();
  };

  const categories = ['All', 'Architecture Brief', 'Recorded Lecture', 'Research Paper', 'Study Guide', 'Presentation'];

  const filteredResources = resources.filter(res => {
    const matchCat = selectedCategory === 'All' || res.category === selectedCategory;
    const matchBookmark = !onlyBookmarked || res.isBookmarked;
    const matchSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        res.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        res.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchBookmark && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="page-header-banner p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-600 via-blue-700 to-indigo-700 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-2 text-white" style={{ color: '#ffffff' }}>
            <BookMarked className="w-3.5 h-3.5 text-white" />
            <span className="text-white" style={{ color: '#ffffff' }}>Digital Repository</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white" style={{ color: '#ffffff' }}>
            Knowledge Hub & Research Library
          </h1>
          <p className="text-xs sm:text-sm text-cyan-100 mt-1 max-w-xl" style={{ color: '#e0f2fe' }}>
            Access recorded masterclasses, enterprise architecture briefs, study guides, and peer-reviewed scientific papers.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOnlyBookmarked(!onlyBookmarked)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
              onlyBookmarked ? 'bg-amber-400 text-slate-900 shadow-md' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
            style={onlyBookmarked ? { color: '#0f172a' } : { color: '#ffffff' }}
          >
            <Bookmark className={`w-4 h-4 ${onlyBookmarked ? 'fill-slate-900 text-slate-900' : 'text-white'}`} />
            <span style={onlyBookmarked ? { color: '#0f172a' } : { color: '#ffffff' }}>{onlyBookmarked ? 'Showing Saved' : 'View Saved'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search resources, topics, or authors (e.g. Zero-Trust, Python, AI Ethics)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map(res => (
          <div
            key={res.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 hover:shadow-xl transition-all flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-lg text-xs font-black tracking-wide uppercase bg-blue-100 text-blue-800 border border-blue-200/90 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800/80">
                  {res.category}
                </span>
                <button
                  onClick={() => handleToggleBookmark(res.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title={res.isBookmarked ? 'Remove Bookmark' : 'Save Bookmark'}
                >
                  <Bookmark className={`w-4 h-4 ${res.isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                </button>
              </div>

              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2 mb-2">
                {res.title}
              </h3>
              <p className="text-[13px] font-medium text-slate-700 dark:text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                {res.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {res.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 px-2.5 py-0.5 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer details */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  <span className="text-slate-500 dark:text-slate-400 font-normal">By</span> {res.author}
                </span>
                <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                  {res.fileSize} · {res.readTime}
                </span>
              </div>

              <button
                onClick={() => alert(`Opening resource: "${res.title}" (${res.format})`)}
                className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-white" />
                <span className="text-white">Access Document ({res.format})</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
