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
