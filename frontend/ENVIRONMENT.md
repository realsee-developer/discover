# Realsee Discover - 前端多环境配置

前端通过 `getStrapiURL()` 支持开发（development）、预览（preview）、生产（production）三套环境：

优先级：
1. `NEXT_PUBLIC_STRAPI_URL`（显式覆盖）
2. 按环境变量：`NEXT_PUBLIC_STRAPI_URL_DEV` / `NEXT_PUBLIC_STRAPI_URL_PREVIEW` / `NEXT_PUBLIC_STRAPI_URL_PROD`
3. 回退：`http://localhost:1337`

环境识别：
- 自动：`VERCEL_ENV`（Vercel）或 `NODE_ENV`（本地）
- 手动覆盖：`NEXT_PUBLIC_APP_ENV`（`development` | `preview` | `production`）

示例：
```bash
# 本地开发
NEXT_PUBLIC_STRAPI_URL_DEV=http://localhost:1337
npm run dev

# Vercel Preview
NEXT_PUBLIC_STRAPI_URL_PREVIEW=https://your-preview-strapi.example.com

# Vercel Production
NEXT_PUBLIC_STRAPI_URL_PROD=https://your-prod-strapi.example.com
```
