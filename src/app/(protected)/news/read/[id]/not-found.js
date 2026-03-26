export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <span className="text-7xl font-black">404</span>
      <h1 className="text-3xl font-bold">News not found</h1>
      <p className="max-w-xl text-muted-foreground">
        The article you are looking for does not exist or may have been removed.
      </p>
    </div>
  );
}
