import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto p-8 text-center text-cyber-gray-200">
      <h1 className="text-3xl font-bold text-cyber-gray-100">页面不存在</h1>
      <p className="mt-2 text-cyber-gray-300">您访问的内容不存在或已被删除。</p>
      <Link
        href="/"
        className="inline-block mt-6 px-4 py-2 rounded border border-cyber-brand-400/60 bg-cyber-gray-800/80 text-cyber-gray-100 hover:border-cyber-brand-400 hover:bg-cyber-brand-500/15"
      >
        返回首页
      </Link>
    </div>
  );
}
