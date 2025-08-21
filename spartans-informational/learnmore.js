
// document.addEventListener('DOMContentLoaded', () => {
//   const hamburger = document.getElementById('hamburger');
//   const navLinks = document.getElementById('nav-links');
//   hamburger.addEventListener('click', () => {
//     navLinks.classList.toggle('open');
//     hamburger.classList.toggle('open');
//   });
//   document.querySelectorAll('.nav-links a').forEach(link => {
//     link.addEventListener('click', () => {
//       if (window.innerWidth <= 700) {
//         navLinks.classList.remove('open');
//         hamburger.classList.remove('open');
//       }
//     });
//   });
// });

// document.addEventListener('DOMContentLoaded', () => {
//   const hamburger = document.getElementById('hamburger');
//   const navLinks = document.getElementById('nav-links');

//   hamburger.addEventListener('click', () => {
//     navLinks.classList.toggle('open'); // Toggle nav links visibility
//     hamburger.classList.toggle('open'); // Toggle hamburger to X
//   });

//   document.querySelectorAll('.nav-links a').forEach(link => {
//     link.addEventListener('click', () => {
//       if (window.innerWidth <= 700) {
//         navLinks.classList.remove('open'); // Close nav links on link click
//         hamburger.classList.remove('open'); // Change hamburger back to normal
//       }
//     });
//   });
// });

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    // Only toggle if the window width is 700px or less
    if (window.innerWidth <= 700) {
      navLinks.classList.toggle('open'); // Toggle nav links visibility
      hamburger.classList.toggle('open'); // Toggle hamburger to X
    }
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 700) {
        navLinks.classList.remove('open'); // Close nav links on link click
        hamburger.classList.remove('open'); // Change hamburger back to normal
      }
    });
  });
});
