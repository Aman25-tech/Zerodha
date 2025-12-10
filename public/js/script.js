(function() {
    'use strict';
    window.addEventListener('load', function() {
        const forms = document.querySelectorAll('.needs-validation');
        Array.prototype.slice.call(forms).forEach(function(form) {
            form.addEventListener('submit', function(event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
})();

document.addEventListener('DOMContentLoaded', function() {
    const tabLinks = document.querySelectorAll('.features-nav .nav-link');
    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            tabLinks.forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            link.classList.add('active');
            document.getElementById(link.getAttribute('data-tab')).classList.add('active');
        });
    });

    fetchWatchlist();
    
    fetchNews();
    
    initializeTradingViewWidget();
});

async function fetchWatchlist() {
    try {
        showLoading('watchlist');
        const response = await fetch(`https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers?apiKey=${API_KEYS.POLYGON}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        updateWatchlist(data.tickers);
    } catch (error) {
        console.error('Error fetching watchlist:', error);
        showError('watchlist', 'Failed to load watchlist');
    } finally {
        hideLoading('watchlist');
    }
}

async function fetchNews() {
    try {
        showLoading('news');
        const response = await fetch(`https://finnhub.io/api/v1/news?category=general&token=${API_KEYS.FINNHUB}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        updateNews(data);
    } catch (error) {
        console.error('Error fetching news:', error);
        showError('news', 'Failed to load news');
    } finally {
        hideLoading('news');
    }
}

function initializeTradingViewWidget() {
    new TradingView.widget({
        "width": "100%",
        "height": 500,
        "symbol": "NASDAQ:AAPL",
        "interval": "D",
        "timezone": "Asia/Kolkata",
        "theme": "light",
        "style": "1",
        "locale": "in",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "container_id": "charts"
    });
}

const API_KEYS = {
    POLYGON: process.env.POLYGON_API_SECRET,
    FINNHUB: process.env.FINNHUB_API_SECRET,
    ALPHAVANTAGE: process.env.ALPHAVANTAGE_API_KEY
};

const loadingStates = {
    watchlist: false,
    news: false,
    charts: false
};

function showLoading(section) {
    loadingStates[section] = true;
    document.getElementById(`${section}-loader`).style.display = 'block';
}

function hideLoading(section) {
    loadingStates[section] = false;
    document.getElementById(`${section}-loader`).style.display = 'none';
}

function showError(section, message) {
    const errorDiv = document.getElementById(`${section}-error`);
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}