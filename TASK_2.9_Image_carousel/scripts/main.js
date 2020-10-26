function toggleBurgerMenuBtn() {
  let burger = document.getElementById('nav-burger-btn'),
    activeClass = 'nav-burger__active';

  burger && burger.addEventListener('click', function (e) {
    e.preventDefault();
    e.currentTarget.classList.toggle(activeClass);
  }, false);
}

document.addEventListener('DOMContentLoaded', function () {
  toggleBurgerMenuBtn();
})

$(function () {
  initJQueryImageCarousel();
});

function initJQueryImageCarousel() {
  var imgWrappers = $(".cards__img-wrapper");
  $(imgWrappers).each(function (index) {
    var imgWrapper = this;
    imgWrapper.carouselImageIndex = 0;
    imgWrapper.images = $(imgWrapper).find(".card__img-list li");
    imgWrapper.radioButtons = $(imgWrapper).find(".card__img-nav-buttons input[type='radio']");

    // init left arrow listeners
    var leftArrow = $(imgWrapper).find("*[id*='left_arrow']")[0];
    leftArrow.imgWrapper = imgWrapper;
    $(leftArrow).click(function () {
      this.imgWrapper.updateCarouselImageIndex(-1);
      this.imgWrapper.animateCarouselImage();
      this.imgWrapper.updateCheckedRadioButton();
    });

    // init right arrow listeners
    var rightArrow = $(imgWrapper).find("*[id*='right_arrow']")[0];
    rightArrow.imgWrapper = imgWrapper;
    $(rightArrow).click(function () {
      this.imgWrapper.updateCarouselImageIndex(+1);
      this.imgWrapper.animateCarouselImage();
      this.imgWrapper.updateCheckedRadioButton();
    });

    // init radio buttons listeners
    $(imgWrapper.radioButtons).each(function (radioIndex) {
      this.imgWrapper = imgWrapper;
      $(this).click(function () {
        this.imgWrapper.carouselImageIndex = this.getClickedRadioButtonIndex();
        this.imgWrapper.animateCarouselImage();
      });

      this.getClickedRadioButtonIndex = getClickedRadioButtonIndex;
    });

    imgWrapper.updateCarouselImageIndex = updateCarouselImageIndex;
    imgWrapper.animateCarouselImage = animateCarouselImage;
    imgWrapper.updateCheckedRadioButton = updateCheckedRadioButton;
  });

  function updateCarouselImageIndex(diff) {
    this.carouselImageIndex += diff;
    var imagesLength = this.images.length;
    if (this.carouselImageIndex < 0) {
      this.carouselImageIndex += imagesLength;
    } else if (this.carouselImageIndex >= imagesLength) {
      this.carouselImageIndex %= imagesLength;
    }
  }

  function animateCarouselImage() {
    var newMarginLeft = -100 * this.carouselImageIndex + '%';
    $(this.images[0]).animate({ marginLeft: newMarginLeft });
  }

  function updateCheckedRadioButton() {
    $(this.radioButtons[this.carouselImageIndex]).prop("checked", true);
  }

  function getClickedRadioButtonIndex() {
    var childrenOfParent = $(this).parent().children();
    for(var i = 0; i < childrenOfParent.length; i++) {
      if(childrenOfParent[i] === this) return i;
    }
    return -1;
  }
}