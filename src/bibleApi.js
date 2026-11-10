const API_BASE = "https://api.midvash.com/v1";

export const BIBLE_VERSIONS = {
  English: "web",
  Hindi: "irv-hi",
  Odia: "irv-or",
};

async function request(endpoint) {
  const response = await fetch(`${API_BASE}${endpoint}`);

  if (!response.ok) {
    throw new Error(`Bible API error: ${response.status}`);
  }

  return response.json();
}

export async function getBooks(testament = "old") {
  const result = await request(
    `/books?testament=${testament}`
  );

  return result.data;
}

export async function getChapter(book, chapter, language) {
  const version = BIBLE_VERSIONS[language];

  if (!version) {
    throw new Error("Unsupported Bible language");
  }

  const cacheKey = `bibleChapter:${version}:${book}:${chapter}`;

  // Check for a previously saved chapter
  const savedChapter = localStorage.getItem(cacheKey);

  // Use saved chapter immediately when offline
  if (!navigator.onLine && savedChapter) {
    return JSON.parse(savedChapter);
  }

  try {
    const result = await request(
      `/${version}/${book}/${chapter}`
    );

    // Save chapter for future offline reading
    localStorage.setItem(
      cacheKey,
      JSON.stringify(result.data)
    );

    return result.data;
  } catch (error) {
    // Fall back to saved chapter if the network fails
    if (savedChapter) {
      return JSON.parse(savedChapter);
    }

    throw error;
  }
}