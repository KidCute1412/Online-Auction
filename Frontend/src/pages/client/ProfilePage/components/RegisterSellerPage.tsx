import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  FileText,
  Send,
  ArrowLeft,
  Shield,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/routes/ProtectedRouter";
import justValidate from "just-validate";
import TinyMCEEditor from "@/components/editor/TinyMCEEditor";
import { userService } from "@/services/user.service.ts";

interface UserInfo {
  username: string;
  email: string;
  full_name: string;
}

export default function RegisterSellerPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { auth } = useAuth();
  const editor = useRef<any>(null);

  const handleEditorChange = (content: string) => {
    const reasonContent = document.getElementById("reason") as HTMLInputElement;
    if (reasonContent) reasonContent.value = content;
  };

  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: "",
    email: "",
    full_name: "",
  });

  useEffect(() => {
    if (auth) {
      setUserInfo({
        username: auth.username,
        email: auth.email,
        full_name: auth.full_name,
      });
    }
  }, [auth]);

  useEffect(() => {
    const validator = new justValidate("#register-seller-form");
    validator
      .addField("#reason", [
        {
          rule: "required",
          errorMessage: "Reason cannot be left blank",
        },
      ])
      .onSuccess((e: any) => {
        e.preventDefault();
        setIsSubmitting(true);

        userService.registerSeller({
          reason: e.target.reason.value,
        })
          .then((data) => {
            toast.success(data.message || "Request submitted successfully");
            navigate(-1);
          })
          .catch((error) => {
            toast.error(error.message || "Server connection error");
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-5 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center cursor-pointer text-sm font-semibold p-3 mb-4 text-accent transition-colors hover:text-accent/90"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>

          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-accent" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-heading font-extrabold text-foreground mb-2">
              Register as Seller
            </h1>
            <p className="text-muted-foreground text-sm">
              Start your business journey on the auction platform
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-2xl shadow-xl overflow-hidden border border-border">
          {/* Card Header */}
          <div className="bg-accent text-white p-6">
            <h2 className="text-xl font-semibold flex items-center">
              <FileText className="w-5 h-5 mr-3" />
              Registration Info
            </h2>
            <p className="text-white/80 mt-2">
              Please verify your details and enter the reason you want to become a seller
            </p>
          </div>

          {/* Form Content */}
          <form id="register-seller-form" className="p-8">
            {/* User Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-accent" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                    <input
                      type="text"
                      value={userInfo.username}
                      readOnly
                      className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-lg text-muted-foreground cursor-not-allowed focus:outline-none"
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                    <input
                      type="text"
                      value={userInfo.full_name}
                      readOnly
                      className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-lg text-muted-foreground cursor-not-allowed focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                    <input
                      type="email"
                      value={userInfo.email}
                      readOnly
                      className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-lg text-muted-foreground cursor-not-allowed focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Reason Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-accent" />
                Reason for becoming a Seller
              </h3>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Please share the reason why you want to become a seller on our platform
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <TinyMCEEditor
                  editorRef={editor}
                  onEditChange={handleEditorChange}
                />
                <input id="reason" name="reason" type="hidden" />
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-accent mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-accent">
                  <p className="font-semibold mb-1">Important Note:</p>
                  <ul className="space-y-1 text-muted-foreground text-xs">
                    <li>Requests will be reviewed within 7 days.</li>
                    <li>You will be granted seller access for 7 days.</li>
                    <li>We will contact you via email with the decision.</li>
                    <li>Sellers must comply with all platform regulations.</li>
                    <li>Additional verification information may be required.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border cursor-pointer border-border text-muted-foreground bg-card rounded-lg hover:bg-muted/50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition-all duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Request
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 bg-card rounded-2xl shadow-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-emerald-500" />
            Benefits of becoming a Seller
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-accent" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">
                Post Products
              </h4>
              <p className="text-xs text-muted-foreground">
                Post your products for sale on the auction platform
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-6 h-6 text-accent" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">
                Customer Management
              </h4>
              <p className="text-xs text-muted-foreground">
                Interact and manage customers effectively
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-emerald-500" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">
                Trust & Ratings
              </h4>
              <p className="text-xs text-muted-foreground">
                Build your brand through our rating system
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
