const bgImages = [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
    'https://images.unsplash.com/photo-1500673922987-e212871fec22',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470'
];

function changeBg() {
    const randomImg = bgImages[Math.floor(Math.random() * bgImages.length)];
    document.body.style.backgroundImage = `url('${randomImg}')`;
}
setInterval(changeBg, 15000);
changeBg();

// ==========================================
// 2. RELOJ DIGITAL Y FRASES
// ==========================================
function startClock() {
    setInterval(() => {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        
        document.getElementById('clock').textContent = `${h}:${m}:${s}`;
        document.getElementById('date').textContent = now.toLocaleDateString('es-ES');

        const hours = now.getHours();
        const msg = document.getElementById('greeting-message');
        if (hours >= 0 && hours <= 7) msg.textContent = "Es hora de descansar.";
        else if (hours <= 12) msg.textContent = "Buenos días, desayuna fuerte.";
        else if (hours <= 14) msg.textContent = "No olvides comer.";
        else if (hours <= 18) msg.textContent = "Buenas tardes, el último empujón.";
        else msg.textContent = "Buenas noches, toca descansar.";
    }, 1000);
}
startClock();

// ==========================================
// 3. ESTACIÓN METEOROLÓGICA (WEATHER API)
// ==========================================
const apiKey = 'TU_API_KEY_AQUÍ'; // <--- PEGA TU API KEY AQUÍ
let city = localStorage.getItem('userCity') || 'Valencia';

async function fetchWeather(targetCity) {
    try {
        const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${targetCity}&lang=es`);
        const data = await res.json();
        
        document.getElementById('city-name').textContent = data.location.name;
        document.getElementById('temperature').textContent = `${Math.round(data.current.temp_c)}°C`;
        document.getElementById('weather-icon').src = data.current.condition.icon;
        document.getElementById('weather-desc').textContent = data.current.condition.text;
        document.getElementById('humidity').textContent = data.current.humidity;
        document.getElementById('wind').textContent = data.current.wind_kph;
        
        localStorage.setItem('userCity', targetCity);
    } catch (e) { console.error("Error clima"); }
}

document.getElementById('btn-city').addEventListener('click', () => {
    const input = document.getElementById('city-input').value;
    if(input) fetchWeather(input);
});
fetchWeather(city);

// ==========================================
// 4. GENERADOR DE CONTRASEÑAS
// ==========================================
document.getElementById('generate-btn').addEventListener('click', () => {
    const length = document.getElementById('pass-length').value;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let pass = "";
    for (let i = 0; i < length; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById('generated-password').textContent = pass;
});

// ==========================================
// 5. LISTADO DE LINKS (LOCALSTORAGE)
// ==========================================
const linkBtn = document.getElementById('add-link-btn');
let links = JSON.parse(localStorage.getItem('myLinks')) || [];

function showLinks() {
    const list = document.getElementById('links-list');
    list.innerHTML = "";
    links.forEach((l, i) => {
        list.innerHTML += `
            <li class="link-item">
                <a href="${l.url}" target="_blank">${l.title}</a>
                <span style="cursor:pointer;color:red" onclick="removeLink(${i})">Eliminar</span>
            </li>`;
    });
}

linkBtn.addEventListener('click', () => {
    const title = document.getElementById('link-title').value;
    const url = document.getElementById('link-url').value;
    if(title && url) {
        links.push({title, url});
        localStorage.setItem('myLinks', JSON.stringify(links));
        showLinks();
    }
});

window.removeLink = (i) => {
    links.splice(i, 1);
    localStorage.setItem('myLinks', JSON.stringify(links));
    showLinks();
};
showLinks();