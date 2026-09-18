# QuoteVault — 100 Famous Quotes Web Application

A lightweight, modern web application built with **Python Flask**, **plain vanilla JavaScript**, **semantic HTML5**, and **CSS3**. It displays random quotes from a curated collection of 100 well-known quotes and supports instant searching by author or keyword as well as category filtering.

---

## Features

- **🎲 Random Quote Generator**: Displays a featured quote on page load or on demand with smooth transition effects.
- **⚡ Pure Vanilla JavaScript**: Zero frontend dependencies or external JS frameworks.
- **🔍 Instant Live Search**: Search by quote keywords or author name with 250ms debounced input.
- **🏷️ Category Filtering**: Filter quotes across 10 categories (Science, Philosophy, Motivation, Technology, Literature, Wisdom, Leadership, Art, Life, Humor) with dynamic count badges.
- **👤 Author Filter Dropdown**: Filter quotes by any of the historical and modern authors.
- **📋 Copy to Clipboard**: One-click copy with formatted attribution and toast notification.
- **⌨️ Keyboard Shortcuts**:
  - `Space` or `R`: Generate a new random quote.
  - `Esc`: Clear the search input.
- **📱 Fully Responsive**: Tailored layout for mobile, tablet, and desktop screens with dark-mode aesthetic.

---

## Project Structure

```text
├── app.py                  # Flask web server & REST API
├── requirements.txt        # Python dependencies (Flask >= 3.0.0)
├── data/
│   └── quotes.json         # 100 curated quotes dataset
├── templates/
│   └── index.html          # Semantic HTML5 frontend template
├── static/
│   ├── css/
│   │   └── style.css       # Modern CSS design system & layout
│   └── js/
│       └── app.js          # Vanilla JavaScript application controller
└── tests/
    └── test_app.py         # Automated test suite (12 test cases)
```

---

## Quickstart

### 1. Install Dependencies
Make sure Python 3.10+ is installed:
```powershell
pip install -r requirements.txt
```

### 2. Run the Application
```powershell
python app.py
```
Open your browser and navigate to:
```
http://127.0.0.1:5000
```

### 3. Run Automated Tests
```powershell
python -m unittest discover -s tests -p "test_*.py" -v
```

---

## REST API Documentation

| Endpoint | Method | Description | Parameters |
| :--- | :--- | :--- | :--- |
| `/` | `GET` | Main Web Application UI | None |
| `/api/quotes/random` | `GET` | Returns a single random quote | `category` (optional), `author` (optional) |
| `/api/quotes` | `GET` | Returns list of quotes with total count | `q` (keyword), `author` (name), `category`, `limit` |
| `/api/categories` | `GET` | List of all categories with quote counts | None |
| `/api/authors` | `GET` | List of all authors with quote counts | None |
