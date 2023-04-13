// Seccion que solicita las peliculas mas populares
import {
  URL_POPULARES,
  contenedorPeliculas,
  mostrarPeliculas,
  obtenerGeneros,
} from './js/PelisPopulares.js';
import { searcher, searcherList, API_KEY } from './js/searcher.js';
import { searchedBaseURL, showSearchedMovies } from './js/showMoviesSearch.js';

fetch(URL_POPULARES)
  .then(response => response.json())
  .then(data => mostrarPeliculas(data.results))
  .catch(error => console.log(error));

//Input para buscar peliculas

searcher.addEventListener('input', () => {
  const searchQuery = searcher.value;
  const searchUrl = `https://api.themoviedb.org/3/search/keyword?api_key=${API_KEY}&query=${searchQuery}`;

  fetch(searchUrl)
    .then(response => response.json())
    .then(results => {
      searcherList.innerHTML = '';
      let counter = 0;
      results.results.forEach(keyword => {
        if (counter < 4) {
          const listItem = document.createElement('li');
          listItem.setAttribute('class', 'movieName');
          listItem.textContent = keyword.name;
          searcherList.appendChild(listItem);
          counter++;
        } else {
          return;
        }
      });
    })
    .catch(error => console.log(error));
});

const searchedBaseURL = 'https://api.themoviedb.org/3/search/movie';

async function searchMovies(query) {
  const url = `${searchedBaseURL}?api_key=${API_KEY}&query=${query}`;

  const response = await fetch(url);
  const data = await response.json();

  const movies = data.results.map(movie => {
    return {
      title: movie.title,
      poster: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
      overview: movie.overview,
      genres: movie.genre_ids,
      estreno: movie.release_date,
    };
  });
  contenedorPeliculas.innerHTML = '';
  movies.forEach(movie => {
    const movieCard = `
    <div class="pelicula"
          <div class="movie-card">
            <img src="${movie.poster}" class="pelicula__imagen" alt="${
      movie.title
    }">
            <h2 class="pelicula__titulo">${movie.title}</h2>
            <p  style=display: "inline-block" class="pelicula__genero">${obtenerGeneros(
              movie.genres
            )}</p>
            <p  style=display: "inline-block" class="pelicula__estreno">${
              movie.estreno
            }</p>
          </div>
          </div>
        `;
    contenedorPeliculas.innerHTML += movieCard;
  });
}

searcher.addEventListener('input', () => {
  const query = searcher.value.trim();
  if (query.length > 0) {
    searchMovies(query);
  } else {
    return window.location.reload();
  }
});

//Modal

const getButton = document.querySelector('#ButtonModal');
const apiKey = '20979babc91cbc65cdd918b0c714bda3';
const URL = `https://api.themoviedb.org/3/movie/76341?api_key=${apiKey}`;
const imageMovie = document.querySelector('.movie_img');
const titleMovie = document.querySelector('.movie_title');
const dataKey = document.querySelector('.data_key');
const dataValue = document.querySelector('.data_value');
const dataSinopsis = document.querySelector('.data_sinopsis');
const arraySubtitles = [
  'Vote / Votes',
  'Popularity',
  'Original Title',
  'Genre',
];
const buttonAddWath = document.querySelector('.video');
const buttonAddQueue = document.querySelector('.movie');
const contentModal = document.querySelector('.sub-content');
const clickWindow = 0;
const orangeColor = '#FF6B01';
const whiteColor = 'white';
const blackColor = 'black';

fetch(URL)
  .then(response => {
    return response.json();
  })
  .then(data => {
    console.log(data);
    const vote = Number.parseFloat(data.vote_average).toFixed(1);
    const popularity = Number.parseFloat(data.popularity).toFixed(1);
    const originalTitle = data.original_title.toUpperCase();

    const arraySubtValue = [
      vote + ' / ' + data.vote_count,
      popularity,
      originalTitle,
      data.genres,
    ];
    imageMovie.src = `https://image.tmdb.org/t/p/w200${data.poster_path}`;
    titleMovie.textContent = arraySubtValue[2];

    for (let i = 0; i < arraySubtitles.length; i++) {
      const subtitle = document.createElement('p');
      subtitle.style.padding = '6% 0%';
      subtitle.style.margin = '0%';
      subtitle.textContent = `${arraySubtitles[i]}`;
      dataKey.appendChild(subtitle);
      const subtitleValue = document.createElement('p');
      subtitleValue.style.width = 'fit-content';
      subtitleValue.classList = 'data_info';

      if (arraySubtitles[i] === 'Genre') {
        const divGenre = document.createElement('div');
        divGenre.classList.add('data_genre');
        dataValue.appendChild(divGenre);
        data.genres.forEach(genre => {
          const addGenre = document.createElement('p');
          addGenre.style.width = 'fit-content';
          addGenre.classList = 'data_info';
          addGenre.textContent = `${genre.name}`;
          divGenre.appendChild(addGenre);
        });
      } else {
        subtitleValue.textContent = `${arraySubtValue[i]}`;
        dataValue.appendChild(subtitleValue);
      }
    }
    //Sinopsis
    const sinopsis = data.overview;
    dataSinopsis.textContent = `${sinopsis}`;

    //Datos en formato JSON
    const baseData = JSON.stringify(data);

    //habilitar botones

    function changeButton(button, background, letter, border) {
      button.style.backgroundColor = background;
      button.style.color = letter;
      button.style.borderColor = border;
    }

    /*Videos vistos*/
    buttonAddWath.addEventListener('click', function () {
      localStorage.setItem('watch-video', baseData);
      localStorage.removeItem('queue_movie');
      changeButton(buttonAddWath, orangeColor, whiteColor, whiteColor);
      changeButton(buttonAddQueue, whiteColor, blackColor, blackColor);
    });

    /*Peliculas en cola*/
    buttonAddQueue.addEventListener('click', function () {
      localStorage.setItem('queue_movie', baseData);
      localStorage.removeItem('watch-video');
      changeButton(buttonAddQueue, orangeColor, whiteColor, whiteColor);
      changeButton(buttonAddWath, whiteColor, blackColor, blackColor);
    });
  });

if (document.querySelector('#ButtonModal')) {
  var modal = document.querySelector('#myModal');
  var button = document.querySelector('#ButtonModal');
  var closeButton = document.querySelector('.button_close');

  button.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  /*Cierre del modal*/
  function closeWindow() {
    modal.style.display = 'none';
  }
  closeButton.addEventListener('click', closeWindow);
  modal.addEventListener('click', closeWindow);

  document.addEventListener('keydown', event => {
    event.preventDefault();
    if (event.code === 'Escape') {
      closeWindow;
    }
  });

  contentModal.addEventListener('click', event => {
    event.stopPropagation();
  });
}
