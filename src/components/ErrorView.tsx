import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ErrorViewProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
}

const ErrorView: React.FC<ErrorViewProps> = ({
  title = "Something went wrong",
  message = "We encountered an error while loading the data. Please try again.",
  onRetry,
  showHomeButton = true,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-red-500/10 p-4 rounded-full mb-6">
        <AlertTriangle className="w-12 h-12 text-red-400" />
      </div>

      <h2 className="text-2xl font-bold text-white mb-3 text-center">{title}</h2>
      <p className="text-slate-400 text-center max-w-md mb-8">{message}</p>

      <div className="flex flex-wrap gap-4 justify-center">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}

        {showHomeButton && (
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            Go Home
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorView;
