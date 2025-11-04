"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto p-8 text-center text-cyber-gray-200">
      <h2 className="text-2xl font-bold text-cyber-gray-100">应用发生错误</h2>
      <p className="mt-2 text-cyber-gray-300">请重试或返回首页。</p>
      <div className="mt-6 flex gap-3 justify-center">
        <button
          type="button"
          onClick={() => reset()}
          className="px-4 py-2 rounded border border-cyber-brand-400/60 bg-cyber-gray-800/80 text-cyber-gray-100 hover:border-cyber-brand-400 hover:bg-cyber-brand-500/15"
        >
          重试
        </button>
        <Link
          href="/"
          className="px-4 py-2 rounded border border-cyber-brand-400/60 bg-cyber-gray-800/80 text-cyber-gray-100 hover:border-cyber-brand-400 hover:bg-cyber-brand-500/15"
        >
          返回首页
        </Link>
      </div>
      {process.env.NODE_ENV === "development" && (
        <pre className="text-left mt-6 bg-cyber-gray-800/80 border border-cyber-gray-600/60 p-4 rounded overflow-auto text-xs text-cyber-gray-100">
          {error.stack}
        </pre>
      )}
    </div>
  );
}
