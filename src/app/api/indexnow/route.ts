import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * IndexNow API endpoint
 * Allows quick notification to search engines (Bing, Yandex, etc.) about content updates
 *
 * IndexNow Protocol: https://www.indexnow.org/documentation
 *
 * Usage:
 * POST /api/indexnow
 * Body: { "urls": ["https://discover.realsee.ai/professional/new-creator"] }
 */

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://discover.realsee.ai";

export async function GET(_request: NextRequest) {
  // Return the IndexNow key for verification
  // This endpoint should return the key as plain text
  if (!INDEXNOW_KEY) {
    return new NextResponse("IndexNow key not configured", { status: 404 });
  }

  return new NextResponse(INDEXNOW_KEY, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

export async function POST(request: NextRequest) {
  if (!INDEXNOW_KEY) {
    return NextResponse.json(
      { error: "IndexNow key not configured" },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const urls = body.urls || [];

    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: "Invalid request: urls array is required" },
        { status: 400 },
      );
    }

    // Validate URLs
    const validUrls = urls.filter((url) => {
      try {
        const parsed = new URL(url);
        return parsed.hostname === new URL(SITE_URL).hostname;
      } catch {
        return false;
      }
    });

    if (validUrls.length === 0) {
      return NextResponse.json(
        { error: "No valid URLs provided" },
        { status: 400 },
      );
    }

    // Submit to IndexNow
    const indexNowPayload = {
      host: new URL(SITE_URL).hostname,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/api/indexnow`,
      urlList: validUrls,
    };

    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(indexNowPayload),
    });

    if (response.ok || response.status === 202) {
      return NextResponse.json({
        success: true,
        message: "URLs submitted to IndexNow successfully",
        submitted: validUrls.length,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: `IndexNow API returned status ${response.status}`,
        submitted: 0,
      },
      { status: response.status },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
