# QuoteVault — 100 Famous Quotes Web Application

[![Python](https://img.shields.io/badge/python-3.10+-blue.svg?logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/flask-3.0+-black.svg?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Tests](https://img.shields.io/badge/tests-12%20passed-brightgreen.svg)]()
[![Frontend](https://img.shields.io/badge/frontend-Vanilla%20JS%20%7C%20CSS3%20%7C%20HTML5-orange.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()

**QuoteVault** is a fast, responsive, modern web application and REST API built with **Python Flask**, **vanilla JavaScript**, **semantic HTML5**, and custom **CSS3**. It provides an interactive interface to discover, search, and filter a curated collection of **100 timeless quotes** from history's greatest philosophers, scientists, leaders, and artists.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quickstart Guide](#quickstart-guide)
  - [Prerequisites](#prerequisites)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Set Up Virtual Environment](#2-set-up-virtual-environment)
  - [3. Install Dependencies](#3-install-dependencies)
  - [4. Run Development Server](#4-run-development-server)
- [REST API Reference](#rest-api-reference)
  - [1. Get Random Quote](#1-get-random-quote)
  - [2. Search & Filter Quotes](#2-search--filter-quotes)
  - [3. List Categories](#3-list-categories)
  - [4. List Authors](#4-list-authors)
- [Automated Testing](#automated-testing)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Production Deployment](#production-deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- 🎲 **Interactive Random Quote Generator**: Displays an inspiring featured quote on launch, with smooth fade-in animations and instant randomization.
- ⚡ **Zero Frontend Framework Overhead**: Written in pure **Vanilla JavaScript (ES6+)** with no heavy JavaScript frameworks or NPM dependencies.
- 🔍 **Real-Time Debounced Search**: Fast 250ms debounced search filtering by quote text, author name, or keywords.
- 🏷️ **Dynamic Category Filtering**: Browse quotes categorized into 10 domains: *Science, Philosophy, Motivation, Technology, Literature, Wisdom, Leadership, Art, Life, and Humor*.
- 👤 **Author Dropdown Selector**: Easily isolate quotes from specific thinkers like Albert Einstein, Steve Jobs, Maya Angelou, Marcus Aurelius, and more.
- 📋 **One-Click Clipboard Copying**: Copies the quote with formatted attribution and displays a visual toast confirmation.
- ⌨️ **Keyboard Shortcuts**: Power-user navigation for instant quote generation and clearing search fields.
- 📱 **Modern Dark-Mode Aesthetic**: Fully responsive flexbox/grid layout styled with CSS custom properties and Google Fonts (*Cinzel* & *Plus Jakarta Sans*).
- 🔌 **Comprehensive REST API**: Fully decoupled backend endpoints returning JSON for easy integration with third-party apps or bots.

---

## Tech Stack

- **Backend**: [Python](https://www.python.org/) & [Flask](https://flask.palletsprojects.com/)
- **Frontend**: Vanilla JavaScript (ES6+), Semantic HTML5, Modern CSS3 (CSS Grid & Flexbox)
- **Typography**: Google Fonts (*Cinzel* serif for quotations, *Plus Jakarta Sans* for clean UI typography)
- **Testing**: Python `unittest` framework (12 comprehensive tests)
- **Data Storage**: JSON-based flat dataset (`data/quotes.json`)

---

## Project Structure

```text
agy-cli-projects/
├── app.py                  # Flask web server, routing, & REST API endpoints
├── requirements.txt        # Minimal Python dependencies (Flask >= 3.0.0)
├── README.md               # Project documentation and API guide
├── data/
│   └── quotes.json         # 100 curated quotes dataset with categories & IDs
├── templates/
│   └── index.html          # Semantic HTML5 single-page application layout
├── static/
│   ├── css/
│   │   └── style.css       # Complete dark-mode design system & responsive layout
│   └── js/
│       └── app.js          # Client-side state manager, debouncer, & event handlers
└── tests/
    └── test_app.py         # Automated test suite (12 unit and integration test cases)
```

---

## Quickstart Guide

### Prerequisites
- **Python 3.10+** installed on your system ([Download Python](https://www.python.org/downloads/)).
- **Git** installed ([Download Git](https://git-scm.com/)).

### 1. Clone Repository
```bash
git clone https://github.com/Obinna-88/antigravity-cli-famous-quotes.git
cd antigravity-cli-famous-quotes
```

### 2. Set Up Virtual Environment

**Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**macOS / Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run Development Server
```bash
python app.py
```

Once running, navigate to:
```
http://127.0.0.1:5000
```

---

## REST API Reference

The backend provides a RESTful JSON API that can be consumed independently of the frontend web UI.

### 1. Get Random Quote
Returns a single random quote. Can be optionally filtered by category or author.

- **Endpoint**: `GET /api/quotes/random`
- **Query Parameters**:
  - `category` *(optional)*: Filter by category (e.g. `science`, `philosophy`).
  - `author` *(optional)*: Partial or exact author name (e.g. `einstein`).

**Sample Request:**
```http
GET /api/quotes/random?category=science HTTP/1.1
Host: 127.0.0.1:5000
```

**Sample Response (`200 OK`):**
```json
{
  "id": 1,
  "quote": "Imagination is more important than knowledge. For knowledge is limited, whereas imagination embraces the entire world.",
  "author": "Albert Einstein",
  "category": "Science"
}
```

---

### 2. Search & Filter Quotes
Retrieves a list of quotes matching optional query parameters.

- **Endpoint**: `GET /api/quotes`
- **Query Parameters**:
  - `q` *(optional)*: Text search across quote contents and author names.
  - `author` *(optional)*: Filter by author name (case-insensitive substring).
  - `category` *(optional)*: Filter by category name (case-insensitive).
  - `limit` *(optional)*: Maximum number of quotes to return (integer).

**Sample Request:**
```http
GET /api/quotes?author=steve&category=technology HTTP/1.1
Host: 127.0.0.1:5000
```

**Sample Response (`200 OK`):**
```json
{
  "total": 1,
  "count": 1,
  "quotes": [
    {
      "id": 31,
      "quote": "Innovation distinguishes between a leader and a follower.",
      "author": "Steve Jobs",
      "category": "Technology"
    }
  ]
}
```

---

### 3. List Categories
Returns all unique quote categories along with the count of quotes in each.

- **Endpoint**: `GET /api/categories`

**Sample Response (`200 OK`):**
```json
{
  "categories": [
    { "name": "Art", "count": 10 },
    { "name": "Humor", "count": 10 },
    { "name": "Leadership", "count": 10 },
    { "name": "Life", "count": 10 },
    { "name": "Literature", "count": 10 },
    { "name": "Motivation", "count": 10 },
    { "name": "Philosophy", "count": 10 },
    { "name": "Science", "count": 10 },
    { "name": "Technology", "count": 10 },
    { "name": "Wisdom", "count": 10 }
  ]
}
```

---

### 4. List Authors
Returns all unique authors represented in the dataset with their corresponding quote counts.

- **Endpoint**: `GET /api/authors`

**Sample Response (`200 OK`):**
```json
{
  "authors": [
    { "name": "Albert Einstein", "count": 4 },
    { "name": "Aristotle", "count": 3 },
    { "name": "Confucius", "count": 2 },
    { "name": "Maya Angelou", "count": 2 },
    { "name": "Steve Jobs", "count": 2 }
  ]
}
```

---

## Automated Testing

The project includes an automated test suite verifying dataset integrity, API status codes, query filtering, and edge cases.

To execute the test suite:

```bash
python -m unittest discover -s tests -p "test_*.py" -v
```

### Test Coverage Highlights:
- **Dataset Integrity**: Confirms exactly 100 quotes exist, IDs are unique, and no fields are empty.
- **Random Quote Endpoint**: Verifies valid JSON responses, error handling for unknown categories (`404`), and category query parameter filtering.
- **Search & Filters**: Tests author search, keyword search, category filtering, combined query parameters, and result bounds.
- **Aggregation Endpoints**: Validates categories and authors count tallies sum to 100 quotes.

---

## Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| <kbd>Space</kbd> or <kbd>R</kbd> | Generate a new random featured quote |
| <kbd>Esc</kbd> | Clear the active search bar and reset gallery search |

---

## Production Deployment

### Using Gunicorn (Linux / macOS / Containers)
Install Gunicorn:
```bash
pip install gunicorn
```
Run with 4 worker processes:
```bash
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

### Using Waitress (Windows Production)
Install Waitress:
```powershell
pip install waitress
```
Run the WSGI server:
```powershell
waitress-serve --port=8000 app:app
```

---

## Contributing

1. **Fork the repository** on GitHub.
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/new-quotes
   ```
3. **Commit your changes**:
   ```bash
   git commit -m "Add new quotes to quotes.json"
   ```
4. **Run the test suite** to ensure tests pass:
   ```bash
   python -m unittest discover -s tests -p "test_*.py"
   ```
5. **Push to the branch**:
   ```bash
   git push origin feature/new-quotes
   ```
6. **Open a Pull Request**.

---

## License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute it for personal and commercial projects.
