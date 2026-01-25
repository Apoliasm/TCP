// shared/ui/FeaturePageLayout.tsx
"use client";

interface FeaturePageLayoutProps {
  title?: string;
  children: React.ReactNode;
}

export function FeaturePageLayout({ title, children }: FeaturePageLayoutProps) {
  return (
    <div>
      {title && (
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900" id="page-title">
            {title}
          </h1>
        </header>
      )}

      <div>{children}</div>
    </div>
  );
}
