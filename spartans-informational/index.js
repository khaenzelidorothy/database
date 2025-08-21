const reviews = [
  {
    image: 'images/farmer.jpg',
    text: `I was able to secure loan that transformed my dairy farm! The process was straightforward, and the team was incredibly supportive; with their help I upgraded my equipment and increased my milk production significantly.`,
    stars: 5,
    author: 'Uwimana Francine'
  },
  {
    image: 'images/farmer.jpg',
    text: "This platform made financing easy and accessible. I'm grateful for the support and guidance throughout the process.",
    stars: 5,
    author: 'Jean Bosco'
  },
  {
    image: 'images/farmer.jpg',
    text: "Excellent service and quick response. Highly recommended for farmers seeking financial support.",
    stars: 5,
    author: 'Amina Habimana'
  }
];

let current = 0;

function renderReview(idx) {
  const review = reviews[idx];
  const imageDiv = document.getElementById('review-image');
  imageDiv.innerHTML = `<img src="${review.image}" />`;
 
  document.getElementById('review-text').textContent = review.text;
  document.getElementById('review-stars').innerHTML = '★'.repeat(review.stars) + '☆'.repeat(5 - review.stars);
  document.getElementById('review-author').textContent = review.author;
}

document.addEventListener('DOMContentLoaded', () => {
  renderReview(current);
  document.getElementById('prev-btn').onclick = () => {
    current = (current - 1 + reviews.length) % reviews.length;
    renderReview(current);
  };
  document.getElementById('next-btn').onclick = () => {
    current = (current + 1) % reviews.length;
    renderReview(current);
  };
});


// Navbar

  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const closeBtn = document.getElementById('closeMenu');


  hamburger.addEventListener('click', () => {
    navLinks.classList.add('active');
  });

  closeBtn.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });


  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });
