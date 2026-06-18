import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ThumbsUp, ThumbsDown, X, Calendar, Eye } from "lucide-react";
import Loading from "@/components/common/Loading";
import PaginationComponent from "@/components/common/Pagination";
import { Link } from "react-router-dom";

interface RatingItem {
  rating_id: number;
  score: number;
  comment: string;
  created_at: string;
  rater_id: number;
  rater_username: string;
  rater_full_name: string;
  rater_avatar: string;
  rater_rating?: number;
  rater_rating_count?: number;
  total_count?: number;
}

interface RatingStats {
  rating_count: number;
  positive_rating_count: number;
}

export default function RatingHistoryPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [ratings, setRatings] = useState<RatingItem[]>([]);
  const [ratingStats, setRatingStats] = useState<RatingStats>({ rating_count: 0, positive_rating_count: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState<RatingItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const username = params.username_id?.trim().split("_")[0];
  const user_id = params.username_id?.trim().split("_")[1];

  useEffect(() => {
    if (!username || !user_id) {
      navigate("/");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/user/rate/count?user_id=${user_id}&username=${username}`, {
      credentials: "include",
    })
      .then(res => res.ok ? res.json() : Promise.reject("Failed to fetch stats"))
      .then(data => {
        setRatingStats(data.data || { rating_count: 0, positive_rating_count: 0 });
      })
      .catch(error => {
        console.error("Can't fetch rating stats:", error);
      });
  }, [username, user_id, navigate]);

  useEffect(() => {
    if (!username || !user_id) return;
    setIsLoading(true);

    fetch(`${import.meta.env.VITE_API_URL}/api/user/rate/history?user_id=${user_id}&username=${username}&page=${currentPage}&limit=${itemsPerPage}`, {
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch ratings");
        }
        return res.json();
      })
      .then(data => {
        setRatings(data.data || []);
        setTotalPages(Math.ceil((data.data[0]?.total_count || 0) / itemsPerPage));
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Can't connect to backend:", error);
        setIsLoading(false);
      });
  }, [username, user_id, currentPage, itemsPerPage]);

  const openModal = (rating: RatingItem) => {
    setSelectedRating(rating);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedRating(null), 300);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-heading font-extrabold text-foreground mb-2">
            Rating History
          </h1>
          <p className="text-muted-foreground">All ratings from other users</p>
        </div>

        {/* Stats Summary */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4">
              <div className="text-3xl font-bold text-accent">{ratingStats.rating_count}</div>
              <div className="text-muted-foreground text-sm">Total Ratings</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-emerald-500">
                {ratingStats.positive_rating_count}
              </div>
              <div className="text-muted-foreground text-sm">Positive</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-rose-500">
                {ratingStats.rating_count - ratingStats.positive_rating_count}
              </div>
              <div className="text-muted-foreground text-sm">Negative</div>
            </div>
          </div>
        </div>

        {/* Ratings List */}
        {ratings.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-lg border border-border p-12 text-center">
            <ThumbsUp className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No ratings yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {ratings.map((rating) => (
              <div
                key={rating.rating_id}
                className="bg-card rounded-2xl border border-border p-6 mb-10"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Rater Info */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Avatar */}
                    <Link to={`/profile/${rating.rater_username}_${rating.rater_id}`} className="w-14 h-14 bg-gradient-to-br from-accent to-muted rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                      {rating.rater_avatar ? (
                        <img
                          src={rating.rater_avatar}
                          alt="Rater Avatar"
                          className="w-14 h-14 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xl font-bold text-white">
                          {rating.rater_full_name?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-foreground text-lg">
                          {rating.rater_full_name}
                        </h3>
                        {rating.score === 1 ? (
                          <div className="flex items-center bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                            <ThumbsUp className="w-4 h-4 text-emerald-500 fill-current mr-1" />
                            <span className="text-emerald-500 text-xs font-semibold">Positive</span>
                          </div>
                        ) : (
                          <div className="flex items-center bg-rose-500/10 px-2 py-1 rounded-full border border-rose-500/20">
                            <ThumbsDown className="w-4 h-4 text-rose-500 fill-current mr-1" />
                            <span className="text-rose-500 text-xs font-semibold">Negative</span>
                          </div>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">@{rating.rater_username}</p>
                      
                      <p className="text-foreground line-clamp-2 mb-2">
                        {rating.comment}
                      </p>

                      {/* Date */}
                      <div className="flex items-center text-muted-foreground text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(rating.created_at)}
                      </div>
                    </div>
                  </div>

                  {/* Right: View Details Button */}
                  <button
                    onClick={() => openModal(rating)}
                    className="px-4 py-2 bg-accent hover:bg-accent/90 cursor-pointer transition-all duration-300 text-white rounded-lg font-medium shadow-md hover:shadow-lg flex items-center gap-2 flex-shrink-0"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">View Details</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <PaginationComponent
          currentPage={currentPage}
          numberOfPages={totalPages}
          controlPage={handlePageChange}
        />

        {/* Modal */}
        {isModalOpen && selectedRating && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <div
              className="bg-card border border-border rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="border-b border-border px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Rating Details</h2>
                <button
                  onClick={closeModal}
                  className="p-1.5 hover:bg-muted/50 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                {/* Rater Information */}
                <Link to={`/profile/${selectedRating.rater_username}_${selectedRating.rater_id}`} className="flex items-center gap-3 pb-4 border-b border-border">
                  <div className="w-14 h-14 bg-gradient-to-br from-accent to-muted rounded-full flex items-center justify-center shadow-sm">
                    {selectedRating.rater_avatar ? (
                      <img
                        src={selectedRating.rater_avatar}
                        alt="Rater Avatar"
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-bold text-white">
                        {selectedRating.rater_full_name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {selectedRating.rater_full_name}
                    </h4>
                    <p className="text-sm text-muted-foreground">@{selectedRating.rater_username}</p>
                  </div>
                </Link>

                {/* Rating Type */}
                <div className="flex justify-center py-2">
                  {selectedRating.score === 1 ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                      <ThumbsUp className="w-5 h-5 text-emerald-500 fill-current" />
                      <span className="font-medium text-emerald-500">Positive Rating</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                      <ThumbsDown className="w-5 h-5 text-rose-500 fill-current" />
                      <span className="font-medium text-rose-500">Negative Rating</span>
                    </div>
                  )}
                </div>

                {/* Comment */}
                <div>
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                    "{selectedRating.comment}"
                  </p>
                </div>

                {/* Date */}
                <div className="pt-3 border-t border-border">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    {formatDate(selectedRating.created_at)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}