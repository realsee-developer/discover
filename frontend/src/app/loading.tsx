export default function Loading() {
  return (
    <div className="container mx-auto p-8">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-1/3 bg-gray-200 rounded" />
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
        <div className="h-64 w-full bg-gray-200 rounded" />
      </div>
    </div>
  );
}


