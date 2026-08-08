export default function WatchLoading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-matte-black">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-matte-800 border-t-crimson" />
      </div>
    </div>
  );
}