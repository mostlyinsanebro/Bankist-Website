'use script';

//////////////////////////////////////////////////////////////////

// MODAL WINDOW

// Step 1:- Make the modal window work
const btnsModal = document.querySelectorAll('.btn--show-modal');
const modalWindow = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnClose = document.querySelector('.btn--close-modal');
const navLink = document.querySelector('.nav__links');
const navLinks = document.querySelectorAll('.nav__link');
const btnScroll = document.querySelector('.btn--scroll-to');
const section1 = document.getElementById('section--1');
const tabsContainer = document.querySelector('.operations__tab-container');
const operationTabs = document.querySelectorAll('.operations__tab');
const operationsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const navImage = document.querySelector('.nav__logo');
const headerElement = document.querySelector('.header__title');
const section2 = document.getElementById('section--2');
const sections = document.querySelectorAll('.section');
const featuresImages = document.querySelectorAll('.features__img');
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');
const dotsContainer = document.querySelector('.dots');

const showModal = function () {
  modalWindow.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const hideModal = function () {
  modalWindow.classList.add('hidden');
  overlay.classList.add('hidden');
};

// On clicking of this button, we want that the modal is displayed on screen and
// ovrelay gets hidden i.e. the hidden class from the modal window gets removed
// and the blurred class is added to the overlay.
btnsModal.forEach(btn => {
  btn.addEventListener('click', showModal);
});

btnClose.addEventListener('click', hideModal);

overlay.addEventListener('click', hideModal);

///////////////////////////////////////////////////////////////////////////
// Step 2). Add scrolling functionality on the learn more page.

btnScroll.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

/////////////////////////////////////////////////////////////////////////////////

// Step 3). Now, add the functionality that when you click on one of the navigation elements
// of the tab, it goes to that part on the webpage.

navLink.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    e.target.classList.contains('nav__link') &&
    !e.target.classList.contains('btn--show-modal')
  ) {
    const id = document.querySelector(e.target.getAttribute('href'));
    id.scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////////////////////////////////////////

// Step 4). Adding tabbed component.
// Now, do event delegation here that when the target element with one of the dataset-tab is clicked
// then first disable elevated functionality from all the elements and add that functionality to the current
// element only.

tabsContainer.addEventListener('click', function (e) {
  const targetElem = e.target.closest('.operations__tab');

  if (!targetElem) return;

  // First, go to the parent element and disable the active class fromall the operation tabs.
  if (targetElem.classList.contains('operations__tab')) {
    operationTabs.forEach(el => {
      el.classList.remove('operations__tab--active');
    });

    // Add active class to only the current tab.
    const currentTab = document.querySelector(
      `.operations__tab--${targetElem.dataset.tab}`
    );
    currentTab.classList.add('operations__tab--active');

    // Now,also switch the content as per that tab.
    operationsContent.forEach(div => {
      // console.log(div);
      div.classList.remove('operations__content--active');
    });

    const currentContent = document.querySelector(
      `.operations__content--${targetElem.dataset.tab}`
    );

    currentContent.classList.add('operations__content--active');
  }
});

///////////////////////////////////////////////////////////////////////////

// Step 5). Menu Fade Animations

// Write feature for mouseover.
nav.addEventListener('mouseover', function (e) {
  if (e.target.classList.contains('nav__link')) {
    const currentElement = e.target;
    // Now, make all the elements blurred.
    navLinks.forEach(el => {
      // Make all elements blurred.
      if (el !== currentElement) {
        el.style.opacity = 0.5;
      }
    });

    // Make image blurred
    navImage.style.opacity = 0.5;

    // Unblur the current element
    // console.log(e.target);
  }
});

// Write feature for mouseout
nav.addEventListener('mouseout', function (e) {
  // Make all the elements opaque again
  navLinks.forEach(el => {
    // Make all elements blurred.

    el.style.opacity = 1.0;
  });

  // Make image blurred
  navImage.style.opacity = 1.0;
});

///////////////////////////////////////////////////////////////////////////////////

// Step 6). Make the navigation component sticky.

// Write the code that as soon as the header element goes out of the view, then the navigation component becomes
// sticked to the screen.

// To know whether an element is intersecting with another element, there is an API. Use that API
// to check whether the sections are intersecting with the root element i.e. with the viewport or not.
// If yes, then make it sticky else make it unsticky.

const navHeight = nav.getBoundingClientRect().height;

const observerCallback = function (entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      nav.classList.remove('sticky');
    } else {
      nav.classList.add('sticky');
    }
  });
};

let options = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

let observer = new IntersectionObserver(observerCallback, options);

observer.observe(headerElement);
/////////////////////////////////////////////////////////////////////////////////////////

// Step 7). Reveal Elements on Scroll

// Solution:- Use IntersectionObserver API to check if the sections are intersecting with the viewport
// or not. By default, make them invisible but on isIntersecting becoming true, then reveal that element.

// sections.forEach(sec => {});

const sectionCallback = function (entries, sectionObserver) {
  // if (entry.isIntersecting) {
  //   section1.classList.remove('hidden');
  // }
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    if (entry.isIntersecting) {
      // section2.classList.remove('hidden');
      // const curElem = document.getElementById(entry.target.id);
      entry.target.classList.remove('section--hidden');
    }
    sectionObserver.unobserve(entry.target);
  });
};

const opt = {
  root: null,
  threshold: 0.15,
};

const sectionObserver = new IntersectionObserver(sectionCallback, opt);

sections.forEach(sec => {
  sec.classList.add('section--hidden');
  sectionObserver.observe(sec);
});

///////////////////////////////////////////////////////////////////////////

// Step 8). Lazy Loading Images
// Initially, have the lazy images on the page displayed, now as soon as the element intersects with the
// viewport, we want that the good image is loaded onto the screen and as soon as the good image is loaded fully
// onto the screen, we want that it is then displayed on the screen with the blurred effect removed.

// Here, we are using the concept of changing the src of the element to the dataset src, then the
// good quality images will be loaded.
const imgCallback = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    // change image source to the source image having high resolution.
    entry.target.src = entry.target.dataset.src;

    // remove the blurred effect.
    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });

    imgObserver.unobserve(entry.target);
  });
};

const imgOptions = {
  root: null,
  threshold: 1.0,
};

let imgObserver = new IntersectionObserver(imgCallback, imgOptions);

featuresImages.forEach(img => {
  imgObserver.observe(img);
});

//////////////////////////////////////////////////////////////////////////////////////
// Step 9). Slider Component

// First of all , make the images visible and the current cards invisible for testing in html file.
// Make the scaling of images smaller, translateX to left, so that all images are visible and make translate X of
// each image different, so that they are not overlapped and are visible.
// slider.style.transform = 'scale(0.4) translatex(-1200px)';
// slider.style.overflow = 'visible';

let curSlide = 0;

// Now,include dots in the slider.
// Traverse the images and for each image add a div to the container with class dots__dot.

slides.forEach((sl, i) => {
  dotsContainer.insertAdjacentHTML(
    'beforeend',
    `<button class = 'dots__dot' data-slide= '${i}'> </button>`
  );
});

const gotToSlide = function () {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${(i - curSlide) * 100}%)`;
  });
};

// After that, add event listener on dotscontainer element that on clicking of any dot
// the page goes to the corresponding slide.
dotsContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    // Slide to that slide
    const cur = Number(e.target.dataset.slide);
    curSlide = cur;
    dotActive();
    gotToSlide();
  }
});

// Now, make the dot of the curSlide -- active.
const dotActive = function () {
  document.querySelectorAll('.dots__dot').forEach(dot => {
    dot.classList.remove('dots__dot--active');
  });

  // Now, display the curslide dot as active.
  document
    .querySelector(`.dots__dot[data-slide = '${curSlide}']`)
    .classList.add('dots__dot--active');
};

dotActive();

const maxSlide = slides.length - 1;
console.log(maxSlide);

slides.forEach((slide, i) => {
  slide.style.transform = `translateX(${i * 100}%)`;
});

const nextSlide = function () {
  if (curSlide == maxSlide) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  dotActive();

  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${(i - curSlide) * 100}%)`;
  });
};

const prevSlide = function () {
  if (curSlide == 0) {
    curSlide = maxSlide;
  } else {
    curSlide--;
  }
  dotActive();

  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${(i - curSlide) * 100}%)`;
  });
};

// btnRight
btnRight.addEventListener('click', function () {
  nextSlide();
});

// btnLeft
btnLeft.addEventListener('click', function () {
  prevSlide();
});

document.addEventListener('keydown', function (e) {
  if (e.key == 'ArrowRight') {
    nextSlide();
  } else if (e.key == 'ArrowLeft') {
    prevSlide();
  }
});
