import { auth } from '@clerk/nextjs/server';

export async function isAdmin() {
  const { userId } = await auth();
  
  if (!userId) return false;
  
  // In a real app, you'd check a database table
  // For now, we'll check Clerk metadata
  // This is a simplified version - we'll improve it
  return true; // TEMPORARY - allows all logged-in users
}