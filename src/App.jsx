
import { useEffect, useState, useRef } from "react";
import "./App.css";
import {
  getBooks,
  getChapter,
  downloadBook,
} from "./bibleApi";

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


// Localized display names for all 66 Bible books.
const BOOK_NAMES = {
  "genesis": { Hindi: "उत्पत्ति", Odia: "ଆଦିପୁସ୍ତକ" },
  "exodus": { Hindi: "निर्गमन", Odia: "ଯାତ୍ରାପୁସ୍ତକ" },
  "leviticus": { Hindi: "लैव्यव्यवस्था", Odia: "ଲେବୀୟ ପୁସ୍ତକ" },
  "numbers": { Hindi: "गिनती", Odia: "ଗଣନା ପୁସ୍ତକ" },
  "deuteronomy": { Hindi: "व्यवस्थाविवरण", Odia: "ଦ୍ୱିତୀୟ ବିବରଣ" },
  "joshua": { Hindi: "यहोशू", Odia: "ଯିହୋଶୂୟ" },
  "judges": { Hindi: "न्यायियों", Odia: "ବିଚାରକର୍ତ୍ତା" },
  "ruth": { Hindi: "रूत", Odia: "ରୂତ" },
  "1-samuel": { Hindi: "1 शमूएल", Odia: "1 ଶାମୁୟେଲ" },
  "2-samuel": { Hindi: "2 शमूएल", Odia: "2 ଶାମୁୟେଲ" },
  "1-kings": { Hindi: "1 राजा", Odia: "1 ରାଜାବଳୀ" },
  "2-kings": { Hindi: "2 राजा", Odia: "2 ରାଜାବଳୀ" },
  "1-chronicles": { Hindi: "1 इतिहास", Odia: "1 ବଂଶାବଳୀ" },
  "2-chronicles": { Hindi: "2 इतिहास", Odia: "2 ବଂଶାବଳୀ" },
  "ezra": { Hindi: "एज्रा", Odia: "ଏଜ୍ରା" },
  "nehemiah": { Hindi: "नहेमायाह", Odia: "ନିହିମିୟା" },
  "esther": { Hindi: "एस्तेर", Odia: "ଏଷ୍ଟର" },
  "job": { Hindi: "अय्यूब", Odia: "ଆୟୁବ" },
  "psalms": { Hindi: "भजन संहिता", Odia: "ଗୀତସଂହିତା" },
  "proverbs": { Hindi: "नीतिवचन", Odia: "ହିତୋପଦେଶ" },
  "ecclesiastes": { Hindi: "सभोपदेशक", Odia: "ଉପଦେଶକ" },
  "song-of-solomon": { Hindi: "श्रेष्ठगीत", Odia: "ପରମଗୀତ" },
  "isaiah": { Hindi: "यशायाह", Odia: "ଯିଶାଇୟ" },
  "jeremiah": { Hindi: "यिर्मयाह", Odia: "ଯିରିମିୟ" },
  "lamentations": { Hindi: "विलापगीत", Odia: "ବିଳାପ" },
  "ezekiel": { Hindi: "यहेजकेल", Odia: "ଯିହିଜିକଲ" },
  "daniel": { Hindi: "दानिय्येल", Odia: "ଦାନିୟେଲ" },
  "hosea": { Hindi: "होशे", Odia: "ହୋଶେୟ" },
  "joel": { Hindi: "योएल", Odia: "ଯୋୟେଲ" },
  "amos": { Hindi: "आमोस", Odia: "ଆମୋଷ" },
  "obadiah": { Hindi: "ओबद्याह", Odia: "ଓବଦିୟ" },
  "jonah": { Hindi: "योना", Odia: "ଯୁନସ" },
  "micah": { Hindi: "मीका", Odia: "ମୀଖା" },
  "nahum": { Hindi: "नहूम", Odia: "ନାହୂମ" },
  "habakkuk": { Hindi: "हबक्कूक", Odia: "ହବକ୍କୂକ" },
  "zephaniah": { Hindi: "सपन्याह", Odia: "ସିଫନିୟ" },
  "haggai": { Hindi: "हाग्गै", Odia: "ହାଗୟ" },
  "zechariah": { Hindi: "जकर्याह", Odia: "ଜଖରିୟ" },
  "malachi": { Hindi: "मलाकी", Odia: "ମଲାଖି" },
  "matthew": { Hindi: "मत्ती", Odia: "ମାଥିଉ" },
  "mark": { Hindi: "मरकुस", Odia: "ମାର୍କ" },
  "luke": { Hindi: "लूका", Odia: "ଲୂକ" },
  "john": { Hindi: "यूहन्ना", Odia: "ଯୋହନ" },
  "acts": { Hindi: "प्रेरितों के काम", Odia: "ପ୍ରେରିତମାନଙ୍କ କାର୍ଯ୍ୟ" },
  "romans": { Hindi: "रोमियों", Odia: "ରୋମୀୟ" },
  "1-corinthians": { Hindi: "1 कुरिन्थियों", Odia: "1 କରିନ୍ଥୀୟ" },
  "2-corinthians": { Hindi: "2 कुरिन्थियों", Odia: "2 କରିନ୍ଥୀୟ" },
  "galatians": { Hindi: "गलातियों", Odia: "ଗାଲାତୀୟ" },
  "ephesians": { Hindi: "इफिसियों", Odia: "ଏଫିସୀୟ" },
  "philippians": { Hindi: "फिलिप्पियों", Odia: "ଫିଲିପ୍ପୀୟ" },
  "colossians": { Hindi: "कुलुस्सियों", Odia: "କଲସୀୟ" },
  "1-thessalonians": { Hindi: "1 थिस्सलुनीकियों", Odia: "1 ଥେସଲନୀକୀୟ" },
  "2-thessalonians": { Hindi: "2 थिस्सलुनीकियों", Odia: "2 ଥେସଲନୀକୀୟ" },
  "1-timothy": { Hindi: "1 तीमुथियुस", Odia: "1 ତୀମଥି" },
  "2-timothy": { Hindi: "2 तीमुथियुस", Odia: "2 ତୀମଥି" },
  "titus": { Hindi: "तीतुस", Odia: "ତୀତସ" },
  "philemon": { Hindi: "फिलेमोन", Odia: "ଫିଲୀମୋନ" },
  "hebrews": { Hindi: "इब्रानियों", Odia: "ଏବ୍ରୀ" },
  "james": { Hindi: "याकूब", Odia: "ଯାକୁବ" },
  "1-peter": { Hindi: "1 पतरस", Odia: "1 ପିତର" },
  "2-peter": { Hindi: "2 पतरस", Odia: "2 ପିତର" },
  "1-john": { Hindi: "1 यूहन्ना", Odia: "1 ଯୋହନ" },
  "2-john": { Hindi: "2 यूहन्ना", Odia: "2 ଯୋହନ" },
  "3-john": { Hindi: "3 यूहन्ना", Odia: "3 ଯୋହନ" },
  "jude": { Hindi: "यहूदा", Odia: "ଯିହୂଦା" },
  "revelation": { Hindi: "प्रकाशितवाक्य", Odia: "ପ୍ରକାଶିତ ବାକ୍ୟ" },
};

function getBookDisplayName(book, language) {
  if (!book) return "";
  if (language === "English") return book.name.en;

  const normalize = (value) =>
    String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const key = normalize(book.slug?.en) || normalize(book.name?.en);
  const localizedName =
    BOOK_NAMES[key]?.[language] ||
    BOOK_NAMES[normalize(book.name?.en)]?.[language];

  return localizedName || book.name.en;
}

export default function App() {
  const [language, setLanguage] = useState("English");
  const [testament, setTestament] = useState("Old");
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [chapterNumber, setChapterNumber] = useState(1);
  const [chapterData, setChapterData] = useState(null);
  const [chapterTranslations, setChapterTranslations] = useState({
  English: null,
  Odia: null,
  Hindi: null,
});

 const [selectedVerse, setSelectedVerse] = useState(1);
const verseRefs = useRef({});
const shouldScrollToVerse = useRef(false);

useEffect(() => {
  if (!shouldScrollToVerse.current) return;

  const selectedElement = verseRefs.current[selectedVerse];

  if (selectedElement) {
    selectedElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    shouldScrollToVerse.current = false;
  }
}, [selectedVerse, chapterTranslations]);
  const [dailyVerse, setDailyVerse] = useState("");
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [loadingChapter, setLoadingChapter] = useState(false);
  const [readerError, setReaderError] = useState("");
  const [activeTab, setActiveTab] = useState("Home");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechUtterance, setSpeechUtterance] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(null);
  const [prayers, setPrayers] = useState(() => {
  return JSON.parse(localStorage.getItem("biblePrayers") || "[]");
});

  const [prayerText, setPrayerText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [referenceInput, setReferenceInput] = useState("");
  const [pendingReference, setPendingReference] = useState(null);
  const [referenceError, setReferenceError] = useState("");
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

    setChapterTranslations({
      English: null,
      Odia: null,
      Hindi: null,
    });

    try {
      const [english, odia, hindi] = await Promise.all([
        getChapter(selectedBook, chapterNumber, "English"),
        getChapter(selectedBook, chapterNumber, "Odia"),
        getChapter(selectedBook, chapterNumber, "Hindi"),
      ]);

      if (!cancelled) {
        setChapterTranslations({
          English: english,
          Odia: odia,
          Hindi: hindi,
        });

        setChapterData(
          language === "English"
            ? english
            : language === "Odia"
            ? odia
            : hindi
        );

        if (
  pendingReference &&
  pendingReference.book === selectedBook &&
  pendingReference.chapter === chapterNumber
) {
  if (pendingReference.verse <= english.verses.length) {
    setSelectedVerse(pendingReference.verse);
  } else {
    setSelectedVerse(1);
    setReferenceError(
      `This chapter has only ${english.verses.length} verses.`
    );
  }

  setPendingReference(null);
} else {
  setSelectedVerse(1);
}
      }
    } catch (error) {
      if (!cancelled) {
        setReaderError(error.message);
      }
    } finally {
      if (!cancelled) {
        setLoadingChapter(false);
      }
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
  async function goToReference() {
  setReferenceError("");

  const match = referenceInput.trim().match(/^(.+?)\s+(\d+):(\d+)$/);

  if (!match) {
    setReferenceError("Enter a reference like John 3:16");
    return;
  }

  const [, bookName, chapterText, verseText] = match;

  const chapter = Number(chapterText);
  const verse = Number(verseText);

  try {
    const [oldBooks, newBooks] = await Promise.all([
      getBooks("old"),
      getBooks("new"),
    ]);

    const allBooks = [...oldBooks, ...newBooks];

    const normalizedName = bookName
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

    const book = allBooks.find(
      (item) =>
        item.name.en.toLowerCase().replace(/\s+/g, " ").trim() ===
        normalizedName
    ) || (
      normalizedName === "psalm"
        ? allBooks.find((item) => item.slug.en === "psalms")
        : null
    );

    if (!book) {
      setReferenceError("Bible book not found. Check the book name.");
      return;
    }

    if (
      chapter < 1 ||
      chapter > book.chapters ||
      verse < 1
    ) {
      setReferenceError("Invalid chapter or verse number.");
      return;
    }

    setPendingReference({
      book: book.slug.en,
      chapter,
      verse,
    });

    setTestament(book.testament === "old" ? "Old" : "New");
    setSelectedBook(book.slug.en);
    setChapterNumber(chapter);
    setActiveTab("Bible");
  } catch (error) {
    setReferenceError("Could not find the Bible reference.");
  }
}
async function shareVerse(verse, index) {
  const reference = `${getBookDisplayName(currentBook, language) || selectedBook} ${chapterNumber}:${index + 1}`;
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
        book: getBookDisplayName(currentBook, language) || selectedBook,
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
        {activeTab === "Home" && (
          <>
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
          </>
        )}

        {activeTab === "Bible" && (
        <section className="section reader">
          <div className="reader-top">
  <span className="eyebrow">YOUR BIBLE READER</span>
  <h2>Explore the Holy Bible</h2>
  <p>Select a testament, book, chapter and verse to begin reading.</p>
</div>
          <span className="eyebrow">HOLY SCRIPTURE</span>
          <div className="reference-search">
  <label htmlFor="reference-input">Go to Bible Reference</label>

  <div className="reference-search-controls">
    <input
      id="reference-input"
      type="text"
      value={referenceInput}
      onChange={(e) => setReferenceInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") goToReference();
      }}
      placeholder="Example: John 3:16"
    />

    <button type="button" onClick={goToReference}>
      Go to Verse
    </button>
  </div>

  {referenceError && (
    <p className="reference-error">{referenceError}</p>
  )}
</div>
          <div className="testament">
  <button
    type="button"
    className={testament === "Old" ? "active" : ""}
    onClick={() => changeTestament("Old")}
  >
    Old Testament
  </button>

  <button
    type="button"
    className={testament === "New" ? "active" : ""}
    onClick={() => changeTestament("New")}
  >
    New Testament
  </button>
</div>

<div className="bible-selectors">
  <div className="selector-group">
    <label htmlFor="book-select">Select Book</label>
    <select
      id="book-select"
      value={selectedBook}
      onChange={(e) => openBook(e.target.value)}
    >
      <option value="">Choose a Bible book</option>
      {books.map((book) => (
        <option key={book.id} value={book.slug.en}>
          {getBookDisplayName(book, language)}
        </option>
      ))}
    </select>
  </div>

  {currentBook && (
    <>
     <div className="selector-group">
  <label htmlFor="chapter-select">Select Chapter</label>
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
</div> 

      <div className="selector-group">
        <label htmlFor="verse-select">Select Verse</label>
        <select
          id="verse-select"
          value={selectedVerse}
          onChange={(e) => {
            shouldScrollToVerse.current = true;
            setSelectedVerse(Number(e.target.value));
          }}
          disabled={!chapterTranslations.English?.verses?.length}
        >
          {Array.from(
            { length: chapterTranslations.English?.verses?.length || 0 },
            (_, index) => index + 1
          ).map((number) => (
            <option key={number} value={number}>
              Verse {number}
            </option>
          ))}
        </select>
      </div>
    </>
  )}
</div>

 

{currentBook && (
  <div className="offline-download">
    
  </div>
)}

          <h2>
            {currentBook ? getBookDisplayName(currentBook, language) : "Bible Reader"}
          </h2>

          {!selectedBook && (
            <p>Select a Bible book above to begin reading.</p>
          )}

          {currentBook && (
            <>
              


<div className="verse-navigation">
  <button
    type="button"
    onClick={() => {
  shouldScrollToVerse.current = true;
  setSelectedVerse((previous) => previous - 1);
}}
    disabled={selectedVerse <= 1}
  >
    ← Previous Verse
  </button>

  <span>
    {selectedVerse} / {chapterTranslations.English?.verses?.length || 0}
  </span>

  <button
    type="button"
    onClick={() =>
      setSelectedVerse((previous) =>
        Math.min(
          previous + 1,
          chapterTranslations.English?.verses?.length || 1
        )
      )
    }
    disabled={
      selectedVerse >= (chapterTranslations.English?.verses?.length || 0)
    }
  >
    Next Verse →
  </button>
</div>
              <h3>
                {getBookDisplayName(currentBook, language)} {chapterNumber}
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

              
{chapterTranslations.English &&
 chapterTranslations.Odia &&
 chapterTranslations.Hindi && (
  <div className="all-translations">
    {chapterTranslations.English.verses.map((englishVerse, index) => {
      const verseNumber = index + 1;
      const odiaVerse = chapterTranslations.Odia.verses[index];
      const hindiVerse = chapterTranslations.Hindi.verses[index];

      const currentVerse = chapterData?.verses?.[index] || englishVerse;
      const key = `${selectedBook}-${chapterNumber}-${verseNumber}-${language}`;
      const saved = bookmarks.some((item) => item.key === key);

      return (
        <div
  ref={(element) => {
    verseRefs.current[verseNumber] = element;
  }}
  className={`translation-section ${
    selectedVerse === verseNumber ? "selected-verse" : ""
  }`}
  key={verseNumber}
  onClick={() => {
  shouldScrollToVerse.current = true;
  setSelectedVerse(verseNumber);
}}
>
          <h3>
            {getBookDisplayName(currentBook, language) || selectedBook} {chapterNumber}:{verseNumber}
          </h3>

          <p className="verse">
            <strong>English:</strong> {englishVerse}
          </p>

          <p className="verse odia-verse">
            <strong>ଓଡ଼ିଆ:</strong>{" "}
            {odiaVerse || "Translation unavailable"}
          </p>

          <p className="verse hindi-verse">
            <strong>हिन्दी:</strong>{" "}
            {hindiVerse || "Translation unavailable"}
          </p>

          <div className="verse-actions">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleBookmark(index, currentVerse);
              }}
            >
              {saved ? "♥ Saved" : "♡ Save"}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                shareVerse(currentVerse, index);
              }}
            >
              ↗ Share
            </button>
          </div>
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
  type="button"
  onClick={() => {
    shouldScrollToVerse.current = true;
    setSelectedVerse((previous) =>
      Math.min(
        previous + 1,
        chapterTranslations.English?.verses?.length || 1
      )
    );
  }}
  disabled={
    selectedVerse >= (chapterTranslations.English?.verses?.length || 0)
  }
>
  Next Verse →
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
{activeTab === "About" && (
  <section className="section about-section">
    <div className="about-header">
      <span className="about-icon">✝</span>
      <h2>About Holy Bible</h2>
      <p>FAITH • HOPE • LOVE</p>
    </div>

    <div className="about-card">
      <h3>About the App</h3>
      <p>
        Holy Bible is a multilingual Bible reading application
        designed to help people read and understand God's Word
        in English, Hindi and Odia.
      </p>
    </div>

    <div className="about-card">
      <h3>Our Mission</h3>
      <p>
        Our mission is to make Scripture accessible to everyone
        and encourage daily Bible reading, prayer and reflection.
      </p>
    </div>

    <div className="about-card">
      <h3>Bible Sources & Credits</h3>
      <p>
        English: World English Bible (WEB), public domain.
      </p>
      <p>
        Hindi and Odia: Indian Revised Version (IRV),
        © Bridge Connectivity Solutions, licensed under
        Creative Commons Attribution-ShareAlike 4.0.
      </p>
    </div>

    <div className="about-card">
  <h3>Contact Us</h3>
  <p><strong>Name:</strong> K DEELU</p>
  <p>
    <strong>Email:</strong>{" "}
    <a href="mailto:kdiljaan1994@gmail.com">
      kdiljaan1994@gmail.com
    </a>
  </p>
  <p>
    <strong>Contact:</strong>{" "}
    <a href="tel:+917735370822">
      +91 7735370822
    </a>
  </p>
  <p><strong>Place:</strong> JALTAR,GUNUPUR,ODISHA</p>
</div>
  </section>
)}
      </main>

<nav className="bottom-nav">
  {["Home", "Bible", "Bookmarks", "Plans", "About"].map((tab) => (
    <button
      key={tab}
      className={activeTab === tab ? "nav-active" : ""}
      onClick={() => setActiveTab(tab)}
    >
      <span>
        {tab === "Home" ? "⌂" :
         tab === "Bible" ? "▤" :
         tab === "Bookmarks" ? "♡" :
         tab === "Plans" ? "◷" : "ⓘ"}
      </span>
      {tab}
    </button>
  ))}
</nav>
<footer className="app-footer">
  <div className="footer-brand">
    <span className="footer-cross">✝</span>
    <h3>Holy Bible</h3>
    <p>FAITH • HOPE • LOVE</p>
  </div>

  <p className="footer-message">
    Made with <span>♥</span> to spread God's Word
  </p>

  <div className="footer-credits">
    <p><strong>Bible Translation Credits</strong></p>
    <p>English: World English Bible (WEB) — Public Domain.</p>
    <p>
      Hindi & Odia: Indian Revised Version (IRV) —
      © Bridge Connectivity Solutions.
    </p>
    <p>
      Licensed under{" "}
      <a
        href="https://creativecommons.org/licenses/by-sa/4.0/"
        target="_blank"
        rel="noreferrer"
      >
        CC BY-SA 4.0
      </a>.
    </p>
  </div>

  <p className="footer-copyright">
    © 2026 Holy Bible. All rights reserved.
  </p>
</footer>
    </div>
  );
}
