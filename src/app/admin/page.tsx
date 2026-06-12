export default async function AdminDashboard() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white">Dashboard</h1>
      <p className="mt-2 text-matte-400">Welcome to the admin panel.</p>
      
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-matte-800 bg-matte-900 p-6">
          <h3 className="text-sm font-medium text-matte-400">Total Movies</h3>
          <p className="mt-2 text-3xl font-bold text-white">9</p>
        </div>
        
        <div className="rounded-lg border border-matte-800 bg-matte-900 p-6">
          <h3 className="text-sm font-medium text-matte-400">Active Users</h3>
          <p className="mt-2 text-3xl font-bold text-white">0</p>
        </div>
        
        <div className="rounded-lg border border-matte-800 bg-matte-900 p-6">
          <h3 className="text-sm font-medium text-matte-400">Total Views</h3>
          <p className="mt-2 text-3xl font-bold text-white">0</p>
        </div>
      </div>
    </div>
  );
}