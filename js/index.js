function parallax(element, distance, speed){
    const item = document.querySelector(element)

    item.style.transform = `translateY(${distance * speed}px)`;
}


window.addEventListener('scroll', function(){
  
    parallax('.alinea1_title', window.scrollY, 0.2);
    parallax('.alinea1_img', window.scrollY, 0.3);
    parallax('.alinea1_rect', window.scrollY, 0.2);

    parallax('.alinea2_title', window.scrollY, 0.2);
    parallax('.alinea2_rect', window.scrollY, 0.3);
    parallax('.alinea2_txt', window.scrollY, 0.1);

    parallax('.alinea3_title', window.scrollY, 0.3);
    parallax('.alinea3_rect', window.scrollY, 0.2);
    parallax('.alinea3_img2', window.scrollY, 0.25);
    parallax('.alinea3_txt', window.scrollY, 0.15);

    parallax('.alinea4_title', window.scrollY, 0.3);
    parallax('.alinea4_img2', window.scrollY, 0.2);
    parallax('.alinea4_rect', window.scrollY, 0.3);
    parallax('.alinea4_txt', window.scrollY, 0.15);

    parallax('.alinea5_title', window.scrollY, 0.3);
    parallax('.alinea5_rect', window.scrollY, 0.25);
    parallax('.alinea5_txt', window.scrollY, 0.2);
});