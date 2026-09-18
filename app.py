import json
import os
import random
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

# Path to quotes dataset
DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "quotes.json")


def load_quotes():
    """Loads quotes from the JSON data file."""
    try:
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        app.logger.error(f"Error loading quotes dataset: {e}")
        return []


QUOTES = load_quotes()


@app.route("/")
def index():
    """Renders the main single-page interface."""
    return render_template("index.html")


@app.route("/api/quotes/random", methods=["GET"])
def get_random_quote():
    """Returns a random quote, optionally filtered by category or author."""
    category = request.args.get("category", "").strip().lower()
    author = request.args.get("author", "").strip().lower()

    filtered = QUOTES
    if category:
        filtered = [q for q in filtered if q["category"].lower() == category]
    if author:
        filtered = [q for q in filtered if author in q["author"].lower()]

    if not filtered:
        return jsonify({"error": "No quotes found matching criteria"}), 404

    return jsonify(random.choice(filtered))


@app.route("/api/quotes", methods=["GET"])
def get_quotes():
    """
    Search and filter quotes.
    Query parameters:
      - q: text search across quote content and author
      - author: case-insensitive partial match on author name
      - category: case-insensitive match on category name
      - limit: maximum number of quotes to return
    """
    q = request.args.get("q", "").strip().lower()
    author = request.args.get("author", "").strip().lower()
    category = request.args.get("category", "").strip().lower()
    limit = request.args.get("limit", type=int)

    results = QUOTES

    if q:
        results = [
            quote
            for quote in results
            if q in quote["quote"].lower() or q in quote["author"].lower()
        ]

    if author:
        results = [quote for quote in results if author in quote["author"].lower()]

    if category:
        results = [
            quote for quote in results if quote["category"].lower() == category
        ]

    total_matches = len(results)

    if limit and limit > 0:
        results = results[:limit]

    return jsonify(
        {
            "total": total_matches,
            "count": len(results),
            "quotes": results,
        }
    )


@app.route("/api/categories", methods=["GET"])
def get_categories():
    """Returns all unique categories with quote counts."""
    category_counts = {}
    for q in QUOTES:
        cat = q.get("category", "General")
        category_counts[cat] = category_counts.get(cat, 0) + 1

    categories = [
        {"name": cat, "count": count}
        for cat, count in sorted(category_counts.items(), key=lambda x: x[0])
    ]
    return jsonify({"categories": categories})


@app.route("/api/authors", methods=["GET"])
def get_authors():
    """Returns a sorted list of unique authors with quote counts."""
    author_counts = {}
    for q in QUOTES:
        auth = q.get("author", "Unknown")
        author_counts[auth] = author_counts.get(auth, 0) + 1

    authors = [
        {"name": auth, "count": count}
        for auth, count in sorted(author_counts.items(), key=lambda x: x[0])
    ]
    return jsonify({"authors": authors})


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
