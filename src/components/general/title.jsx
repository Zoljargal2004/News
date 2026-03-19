export const GreenBgTitle = ({ title, className }) => {
  return (
    <div className={`${className} relative inline-flex items-end`}>
      <span className="relative z-10">{title}</span>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[0.12em] -z-10 h-[0.55em] rounded-sm bg-(--accent)"
      />
    </div>
  );
};
