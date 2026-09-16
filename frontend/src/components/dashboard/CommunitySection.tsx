import React, { useState } from 'react';
import { Heart, MessageSquare, Share2, Sparkles, Send } from 'lucide-react';
import { communityDiscussions, CommunityPost } from '../../data/capacityConnectData';
import { useAuth } from '../../context/AuthContext';

export const CommunitySection: React.FC = () => {
  const { user } = useAuth();
  const authorName = user?.name || 'SkillSync Learner';
  const authorAvatar = user?.profile?.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(authorName)}&backgroundColor=0284c7,2563eb,7c3aed&textColor=ffffff`;

  const [posts, setPosts] = useState<CommunityPost[]>(communityDiscussions);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [newPostText, setNewPostText] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handleLike = (id: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likes: isLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  const handleAddReply = (postId: string) => {
    if (!replyText.trim()) return;
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [
              ...p.comments,
              { author: `${authorName} (You)`, text: replyText.trim(), time: 'Just now' },
            ],
          };
        }
        return p;
      })
    );
    setReplyText('');
    setActiveReplyId(null);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    const newP: CommunityPost = {
      id: `p-${Date.now()}`,
      author: `${authorName} (You)`,
      role: user?.role === 'TRAINER' ? 'Course Educator' : 'Digital Innovation Fellow',
      avatar: authorAvatar,
      timeAgo: 'Just now',
      content: newPostText.trim(),
      tags: ['#Discussion', '#CapacityConnect'],
      likes: 1,
      isLiked: true,
      commentsCount: 0,
      comments: [],
    };
    setPosts([newP, ...posts]);
    setNewPostText('');
    setIsPosting(false);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Learning Community
          </h2>
          <p className="text-xs text-slate-500">
            Share takeaways, ask questions, and collaborate with fellow learners & mentors
          </p>
        </div>
        <button
          onClick={() => setIsPosting(!isPosting)}
          className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isPosting ? 'Cancel Post' : 'Share a Reflection'}</span>
        </button>
      </div>

      {/* New Post Creator Box */}
      {isPosting && (
        <form onSubmit={handleCreatePost} className="cc-card p-4 mb-4 border-blue-200 bg-blue-50/20 animate-fadeIn">
          <textarea
            value={newPostText}
            onChange={e => setNewPostText(e.target.value)}
            placeholder="What learning insights or questions would you like to share with the cohort today?"
            className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 min-h-[75px]"
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="cc-btn-primary text-xs py-2 px-4"
            >
              Post to Community
            </button>
          </div>
        </form>
      )}

      {/* Discussion Posts Feed */}
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="cc-card p-5">
            {/* Author Bar */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <img
                  src={post.avatar}
                  alt={post.author}
                  className="w-10 h-10 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                    {post.author}
                  </h4>
                  <p className="text-[11px] text-slate-400">{post.role} · {post.timeAgo}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="hidden sm:flex items-center gap-1">
                {post.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md font-semibold">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Post Content */}
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
              {post.content}
            </p>

            {/* Interaction Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 font-bold transition-all ${
                    post.isLiked ? 'text-rose-500' : 'text-slate-500 hover:text-rose-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 transition-transform active:scale-125 ${post.isLiked ? 'fill-rose-500' : ''}`} />
                  <span>{post.likes} Likes</span>
                </button>

                <button
                  onClick={() => setActiveReplyId(activeReplyId === post.id ? null : post.id)}
                  className="flex items-center gap-1.5 font-bold text-slate-500 hover:text-blue-600 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.commentsCount} Comments</span>
                </button>
              </div>

              <button
                onClick={() => setActiveReplyId(activeReplyId === post.id ? null : post.id)}
                className="text-blue-600 hover:text-blue-700 font-bold"
              >
                Reply
              </button>
            </div>

            {/* Comments Thread & Reply Box */}
            {activeReplyId === post.id && (
              <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50/70 -mx-5 -mb-5 p-4 rounded-b-2xl animate-fadeIn space-y-3">
                {post.comments.map((cmt, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200/60 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                      <span>{cmt.author}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{cmt.time}</span>
                    </div>
                    <p className="text-slate-600">{cmt.text}</p>
                  </div>
                ))}

                {/* Reply Form */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Write a helpful response..."
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => handleAddReply(post.id)}
                    className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 flex-shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
