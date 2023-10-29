// Global
const MAX_CHARS = 150;
const BASE_API_URL = 'https://bytegrad.com/course-assets/js/1/api';

const textareaEl = document.querySelector(".form__textarea");
const counterEl = document.querySelector(".counter");
const formEl = document.querySelector('.form');
const feedBackEl = document.querySelector('.feedbacks');
const sumbitBtnEl = document.querySelector('.submit-btn__text');
const spinnerEl = document.querySelector('.spinner');
const hastaglistEl = document.querySelector('.hashtags');

//RenderList

function renderFeedbackItem(feedbackItem) {

    const feedBackItemHtml = `
        <li class="feedback">
            <button class="upvote">
                <i class="fa-solid fa-caret-up upvote__icon"></i>
                <span class="upvote__count">${feedbackItem.upvoteCount}</span>
            </button>
            <section class="feedback__badge">
                <p class="feedback__letter">${feedbackItem.badgeLetter}</p>
            </section>
            <div class="feedback__content">
                <p class="feedback__company">${feedbackItem.company}</p>
                <p class="feedback__text">${feedbackItem.text}</p>
            </div>
            <p class="feedback__date">${feedbackItem.daysAgo === 0 ? "NEW" : `${feedbackItem.daysAgo}d` }</p>
        </li>
    `;

    feedBackEl.insertAdjacentHTML("beforeend", feedBackItemHtml);

}


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
//Form Submit
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

    // render feedbacks
    const feedbackItem = {
        badgeLetter : badgeLetter,
        company : company,
        text : text,
        daysAgo : daysAgo,
        upvoteCount: upVoteCount
    }
    renderFeedbackItem(feedbackItem);

    //Send feedbacks

    fetch(`${BASE_API_URL}/feedbacks`, {
        method: 'POST',
        body: JSON.stringify(feedbackItem),
        headers: {
            Accept:  'application/json',
            'Content-Type': 'application/json'
        },

    }).then(response =>{
        if(!response.ok) {
            console.log("something wrong");
            return;
        }
        console.log("success res");
    }).catch(error =>{
        console.log(error);
    });
   

    textareaEl.value = '';
    sumbitBtnEl.blur();
    counterEl.textContent = MAX_CHARS;
 })


// feedback list expand
 feedBackEl.addEventListener('click', function(event){
    const clickedEl = event.target;
    
    const upvoteDetection = clickedEl.className.includes('upvote');

    if(upvoteDetection){
        const upvoteBtnEl =  clickedEl.closest('.upvote');
        upvoteBtnEl.disabled = true;
        const upvoteCountEl = upvoteBtnEl.querySelector('.upvote__count');
        let upvoteCount = +upvoteCountEl.textContent;
        upvoteCountEl.textContent = ++upvoteCount;

    }else{
        clickedEl.closest('.feedback').classList.toggle('feedback--expand');
    }
    
 })

//  Feedback List Component

fetch(`${BASE_API_URL}/feedbacks`)
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log(data.feedbacks);
        spinnerEl.remove();
        data.feedbacks.forEach(feedbackItem =>{
            
            renderFeedbackItem(feedbackItem);
     
         

        });
    })
    .catch(error => {
        feedBackEl.textContent= `Failed to fetch. Error message ${error.message}`;
    })


    // filter based on hashtag

    hastaglistEl.addEventListener('click' , function(event) {

        const clickedEl = event.target;
        if(clickedEl.className === 'hashtags') return;

        const companyNameHashtag = clickedEl.textContent.substring(1).toLowerCase().trim();

        feedBackEl.childNodes.forEach(child =>{
            if(child.nodeType === 3) return;

            const companyNamefromFeed = child.querySelector('.feedback__company').textContent.toLowerCase().trim();
            if(companyNameHashtag !== companyNamefromFeed){
                child.remove();
            }
        })


        
    })