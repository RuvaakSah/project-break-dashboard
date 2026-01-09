const images = [
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d',
    'https://images.unsplash.com/photo-1426604966848-d7adac402bff'
];

function changeBackground() {
    const randomImg = images[Math.floor(Math.random() * images.length)];
    document.body.style.backgroundImage = `url('${randomImg}')`;
}
setInterval(changeBackground, 15000);
changeBackground();

// ==========================================
// 2. RELOJ Y FECHA
// ==========================================
function updateClock() {
    const now = new Date();
    
    // Formateo de Hora
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = `${h}:${m}:${s}`;
    
    // Formateo de Fecha
    const dateStr = now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    document.getElementById('date').textContent = dateStr;

    // Mensajes según hora
    const msgEl = document.getElementById('greeting-message');
    const hours = now.getHours();
    if (hours >= 0 && hours <= 7) msgEl.textContent = "Es hora de descansar. Apaga y sigue mañana.";
    else if (hours <= 12) msgEl.textContent = "Buenos días, desayuna fuerte y a darle al código.";
    else if (hours <= 14) msgEl.textContent = "Echa un rato más pero no olvides comer.";
    else if (hours <= 16) msgEl.textContent = "Espero que hayas comido.";
    else if (hours <= 18) msgEl.textContent = "Buenas tardes, el último empujón.";
    else if (hours <= 22) msgEl.textContent = "Esto ya son horas extras... piensa en parar pronto.";
    else msgEl.textContent = "Buenas noches, es hora de pensar en parar y descansar.";
}
setInterval(updateClock, 1000);
updateClock();

// ==========================================
// 3. GENERADOR DE CONTRASEÑAS
// ==========================================
const charSets = {
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lower: "abcdefghijklmnopqrstuvwxyz",
    nums: "0123456789",
    symbols: "!@#$%^&*()-_=+"
};

document.getElementById('generate-btn').addEventListener('click', () => {
    const length = document.getElementById('pass-length').value;
    let characters = charSets.upper + charSets.lower + charSets.nums + charSets.symbols;
    let password = "";

    // Asegurar al menos uno de cada
    password += charSets.upper[Math.floor(Math.random() * charSets.upper.length)];
    password += charSets.lower[Math.floor(Math.random() * charSets.lower.length)];
    password += charSets.nums[Math.floor(Math.random() * charSets.nums.length)];
    password += charSets.symbols[Math.floor(Math.random() * charSets.symbols.length)];

    for (let i = password.length; i < length; i++) {
        password += characters[Math.floor(Math.random() * characters.length)];
    }
    
    // Mezclar
    password = password.split('').sort(() => 0.5 - Math.random()).join('');
    document.getElementById('generated-password').textContent = password;
});

// ==========================================
// 4. TIEMPO (WEATHER API)
// ==========================================
const apiKey = 'TU_API_KEY_AQUÍ'; // <--- PON TU KEY AQUÍ
const city = 'Madrid'; 

async function getWeather() {
    try {
        const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&aqi=no`);
        const data = await res.json();

        document.getElementById('city-name').textContent = `${data.location.name}, ${data.location.country}`;
        document.getElementById('temperature').textContent = `${data.current.temp_c}°C`;
        document.getElementById('weather-icon').src = data.current.condition.icon;
        document.getElementById('weather-desc').textContent = data.current.condition.text;
        document.getElementById('precip').textContent = `${data.current.precip_mm} mm`;
        document.getElementById('humidity').textContent = `${data.current.humidity}%`;
        document.getElementById('wind').textContent = `${data.current.wind_kph} km/h`;

        // Previsión por horas
        const forecastEl = document.getElementById('weather-forecast');
        forecastEl.innerHTML = "";
        data.forecast.forecastday[0].hour.forEach(h => {
            const time = h.time.split(' ')[1];
            forecastEl.innerHTML += `
                <div class="forecast-item">
                    <div>${time}</div>
                    <img src="${h.condition.icon}">
                    <div>${h.temp_c}°</div>
                </div>`;
        });
    } catch (err) { console.error("Error clima:", err); }
}
getWeather();

// ==========================================
// 5. LISTADO DE LINKS (LOCAL STORAGE)
// ==========================================
const linksList = document.getElementById('links-list');
let links = JSON.parse(localStorage.getItem('myDashboardLinks')) || [];

function renderLinks() {
    linksList.innerHTML = "";
    links.forEach((link, index) => {
        const li = document.createElement('li');
        li.className = "link-item";
        li.innerHTML = `
            <a href="${link.url}" target="_blank">${link.title}</a>
            <button class="delete-link" onclick="deleteLink(${index})">✖</button>
        `;
        linksList.appendChild(li);
    });
}

document.getElementById('add-link-btn').addEventListener('click', () => {
    const title = document.getElementById('link-title').value;
    const url = document.getElementById('link-url').value;
    if (title && url) {
        links.push({ title, url });
        localStorage.setItem('myDashboardLinks', JSON.stringify(links));
        renderLinks();
        document.getElementById('link-title').value = "";
        document.getElementById('link-url').value = "";
    }
});

window.deleteLink = (index) => {
    links.splice(index, 1);
    localStorage.setItem('myDashboardLinks', JSON.stringify(links));
    renderLinks();
};

renderLinks();