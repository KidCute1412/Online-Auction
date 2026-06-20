import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/routes/ProtectedRouter";
import { useParams } from "react-router-dom";
import Loading from "@/components/common/Loading";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Star,
  Award,
  Edit,
} from "lucide-react";
import { profileService } from "@/services/profile.service.ts";

export type UserProfile = {
  id: number;
  username: string;
  email: string;
  full_name: string;
  avatar_url: string;
  role: "bidder" | "seller" | "admin";
  rating: number;
  rating_count: number;
  address: string;
  date_of_birth: string;
  avatar?: string;
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const params = useParams();
  const [isOwner, setIsOwner] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const location = useLocation();

  useEffect(() => {
    const username = params.username_id?.trim().split("_")[0];
    const user_id = params.username_id?.trim().split("_")[1];
    if (!username || !user_id) {
      navigate("/");
      return;
    }
    profileService.getProfileDetail({ username, user_id })
      .then((data) => {
        setUserProfile(data.data);
        setIsOwner(data.is_owner);
      })
      .catch((error) => {
        console.error("Can't connect to backend:", error);
        navigate("/");
      });
  }, [params, navigate]);

  const getRoleLabel = (role: string) => {
    if (!isOwner && role === "admin") {
      return "Seller";
    }
    
    switch (role) {
      case "admin": return "Administrator";
      case "seller": return "Seller";
      case "user": return "User";
      default: return "User";
    }
  };

  const getRoleBadgeColor = (role: string) => {
    if (!isOwner && role === "admin") {
      return "bg-gradient-to-r from-yellow-500 to-amber-500 text-black";
    }
    
    switch (role) {
      case "admin": return "bg-gradient-to-r from-rose-500 to-red-500 text-white";
      case "seller": return "bg-gradient-to-r from-yellow-500 to-amber-500 text-black";
      case "user": return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white";
      default: return "bg-gradient-to-r from-gray-500 to-slate-500 text-white";
    }
  };

  if (!userProfile) return <Loading />;

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-heading font-extrabold text-foreground mb-2">
            User Profile
          </h1>
          <p className="text-muted-foreground">Detailed information about the user account</p>
        </div>

        {/* Profile Header Card */}
        <div className="bg-card rounded-3xl shadow-xl border border-border p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              {userProfile.avatar ? (
                <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg border border-border">
                  <img
                    src={userProfile.avatar}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 bg-gradient-to-br from-accent to-muted rounded-full flex items-center justify-center shadow-lg border border-border">
                  <span className="text-4xl font-bold text-white">
                    {userProfile.full_name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-card shadow-md"></div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-foreground mb-2">{userProfile.full_name}</h2>
              <p className="text-muted-foreground mb-4">@{userProfile.username}</p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md ${getRoleBadgeColor(userProfile.role)}`}>
                  {getRoleLabel(userProfile.role)}
                </span>

                <Link to={`${location.pathname}/rate`} className="flex items-center bg-yellow-500/10 px-4 py-2 rounded-full border border-yellow-500/20">
                  <Star className="w-5 h-5 text-yellow-500 fill-current mr-2" />
                  <span className="font-bold text-yellow-500 mr-1">{userProfile.rating.toFixed(1)}</span>
                  <span className="text-yellow-600 text-sm">({userProfile.rating_count} ratings)</span>
                </Link>
              </div>

              {/* Rating Stars */}
              <div className="flex items-center justify-center md:justify-start">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${star <= Math.floor(userProfile.rating) ? "text-yellow-500 fill-current" : "text-muted-foreground/30"}`}
                  />
                ))}
                <span className="ml-3 text-muted-foreground font-medium">
                  {userProfile.rating.toFixed(1)} / 5.0
                </span>
              </div>

              {/* Edit Profile Button */}
              {isOwner && (
                <div className="mt-6 flex justify-center md:justify-start">
                  <button
                    onClick={() => navigate("/profile/edit")}
                    className="inline-flex items-center px-4 py-2 cursor-pointer bg-accent hover:bg-accent/90 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-colors duration-200"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Personal Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mr-3">
                <User className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Contact Information</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center p-3 bg-muted/30 rounded-lg border border-border">
                <Mail className="w-5 h-5 text-accent mr-3 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-semibold text-foreground text-sm">{userProfile.email}</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-muted/30 rounded-lg border border-border">
                <MapPin className="w-5 h-5 text-muted-foreground mr-3 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="font-semibold text-foreground text-sm">{userProfile.address || "Not updated"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center mr-3">
                <Award className="w-5 h-5 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Account Details</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center p-3 bg-muted/30 rounded-lg border border-border">
                <User className="w-5 h-5 text-accent mr-3 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Username</p>
                  <p className="font-semibold text-foreground text-sm">{userProfile.username}</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-muted/30 rounded-lg border border-border">
                <Calendar className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Date of Birth</p>
                  <p className="font-semibold text-foreground text-sm">
                    {userProfile.date_of_birth ? new Date(userProfile.date_of_birth).toLocaleDateString("en-US") : "Not updated"}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-muted/30 rounded-lg border border-border">
                <Award className="w-5 h-5 text-muted-foreground mr-3 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Role</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(userProfile.role)}`}>
                    {getRoleLabel(userProfile.role)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}