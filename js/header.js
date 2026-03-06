// header.js — shared header for all pages
// Usage: <script src="/js/header.js"></script> in every HTML page

(function () {
  const currentPath = window.location.pathname;

  function isActive(href) {
    return currentPath === href || currentPath.endsWith(href)
      ? ' class="nav-link active"'
      : ' class="nav-link"';
  }

  const header = `
  <header class="site-header">
    <a class="brand" href="/" aria-label="AgeTimeTools home">
      <span class="brand-mark" aria-hidden="true">⏱️</span>
      <span class="brand-name">AgeTimeTools</span>
    </a>
    <nav class="nav">
      <a href="/how-old-am-i.html"${isActive('/how-old-am-i.html')}>How Old Am I</a>
      <a href="/time-zone-converter.html"${isActive('/time-zone-converter.html')}>Time Zone Converter</a>
      <a href="/time-difference-calculator.html"${isActive('/time-difference-calculator.html')}>Time Difference</a>
      <a href="/age-calculator.html"${isActive('/age-calculator.html')}>Age Tools</a>
      <a href="/how-old-will-i-be.html"${isActive('/how-old-will-i-be.html')}>Time Tools</a>
      <a href="/#tools" class="nav-link">All Tools</a>
      <button class="btn-theme" id="theme_toggle" aria-label="Toggle dark mode">🌙</button>
    </nav>
  </header>`;

  // Inject header as first element in body
  document.body.insertAdjacentHTML('afterbegin', header);

  // Dark mode toggle
  const toggle = document.getElementById('theme_toggle');
  const root = document.documentElement;

  // Load saved preference
  if (localStorage.getItem('theme') === 'dark') {
    root.setAttribute('data-theme', 'dark');
    if (toggle) toggle.textContent = '☀️';
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      root.setAttribute('data-theme', isDark ? 'light' : 'dark');
      toggle.textContent = isDark ? '🌙' : '☀️';
      localStorage.setItem('theme', isDark ? 'light' : 'dark');
    });
  }
})();
