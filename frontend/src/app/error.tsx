"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto p-8 text-center">
      <h2 className="text-2xl font-bold">应用发生错误</h2>
      <p className="mt-2 text-muted-foreground">请重试或返回首页。</p>
      <div className="mt-6 flex gap-3 justify-center">
        <button onClick={() => reset()} className="px-4 py-2 border rounded">
          重试
        </button>
        <Link href="/" className="px-4 py-2 border rounded">
          返回首页
        </Link>
      </div>
      {process.env.NODE_ENV === "development" && (
        <pre className="text-left mt-6 bg-gray-50 p-4 rounded overflow-auto text-xs">{error.stack}</pre>
      )}
    </div>
  );
}


