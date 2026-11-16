
import json
import subprocess
import time
from pathlib import Path

API = "https://api.midvash.com/v1"
OUTPUT = Path("public/bible-data")

VERSIONS = {
    "web": "English",
    "irv-or": "Odia",
    "irv-hi": "Hindi",
}


def fetch_json(url):
    result = subprocess.run(
        ["curl", "-fsS", "--retry", "3", url],
        capture_output=True,
        text=True,
        check=True,
    )
    return json.loads(result.stdout)


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)

    books = (
        fetch_json(f"{API}/books?testament=old")["data"]
        + fetch_json(f"{API}/books?testament=new")["data"]
    )

    print(f"Found {len(books)} Bible books.")

    for version, language in VERSIONS.items():
        folder = OUTPUT / version
        folder.mkdir(parents=True, exist_ok=True)

        print(f"\nDownloading {language}...")

        for book in books:
            slug = book["slug"]["en"]
            destination = folder / f"{slug}.json"

            if destination.exists():
                try:
                    saved = json.loads(destination.read_text(encoding="utf-8"))
                    if len(saved["chapters"]) == book["chapters"]:
                        print(f"Already complete: {language} / {slug}")
                        continue
                except Exception:
                    pass

            chapters = {}

            if destination.exists():
                try:
                    chapters = json.loads(
                        destination.read_text(encoding="utf-8")
                    ).get("chapters", {})
                except Exception:
                    chapters = {}

            for chapter in range(1, book["chapters"] + 1):
                if str(chapter) in chapters:
                    continue

                url = f"{API}/{version}/{slug}/{chapter}"
                data = fetch_json(url)["data"]

                if not isinstance(data.get("verses"), list):
                    raise ValueError(
                        f"Invalid verse data: {version}/{slug}/{chapter}"
                    )

                chapters[str(chapter)] = data

                temporary = destination.with_suffix(".tmp")
                temporary.write_text(
                    json.dumps(
                        {
                            "version": version,
                            "language": language,
                            "book": book,
                            "chapters": chapters,
                        },
                        ensure_ascii=False,
                    ),
                    encoding="utf-8",
                )
                temporary.replace(destination)

                print(
                    f"{language}: {slug} "
                    f"chapter {chapter}/{book['chapters']}"
                )

                time.sleep(0.1)

        print(f"{language} download complete.")

    print("\nAll three Bible translations downloaded.")


if __name__ == "__main__":
    main()
