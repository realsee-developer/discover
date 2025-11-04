import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Cron job to automatically submit sitemap to search engines
 * Runs daily at 2:00 AM UTC (configured in vercel.json)
 * 
 * Vercel Cron Jobs documentation: https://vercel.com/docs/cron-jobs
 */
export async function GET(request: NextRequest) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://discover.realsee.ai";
  const sitemapUrl = `${siteUrl}/sitemap.xml`;
  
  const results = {
    google: { success: false, message: "" },
    bing: { success: false, message: "" },
    indexnow: { success: false, message: "" },
  };

  try {
    // Submit to Google Search Console
    // Note: This requires Google Search Console API setup
    // For now, we'll just ping the sitemap URL
    const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    try {
      const googleResponse = await fetch(googlePingUrl, { method: "GET" });
      results.google.success = googleResponse.ok;
      results.google.message = googleResponse.ok 
        ? "Sitemap submitted successfully"
        : `Failed with status ${googleResponse.status}`;
    } catch (error) {
      results.google.message = `Error: ${error instanceof Error ? error.message : "Unknown error"}`;
    }

    // Submit to Bing Webmaster Tools
    const bingPingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    try {
      const bingResponse = await fetch(bingPingUrl, { method: "GET" });
      results.bing.success = bingResponse.ok;
      results.bing.message = bingResponse.ok
        ? "Sitemap submitted successfully"
        : `Failed with status ${bingResponse.status}`;
    } catch (error) {
      results.bing.message = `Error: ${error instanceof Error ? error.message : "Unknown error"}`;
    }

    // Submit via IndexNow (if key is configured)
    const indexnowKey = process.env.INDEXNOW_KEY;
    if (indexnowKey) {
      try {
        const indexnowResponse = await fetch("https://api.indexnow.org/indexnow", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            host: siteUrl.replace(/^https?:\/\//, ""),
            key: indexnowKey,
            keyLocation: `${siteUrl}/api/indexnow`,
            urlList: [sitemapUrl],
          }),
        });
        results.indexnow.success = indexnowResponse.ok || indexnowResponse.status === 202;
        results.indexnow.message = results.indexnow.success
          ? "Sitemap submitted via IndexNow"
          : `Failed with status ${indexnowResponse.status}`;
      } catch (error) {
        results.indexnow.message = `Error: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    } else {
      results.indexnow.message = "IndexNow key not configured";
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      sitemapUrl,
      results,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Allow POST as well for manual triggering
export async function POST(request: NextRequest) {
  return GET(request);
}

