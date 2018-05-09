window.onload = function() {
    console.log('Welcome 67one');
    var mySwiper = new Swiper ('.swiper-container', {
        loop: true,
        autoplay:true,
        pagination: {
            el: '.swiper-pagination',
            clickable :true
        }
    });
};
