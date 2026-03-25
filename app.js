const API_KEY = 'fe1c36f2f60ad7048e1a20128a189ea5';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_URL = 'https://image.tmdb.org/t/p/w1280';

const suggestBtn = document.getElementById('suggestBtn');
const movieGrid = document.getElementById('movieGrid');
const loader = document.getElementById('loader');
const bgBlur = document.getElementById('bgBlur');
const logo = document.getElementById('logo');

suggestBtn.addEventListener('click', async () => {
    const searchInput = document.getElementById('searchInput').value;
    const genreId = document.getElementById('genreSelect').value;
    loader.style.display = 'block';
    movieGrid.innerHTML = '';

    let url = searchInput.trim() !== "" 
        ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchInput)}&language=tr-TR`
        : `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=tr-TR&sort_by=popularity.desc&page=${Math.floor(Math.random() * 5) + 1}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const movies = data.results.slice(0, 12).filter(m => m.poster_path);
        await displayMovies(movies);
        loader.style.display = 'none';
    } catch (error) {
        loader.style.display = 'none';
        console.error(error);
    }
});

async function displayMovies(movies) {
    for (const movie of movies) {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item');
        
        const videoUrl = `${BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}&language=tr-TR`;
        const vResponse = await fetch(videoUrl);
        const vData = await vResponse.json();
        let trailer = vData.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');

        if (!trailer) {
            const enVResponse = await fetch(`${BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}&language=en-US`);
            const enVData = await enVResponse.json();
            trailer = enVData.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
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
            if (movie.backdrop_path) bgBlur.style.backgroundImage = `url(${BACKDROP_URL + movie.backdrop_path})`;
        };

        movieGrid.appendChild(movieItem);
    }
}

logo.addEventListener('click', () => {
    document.getElementById('searchInput').value = '';
    document.getElementById('genreSelect').value = '';
    movieGrid.innerHTML = '';
    if (bgBlur) bgBlur.style.backgroundImage = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') suggestBtn.click();
});