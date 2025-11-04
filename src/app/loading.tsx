export default function Loading() {
  return (
    <div className="container mx-auto p-8 text-cyber-gray-200">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-1/3 rounded bg-cyber-gray-700/70" />
        <div className="h-4 w-2/3 rounded bg-cyber-gray-700/70" />
        <div className="h-64 w-full rounded bg-cyber-gray-700/70" />
      </div>
    </div>
  );
}
