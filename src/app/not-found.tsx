import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto p-8 text-center text-cyber-gray-200">
      <h1 className="text-3xl font-bold text-cyber-gray-100">Page Not Found</h1>
      <p className="mt-2 text-cyber-gray-300">The page you are looking for does not exist or has been removed.</p>
      <Link
        href="/"
        className="inline-block mt-6 px-4 py-2 rounded border border-cyber-brand-400/60 bg-cyber-gray-800/80 text-cyber-gray-100 hover:border-cyber-brand-400 hover:bg-cyber-brand-500/15"
      >
        Return to Home
      </Link>
    </div>
  );
}
