function parallax(element, distance, speed){
    const item = document.querySelector(element)

    item.style.transform = `translateY(${distance * speed}px)`;

    console.log(distance)
}


window.addEventListener('scroll', function(){
  


    parallax('.alinea1_title', window.scrollY, 0.2);
    parallax('.alinea1_img', window.scrollY, 0.3);
    parallax('.alinea1_rect', window.scrollY, 0.2);

    parallax('.alinea2_title', window.scrollY, 0.2);

    parallax('.alinea2_rect', window.scrollY, 0.25);
});