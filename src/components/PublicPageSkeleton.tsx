type PublicPageSkeletonProps = {
  variant?: "profile" | "locked-grid";
  themeClass?: string;
};

const cardHeights = [
  "h-[180px]",
  "h-[240px]",
  "h-[210px]",
  "h-[280px]",
  "h-[200px]",
  "h-[260px]",
  "h-[220px]",
  "h-[250px]",
];

const PublicPageSkeleton = ({
  variant = "profile",
  themeClass = "",
}: PublicPageSkeletonProps) => {
  const isLockedGrid = variant === "locked-grid";

  return (
    <div className={`min-h-screen mobile-stable-shell feed-bg ${themeClass}`}>
      <header className="sticky top-0 z-20 nav-elevated">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="skeleton-shimmer h-8 w-36 rounded-full" />
              <div className="skeleton-shimmer h-7 w-20 rounded-full" />
            </div>
            <div className="flex items-center gap-2">
              <div className="skeleton-shimmer h-8 w-8 rounded-full" />
              <div className="skeleton-shimmer h-8 w-24 rounded-full" />
            </div>
          </div>
        </div>
      </header>

      {!isLockedGrid && (
        <section className="max-w-[1600px] mx-auto px-4 pt-4">
          <div className="skeleton-shimmer h-[220px] sm:h-[280px] rounded-2xl" />
          <div className="relative -mt-10 sm:-mt-14 mx-auto max-w-5xl">
            <div className="post-card rounded-2xl p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="skeleton-shimmer h-24 w-24 rounded-full" />
                <div className="flex-1 w-full">
                  <div className="skeleton-shimmer h-7 w-48 rounded-md mb-3 mx-auto sm:mx-0" />
                  <div className="skeleton-shimmer h-4 w-full max-w-xl rounded-md mb-2" />
                  <div className="skeleton-shimmer h-4 w-3/4 max-w-md rounded-md mb-4" />
                  <div className="flex gap-2 justify-center sm:justify-start">
                    <div className="skeleton-shimmer h-7 w-28 rounded-full" />
                    <div className="skeleton-shimmer h-7 w-24 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-5">
                <div className="skeleton-shimmer h-10 w-72 rounded-xl" />
              </div>
            </div>
          </div>
        </section>
      )}

      <main
        className={`max-w-7xl mx-auto px-4 pb-8 ${
          isLockedGrid ? "pt-6" : "pt-6 lg:pt-4"
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
          {!isLockedGrid && (
            <aside className="hidden lg:block post-card rounded-xl p-3 h-[620px]">
              <div className="skeleton-shimmer h-5 w-28 rounded mb-4" />
              <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div key={`side-${idx}`} className="skeleton-shimmer h-10 rounded-lg" />
                ))}
              </div>
            </aside>
          )}

          <div className={isLockedGrid ? "" : "space-y-4"}>
            {!isLockedGrid && (
              <div className="skeleton-shimmer h-14 w-full max-w-sm rounded-xl mx-auto lg:mx-0" />
            )}

            <div
              className={`${
                isLockedGrid
                  ? "columns-1 sm:columns-2 lg:columns-4 gap-3 [column-fill:_balance]"
                  : "space-y-4"
              }`}
            >
              {Array.from({ length: isLockedGrid ? 12 : 6 }).map((_, idx) => (
                <div
                  key={`card-${idx}`}
                  className={`${isLockedGrid ? "mb-3 break-inside-avoid" : ""} post-card rounded-xl p-3`}
                >
                  <div className={`skeleton-shimmer rounded-lg ${cardHeights[idx % cardHeights.length]}`} />
                  {!isLockedGrid && (
                    <div className="mt-3 space-y-2">
                      <div className="skeleton-shimmer h-4 w-2/3 rounded" />
                      <div className="skeleton-shimmer h-4 w-full rounded" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {isLockedGrid && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-xs rounded-2xl p-5 bg-black/25 backdrop-blur-sm border border-white/10">
            <div className="skeleton-shimmer h-7 w-32 rounded-md mx-auto mb-4" />
            <div className="skeleton-shimmer h-4 w-48 rounded-md mx-auto mb-6" />
            <div className="skeleton-dark-shimmer h-12 rounded-xl w-full" />
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicPageSkeleton;
