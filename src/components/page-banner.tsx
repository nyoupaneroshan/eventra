'use client';

interface PageBannerProps {
  title: string;
  subtitle?: string;
}

export default function PageBanner({ title, subtitle }: PageBannerProps) {
  return (
    <section className="relative w-full h-64 sm:h-72 md:h-80 flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero1.png')" }}
      />
      <div className="absolute inset-0 bg-rose-dark/80" />
      <div className="relative z-10 text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 animate-fade-in-up">
          {title}
        </h1>
        {subtitle && (
          <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
