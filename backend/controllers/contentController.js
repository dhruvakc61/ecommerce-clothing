const VOGUE_RSS_URL = "https://www.vogue.co.uk/feed/rss";
const CACHE_TTL_MS = 15 * 60 * 1000;

let vogueCache = {
  expiresAt: 0,
  articles: [],
};

function decodeXmlEntities(value = "") {
  return String(value)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, "-")
    .replace(/&#8212;/g, "-")
    .replace(/&#8230;/g, "...")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .trim();
}

function stripTags(value = "") {
  return decodeXmlEntities(String(value).replace(/<[^>]+>/g, " "));
}

function getTagValue(block, tagName) {
  const match = block.match(new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  return match ? match[1].trim() : "";
}

function getThumbnailUrl(block) {
  const match = block.match(/<media:thumbnail[^>]*url="([^"]+)"/i);
  return match ? match[1].trim() : "";
}

function parseVogueFeed(xml = "") {
  const items = [...String(xml).matchAll(/<item>([\s\S]*?)<\/item>/gi)];

  return items
    .map(([, rawItem]) => {
      const title = decodeXmlEntities(getTagValue(rawItem, "title"));
      const link = decodeXmlEntities(getTagValue(rawItem, "link"));
      const description = stripTags(getTagValue(rawItem, "description"));
      const author = decodeXmlEntities(getTagValue(rawItem, "dc:creator"));
      const publishedAt = decodeXmlEntities(getTagValue(rawItem, "pubDate"));
      const image = decodeXmlEntities(getThumbnailUrl(rawItem));
      const category = decodeXmlEntities(getTagValue(rawItem, "dc:subject") || getTagValue(rawItem, "category"));

      return {
        title,
        link,
        description,
        author,
        publishedAt,
        image,
        category,
        source: "British Vogue",
      };
    })
    .filter((item) => item.title && item.link);
}

async function fetchVogueArticles() {
  const now = Date.now();
  if (vogueCache.articles.length > 0 && vogueCache.expiresAt > now) {
    return vogueCache.articles;
  }

  const response = await fetch(VOGUE_RSS_URL, {
    headers: {
      "User-Agent": "BayaStore/1.0 (+https://www.vogue.co.uk/feed/rss)",
      Accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Vogue feed (${response.status})`);
  }

  const xml = await response.text();
  const articles = parseVogueFeed(xml);

  vogueCache = {
    expiresAt: now + CACHE_TTL_MS,
    articles,
  };

  return articles;
}

export const getVogueArticles = async (req, res) => {
  try {
    const requestedLimit = Number.parseInt(req.query.limit, 10);
    const limit = Number.isFinite(requestedLimit)
      ? Math.min(Math.max(requestedLimit, 1), 12)
      : 3;

    const articles = await fetchVogueArticles();

    res.json({
      source: "British Vogue",
      sourceUrl: "https://www.vogue.co.uk/",
      feedUrl: VOGUE_RSS_URL,
      articles: articles.slice(0, limit),
    });
  } catch (error) {
    res.status(502).json({
      message: "Unable to load Vogue articles right now.",
      detail: error.message,
    });
  }
};
