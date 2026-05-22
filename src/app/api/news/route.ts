import { getCurrentUser, isAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Category, isObjectId, News, serializeNews } from "@/lib/models";
import { defaultPartyScores, politicalParties } from "@/data/political-parties";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const normalizeCategories = (value: unknown) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return [...new Set(value.map((item) => String(item).trim()).filter(Boolean))];
};

const normalizeCategoryIds = (value: string | null) => {
  if (!value) {
    return [];
  }

  return [
    ...new Set(
      value
        .split(",")
        .map((item) => item.trim())
        .filter((item) => isObjectId(item)),
    ),
  ];
};

const normalizeCategoryNames = (value: string | null) => {
  if (!value) {
    return [];
  }

  return [
    ...new Set(
      value
        .split(",")
        .map((item) => String(item).trim())
        .filter(Boolean),
    ),
  ];
};

const normalizeNews = (value: unknown) => {
  return Array.isArray(value) ? value : [];
};

const PARTY_SCORE_KEYS = politicalParties.map((party) => party.id);

const clampScore = (value: unknown) => {
  const score = Number(value);

  if (!Number.isFinite(score)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(score)));
};

const inferPartyScores = (politicalParty: string | null) => {
  const normalizedParty = String(politicalParty || "").toLowerCase();

  if (normalizedParty.includes("ардчилсан") || normalizedParty.includes("democratic")) {
    return {
      democratic_party: 80,
      neutral: 20,
      peoples_party: 0,
    };
  }

  if (
    normalizedParty.includes("монгол ардын") ||
    normalizedParty.includes("ман") ||
    normalizedParty.includes("people")
  ) {
    return {
      democratic_party: 0,
      neutral: 20,
      peoples_party: 80,
    };
  }

  return defaultPartyScores;
};

const normalizePartyScores = (
  value: unknown,
  politicalParty: string | null,
) => {
  if (!value || typeof value !== "object") {
    return inferPartyScores(politicalParty);
  }

  const rawScores = value as Record<string, unknown>;

  return {
    democratic_party: clampScore(rawScores.democratic_party),
    neutral: clampScore(rawScores.neutral),
    peoples_party: clampScore(rawScores.peoples_party),
  };
};

const normalizePublishRange = (value: string | null) => {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const start = new Date(`${trimmed}T00:00:00.000Z`);

  if (Number.isNaN(start.getTime())) {
    return null;
  }

  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  return { start, end };
};

const normalizeSearch = (value: string | null) => {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed || null;
};

const normalizePoliticalPartyFilter = (value: string | null) => {
  const partyId = String(value || "").trim();

  return PARTY_SCORE_KEYS.includes(partyId) ? partyId : null;
};

const escapeRegex = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const getCategoryFilterIds = async (
  categoryIds: string[],
  categoryNames: string[],
) => {
  if (categoryIds.length === 0 && categoryNames.length === 0) {
    return [];
  }

  const filters = [];

  if (categoryIds.length > 0) {
    filters.push({ _id: { $in: categoryIds } });
  }

  if (categoryNames.length > 0) {
    filters.push({ name: { $in: categoryNames } });
  }

  const categories = await Category.find({ $or: filters }).select("_id").lean();

  return categories.map((category) => category._id);
};

export async function POST(request: Request) {
  try {
    await connectDB();

    const user = await getCurrentUser();

    if (!isAdmin(user)) {
      return NextResponse.json(
        { success: false, error: "Only admins can create news" },
        { status: 403 },
      );
    }

    const {
      news,
      status,
      categories,
      recommended,
      title,
      thumbnail,
      politicalParty,
      partyScores,
    } = await request.json();
    const safeTitle = String(title || "").trim();
    const safeCategories = normalizeCategories(categories);
    const safeNews = normalizeNews(news);
    const safePoliticalParty = String(politicalParty || "").trim() || null;
    const safePartyScores = normalizePartyScores(partyScores, safePoliticalParty);

    if (!safeTitle) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 },
      );
    }

    if (safeNews.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one content block is required" },
        { status: 400 },
      );
    }

    const categoryRows = await Promise.all(
      safeCategories.map((name) =>
        Category.findOneAndUpdate(
          { name },
          { $setOnInsert: { name } },
          { new: true, upsert: true, setDefaultsOnInsert: true },
        ),
      ),
    );

    const createdNews = await News.create({
      news: safeNews,
      status: Boolean(status),
      recommended: Boolean(recommended),
      title: safeTitle,
      thumbnail: thumbnail || null,
      political_party: safePoliticalParty,
      party_scores: safePartyScores,
      author_id: user.id,
      categories: categoryRows.map((category) => category._id),
    });

    return NextResponse.json({
      success: true,
      data: { id: createdNews._id.toString() },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        success: false,
        error: e instanceof Error ? e.message : "Failed to create news",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();

    const user = await getCurrentUser();
    const admin = isAdmin(user);
    const { searchParams } = new URL(request.url);
    const publishRange = normalizePublishRange(searchParams.get("publish-date"));
    const categoryIds = normalizeCategoryIds(searchParams.get("category"));
    const categoryNames = normalizeCategoryNames(searchParams.get("category-name"));
    const search = normalizeSearch(searchParams.get("q"));
    const politicalPartyFilter = normalizePoliticalPartyFilter(
      searchParams.get("political-party"),
    );
    const filter: Record<string, any> = {};

    if (!admin) {
      filter.status = true;
    }

    if (publishRange) {
      filter.created_at = {
        $gte: publishRange.start,
        $lt: publishRange.end,
      };
    }

    if (search) {
      const searchRegex = new RegExp(escapeRegex(search), "i");

      filter.$or = [
        { title: searchRegex },
        { political_party: searchRegex },
        { "news.value": searchRegex },
        { "news.src": searchRegex },
      ];
    }

    if (politicalPartyFilter) {
      filter[`party_scores.${politicalPartyFilter}`] = { $gte: 50 };
    }

    if (categoryIds.length > 0 || categoryNames.length > 0) {
      const filterCategoryIds = await getCategoryFilterIds(
        categoryIds,
        categoryNames,
      );

      if (filterCategoryIds.length === 0) {
        return NextResponse.json({ success: true, data: [] });
      }

      filter.categories = { $in: filterCategoryIds };
    }

    const news = await News.find(filter)
      .sort({ created_at: -1 })
      .populate("author_id", "name email")
      .populate("categories", "name")
      .lean();

    return NextResponse.json({
      success: true,
      data: news.map(serializeNews),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        success: false,
        error: e instanceof Error ? e.message : "Failed to fetch news",
      },
      { status: 500 },
    );
  }
}
