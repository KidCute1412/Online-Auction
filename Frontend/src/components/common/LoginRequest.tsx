import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogIn, Shield } from 'lucide-react';

export default function LoginRequest() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoToLogin = () => {
    navigate('/accounts/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pb-10 bg-background transition-colors duration-300">
      <div className="max-w-md w-full">
        {/* Main Card */}
        <div className="bg-card rounded-2xl shadow-gold-glow border border-border overflow-hidden">
          {/* Header */}
          <div className="bg-muted/40 px-6 py-8 text-center border-b border-border">
            <div className="w-16 h-16 bg-card border border-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Shield className="w-8 h-8 text-accent animate-pulse" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground">
              Restricted Access
            </h1>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            <div className="text-center mb-6">
              <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
                Authentication Required
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                To access this feature, please log in to your account. This helps ensure data security and integrity.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleGoToLogin}
                className="w-full bg-primary text-primary-foreground font-semibold py-3 px-4 rounded-xl hover:opacity-90 transition-all duration-200 flex items-center justify-center shadow-sm"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Log In
              </button>

              <button
                onClick={handleGoBack}
                className="w-full bg-transparent hover:bg-muted text-foreground font-semibold py-3 px-4 rounded-xl border border-border transition-colors duration-200 flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </button>
            </div>

            {/* Registration Prompt */}
            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/accounts/register')}
                  className="text-accent hover:underline font-semibold"
                >
                  Register here
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Your information security is our top priority
          </p>
        </div>
      </div>
    </div>
  );
}
