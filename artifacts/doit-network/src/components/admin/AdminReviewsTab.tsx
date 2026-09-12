import React, { useState } from 'react';
import { 
  Star, 
  Search, 
  Filter, 
  EyeOff, 
  Eye, 
  Flag, 
  CheckCircle2, 
  AlertTriangle,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';

interface ReviewItem {
  id: string;
  customerName: string;
  providerName: string;
  serviceName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'PUBLISHED' | 'FLAGGED' | 'HIDDEN';
}

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'REV-01',
    customerName: 'Pooja Verma',
    providerName: 'Anita Devi',
    serviceName: 'Maid (Kitchen Scrubbing)',
    rating: 5,
    comment: 'Anita ji was very thorough and polite. She reached our Sector 2 quarter exactly on time and cleaned all oily stains behind the stove.',
    date: '2026-09-07',
    status: 'PUBLISHED'
  },
  {
    id: 'REV-02',
    customerName: 'Suresh Chandra BHEL',
    providerName: 'Rahul Sharma',
    serviceName: 'Gardener (Township Lawn)',
    rating: 5,
    comment: 'Excellent hedge trimming and lawn mowing. Highly recommended for all retired BHEL personnel in Sector 1.',
    date: '2026-09-06',
    status: 'PUBLISHED'
  },
  {
    id: 'REV-03',
    customerName: 'Amit Saxena',
    providerName: 'Vikram Singh Rajput',
    serviceName: 'Caretaker (Vacant Quarter)',
    rating: 4,
    comment: 'Very reliable check on my locked house while I was in Delhi. Sent photos on WhatsApp as requested.',
    date: '2026-09-05',
    status: 'PUBLISHED'
  },
  {
    id: 'REV-04',
    customerName: 'Rohit K.',
    providerName: 'Manoj Kumar',
    serviceName: 'Electrician & Repairs',
    rating: 2,
    comment: 'Arrived 45 minutes late due to rain near Piplani. Work was okay but timing could be improved.',
    date: '2026-09-04',
    status: 'FLAGGED'
  },
  {
    id: 'REV-05',
    customerName: 'Anonymous Resident',
    providerName: 'Sunil Sen',
    serviceName: 'Sanitation & Disinfection',
    rating: 1,
    comment: 'Spam review containing unrelated advertising for local coaching center.',
    date: '2026-09-02',
    status: 'HIDDEN'
  }
];

interface AdminReviewsTabProps {
  theme: 'light' | 'dark';
}

export const AdminReviewsTab: React.FC<AdminReviewsTabProps> = ({ theme }) => {
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [ratingFilter, setRatingFilter] = useState('ALL');

  const isDark = theme === 'dark';

  const handleToggleStatus = (id: string, newStatus: 'PUBLISHED' | 'FLAGGED' | 'HIDDEN') => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const filteredReviews = reviews.filter(r => {
    const matchSearch = !searchTerm ||
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchSearch) return false;
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (ratingFilter !== 'ALL' && r.rating !== Number(ratingFilter)) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
            Reviews & Feedback Moderation
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Audit customer ratings, investigate negative feedback, and moderate public comments.
          </p>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center gap-3 ${
        isDark ? 'bg-zinc-900/70 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-2xs'
      }`}>
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-400" />
          <input
            type="text"
            placeholder="Search reviews, customers, partners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border ${
              isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
            }`}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`px-3 py-2 rounded-xl text-xs border cursor-pointer ${
            isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
          }`}
        >
          <option value="ALL">All Statuses</option>
          <option value="PUBLISHED">Published</option>
          <option value="FLAGGED">Flagged</option>
          <option value="HIDDEN">Hidden</option>
        </select>

        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className={`px-3 py-2 rounded-xl text-xs border cursor-pointer ${
            isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
          }`}
        >
          <option value="ALL">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {filteredReviews.length === 0 ? (
          <div className={`p-12 text-center rounded-2xl border text-zinc-400 ${
            isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200'
          }`}>
            No reviews match the current filters.
          </div>
        ) : (
          filteredReviews.map((r) => (
            <div
              key={r.id}
              className={`p-4 rounded-2xl border transition-all ${
                isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-2xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                    {r.customerName}
                  </span>
                  <span className="text-zinc-400 text-xs">reviewed</span>
                  <span className="font-bold text-xs text-[#00876e] dark:text-[#00c29e]">
                    {r.providerName}
                  </span>
                  <span className="text-zinc-400 text-xs">for {r.serviceName}</span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${s <= r.rating ? 'fill-amber-400' : 'text-zinc-300 dark:text-zinc-700'}`}
                      />
                    ))}
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 ml-1">
                      {r.rating}.0
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    r.status === 'PUBLISHED'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                      : r.status === 'FLAGGED'
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                  }`}>
                    {r.status}
                  </span>
                </div>
              </div>

              <div className="pt-3 text-xs text-zinc-600 dark:text-zinc-300">
                "{r.comment}"
              </div>

              <div className="pt-3 mt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                <span>Submitted on {r.date}</span>
                <div className="flex items-center gap-2">
                  {r.status !== 'PUBLISHED' && (
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(r.id, 'PUBLISHED')}
                      className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold cursor-pointer"
                    >
                      Publish Review
                    </button>
                  )}
                  {r.status !== 'FLAGGED' && (
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(r.id, 'FLAGGED')}
                      className="text-amber-600 dark:text-amber-400 hover:underline font-bold cursor-pointer"
                    >
                      Flag for Follow-up
                    </button>
                  )}
                  {r.status !== 'HIDDEN' && (
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(r.id, 'HIDDEN')}
                      className="text-rose-600 dark:text-rose-400 hover:underline font-bold cursor-pointer"
                    >
                      Hide from Public
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
