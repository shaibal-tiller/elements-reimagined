import React from "react";

const ProjectDetailSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 animate-pulse mt-[100px]">
      {/* Hero Header Skeleton */}
      <div className="relative bg-slate-800 text-white overflow-hidden rounded-xl">
        <div className="container mx-auto px-6 pt-6 pb-16 relative z-10">
          {/* Back Button */}
          <div className="h-8 w-32 bg-slate-700 rounded-lg mb-8" />

          {/* Category & Meta */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="h-6 w-36 bg-slate-700 rounded-full" />
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <div className="h-4 w-24 bg-slate-700 rounded" />
              <div className="h-4 w-20 bg-slate-700 rounded" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-4 mb-8">
            <div className="h-12 w-80 bg-slate-700 rounded" />
            <div className="h-10 w-96 bg-slate-700 rounded" />
          </div>

          {/* Header Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mt-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-700/50 p-4 rounded-xl">
                <div className="h-3 w-16 bg-slate-600 rounded mb-2" />
                <div className="h-5 w-full bg-slate-600 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Project Context */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-slate-300 rounded-full" />
                <div className="h-7 w-40 bg-slate-200 rounded" />
              </div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-slate-100 rounded" />
                <div className="h-4 w-full bg-slate-100 rounded" />
                <div className="h-4 w-full bg-slate-100 rounded" />
                <div className="h-4 w-3/4 bg-slate-100 rounded" />
              </div>
            </div>

            {/* Features */}
            <div>
              <div className="h-6 w-48 bg-slate-200 rounded mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white p-6 rounded-xl border border-slate-200">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg mb-4" />
                    <div className="h-5 w-32 bg-slate-200 rounded mb-2" />
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-slate-100 rounded" />
                      <div className="h-3 w-3/4 bg-slate-100 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Images */}
            <div>
              <div className="h-6 w-32 bg-slate-200 rounded mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-video bg-slate-200 rounded-xl" />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="h-6 w-28 bg-slate-200 rounded mb-4" />

              <div className="space-y-6">
                {["Frontend", "Backend", "DevOps"].map((label) => (
                  <div key={label}>
                    <div className="h-3 w-16 bg-slate-100 rounded mb-3" />
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-6 w-20 bg-slate-100 rounded-lg" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="h-6 w-32 bg-slate-200 rounded mb-4" />
                <div className="bg-orange-50 rounded-xl p-4">
                  <div className="h-4 w-40 bg-orange-200 rounded mb-2" />
                  <div className="h-3 w-full bg-orange-100 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetailSkeleton;
