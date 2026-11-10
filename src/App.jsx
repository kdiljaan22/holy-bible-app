
import { useEffect, useState } from "react";
import "./App.css";
import { getBooks, getChapter } from "./bibleApi";

const languages = {
  English: {
    greeting: "Welcome to the Word",
    subtitle: "Grow in faith every day",
    daily: "VERSE OF THE DAY",
    read: "Start Reading",
    old: "OLD TESTAMENT",
    new: "NEW TESTAMENT",
    continue: "Continue Reading",
    books: "Explore the Bible",
    bookmark: "Bookmarks",
    plans: "Reading Plans",
    prayer: "Prayer & Reflection",
    note: "Loading today's verse...",
  },
  Hindi: {
    greeting: "परमेश्वर के वचन में आपका स्वागत है",
    subtitle: "हर दिन विश्वास में बढ़ें",
    daily: "आज का वचन",
    read: "पढ़ना शुरू करें",
    old: "पुराना नियम",
    new: "नया नियम",
    continue: "पढ़ना जारी रखें",
    books: "बाइबल पढ़ें",
    bookmark: "बुकमार्क",
    plans: "बाइबल अध्ययन योजनाएँ",
    prayer: "प्रार्थना और मनन",
    note: "आज का वचन लोड हो रहा है...",
  },
  Odia: {
    greeting: "ପରମେଶ୍ୱରଙ୍କ ବାକ୍ୟକୁ ସ୍ୱାଗତ",
    subtitle: "ପ୍ରତିଦିନ ବିଶ୍ୱାସରେ ବଢ଼ନ୍ତୁ",
    daily: "ଆଜିର ବାକ୍ୟ",
    read: "ପଢ଼ିବା ଆରମ୍ଭ କରନ୍ତୁ",
    old: "ପୁରାତନ ନିୟମ",
    new: "ନୂତନ ନିୟମ",
    continue: "ପଢ଼ିବା ଜାରି ରଖନ୍ତୁ",
    books: "ବାଇବଲ ପଢ଼ନ୍ତୁ",
    bookmark: "ବୁକମାର୍କ",
    plans: "ବାଇବଲ ପଠନ ଯୋଜନା",
    prayer: "ପ୍ରାର୍ଥନା ଓ ଧ୍ୟାନ",
    note: "ଆଜିର ବାକ୍ୟ ଲୋଡ୍ ହେଉଛି...",
  },
};

export default function App() {
  const [language, setLanguage] = useState("English");
  const [testament, setTestament] = useState("Old");
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [chapterNumber, setChapterNumber] = useState(1);
  const [chapterData, setChapterData] = useState(null);
  const [dailyVerse, setDailyVerse] = useState("");
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [loadingChapter, setLoadingChapter] = useState(false);
  const [readerError, setReaderError] = useState("");
  const [activeTab, setActiveTab] = useState("Home");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechUtterance, setSpeechUtterance] = useState(null);
  const [prayers, setPrayers] = useState(() => {
  return JSON.parse(localStorage.getItem("biblePrayers") || "[]");
});

const [prayerText, setPrayerText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [completedDays, setCompletedDays] = useState(() => {
  return JSON.parse(localStorage.getItem("bibleReadingProgress") || "[]");
});
  const [bookmarks, setBookmarks] = useState(() => {
  return JSON.parse(localStorage.getItem("bibleBookmarks") || "[]");
});

  const t = languages[language];
  const readingPlan = [
  { day: 1, title: "The Beginning", reference: "Genesis 1" },
  { day: 2, title: "God's Creation", reference: "Genesis 2" },
  { day: 3, title: "The Fall of Man", reference: "Genesis 3" },
  { day: 4, title: "Noah's Faith", reference: "Genesis 6" },
  { day: 5, title: "God's Promise", reference: "Genesis 12" },
  { day: 6, title: "The Power of Faith", reference: "Hebrews 11" },
  { day: 7, title: "God's Love", reference: "John 3" },
];
  const currentBook = books.find(
    (book) => book.slug.en === selectedBook
  );

  // Load all books for the selected testament.
  useEffect(() => {
    let cancelled = false;

    async function loadBooks() {
      setLoadingBooks(true);

      try {
        const result = await getBooks(testament.toLowerCase());
        if (!cancelled) setBooks(result);
      } catch (error) {
        if (!cancelled) setReaderError(error.message);
      } finally {
        if (!cancelled) setLoadingBooks(false);
      }
    }

    loadBooks();

    return () => {
      cancelled = true;
    };
  }, [testament]);

  // Load the selected chapter in the chosen language.
  useEffect(() => {
    if (activeTab !== "Bible" || !selectedBook) return;

    let cancelled = false;

    async function loadChapter() {
      setLoadingChapter(true);
      setReaderError("");
      setChapterData(null);

      try {
        const result = await getChapter(
          selectedBook,
          chapterNumber,
          language
        );

        if (!cancelled) setChapterData(result);
      } catch (error) {
        if (!cancelled) setReaderError(error.message);
      } finally {
        if (!cancelled) setLoadingChapter(false);
      }
    }

    loadChapter();

    return () => {
      cancelled = true;
    };
  }, [activeTab, selectedBook, chapterNumber, language]);

  // Load the real John 3:16 verse in the selected language.
  useEffect(() => {
    let cancelled = false;

    async function loadDailyVerse() {
      setDailyVerse("");

      try {
        const result = await getChapter("john", 3, language);
        if (!cancelled) setDailyVerse(result.verses[15]);
      } catch {
        if (!cancelled) setDailyVerse("");
      }
    }

    loadDailyVerse();

    return () => {
      cancelled = true;
    };
  }, [language]);

  function openBook(slug) {
    setSelectedBook(slug);
    setChapterNumber(1);
    setActiveTab("Bible");
  }

  function changeTestament(value) {
    setTestament(value);
    setSelectedBook("");
    setChapterData(null);
  }
async function shareVerse(verse, index) {
  const reference = `${currentBook?.name.en || selectedBook} ${chapterNumber}:${index + 1}`;
  const message = `${verse}\n\n— ${reference} (${language})`;

  if (navigator.share) {
    try {
      await navigator.share({ text: message });
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Sharing failed:", error);
      }
    }
  } else {
    await navigator.clipboard.writeText(message);
    alert("Verse copied to clipboard!");
  }
}
function readChapterAloud() {
  if (!chapterData?.verses?.length) return;

  window.speechSynthesis.cancel();

 const text = chapterData.verses.join(". ");

  const utterance = new SpeechSynthesisUtterance(text);

  const languageCodes = {
    English: "en-US",
    Hindi: "hi-IN",
    Odia: "or-IN",
  };

  utterance.lang = languageCodes[language];
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find((voice) =>
    voice.lang.toLowerCase().startsWith(
      language === "Hindi" ? "hi" : language === "Odia" ? "or" : "en"
    )
  );

  if (preferredVoice) utterance.voice = preferredVoice;

  utterance.onstart = () => setIsSpeaking(true);
  utterance.onend = () => setIsSpeaking(false);
  utterance.onerror = () => setIsSpeaking(false);

  setSpeechUtterance(utterance);
  window.speechSynthesis.speak(utterance);
}

function toggleBookmark(index, verse) {
  const key = `${selectedBook}-${chapterNumber}-${index + 1}-${language}`;
  const exists = bookmarks.some((item) => item.key === key);

  const updated = exists
    ? bookmarks.filter((item) => item.key !== key)
    : [...bookmarks, {
        key,
        book: currentBook?.name.en || selectedBook,
        chapter: chapterNumber,
        verseNumber: index + 1,
        text: verse,
        language,
      }];

  setBookmarks(updated);
  localStorage.setItem("bibleBookmarks", JSON.stringify(updated));
}
function handleSearch() {
  const query = searchQuery.trim().toLowerCase();

  if (!query || !chapterData?.verses) {
    setSearchResults([]);
    return;
  }
  function toggleReadingDay(day) {
  const updated = completedDays.includes(day)
    ? completedDays.filter((item) => item !== day)
    : [...completedDays, day];

  setCompletedDays(updated);

  localStorage.setItem(
    "bibleReadingProgress",
    JSON.stringify(updated)
  );
}

  setSearching(true);

  const results = chapterData.verses
    .map((text, index) => ({
      verseNumber: index + 1,
      text,
    }))
    .filter((item) => item.text.toLowerCase().includes(query));

  setSearchResults(results);
  setSearching(false);
}
function savePrayer() {
  if (!prayerText.trim()) return;

  const updated = [
    ...prayers,
    {
      id: Date.now(),
      text: prayerText.trim(),
      date: new Date().toLocaleDateString(),
      answered: false,
    },
  ];

  setPrayers(updated);
  localStorage.setItem("biblePrayers", JSON.stringify(updated));
  setPrayerText("");
}
function toggleReadingDay(day) {
  const updated = completedDays.includes(day)
    ? completedDays.filter((item) => item !== day)
    : [...completedDays, day];

  setCompletedDays(updated);

  localStorage.setItem(
    "bibleReadingProgress",
    JSON.stringify(updated)
  );
}
  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="cross">✝</div>
          <div>
            <h2>HOLY BIBLE</h2>
            <span>FAITH • HOPE • LOVE</span>
          </div>
        </div>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          aria-label="Select Bible language"
        >
          <option value="English">English</option>
          <option value="Hindi">हिंदी</option>
          <option value="Odia">ଓଡ଼ିଆ</option>
        </select>
      </header>

      <main>
        <section className="welcome">
          <div className="welcome-text">
            <span className="eyebrow">✦ YOUR DAILY FAITH JOURNEY</span>
            <h1>{t.greeting}</h1>
            <p>{t.subtitle}</p>
            <button onClick={() => openBook("genesis")}>
              {t.read} →
            </button>
          </div>
          <div className="welcome-cross">✝</div>
        </section>

        <section className="daily">
          <span className="eyebrow">{t.daily}</span>
          <div className="gold-line"></div>
          <div className="quote">
            “{dailyVerse || t.note}”
          </div>
          <p className="reference">
            {language === "Hindi"
              ? "यूहन्ना 3:16"
              : language === "Odia"
              ? "ଯୋହନ ୩:୧୬"
              : "John 3:16"}
          </p>
          <div className="daily-bottom">
            <span>✧ &nbsp; WORD OF GOD</span>
            <span>✝</span>
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">DISCOVER SCRIPTURE</span>
              <h2>{t.books}</h2>
            </div>
          </div>

          <div className="testament">
            <button
              className={testament === "Old" ? "active" : ""}
              onClick={() => changeTestament("Old")}
            >
              {t.old}
            </button>

            <button
              className={testament === "New" ? "active" : ""}
              onClick={() => changeTestament("New")}
            >
              {t.new}
            </button>
          </div>

          {loadingBooks ? (
            <p>Loading Bible books...</p>
          ) : (
            <div className="book-grid">
              {books.map((book, index) => (
                <button
                  className={`book ${
                    selectedBook === book.slug.en ? "selected" : ""
                  }`}
                  key={book.id}
                  onClick={() => openBook(book.slug.en)}
                >
                  <span className="book-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {book.name.en}
                  <span className="book-arrow">→</span>
                </button>
              ))}
            </div>
          )}

          {currentBook && (
            <div className="selection">
              <span>SELECTED BOOK</span>
              <h3>{currentBook.name.en}</h3>
              <p>{currentBook.chapters} chapters</p>
              <button onClick={() => openBook(currentBook.slug.en)}>
                Open Book →
              </button>
            </div>
          )}
        </section>

        <section className="section">
          <span className="eyebrow">YOUR SPIRITUAL GROWTH</span>
          <h2>{t.continue}</h2>

          <div className="feature-grid">
            <button onClick={() => setActiveTab("Bookmarks")}>
              <span>♡</span>
              <strong>{t.bookmark}</strong>
              <small>Save favourite verses</small>
            </button>

            <button onClick={() => setActiveTab("Plans")}>
              <span>◷</span>
              <strong>{t.plans}</strong>
              <small>Build a daily habit</small>
            </button>

            <button onClick={() => setActiveTab("Prayer")}>
              <span>✧</span>
              <strong>{t.prayer}</strong>
              <small>Spend time with God</small>
            </button>
          </div>
        </section>
      </main>

      {activeTab === "Bible" && (
        <section className="section reader">
          <span className="eyebrow">HOLY SCRIPTURE</span>
          <h2>
            {currentBook ? currentBook.name.en : "Bible Reader"}
          </h2>

          {!selectedBook && (
            <p>Select a Bible book above to begin reading.</p>
          )}

          {currentBook && (
            <>
              <label htmlFor="chapter-select">Select chapter</label>
              <select
                id="chapter-select"
                value={chapterNumber}
                onChange={(e) => setChapterNumber(Number(e.target.value))}
              >
                {Array.from(
                  { length: currentBook.chapters },
                  (_, index) => index + 1
                ).map((number) => (
                  <option key={number} value={number}>
                    Chapter {number}
                  </option>
                ))}
              </select>

              <h3>
                {currentBook.name.en} {chapterNumber}
              </h3>
              <div className="audio-controls">
  <button
    type="button"
    onClick={readChapterAloud}
    disabled={!chapterData?.verses?.length}
  >
    ▶ Listen to Chapter
  </button>

  <button
    type="button"
    onClick={() => {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }}
    disabled={!isSpeaking}
  >
    ■ Stop
  </button>

  {isSpeaking && <span>Playing audio...</span>}
</div>
              <div className="bible-search">
  <input
    type="text"
    placeholder="Search this chapter..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />

  <button onClick={handleSearch}>
    Search
  </button>
  <button
  onClick={() => {
    setSearchQuery("");
    setSearchResults([]);
  }}
>
  Clear
</button>
</div>

              {loadingChapter && <p>Loading scripture...</p>}

              {readerError && (
                <p className="reader-error">{readerError}</p>
              )}

              {chapterData && (
                <div className="verse-list">
  {chapterData.verses.map((verse, index) => {
    const key = `${selectedBook}-${chapterNumber}-${index + 1}-${language}`;
    const saved = bookmarks.some((item) => item.key === key);

    return (
      <div className="verse-row" key={index}>
        <p className="verse">
          <strong>{index + 1}</strong> {verse}
        </p>

        <button onClick={() => toggleBookmark(index, verse)}>
          {saved ? "♥ Saved" : "♡ Save"}
        </button>
        <button
  type="button"
  onClick={() => shareVerse(verse, index)}
>
  ↗ Share
</button>
      </div>
    );
  })}
</div>
              )}
              {searchResults.length > 0 && (
  <div className="section">
    <h3>Search Results ({searchResults.length})</h3>

    {searchResults.map((item) => (
      <p className="verse" key={item.verseNumber}>
        <strong>{item.verseNumber}</strong> {item.text}
      </p>
    ))}
  </div>
)}

{searching && <p>Searching...</p>}

{searchQuery.trim() && searchResults.length === 0 && !searching && (
  <p>No matching verses found.</p>
)}

              <div className="chapter-navigation">
                <button
                  disabled={chapterNumber <= 1}
                  onClick={() => setChapterNumber((n) => n - 1)}
                >
                  ← Previous
                </button>

                <button
                  disabled={chapterNumber >= currentBook.chapters}
                  onClick={() => setChapterNumber((n) => n + 1)}
                >
                  Next →
                </button>
              </div>
            </>
          )}
        </section>
      )}
      {activeTab === "Bookmarks" && (
  <section className="section">
    <span className="eyebrow">YOUR SAVED SCRIPTURE</span>
    <h2>{t.bookmark}</h2>

    {bookmarks.length === 0 ? (
      <p>No saved verses yet. Open a Bible chapter and tap ♡ Save.</p>
    ) : (
      <div className="verse-list">
        {bookmarks.map((item) => (
          <div className="verse-row" key={item.key}>
            <div>
              <p className="verse">
                <strong>{item.book} {item.chapter}:{item.verseNumber}</strong>
              </p>
              <p>{item.text}</p>
              <small>{item.language}</small>
            </div>

            <button
              onClick={() => {
                const updated = bookmarks.filter(
                  (bookmark) => bookmark.key !== item.key
                );
                setBookmarks(updated);
                localStorage.setItem(
                  "bibleBookmarks",
                  JSON.stringify(updated)
                );
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    )}
  </section>
)}
{activeTab === "Plans" && (
  <section className="section">
    <span className="eyebrow">GROW IN FAITH</span>
    <h2>7-Day Bible Reading Plan</h2>

    <p>
      Your progress: {completedDays.length} of 7 days completed
    </p>

    <div className="verse-list">
      {readingPlan.map((item) => (
        <div className="verse-row" key={item.day}>
          <div>
            <strong>Day {item.day}: {item.title}</strong>
            <p>{item.reference}</p>
          </div>

         <button
  type="button"
  onClick={() => toggleReadingDay(item.day)}
>
  {completedDays.includes(item.day)
    ? "✓ Completed"
    : "Mark Done"}
</button>
        </div>
      ))}
    </div>
  </section>
)}
 {activeTab === "Prayer" && (
  <section className="section">
    <span className="eyebrow">YOUR PERSONAL PRAYER SPACE</span>
    <h2>Prayer Journal</h2>

    <p>Write down your prayers and keep track of them.</p>

    <textarea
      placeholder="Write your prayer here..."
      value={prayerText}
      onChange={(e) => setPrayerText(e.target.value)}
      rows={5}
    />

    <button type="button" onClick={savePrayer}>
      Save Prayer
    </button>

    <h3>Your Prayers ({prayers.length})</h3>

    {prayers.length === 0 ? (
      <p>No prayers saved yet.</p>
    ) : (
      prayers.map((prayer) => (
        <div className="verse-row" key={prayer.id}>
          <div>
            <p>{prayer.text}</p>
            <small>{prayer.date}</small>
            <p>{prayer.answered ? "✓ Answered" : "In Prayer"}</p>
          </div>

          <button
            type="button"
            onClick={() => {
              const updated = prayers.map((item) =>
                item.id === prayer.id
                  ? { ...item, answered: !item.answered }
                  : item
              );
              setPrayers(updated);
              localStorage.setItem("biblePrayers", JSON.stringify(updated));
            }}
          >
            {prayer.answered ? "Undo" : "Answered"}
          </button>

          <button
            type="button"
            onClick={() => {
              const updated = prayers.filter(
                (item) => item.id !== prayer.id
              );
              setPrayers(updated);
              localStorage.setItem("biblePrayers", JSON.stringify(updated));
            }}
          >
            Delete
          </button>
        </div>
      ))
    )}
  </section>
)}     
      
      <nav className="bottom-nav">
        {["Home", "Bible", "Bookmarks", "Plans"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "nav-active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            <span>
              {tab === "Home" ? "⌂" :
               tab === "Bible" ? "▤" :
               tab === "Bookmarks" ? "♡" : "◷"}
            </span>
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
}
