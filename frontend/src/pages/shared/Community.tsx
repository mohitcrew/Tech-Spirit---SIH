import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Users, MessageSquare, ThumbsUp, Send, Share2, PlusCircle,
  Sparkles, Tag, CheckCircle2, Bookmark
} from 'lucide-react';
import { learnerService } from '../../services/learnerService';
import { CommunityPost } from '../../data/capacityConnectData';

export default function Community() {
  const { data: posts = [], isLoading, refetch } = useQuery({
    queryKey: ['communityPosts'],
    queryFn: () => learnerService.getCommunityPosts(),
  });

  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTag, setNewPostTag] = useState('#DigitalSkills');
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    learnerService.saveCommunityPost({
      author: 'Priya Sharma',
      role: 'Digital Innovation Fellow',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      content: newPostContent.trim(),
      tags: [newPostTag, '#SkillSyncLearner'],
    });
    setNewPostContent('');
    refetch();
  };

  const handleLike = (postId: string) => {
    learnerService.likeCommunityPost(postId);
    refetch();
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text?.trim()) return;
    learnerService.addComment(postId, text.trim());
    setCommentInputs({ ...commentInputs, [postId]: '' });
    refetch();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Learner Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Community Discussions & Cohort Hub
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 mt-1 max-w-xl">
            Ask questions, collaborate on capstone assignments, and exchange technical insights with fellows and faculty.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center flex-shrink-0">
          <div className="text-[10px] uppercase font-bold text-indigo-200">Active Cohort Fellows</div>
          <div className="text-2xl font-black mt-0.5">1,420 Online</div>
        </div>
      </div>

      {/* Create Post Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <PlusCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Start a Discussion</span>
        </h2>

        <form onSubmit={handleCreatePost} className="space-y-3">
          <textarea
            rows={3}
            value={newPostContent}
            onChange={e => setNewPostContent(e.target.value)}
            placeholder="Share a learning breakthrough, ask for code/brief review, or discuss a curriculum topic..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold">Topic Tag:</span>
              <select
                value={newPostTag}
                onChange={e => setNewPostTag(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
              >
                <option value="#DigitalSkills">#DigitalSkills</option>
                <option value="#AIEducation">#AIEducation</option>
                <option value="#CloudArchitecture">#CloudArchitecture</option>
                <option value="#Leadership">#Leadership</option>
                <option value="#ZeroTrust">#ZeroTrust</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={!newPostContent.trim()}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
            >
              <span>Publish Post</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Discussions Feed */}
      <div className="space-y-4">
        {posts.map(post => (
          <div
            key={post.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            {/* Author info */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.avatar}
                  alt={post.author}
                  className="w-10 h-10 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {post.author}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {post.role} · {post.timeAgo}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {post.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {post.content}
            </p>

            {/* Actions row: Like & Comment count */}
            <div className="flex items-center gap-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-1.5 font-bold transition-colors ${
                  post.isLiked ? 'text-pink-600' : 'text-slate-500 hover:text-pink-600'
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${post.isLiked ? 'fill-pink-600' : ''}`} />
                <span>{post.likes} Helpful</span>
              </button>

              <div className="flex items-center gap-1.5 text-slate-500 font-bold">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{post.commentsCount} Comments</span>
              </div>
            </div>

            {/* Comments List */}
            {post.comments.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                {post.comments.map((c, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-900 dark:text-white">{c.author}</span>
                      <span className="text-[10px] text-slate-400">{c.time}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">{c.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment input */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Write a helpful response..."
                value={commentInputs[post.id] || ''}
                onChange={e => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleAddComment(post.id)}
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => handleAddComment(post.id)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-indigo-600 hover:text-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold text-xs transition-all"
              >
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
