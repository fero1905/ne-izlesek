const API_KEY = 'fe1c36f2f60ad7048e1a20128a189ea5';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_URL = 'https://image.tmdb.org/t/p/w1280';

const suggestBtn = document.getElementById('suggestBtn');
const movieGrid = document.getElementById('movieGrid');
const loader = document.getElementById('loader');
const bgBlur = document.getElementById('bgBlur');
const logo = document.getElementById('logo');

if (suggestBtn) {
    suggestBtn.addEventListener('click', async () => {
        const searchInput = document.getElementById('searchInput').value;
        const genreId = document.getElementById('genreSelect').value;
        
        loader.style.display = 'block';
        movieGrid.innerHTML = '';

        let url = "";
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
                const movies = data.results.slice(0, 12).filter(m => m.poster_path);
                await displayMovies(movies);
                loader.style.display = 'none';
            } else {
                loader.style.display = 'none';
                alert("Sonuç bulunamadı!");
            }
        } catch (error) {
            loader.style.display = 'none';
            console.error("Hata:", error);
        }
    });
}

async function displayMovies(movies) {
    for (const movie of movies) {
        const movieItem = document.createElement('div');
        movieItem.className = 'movie-item';
        
        try {
            const videoUrl = `${BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}&language=tr-TR`;
            const vResponse = await fetch(videoUrl);
            const vData = await vResponse.json();
            let trailer = vData.results ? vData.results.find(v => v.type === 'Trailer' && v.site === 'YouTube') : null;

            if (!trailer) {
                const enVUrl = `${BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}&language=en-US`;
                const enVRes = await fetch(enVUrl);
                const enVData = await enVRes.json();
                trailer = enVData.results ? enVData.results.find(v => v.type === 'Trailer' && v.site === 'YouTube') : null;
            }

            movieItem.innerHTML = `
                ${trailer ? `<div class="trailer-badge" onclick="window.open('https://youtube.com/watch?v=${trailer.key}', '_blank'); event.stopPropagation();">▶ FRAGMAN</div>` : ''}
                <img src="${IMAGE_URL + movie.poster_path}" alt="${movie.title}" loading="lazy">
                <div class="movie-item-info">
                    <h3>${movie.title}</h3>
                    <p>⭐ ${movie.vote_average.toFixed(1)} | ${movie.release_date ? movie.release_date.split('-')[0] : ""}</p>
                </div>
            `;

            movieItem.onclick = () => {
                if (movie.backdrop_path && bgBlur) {
                    bgBlur.style.backgroundImage = `url(${BACKDROP_URL + movie.backdrop_path})`;
                }
            };

            movieGrid.appendChild(movieItem);
        } catch (err) {
            console.error("Film kartı hatası:", err);
        }
    }
}

if (logo) {
    logo.addEventListener('click', () => {
        document.getElementById('searchInput').value = '';
        document.getElementById('genreSelect').value = '';
        movieGrid.innerHTML = '';
        if (bgBlur) bgBlur.style.backgroundImage = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

const searchInp = document.getElementById('searchInput');
if (searchInp) {
    searchInp.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') suggestBtn.click();
    });
}