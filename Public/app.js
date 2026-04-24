const API_KEY = '6bd334abc9bfd21d79a7fe8b219a4b44';

// ── Tab switching ──────────────────────────────────────────────────────────
document.querySelectorAll('nav button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    if (btn.dataset.tab === 'history') renderHistory();
  });
});

// ── Clock ──────────────────────────────────────────────────────────────────
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent =
    now.toLocaleTimeString('en-GB');
  document.getElementById('date-display').textContent =
    now.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
setInterval(updateClock, 1000);
updateClock();

// ── Fetch weather from OpenWeatherMap ──────────────────────────────────────
async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'City not found');
  return {
    city:        data.name,
    country:     data.sys.country,
    weather:     data.weather[0].main,
    description: data.weather[0].description,
    icon:        data.weather[0].icon,
    temp:        (data.main.temp - 273.15).toFixed(1),
    feels_like:  (data.main.feels_like - 273.15).toFixed(1),
    humidity:    data.main.humidity,
    wind:        Math.round(data.wind.speed * 3.6),
  };
}

// ── Build weather card HTML ────────────────────────────────────────────────
function weatherCardHTML(d) {
  return `
    <div class="weather-card">
      <div>
        <div class="w-city">${d.city}</div>
        <div class="w-country">${d.country}</div>
        <div class="w-desc">${d.description}</div>
        <div class="w-stats">
          <div class="stat"><div class="stat-label">🌡 Temp</div><div class="stat-value">${d.temp}°C</div></div>
          <div class="stat"><div class="stat-label">🤔 Feels</div><div class="stat-value">${d.feels_like}°C</div></div>
          <div class="stat"><div class="stat-label">💧 Humidity</div><div class="stat-value">${d.humidity}%</div></div>
          <div class="stat"><div class="stat-label">💨 Wind</div><div class="stat-value">${d.wind} km/h</div></div>
        </div>
      </div>
      <div class="w-icon">
        <img src="https://openweathermap.org/img/wn/${d.icon}@2x.png" alt="${d.weather}" />
        <div class="w-condition">${d.weather}</div>
      </div>
    </div>`;
}

// ── Weather tab ────────────────────────────────────────────────────────────
document.getElementById('search-btn').addEventListener('click', searchWeather);
document.getElementById('city-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') searchWeather();
});

async function searchWeather() {
  const city = document.getElementById('city-input').value.trim();
  if (!city) return;

  const msg    = document.getElementById('weather-msg');
  const result = document.getElementById('weather-result');
  msg.innerHTML = '<span class="spinner"></span> Loading…';
  result.innerHTML = '';

  try {
    const d = await getWeather(city);
    msg.innerHTML = '';
    result.innerHTML = weatherCardHTML(d);
    await saveHistory(d);
  } catch (err) {
    msg.innerHTML = `<div class="msg msg-error">❌ ${err.message}</div>`;
  }
}

// ── History (SQL via backend API) ──────────────────────────────────────────
async function saveHistory(d) {
  try {
    await fetch('/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        city:        d.city,
        country:     d.country,
        temp:        d.temp,
        description: d.description,
      }),
    });
  } catch (err) {
    console.error('Failed to save history:', err);
  }
}

async function renderHistory() {
  const el = document.getElementById('history-list');
  el.innerHTML = '<span class="spinner"></span> Loading…';

  try {
    const res  = await fetch('/history');
    const rows = await res.json();

    if (!rows.length) {
      el.innerHTML = '<p class="muted">No history yet. Search for a city!</p>';
      return;
    }

    el.innerHTML = rows.map(r => `
      <div class="history-item">
        [${r.searched_at}] ${r.city}, ${r.country} — ${r.temp}°C, ${r.description}
      </div>
    `).join('');
  } catch (err) {
    el.innerHTML = '<p class="muted">Failed to load history.</p>';
  }
}

document.getElementById('clear-btn').addEventListener('click', async () => {
  if (!confirm('Delete all history from the database?')) return;
  try {
    await fetch('/history', { method: 'DELETE' });
    renderHistory();
  } catch (err) {
    console.error('Failed to clear history:', err);
  }
});

// ── Utility ────────────────────────────────────────────────────────────────
function showMsg(id, text, type) {
  document.getElementById(id).innerHTML = `<div class="msg msg-${type}">${text}</div>`;
}