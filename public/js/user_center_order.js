// [...document.querySelectorAll('.user-order-title li')].forEach((x) => {
//     x.addEventListener('click', (e) => {
//         e.preventDefault();
//         e.classList.add('user-order-title-active');
//         [...e.parentNode.children].filter((child) =>
//         child !== e ;
//         console.log(child)
//     )
// })
// });
// child.classList.remove('user-order-title-active')

$('.user-order-title li').click((e) => {
  e.preventDefault();
  $(e.currentTarget).addClass('user-order-title-active');
  $(e.currentTarget).siblings().removeClass('user-order-title-active');
});
