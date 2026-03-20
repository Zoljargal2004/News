export const GreenBgTitle = ({ title, className, onClick }) => {
  return (
    <div
      className={`${className} relative inline-flex items-end cursor-pointer`}
      onClick={onClick}
    >
      <span className="relative z-10">{title}</span>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[0.12em] -z-50 h-[0.55em] rounded-sm bg-(--additional-accent)"
      />
    </div>
  );
};

export const BlueBgTitle = ({ title, className, onClick }) => {
  return (
    <div
      className={`${className} relative inline-flex items-end cursor-pointer`}
      onClick={onClick}
    >
      <span className="relative z-10">{title}</span>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[0.12em] -z-50 h-[0.55em] rounded-sm bg-(--additional-accent)"
      />
    </div>
  );
};

export const RedBgTitle = ({ title, className, onClick }) => {
  return (
    <div
      className={`${className} relative inline-flex items-end cursor-pointer`}
      onClick={onClick}
    >
      <span className="relative z-10">{title}</span>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[0.12em] -z-50 h-[0.55em] rounded-sm bg-(--additional-accent)"
      />
    </div>
  );
};
