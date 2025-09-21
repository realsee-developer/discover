export default function AccountLoading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 p-4">
      <div className="col-span-3 space-y-4">
        <div className="h-8 w-1/3 bg-gray-200 animate-pulse rounded" />
        <div className="h-10 w-full bg-gray-200 animate-pulse rounded" />
        <div className="h-10 w-full bg-gray-200 animate-pulse rounded" />
        <div className="h-24 w-full bg-gray-200 animate-pulse rounded" />
        <div className="h-10 w-24 bg-gray-200 animate-pulse rounded" />
      </div>
      <div className="col-span-2 space-y-4">
        <div className="h-8 w-1/3 bg-gray-200 animate-pulse rounded" />
        <div className="h-48 w-full bg-gray-200 animate-pulse rounded" />
        <div className="h-10 w-24 bg-gray-200 animate-pulse rounded" />
      </div>
    </div>
  );
}


