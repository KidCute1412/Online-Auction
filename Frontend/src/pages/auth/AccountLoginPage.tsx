/* eslint-disable @typescript-eslint/no-explicit-any */
import JustValidate from "just-validate";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Lock, Mail, LogIn, Eye, EyeOff } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { accountService } from "@/services/account.service.ts";

function AccountLogin() {
  const navigate = useNavigate();
  const [isCaptchaChecked, setIsCaptchaChecked] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    const validate = new JustValidate("#loginForm", { lockForm: false });
    validate
      .addField("#email", [
        { rule: "required", errorMessage: "Please enter your email!" },
        { rule: "email", errorMessage: "Invalid email address!" },
      ])
      .addField("#password", [
        { rule: "required", errorMessage: "Please enter your password!" },
      ])
      .onSuccess((e: any) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const email = (form.querySelector("#email") as HTMLInputElement).value;
        const password = (form.querySelector("#password") as HTMLInputElement)
          .value;
        const rememberPassword = (
          form.querySelector("#rememberPassword") as HTMLInputElement
        ).checked;

        if (!isCaptchaChecked || !captchaToken) {
          toast.error("Please verify that you are not a robot!");
          return;
        }

        const dataFinal = {
          email: email,
          password: password,
          rememberPassword: rememberPassword,
          captchaToken: captchaToken,
        };

        accountService.login(dataFinal)
          .then((data) => {
            if (data.code === "error") {
              toast.error(data.message);
            }

            if (data.code === "success") {
              toast.success("Logged in successfully!");
              if (data.role === "admin") {
                navigate(`/admin/dashboard`);
              } else {
                navigate(`/`);
              }
            }
          });
      });
    return () => {
      validate.destroy();
    };
  }, [isCaptchaChecked, captchaToken, navigate]);

  const handleSuccessGoogleLogin = async (credentialResponse: any) => {
    const { credential } = credentialResponse;
    const dataFinal = { credential: credential, rememberMe: false };
    accountService.googleLogin(dataFinal as any)
      .then((data) => {
        if (data.code === "error") {
          toast.error(data.message);
        }
        if (data.code === "success") {
          toast.success(data.message || "Logged in successfully!");
          if (data.role === "admin") {
            navigate(`/admin/dashboard`);
          } else {
            navigate(`/`);
          }
        }
      });
  };

  return (
    <div className="flex justify-center px-4 min-h-[calc(100vh-140px)] items-center py-4 transition-colors duration-300">
      <form
        id="loginForm"
        className="w-full max-w-md bg-card p-6 sm:p-7 rounded-2xl shadow-gold-glow border border-border"
      >
        {/* Compact Title */}
        <div className="text-center mb-4">
          <h1 className="font-heading font-bold text-xl text-foreground">
            Log In
          </h1>
        </div>

        {/* Inputs stack */}
        <div className="space-y-3.5">
          {/* Email input */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Email
            </label>
            <div className="relative">
              <input
                type="text"
                id="email"
                placeholder="your@email.com"
                className="w-full px-3.5 py-2 pl-10 bg-muted/30 border border-border rounded-xl focus:border-accent focus:ring-1 focus:ring-accent/30 text-foreground transition-all duration-200 text-sm outline-none"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                <Mail className="w-4 h-4" />
              </div>
            </div>
            <div id="emailError" className="text-xs text-destructive mt-0.5 font-medium"></div>
          </div>

          {/* Password input */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="••••••••"
                className="w-full px-3.5 py-2 pl-10 pr-10 bg-muted/30 border border-border rounded-xl focus:border-accent focus:ring-1 focus:ring-accent/30 text-foreground transition-all duration-200 text-sm outline-none"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                <Lock className="w-4 h-4" />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div id="passwordError" className="text-xs text-destructive mt-0.5 font-medium"></div>
          </div>

          {/* Remember/Forgot options */}
          <div className="flex items-center justify-between pb-0.5">
            <label className="flex items-center cursor-pointer group select-none">
              <input
                id="rememberPassword"
                type="checkbox"
                className="w-3.5 h-3.5 text-accent bg-muted border-border rounded focus:ring-accent focus:ring-offset-background cursor-pointer"
              />
              <span className="ml-1.5 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                Remember me
              </span>
            </label>
            <span
              className="text-xs text-accent hover:underline cursor-pointer font-semibold transition-colors duration-200"
              onClick={() => navigate("/accounts/forgot-password")}
            >
              Forgot password?
            </span>
          </div>

          {/* Google reCAPTCHA - scaled slightly down to fit */}
          <div className="flex justify-center my-1">
            <div className="scale-90 origin-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={import.meta.env.VITE_CAPTCHA_SITE_KEY}
                onChange={(token) => {
                  setIsCaptchaChecked(!!token);
                  setCaptchaToken(token);
                }}
                onExpired={() => {
                  setIsCaptchaChecked(false);
                  setCaptchaToken(null);
                }}
                onErrored={() => {
                  setIsCaptchaChecked(false);
                  setCaptchaToken(null);
                  toast.error("Error loading reCAPTCHA, please try again!");
                }}
              />
            </div>
          </div>

          {/* Form Submit Button */}
          <div>
            <button
              className="w-full cursor-pointer bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-xl hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm text-sm"
              type="submit"
            >
              <LogIn className="w-4 h-4" />
              Log In
            </button>
          </div>

          {/* Social Divider */}
          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-card text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                OR
              </span>
            </div>
          </div>

          {/* Google OAuth wrap */}
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <div ref={googleButtonRef} className="hidden">
              <GoogleLogin
                onSuccess={handleSuccessGoogleLogin}
                onError={() => {
                  console.error("Google login failed");
                  toast.error("Google login failed");
                }}
              />
            </div>
          </GoogleOAuthProvider>

          {/* Custom Google Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                const googleBtn = googleButtonRef.current?.querySelector(
                  'div[role="button"]'
                ) as HTMLElement;
                if (googleBtn) googleBtn.click();
              }}
              className="w-10 h-10 flex items-center justify-center bg-card border border-border hover:bg-muted hover:border-accent/40 rounded-full transition-all duration-200 shadow-sm cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            </button>
          </div>

          {/* Registration link */}
          <div className="text-center pt-1">
            <span className="text-xs text-muted-foreground">Don't have an account?</span>
            <span
              className="ml-1 text-accent hover:underline cursor-pointer font-bold transition-colors duration-200 text-xs"
              onClick={() => navigate("/accounts/register")}
            >
              Register now
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AccountLogin;
