import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold">页面不存在</h1>
      <p className="mt-2 text-muted-foreground">您访问的内容不存在或已被删除。</p>
      <Link href="/" className="inline-block mt-6 px-4 py-2 border rounded">
        返回首页
      </Link>
    </div>
  );
}


