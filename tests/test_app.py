import json
import os
import unittest
from app import app, DATA_PATH


class QuotesAppTestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        app.testing = True
        cls.client = app.test_client()

    def test_dataset_integrity(self):
        """Verify that quotes.json exists, has exactly 100 quotes, and all fields are valid."""
        self.assertTrue(os.path.exists(DATA_PATH), "data/quotes.json does not exist")
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            quotes = json.load(f)

        self.assertEqual(len(quotes), 100, "Dataset must contain exactly 100 quotes")

        ids = set()
        for q in quotes:
            self.assertIn("id", q)
            self.assertIn("quote", q)
            self.assertIn("author", q)
            self.assertIn("category", q)

            self.assertTrue(q["quote"].strip(), "Quote text cannot be empty")
            self.assertTrue(q["author"].strip(), "Author cannot be empty")
            self.assertTrue(q["category"].strip(), "Category cannot be empty")

            self.assertNotIn(q["id"], ids, f"Duplicate quote id found: {q['id']}")
            ids.add(q["id"])

    def test_index_route(self):
        """Test that the homepage serves the HTML application."""
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        content = response.data.decode("utf-8")
        self.assertIn("QuoteVault", content)
        self.assertIn("100 Timeless Quotes", content)

    def test_random_quote_endpoint(self):
        """Test /api/quotes/random returns a single random quote with all required keys."""
        response = self.client.get("/api/quotes/random")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("id", data)
        self.assertIn("quote", data)
        self.assertIn("author", data)
        self.assertIn("category", data)

    def test_random_quote_with_category_filter(self):
        """Test /api/quotes/random with a category query param."""
        response = self.client.get("/api/quotes/random?category=science")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["category"].lower(), "science")

    def test_random_quote_not_found(self):
        """Test /api/quotes/random with a non-existent category."""
        response = self.client.get("/api/quotes/random?category=nonexistentcategoryxyz")
        self.assertEqual(response.status_code, 404)
        data = response.get_json()
        self.assertIn("error", data)

    def test_get_all_quotes(self):
        """Test /api/quotes returns all 100 quotes by default."""
        response = self.client.get("/api/quotes")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["total"], 100)
        self.assertEqual(data["count"], 100)
        self.assertEqual(len(data["quotes"]), 100)

    def test_filter_by_author(self):
        """Test search by author name."""
        response = self.client.get("/api/quotes?author=einstein")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertGreater(data["total"], 0)
        for q in data["quotes"]:
            self.assertIn("einstein", q["author"].lower())

    def test_filter_by_category(self):
        """Test filter by category."""
        response = self.client.get("/api/quotes?category=philosophy")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertGreater(data["total"], 0)
        for q in data["quotes"]:
            self.assertEqual(q["category"].lower(), "philosophy")

    def test_filter_by_keyword(self):
        """Test keyword search across quote and author."""
        response = self.client.get("/api/quotes?q=imagination")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertGreater(data["total"], 0)
        for q in data["quotes"]:
            match = "imagination" in q["quote"].lower() or "imagination" in q["author"].lower()
            self.assertTrue(match)

    def test_combined_filters(self):
        """Test combining author and category filters."""
        response = self.client.get("/api/quotes?author=steve&category=technology")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["total"], 1)
        self.assertEqual(data["quotes"][0]["author"], "Steve Jobs")

    def test_categories_endpoint(self):
        """Test /api/categories endpoint returns all categories and valid counts."""
        response = self.client.get("/api/categories")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("categories", data)
        categories = data["categories"]
        self.assertGreater(len(categories), 5)
        total_quotes = sum(c["count"] for c in categories)
        self.assertEqual(total_quotes, 100)

    def test_authors_endpoint(self):
        """Test /api/authors endpoint returns unique authors and valid counts."""
        response = self.client.get("/api/authors")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("authors", data)
        authors = data["authors"]
        self.assertGreater(len(authors), 50)
        total_quotes = sum(a["count"] for a in authors)
        self.assertEqual(total_quotes, 100)


if __name__ == "__main__":
    unittest.main()
