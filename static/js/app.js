/**
 * 100 Famous Quotes - Frontend Application Controller
 * Pure Vanilla JavaScript (ES6+)
 */

// Application State
const state = {
  currentQuote: null,
  searchQuery: '',
  selectedCategory: '',
  selectedAuthor: '',
  categories: [],
  authors: [],
  quotes: [],
  debounceTimer: null,
};

// DOM Element References
const elements = {
  featuredCard: document.getElementById('featured-quote-card'),
  featuredText: document.getElementById('featured-quote-text'),
  featuredAuthor: document.getElementById('featured-author'),
  featuredCategory: document.getElementById('featured-category'),
  newQuoteBtn: document.getElementById('new-quote-btn'),
  copyQuoteBtn: document.getElementById('copy-quote-btn'),
  searchInput: document.getElementById('search-input'),
  clearSearchBtn: document.getElementById('clear-search-btn'),
  authorSelect: document.getElementById('author-select'),
  resetFiltersBtn: document.getElementById('reset-filters-btn'),
  categoriesBar: document.getElementById('categories-bar'),
  quotesGrid: document.getElementById('quotes-grid'),
  resultsCount: document.getElementById('results-count'),
  emptyState: document.getElementById('empty-state'),
  emptyResetBtn: document.getElementById('empty-reset-btn'),
  toast: document.getElementById('toast'),
  statsBadge: document.getElementById('stats-badge'),
  totalCountBadge: document.getElementById('total-count-badge'),
};

/**
 * Helper: Escapes HTML to prevent XSS vulnerabilities
 */
function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Toast Notification Utility
 */
let toastTimeout = null;
function showToast(message) {
  if (!elements.toast) return;
  elements.toast.textContent = message;
  elements.toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    elements.toast.classList.remove('show');
  }, 2400);
}

/**
 * Copy text to clipboard
 */
async function copyQuote(quote, author) {
  const formatted = `"${quote}" — ${author}`;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(formatted);
    } else {
      // Fallback for non-HTTPS / legacy contexts
      const textArea = document.createElement('textarea');
      textArea.value = formatted;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    showToast('✓ Quote copied to clipboard!');
  } catch (err) {
    console.error('Failed to copy quote: ', err);
    showToast('Failed to copy quote');
  }
}

/**
 * API: Fetch Random Quote
 */
async function fetchRandomQuote() {
  elements.featuredText.style.opacity = '0.3';
  try {
    // Optionally respect selected category when picking a random quote
    let url = '/api/quotes/random';
    const params = new URLSearchParams();
    if (state.selectedCategory) params.append('category', state.selectedCategory);
    if (state.selectedAuthor) params.append('author', state.selectedAuthor);

    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;

    const res = await fetch(url);
    if (!res.ok) {
      // Fallback without filters if filtered random quote has no matches
      const fallbackRes = await fetch('/api/quotes/random');
      const data = await fallbackRes.json();
      renderFeaturedQuote(data);
      return;
    }

    const data = await res.json();
    renderFeaturedQuote(data);
  } catch (error) {
    console.error('Error fetching random quote:', error);
    elements.featuredText.textContent = 'Could not load random quote. Please try again.';
  } finally {
    elements.featuredText.style.opacity = '1';
  }
}

/**
 * Render Featured Quote Card
 */
function renderFeaturedQuote(quote) {
  if (!quote) return;
  state.currentQuote = quote;
  elements.featuredText.textContent = `“${quote.quote}”`;
  elements.featuredAuthor.textContent = `— ${quote.author}`;
  elements.featuredCategory.textContent = quote.category;
}

/**
 * API: Fetch Filtered Quotes List
 */
async function fetchQuotes() {
  const params = new URLSearchParams();
  if (state.searchQuery) params.append('q', state.searchQuery);
  if (state.selectedCategory) params.append('category', state.selectedCategory);
  if (state.selectedAuthor) params.append('author', state.selectedAuthor);

  try {
    const res = await fetch(`/api/quotes?${params.toString()}`);
    if (!res.ok) throw new Error('API response not ok');
    const data = await res.json();
    state.quotes = data.quotes || [];
    renderQuotesGrid(state.quotes, data.total);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    renderQuotesGrid([], 0);
  }
}

/**
 * Render Quotes in Grid Gallery
 */
function renderQuotesGrid(quotes, totalCount) {
  // Update counter text
  if (totalCount === 0) {
    elements.resultsCount.textContent = '0 quotes found';
    elements.quotesGrid.innerHTML = '';
    elements.emptyState.hidden = false;
    return;
  }

  elements.emptyState.hidden = true;
  elements.resultsCount.textContent = `Showing ${quotes.length} of ${totalCount} quotes`;

  // Render cards
  const cardsHtml = quotes
    .map((q) => {
      const escapedQuote = escapeHTML(q.quote);
      const escapedAuthor = escapeHTML(q.author);
      const escapedCategory = escapeHTML(q.category);

      return `
      <article class="grid-card">
        <blockquote class="card-quote-text">“${escapedQuote}”</blockquote>
        <footer class="card-footer">
          <div class="card-author-info">
            <cite class="card-author">${escapedAuthor}</cite>
            <span class="card-category-tag">${escapedCategory}</span>
          </div>
          <button 
            type="button" 
            class="card-copy-btn" 
            title="Copy this quote"
            data-quote="${escapedQuote}" 
            data-author="${escapedAuthor}"
          >
            📋 Copy
          </button>
        </footer>
      </article>
    `;
    })
    .join('');

  elements.quotesGrid.innerHTML = cardsHtml;

  // Attach copy listeners to grid cards
  elements.quotesGrid.querySelectorAll('.card-copy-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const quoteText = btn.getAttribute('data-quote');
      const authorText = btn.getAttribute('data-author');
      copyQuote(quoteText, authorText);
    });
  });
}

/**
 * API: Fetch Categories and Render Filter Chips
 */
async function fetchCategories() {
  try {
    const res = await fetch('/api/categories');
    if (!res.ok) throw new Error('Failed to load categories');
    const data = await res.json();
    state.categories = data.categories || [];
    renderCategories(state.categories);
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

/**
 * Render Category Chips
 */
function renderCategories(categories) {
  // Calculate total quotes count across categories
  const total = categories.reduce((sum, cat) => sum + cat.count, 0);
  if (elements.totalCountBadge) elements.totalCountBadge.textContent = total;
  if (elements.statsBadge) {
    elements.statsBadge.textContent = `${total} Quotes • ${categories.length} Categories`;
  }

  // Clear except the "All" chip
  const allChip = elements.categoriesBar.querySelector('[data-category=""]');
  elements.categoriesBar.innerHTML = '';
  if (allChip) elements.categoriesBar.appendChild(allChip);

  categories.forEach((cat) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'cat-chip';
    chip.setAttribute('data-category', cat.name);
    chip.innerHTML = `${escapeHTML(cat.name)} <span class="chip-count">${cat.count}</span>`;

    chip.addEventListener('click', () => {
      // Toggle active class
      elements.categoriesBar.querySelectorAll('.cat-chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      state.selectedCategory = cat.name;
      fetchQuotes();
    });

    elements.categoriesBar.appendChild(chip);
  });

  // Re-attach listener to "All" chip
  if (allChip) {
    allChip.addEventListener('click', () => {
      elements.categoriesBar.querySelectorAll('.cat-chip').forEach((c) => c.classList.remove('active'));
      allChip.classList.add('active');
      state.selectedCategory = '';
      fetchQuotes();
    });
  }
}

/**
 * API: Fetch Authors and Populate Dropdown
 */
async function fetchAuthors() {
  try {
    const res = await fetch('/api/authors');
    if (!res.ok) throw new Error('Failed to load authors');
    const data = await res.json();
    state.authors = data.authors || [];
    populateAuthorSelect(state.authors);
  } catch (error) {
    console.error('Error loading authors:', error);
  }
}

/**
 * Populate Author Select Element
 */
function populateAuthorSelect(authors) {
  elements.authorSelect.innerHTML = '<option value="">All Authors</option>';
  authors.forEach((item) => {
    const opt = document.createElement('option');
    opt.value = item.name;
    opt.textContent = `${item.name} (${item.count})`;
    elements.authorSelect.appendChild(opt);
  });
}

/**
 * Reset All Filter Inputs
 */
function resetAllFilters() {
  state.searchQuery = '';
  state.selectedCategory = '';
  state.selectedAuthor = '';

  elements.searchInput.value = '';
  elements.clearSearchBtn.hidden = true;
  elements.authorSelect.value = '';

  elements.categoriesBar.querySelectorAll('.cat-chip').forEach((c) => {
    if (c.getAttribute('data-category') === '') {
      c.classList.add('active');
    } else {
      c.classList.remove('active');
    }
  });

  fetchQuotes();
}

/**
 * Bind User Event Handlers
 */
function initEventListeners() {
  // New Random Quote
  elements.newQuoteBtn.addEventListener('click', () => fetchRandomQuote());

  // Copy Featured Quote
  elements.copyQuoteBtn.addEventListener('click', () => {
    if (state.currentQuote) {
      copyQuote(state.currentQuote.quote, state.currentQuote.author);
    }
  });

  // Search Input with 250ms debounce
  elements.searchInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    elements.clearSearchBtn.hidden = !val;

    clearTimeout(state.debounceTimer);
    state.debounceTimer = setTimeout(() => {
      state.searchQuery = val;
      fetchQuotes();
    }, 250);
  });

  // Clear Search Button
  elements.clearSearchBtn.addEventListener('click', () => {
    elements.searchInput.value = '';
    elements.clearSearchBtn.hidden = true;
    state.searchQuery = '';
    elements.searchInput.focus();
    fetchQuotes();
  });

  // Author Dropdown Filter
  elements.authorSelect.addEventListener('change', (e) => {
    state.selectedAuthor = e.target.value;
    fetchQuotes();
  });

  // Reset Filters Buttons
  elements.resetFiltersBtn.addEventListener('click', resetAllFilters);
  elements.emptyResetBtn.addEventListener('click', resetAllFilters);

  // Global Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    const activeTagName = document.activeElement ? document.activeElement.tagName : '';
    const isTyping = activeTagName === 'INPUT' || activeTagName === 'SELECT' || activeTagName === 'TEXTAREA';

    // Space or R -> New Random Quote (if not typing in search box)
    if (!isTyping && (e.code === 'Space' || e.key.toLowerCase() === 'r')) {
      e.preventDefault();
      fetchRandomQuote();
    }

    // Escape -> Clear search
    if (e.key === 'Escape') {
      if (elements.searchInput.value) {
        elements.searchInput.value = '';
        elements.clearSearchBtn.hidden = true;
        state.searchQuery = '';
        fetchQuotes();
      }
    }
  });
}

/**
 * Initialize Application
 */
async function init() {
  initEventListeners();
  await Promise.all([
    fetchCategories(),
    fetchAuthors(),
    fetchRandomQuote(),
    fetchQuotes(),
  ]);
}

// Start app once DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
