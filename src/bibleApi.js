
export const BIBLE_VERSIONS = {
  English: "web",
  Hindi: "irv-hi",
  Odia: "irv-or",
};

// Cache loaded book files in memory.
const loadedBooks = new Map();

async function loadLocalBook(book, language) {
  const version = BIBLE_VERSIONS[language];

  if (!version) {
    throw new Error("Unsupported Bible language");
  }

  const key = `${version}:${book}`;

  if (!loadedBooks.has(key)) {
    const promise = fetch(`/bible-data/${version}/${book}.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Could not load ${book}: ${response.status}`);
        }

        return response.json();
      });

    loadedBooks.set(key, promise);
  }

  return loadedBooks.get(key);
}

// Load the complete 66-book catalogue locally.
export async function getBooks(testament = "old") {
  const response = await fetch("/bible-data/books.json");

  if (!response.ok) {
    throw new Error("Could not load the offline Bible book catalogue");
  }

  const books = await response.json();

  return books.filter(
    (book) => book.testament === testament.toLowerCase()
  );
}

// Read a chapter directly from the local Bible files.
export async function getChapter(book, chapter, language) {
  const data = await loadLocalBook(book, language);
  const savedChapter = data.chapters[String(chapter)];

  if (!savedChapter) {
    throw new Error(`Chapter ${chapter} not found in ${book}`);
  }

  return savedChapter;
}

// Compatibility with the existing download button.
// The complete book is already included in the installed app.
export async function downloadBook(book, language, onProgress) {
  const data = await loadLocalBook(book.slug.en, language);
  const total = book.chapters;

  if (onProgress) {
    onProgress({
      completed: total,
      total,
      book: book.name.en,
    });
  }

  return {
    completed: Object.keys(data.chapters).length,
    total,
  };
}
