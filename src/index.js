import '../src/css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';

const API_KEY = '36230432-188f02e7fd3eb7806444db018';
const API_URL = 'https://pixabay.com/api/';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let page = 1;
let currentPage = 1;

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  currentPage = 1; // reset currentPage to 1 for new search

  const searchQuery = e.target.elements.searchQuery.value.trim();

  searchImages(searchQuery, currentPage);
});

loadMoreBtn.addEventListener('click', () => {
  currentPage++; // increase currentPage for next page of results

  const searchQuery = searchForm.elements.searchQuery.value.trim();

  searchImages(searchQuery, currentPage);
});

function searchImages(searchQuery, page) {
  axios
    .get(API_URL, {
      params: {
        key: API_KEY,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: page,
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

      if (page === 1) {
        gallery.innerHTML = '';
      }

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

      if (
        photos.length < 40 ||
        gallery.children.length >= response.data.totalHits
      ) {
        // ukrycie przycisku "Load more" jeśli dotarliśmy do końca kolekcji
        loadMoreBtn.style.display = 'none';
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      } else {
        // wyświetlenie przycisku "Load more" w przeciwnym razie
        loadMoreBtn.style.display = 'block';
      }

      Notiflix.Notify.success(
        `Found ${photos.length} images for "${searchQuery}"`
      );

      // // show loadMoreBtn if there are more pages of results
      // if (response.data.totalHits > currentPage * 40) {
      //   loadMoreBtn.style.display = 'block';
      // } else {
      //   loadMoreBtn.style.display = 'none';
      // }
    })
    .catch(error => {
      console.error(error);
      Notiflix.Notify.failure(
        'Oops, something went wrong. Please try again later.'
      );
    });
}
