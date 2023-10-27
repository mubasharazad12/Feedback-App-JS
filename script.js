// Global
const MAX_CHARS = 150;

const textareaEl = document.querySelector(".form__textarea");
const counterEl = document.querySelector(".counter");
const formEl = document.querySelector('.form');
const feedBackEl = document.querySelector('.feedbacks');
const sumbitBtnEl = document.querySelector('.submit-btn__text');


//  Counter component
 textareaEl.addEventListener('input', function () {
    const maxNrChars= MAX_CHARS;
    const nrCharsTyped = textareaEl.value.length;
    var charsLeft= maxNrChars - nrCharsTyped;

    counterEl.textContent = charsLeft;
 })


 //Form Component
function showVisualIndicator(textCheck){

    const className = textCheck === 'valid' ? 'form--valid' : 'form--invalid';

    formEl.classList.add(className);

    setTimeout(() => {
        formEl.classList.remove(className);
    }, 2000);    

}

 formEl.addEventListener('submit' , function (event) {

    event.preventDefault();
    const text = textareaEl.value;

    if(text.includes('#') && text.length >= 5 ){
        showVisualIndicator('valid');
    } else {
        showVisualIndicator('invalid');
        textareaEl.focus();
        return;
    }

    //new feedback

    const hashtag = text.split(' ').find(words => words.includes("#"));
    const company = hashtag.substring(1);
    const badgeLetter = company.substring(0, 1).toUpperCase();
    const upVoteCount = 0;
    const daysAgo = 0;

    const feedBackItemHtml = `
        <li class="feedback">
            <button class="upvote">
                <i class="fa-solid fa-caret-up upvote__icon"></i>
                <span class="upvote__count">${upVoteCount}</span>
            </button>
            <section class="feedback__badge">
                <p class="feedback__letter">${badgeLetter}</p>
            </section>
            <div class="feedback__content">
                <p class="feedback__company">${company}</p>
                <p class="feedback__text">${text}</p>
            </div>
            <p class="feedback__date">${daysAgo === 0 ? "NEW" : `${daysAgo}d` }</p>
        </li>
    `;

    feedBackEl.insertAdjacentHTML("beforeend", feedBackItemHtml);
    textareaEl.value = '';
    sumbitBtnEl.blur();
    counterEl.textContent = MAX_CHARS;
 })


//  Feedback List Component

fetch('https://bytegrad.com/course-assets/js/1/api/feedbacks')
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log(data.feedbacks);
    });
