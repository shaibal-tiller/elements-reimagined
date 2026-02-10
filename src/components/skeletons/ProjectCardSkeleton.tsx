import React from "react";

const ProjectCardSkeleton: React.FC = () => {
  return (
    <div className="card-white p-0 h-full overflow-hidden border border-slate-100 flex flex-col animate-pulse">
      {/* Header / Banner Skeleton */}
      <div className="h-48 bg-slate-700 relative overflow-hidden p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="h-6 w-24 bg-slate-600 rounded-full" />
          <div className="h-6 w-6 bg-slate-600 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-7 w-48 bg-slate-600 rounded" />
          <div className="h-4 w-64 bg-slate-600 rounded" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="space-y-2 mb-6 flex-1">
          <div className="h-4 w-full bg-slate-200 rounded" />
          <div className="h-4 w-full bg-slate-200 rounded" />
          <div className="h-4 w-3/4 bg-slate-200 rounded" />
        </div>

        {/* Tech Stack Pills Skeleton */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-6 w-16 bg-slate-100 rounded-md" />
          ))}
        </div>

        {/* Footer Skeleton */}
        <div className="h-5 w-32 bg-slate-200 rounded" />
      </div>
    </div>
  );
};

export default ProjectCardSkeleton;
