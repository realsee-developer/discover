# SEO/GEO 优化指南

## 概述

本指南介绍 discover.realsee.ai 项目的 SEO 和 GEO 优化实践，确保网站能够被全球搜索引擎和 AI 大模型正确索引和理解。

## 核心组件

### 1. Robots.txt 配置

动态 robots.txt 通过 `src/app/robots.ts` 生成，支持：

- **传统搜索引擎**：Google, Bing, Baidu, Yandex, DuckDuckGo
- **AI 搜索引擎**：GPTBot, Claude-Web, PerplexityBot, Google-Extended, Amazonbot, Meta AI, Apple Intelligence

**关键配置：**
```typescript
// 高优先级爬虫（Google, Bing）: crawlDelay: 0
// AI 爬虫和其他引擎: crawlDelay: 1
// 禁止访问: /api/
```

### 2. Hreflang 标签

通过 `src/lib/seo-utils.ts` 的 `generateGlobalAlternates()` 函数生成全球市场的 hreflang 标签。

**支持的市场：**
- 北美：en-US, en-CA
- 欧洲：en-GB, de-DE, fr-FR, es-ES, it-IT, nl-NL, pl-PL, pt-PT
- 亚太：en-AU, en-SG, en-NZ, ja-JP, zh-CN, zh-TW, zh-HK, ko-KR
- 中东：en-AE, ar-AE, en-SA
- 拉美：es-MX, pt-BR, es-AR, es-CL
- 其他：en-IN, en-ZA, ru-RU

**使用方法：**
```typescript
import { generateGlobalAlternates } from "@/lib/seo-utils";

export const metadata: Metadata = {
  alternates: {
    canonical: absoluteUrl("/path"),
    languages: generateGlobalAlternates("/path"),
  },
};
```

### 3. 结构化数据 (Schema.org)

通过 `src/lib/structured-data.ts` 实现，包含：

#### Organization Schema
- Realsee 公司信息
- 社交媒体链接（Twitter, YouTube, LinkedIn, Facebook）
- 联系方式

#### WebSite Schema
- 网站基本信息
- 搜索功能（SearchAction）
- 帮助搜索引擎理解站内搜索

#### ProfilePage Schema
- 专业摄影师个人资料
- 作品集信息
- 社交链接
- 地理位置

#### BreadcrumbList Schema
- 导航路径
- 帮助搜索引擎理解网站结构
- 改善搜索结果展示

#### ItemList Schema
- Tours 列表
- Professionals 列表
- 帮助搜索引擎理解内容集合

### 4. Sitemap

动态生成的 sitemap (`src/app/sitemap.ts`) 包含：

- **首页**：priority 1.0, changeFrequency daily
- **搜索页**：priority 0.8, changeFrequency weekly
- **专业摄影师页面**：priority 0.7, changeFrequency monthly

**特点：**
- 自动包含所有 professional 页面
- 使用当前时间作为 lastModified
- 为图片索引预留了结构

### 5. 搜索引擎验证

在 `layout.tsx` 的 `metadata.verification` 中配置：

```typescript
verification: {
  google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  yandex: process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION,
  other: {
    "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || "",
    "baidu-site-verification": process.env.NEXT_PUBLIC_BAIDU_SITE_VERIFICATION || "",
  },
}
```

**需要的环境变量：**
```
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=xxx
NEXT_PUBLIC_BING_SITE_VERIFICATION=xxx
NEXT_PUBLIC_BAIDU_SITE_VERIFICATION=xxx
NEXT_PUBLIC_YANDEX_SITE_VERIFICATION=xxx
```

### 6. AI 搜索引擎优化

在 `layout.tsx` 的 `metadata.other` 中配置特殊标签：

```typescript
other: {
  // AI 内容声明（人工创作）
  "ai-content-declaration": "human-created",
  "content-language": "en",
  "geo.region": "global",
  // 允许 AI 爬虫使用内容
  "X-Robots-Tag": "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  // 内容分类标签
  "article:tag": "3d-virtual-tours, creators, photography, real-estate, technology",
  "article:content_tier": "free",
  // 网站类型
  "website:type": "directory",
}
```

## 页面 SEO 配置

### 首页 (`/`)
- ✅ 完整的 metadata（title, description, keywords）
- ✅ Organization, WebSite, Breadcrumb schemas
- ✅ OpenGraph 和 Twitter Cards
- ✅ Hreflang 标签

### 搜索页 (`/search`)
- ✅ 搜索优化的 metadata
- ✅ Organization, Breadcrumb schemas
- ✅ OpenGraph 和 Twitter Cards
- ✅ Hreflang 标签

### 专业摄影师页面 (`/professional/[slug]`)
- ✅ 动态生成的 metadata
- ✅ ProfilePage, Breadcrumb schemas
- ✅ 包含社交链接的结构化数据
- ✅ Hreflang 标签

## 新增页面 SEO 检查清单

创建新页面时，确保包含以下 SEO 元素：

### Metadata 必需项
- [ ] `title`：描述性标题（50-60 字符）
- [ ] `description`：页面描述（150-160 字符）
- [ ] `keywords`：相关关键词数组
- [ ] `alternates.canonical`：规范 URL
- [ ] `alternates.languages`：使用 `generateGlobalAlternates(path)`
- [ ] `openGraph`：完整的 OG 标签
- [ ] `twitter`：Twitter Card 标签

### 结构化数据
- [ ] 选择适当的 Schema 类型
- [ ] 使用 `src/lib/structured-data.ts` 中的函数
- [ ] 在页面组件中输出 JSON-LD

### 示例代码
```typescript
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/utils";
import { generateGlobalAlternates } from "@/lib/seo-utils";
import { getOrganizationSchema, getBreadcrumbListSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Page Title",
  description: "Page description",
  keywords: ["keyword1", "keyword2"],
  alternates: {
    canonical: absoluteUrl("/page"),
    languages: generateGlobalAlternates("/page"),
  },
  openGraph: {
    title: "Page Title",
    description: "Page description",
    url: absoluteUrl("/page"),
    images: [{ url: absoluteUrl("/image.jpg") }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Page Title",
    description: "Page description",
    images: [absoluteUrl("/image.jpg")],
  },
};

export default function Page() {
  const organizationSchema = getOrganizationSchema();
  const breadcrumbSchema = getBreadcrumbListSchema([
    { name: "Home", url: absoluteUrl("/") },
    { name: "Page", url: absoluteUrl("/page") },
  ]);

  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main>{/* Page content */}</main>
    </>
  );
}
```

## 最佳实践

### 1. 内容质量
- 确保所有 professional 资料完整准确
- 为每个 tour 提供清晰的标题和分类
- 定期更新内容，保持新鲜度
- 避免重复内容

### 2. 图片优化
- 使用 Next.js Image 组件
- 为所有图片提供 alt 文本
- Portrait 图片使用 3:4 比例
- Tour cover 图片优化加载性能
- 使用 Cloudflare Image Resizing

### 3. 链接策略
- 内部链接使用描述性文本
- Professional 页面互相链接（相关推荐）
- 外部链接到社交媒体和作品
- 确保所有链接可访问

### 4. 性能优化
- 使用图片懒加载
- 实现代码分割
- 优化首屏渲染时间（LCP < 2.5s）
- 确保移动端性能

### 5. AI 友好
- 提供清晰的内容层级结构
- 使用语义化 HTML
- 完整的结构化数据
- 明确的导航路径

## 监控和维护

### 定期任务
- [ ] 每周检查 Google Search Console 错误
- [ ] 每月审查关键词表现
- [ ] 每月更新 professional 数据
- [ ] 每季度审查和优化 Schema

### 测试工具
1. **Google Search Console**
   - 索引覆盖率
   - 搜索性能
   - Core Web Vitals

2. **Bing Webmaster Tools**
   - Sitemap 状态
   - 爬取统计

3. **Rich Results Test**
   - 验证结构化数据
   - 测试富媒体结果

4. **Lighthouse**
   - SEO 评分
   - 性能指标
   - 最佳实践

### 指标监控
- **索引页面数**：应包含所有 professional 页面
- **爬取频率**：首页每天，专业页面每月
- **错误率**：保持 < 1%
- **平均排名**：跟踪核心关键词

## 常见问题

### Q: 如何添加新的 professional？
A: 
1. 在 `data/professionals.json` 添加数据
2. 添加对应的 portrait 图片到 `public/professional/`
3. Sitemap 会自动更新
4. 确保包含完整的社交链接和 bio

### Q: 为什么使用动态 sitemap？
A: 动态 sitemap 能自动包含所有 professional 页面，无需手动维护。当添加新的 creator 时，sitemap 自动更新。

### Q: 如何优化 professional 页面的 SEO？
A: 
1. 确保每个 professional 有独特的 shortBio
2. 添加完整的社交链接
3. 包含地理位置信息
4. 定期更新作品集（tours）

### Q: 结构化数据的优先级？
A:
1. Organization（全站必需）
2. WebSite（首页必需）
3. ProfilePage（professional 页面）
4. BreadcrumbList（改善导航）
5. ItemList（列表页面）

## SEO 工具函数

### generateGlobalAlternates(path)
生成全球市场的 hreflang 标签。

```typescript
import { generateGlobalAlternates } from "@/lib/seo-utils";
const languages = generateGlobalAlternates("/professional/john-doe");
```

### getAICrawlers()
获取所有 AI 爬虫的 user agent 列表。

```typescript
import { getAICrawlers } from "@/lib/seo-utils";
const aiCrawlers = getAICrawlers();
// ["GPTBot", "Claude-Web", "PerplexityBot", ...]
```

### isAICrawler(userAgent)
检查是否为 AI 爬虫。

```typescript
import { isAICrawler } from "@/lib/seo-utils";
if (isAICrawler(request.headers.get("user-agent"))) {
  // 特殊处理 AI 爬虫请求
}
```

## 相关资源

- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Web.dev SEO Guide](https://web.dev/learn/seo/)
- [OpenAI GPTBot](https://platform.openai.com/docs/gptbot)
- [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/webmasters-guidelines-30fba23a)

## 更新日志

- **2025-11**: 全面 SEO/GEO 优化
  - ✅ 添加全球市场 hreflang 支持
  - ✅ 实现完整的结构化数据系统
  - ✅ 配置 AI 爬虫支持
  - ✅ 添加多搜索引擎验证
  - ✅ 优化所有页面的 metadata
  - ✅ 增强 sitemap 功能

