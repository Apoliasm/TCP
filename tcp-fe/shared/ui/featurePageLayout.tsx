// shared/ui/FeaturePageLayout.tsx
"use client";

interface FeaturePageLayoutProps {
  title?: string;
  children: React.ReactNode;
}

export function FeaturePageLayout({ title, children }: FeaturePageLayoutProps) {
  return (
    <div className="min-h-screen">
      <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-6 max-w-3xl mx-auto px-4">
        {title && (
          <header className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          </header>
        )}

        {children}
      </div>
    </div>
  );
}
