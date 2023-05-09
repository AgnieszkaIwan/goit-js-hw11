import '../src/css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';

const API_KEY = '36230432-188f02e7fd3eb7806444db018';
const API_URL = 'https://pixabay.com/api/';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');

searchForm.addEventListener('submit', e => {
  e.preventDefault();

  const searchQuery = e.target.elements.searchQuery.value.trim();

  axios
    .get(API_URL, {
      params: {
        key: API_KEY,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    })
    .then(response => {
      const photos = response.data.hits;

      if (photos.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      gallery.innerHTML = '';

      photos.forEach(photo => {
        const card = `
        <div class="photo-card">
          <img src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy" />
          <div class="info">
            <p class="info-item">
              <b>Likes:</b> ${photo.likes}
            </p>
            <p class="info-item">
              <b>Views:</b> ${photo.views}
            </p>
            <p class="info-item">
              <b>Comments:</b> ${photo.comments}
            </p>
            <p class="info-item">
              <b>Downloads:</b> ${photo.downloads}
            </p>
          </div>
        </div>
      `;

        gallery.insertAdjacentHTML('beforeend', card);
      });

      Notiflix.Notify.success(
        `Found ${photos.length} images for "${searchQuery}"`
      );
    })
    .catch(error => {
      console.error(error);
      Notiflix.Notify.failure(
        'Oops, something went wrong. Please try again later.'
      );
    });
});

async function fetchImages() {
  try {
    const response = await axios.get(API_URL, {
      params: {
        key: API_KEY,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40, //liczba obiektów na stronie
        page: pageNumber, //numer strony
      },
    });

    const hits = response.data.hits;
    const totalHits = response.data.totalHits;

    if (hits.length === 0) {
      // pokaz powiadomienie, ze nie znaleziono obrazkow
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      //dodaj obrazy do galerii
      const gallery = document.querySelector('.gallery');
      hits.forEach(hit => {
        const card = createPhotoCard(hit);
        gallery.insertAdjacentHTML('beforeend', card);
      });

      //jeśli pobrano mniej obrazków niż per_page - koniec kolekcji
      if (pageNumber * 40 >= totalHits) {
        loadMoreBtn.style.display = 'none';
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      } else {
        //w innym przypadku pokaz przycisk
        loadMoreBtn.style.display = 'block';
      }
    }
  } catch (error) {
    console.log(error);
  }
}

const loadMoreBtn = document.getElementById('load-more');

let pageNumber;

loadMoreBtn.addEventListener('click', () => {
  pageNumber += 1;
  fetchImages();
});

// loadMoreBtn.style.display = 'none'; // początkowo ukryj przycisk

// if (response.data.hits.length === 0) {
//   // wyświetl powiadomienie o braku wyników i ukryj przycisk
//   gallery.innerHTML = '<p>No results found.</p>';
//   loadMoreBtn.style.display = 'none';
// } else {
//   // wyświetl kolejne obrazy i pokaż przycisk "load more"
//   gallery.insertAdjacentHTML('beforeend', markup);
//   loadMoreBtn.style.display = 'block';
// }
