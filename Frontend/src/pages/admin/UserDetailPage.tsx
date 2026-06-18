import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { UserItem } from "@/interface/user.interface";
import { formatDateOfBirth } from "@/utils/format_time";
import { toast } from "sonner";
import Swal from "sweetalert2";

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userDetail, setUserDetail] = useState<UserItem | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  useEffect(() => {
    // Fetch detailed user profile by user ID
    fetch(
      `${import.meta.env.VITE_API_URL}/${
        import.meta.env.VITE_PATH_ADMIN
      }/api/user/detail/${id}`,
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then((data) => {
        setUserDetail(data.user);
        setSelectedRole(data.user.role);
        setSelectedStatus(data.user.status);
      })
      .catch(() => {
        setUserDetail(null);
      });
  }, [id]);

  const handleSave = () => {
    // Send request to edit user role and status
    fetch(
      `${import.meta.env.VITE_API_URL}/${
        import.meta.env.VITE_PATH_ADMIN
      }/api/user/edit-role/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedRole, status: selectedStatus }),
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "success") {
          toast.success("Updated successfully!");
          setUserDetail((prev) =>
            prev
              ? { ...prev, role: selectedRole, status: selectedStatus }
              : null
          );
        } else {
          toast.error("Failed to update.");
        }
      })
      .catch(() => {
        toast.error("An error occurred while updating.");
      });
  };

  const handleResetPassword = () => {
    // Show SweetAlert warning dialog before resetting password
    Swal.fire({
      title: "Are you sure you want to reset the password?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reset",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(
          `${import.meta.env.VITE_API_URL}/${
            import.meta.env.VITE_PATH_ADMIN
          }/api/user/reset-password/${id}`,
          {
            method: "PATCH",
            credentials: "include",
          }
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.code === "success") {
              toast.success(data.message);
            } else {
              toast.error(data.message);
            }
          })
          .catch(() => {
            toast.error("An error occurred while resetting the password.");
          });
      }
    });
  };

  return (
    userDetail && (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 text-foreground bg-background">
        <h1 className="text-xl sm:text-2xl font-heading font-bold mb-4 text-foreground">
          User Details
        </h1>

        <div className="bg-card rounded-xl border border-border p-4 sm:p-6 shadow-sm transition-colors duration-300">
          {/* Row 1: Full Name & Username */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                value={userDetail.full_name}
                readOnly
                className="w-full px-3.5 py-2 border border-border rounded-lg text-sm bg-muted/30 text-foreground focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                value={userDetail.username}
                readOnly
                className="w-full px-3.5 py-2 border border-border rounded-lg text-sm bg-muted/30 text-foreground focus:outline-none"
              />
            </div>
          </div>

          {/* Row 2: Email & Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={userDetail.email}
                readOnly
                className="w-full px-3.5 py-2 border border-border rounded-lg text-sm bg-muted/30 text-foreground focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Address
              </label>
              <input
                type="text"
                value={userDetail.address}
                readOnly
                className="w-full px-3.5 py-2 border border-border rounded-lg text-sm bg-muted/30 text-foreground focus:outline-none"
              />
            </div>
          </div>

          {/* Row 3: Role, Account Status & Birthday */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block mb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                User Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3.5 py-2 border border-border rounded-lg text-sm bg-card text-foreground cursor-pointer focus:outline-none"
              >
                <option value="user" className="bg-card text-foreground">User</option>
                <option value="seller" className="bg-card text-foreground">Seller</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Account Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3.5 py-2 border border-border rounded-lg text-sm bg-card text-foreground cursor-pointer focus:outline-none"
              >
                <option value="active" className="bg-card text-foreground">Active</option>
                <option value="inactive" className="bg-card text-foreground">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Date of Birth
              </label>
              <input
                type="text"
                value={formatDateOfBirth(userDetail.date_of_birth)}
                readOnly
                className="w-full px-3.5 py-2 border border-border rounded-lg text-sm bg-muted/30 text-foreground focus:outline-none"
              />
            </div>
          </div>

          {/* Row 4: Rating & Rating Count info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block mb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Average Rating
              </label>
              <div className="px-3.5 py-2 border border-border rounded-lg bg-muted/30 flex items-center gap-2">
                <span className="text-lg text-yellow-500">⭐</span>
                <span className="text-base font-bold text-foreground">{userDetail.rating}</span>
                <span className="text-xs text-muted-foreground">/ 5.0</span>
              </div>
            </div>

            <div>
              <label className="block mb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Rating Count
              </label>
              <input
                type="text"
                value={`${userDetail.rating_count} ratings`}
                readOnly
                className="w-full px-3.5 py-2 border border-border rounded-lg text-sm bg-muted/30 text-foreground focus:outline-none"
              />
            </div>
          </div>

          {/* Action triggers */}
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => navigate("/admin/user/list")}
              className="cursor-pointer px-6 py-2 bg-muted text-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all focus:outline-none"
            >
              Back to list
            </button>
            <button
              onClick={handleSave}
              className="cursor-pointer px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all focus:outline-none"
            >
              Save changes
            </button>
            <button
              onClick={handleResetPassword}
              className="cursor-pointer px-6 py-2 bg-destructive text-destructive-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all focus:outline-none"
            >
              Reset Password
            </button>
          </div>
        </div>
      </div>
    )
  );
}
