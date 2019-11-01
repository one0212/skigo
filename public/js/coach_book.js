// 該課程人數上限
const booknumlimit = 5;
// 該課程人數折價標準
const booknumdiscount = 3;
// 該課程是否特價判斷
let discountok = false;
// 課程原價
const coachprice = 2000;
// 課程打幾折
const coachoff = 0.8;
// 課程打折後價錢
let coachdiscount = coachprice;

// 價錢千分位處理
const thousandComma = (number) => {
  let num = number.toString();
  const pattern = /(-?\d+)(\d{3})/;

  while (pattern.test(num)) {
    num = num.replace(pattern, '$1,$2');
  }
  return num;
};

// 當人數達到特價條件之判斷式
function discountokJudge() {
  if (discountok === true) {
    // 有特價
    coachdiscount = coachprice * coachoff;
    $('.coach-price').css('text-decoration', 'line-through');
    $('.coach-price-discount').css('display', 'inline');
    $('.coach-price-discount').html(`特價${thousandComma(coachdiscount)}`);
  } else {
    // 沒特價
    coachdiscount = coachprice * 1;
    $('.coach-price').css('text-decoration', 'none');
    $('.coach-price-discount').css('display', 'none');
  }
}
// 達到特價的人數條件

// 課程人數超過上限 & 人數<0處理
$('#coach-book-num').change(
  () => {
    let bookNum = $(this).val();
    if (bookNum < 0) {
      bookNum = 0;
    } else if (bookNum < booknumdiscount) {
      discountok = false;
      discountokJudge();
    } else if (bookNum >= booknumdiscount && bookNum <= booknumlimit) {
      discountok = true;
      discountokJudge();
      $('.coach-book-num-js').css('display', 'none');
    } else if (bookNum > booknumlimit) {
      bookNum = booknumlimit;
      $('.coach-book-num-js').css('display', 'block');
    } else {
      $('.coach-book-num-js').css('display', 'none');
    }
    // 將數字打入input
    $(this).val(bookNum);
    console.log(discountok);
  },
);

// 課程天數<0處理
$('#coach-book-days').change(
  () => {
    let bookNum = $(this).val();
    if (bookNum < 0) {
      bookNum = 0;
    }
    // 將數字打入input
    $(this).val(bookNum);
  },
);

// 價錢處理
// $('.coach-price')
$('.coach-price').html(thousandComma(coachprice));
