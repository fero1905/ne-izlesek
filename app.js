const API_KEY = 'fe1c36f2f60ad7048e1a20128a189ea5'; // <-- Buraya kendi key'ini yapıştır
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_URL = 'https://image.tmdb.org/t/p/w1280';

const suggestBtn = document.getElementById('suggestBtn');
const movieGrid = document.getElementById('movieGrid');
const loader = document.getElementById('loader');
const bgBlur = document.getElementById('bgBlur');

// app.js dosyandaki suggestBtn olayını bu mantıkla güncelle:

suggestBtn.addEventListener('click', async () => {
    const searchInput = document.getElementById('searchInput').value;
    const genreId = document.getElementById('genreSelect').value;
    
    loader.style.display = 'block';
    movieGrid.innerHTML = '';

    let url = "";

    // MANTIK: Eğer arama kutusu doluysa arama yap, boşsa türe göre getir
    if (searchInput.trim() !== "") {
        url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchInput)}&language=tr-TR`;
    } else {
        const randomPage = Math.floor(Math.random() * 5) + 1;
        url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=tr-TR&sort_by=popularity.desc&page=${randomPage}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            // Arama sonuçlarında 12, keşfette 12 film gösterelim
            const movies = data.results.slice(0, 12).filter(m => m.poster_path);

            setTimeout(() => {
                displayMovies(movies);
                loader.style.display = 'none';
            }, 500);
        } else {
            loader.style.display = 'none';
            alert("Sonuç bulunamadı!");
        }
    } catch (error) {
        loader.style.display = 'none';
        console.error("Hata:", error);
    }
});

// Arama kutusunda 'Enter'a basınca da çalışsın
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        suggestBtn.click();
    }
});

function displayMovies(movies) {
    movies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item');
        
        movieItem.innerHTML = `
            <img src="${IMAGE_URL + movie.poster_path}" alt="${movie.title}">
            <div class="movie-item-info">
                <h3>${movie.title}</h3>
                <div class="meta">
                    <span class="rating">⭐ ${movie.vote_average.toFixed(1)}</span>
                    <span class="year">${movie.release_date ? movie.release_date.split('-')[0] : ""}</span>
                </div>
            </div>
        `;

        movieItem.onclick = () => {
            if (movie.backdrop_path && bgBlur) {
                bgBlur.style.backgroundImage = `url(${BACKDROP_URL + movie.backdrop_path})`;
            }
        };

        movieGrid.appendChild(movieItem);
    });
}
// app.js dosyanın en altına bu kodu ekle:

const logo = document.getElementById('logo');

logo.addEventListener('click', () => {
    // 1. Arama kutusunu ve seçimi temizle
    document.getElementById('searchInput').value = '';
    document.getElementById('genreSelect').value = '';
    
    // 2. Film listesini temizle
    movieGrid.innerHTML = '';
    
    // 3. Arka planı varsayılan siyah haline döndür
    if (bgBlur) {
        bgBlur.style.backgroundImage = 'none';
    }
    
    // 4. Sayfayı en yukarı kaydır (eğer aşağı indiysen)
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    console.log("Sayfa sıfırlandı, ana sayfaya dönüldü.");
});