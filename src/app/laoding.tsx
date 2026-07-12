export default function Loading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-matte-black gap-4">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-matte-800 border-t-crimson" />
      </div>
      <img
        src="/logo.png"
        alt="Haapu TV"
        className="h-8 w-auto object-contain opacity-60"
      />
    </div>
  );
}