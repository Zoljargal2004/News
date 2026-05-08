export const HighlightTitle = ({ title, className = "", onClick }) => {
  return (
    <span
      className={`relative isolate inline-flex items-end font-black italic leading-none ${className}`}
      onClick={onClick}
    >
      <span className="relative z-10">{title}</span>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-[0.45em] bg-[var(--additional-accent)]"
      />
    </span>
  );
};

export const GreenBgTitle = HighlightTitle;
export const BlueBgTitle = HighlightTitle;
export const RedBgTitle = HighlightTitle;
