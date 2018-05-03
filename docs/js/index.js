window.onload = function() {
    console.log(2);
    var mySwiper = new Swiper ('.swiper-container', {
        loop: true,
        autoplay:true,
        pagination: {
            el: '.swiper-pagination',
            clickable :true
        }
    });
};
