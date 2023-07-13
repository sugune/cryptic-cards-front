import {TokenStorage, Request, deckUrl, Theme, cardUrl} from './utility.js ';

const swiperPev = document.querySelector('.swiper-prev');
const swiperNext = document.querySelector('.swiper-next');
const sliderCardContainer = document.querySelector('.slider-card-wrapper');
const correctJudge = document.querySelector('.fa-circle-check');
const incorrectJudge = document.querySelector('.fa-circle-xmark');


const token = TokenStorage.getToken();
const deckId = localStorage.getItem('chosenDeckId');
let caretCounter = 0;
let prevCorrectJudgmentFunction;
let prevIncorrectJudgmentFunction;
let judgmentStorage = {}

class UI {
  
  cardDisplayFunctionality(cardsData) {
    
    this.compose(
      this.shuffleCards,
      this.createCards,
      this.createUpdateMasteryCard,
      this.appendCards
      )(cardsData);
    
    
    
  }
  
  
  displayCards = (randomizedCards) => {
    
  }
  
  appendCards(cards) {
    let counter = 0;
    cards.forEach(card => {
        counter++
      if (counter > 10) {
        card.style.opacity = 0;
      }
      sliderCardContainer.appendChild(card);
    });
  }
  
  shuffleCards(cards) {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }
  
  createCards(cards) {
    return cards.map(card => {
      const sliderCard = document.createElement('div');
      sliderCard.classList.add('slider-card')
      sliderCard.classList.add('swiper-slide');
      sliderCard.id = 'id_' + card._id;
      
      const definitions = card.definition.map(def => {
        return `<li class="item-definition">${def}</li>`;
      });
      
      sliderCard.innerHTML = `
      <div class="slider-cardname">
        <div class="cardname">
          ${card.cardname}
        </div>
        <h4>Answer:</h4>
      </div>
      <div class="slider-definition">
        <ul class="list-definition">
          ${definitions.join(' ')}
        </ul>
        <div class="reveal-definition"><i class="fa-regular fa-eye"></i></div>
      </div>
      `
      const revealDefinition = sliderCard.querySelector('.reveal-definition');
      revealDefinition.addEventListener('click', () => {
        revealDefinition.classList.add('show-reveal-definition');
      });
      
      return sliderCard;
    });
  }
  
  createUpdateMasteryCard(cards) {
    const sliderCard = document.createElement('div');
    sliderCard.classList.add('slider-card');
    sliderCard.classList.add('swiper-slide');
    sliderCard.classList.add('update-card');
    
    sliderCard.innerHTML = `
    <div class="update-card-container">
      <div class="correct">
        <h4>
          correct
        </h4>
        <div>6</div>
      </div>
      <div class="incorrect">
        <h4>
          incorrect
        </h4>
        <div>26</div>
      </div>
      
      <button class="update-mastery-btn">
        Update Mastery
      </button>
    </div>
    `;
    cards.push(sliderCard);
    
    return cards
  }
  
  compose(...fns) {
    return arg => {
      return fns.reduce((composed, f) => f(composed), arg);
    }
  }
  
  swiperNextFunctionality = () => {
    const cards = [...document.querySelectorAll('.slider-card')];
    caretCounter = caretCounter < cards.length ? caretCounter += 1 : caretCounter;
    if(caretCounter >= 5) {
      
      const leftCard = cards[caretCounter - 5];
      if (leftCard) {
        leftCard.style.opacity = 0;
      }
      
      const rightCard = cards[caretCounter + 5]
      if (rightCard) {
        rightCard.style.opacity = 1;
      }
    }
  }
  
  swiperPrevFunctionality = () => {
    if(caretCounter >= 5) {
      
      const cards = [...document.querySelectorAll('.slider-card')];
      const leftCard = cards[caretCounter - 5];
      if (leftCard) {
        leftCard.style.opacity = 1;
      }
      
      if (caretCounter < cards.length - 5) {
        const rightCard = cards[caretCounter + 5];
        if (rightCard) {
          rightCard.style.opacity = 0;
        }
      }
      
    }
    caretCounter = caretCounter > 0 ? caretCounter -= 1 : 0;
  }
  
  updateCollectiveJudgment(judgmentStorage) {
    
    const judgment = Object.values(judgmentStorage).reduce((judgment, value) => {
      if (!judgment['correct']) {
        judgment['correct'] = 0;
      }
      if (!judgment['incorrect']) {
        judgment['incorrect'] = 0;
      }
     
      if (value) {
        judgment['correct'] = 1 + judgment.correct;
      }
      if (!value) {
        judgment['incorrect'] = 1 + judgment.incorrect;
      }
      
      return judgment;
    }, {});
    
    
    const correctStorage = document.querySelector('.slider-card .correct div ');
    const incorrectStorage = document.querySelector('.slider-card .incorrect div ');
    
    correctStorage.textContent = judgment.correct
    incorrectStorage.textContent = judgment.incorrect
    console.log(judgment)
  }
  
  correctJudgment(activeIndex) {
    const cards = document.querySelectorAll('.slider-card');
    const activeCard = cards[activeIndex];
    const sliderDefinition = activeCard.querySelector('.slider-definition');
    
    
    const correctJudgmentFunction = () => {
      if (activeCard.matches('.update-card')) return
      
      activeCard.classList.remove('change-border-red')
      sliderDefinition.classList.remove('change-border-top-red')
      
      activeCard.classList.add('change-border-green')
      sliderDefinition.classList.add('change-border-top-green')
      
      judgmentStorage[activeCard.id.split('_')[1]] = true;
      
      this.updateCollectiveJudgment(judgmentStorage);
    }
    
    correctJudge.removeEventListener('click', prevCorrectJudgmentFunction);
    correctJudge.addEventListener('click', correctJudgmentFunction);
    
    prevCorrectJudgmentFunction = correctJudgmentFunction;
  }
  
  incorrectJudgment(activeIndex) {
    const cards = document.querySelectorAll('.slider-card');
    const activeCard = cards[activeIndex];
    const sliderDefinition = activeCard.querySelector('.slider-definition');
    
    const incorrectJudgmentFunction = () => {
      if (activeCard.matches('.update-card')) return
      
      activeCard.classList.remove('change-border-green')
      sliderDefinition.classList.remove('change-border-top-green')
      
      activeCard.classList.add('change-border-red')
      sliderDefinition.classList.add('change-border-top-red')
      judgmentStorage[activeCard.id.split('_')[1]] = false;
      
      this.updateCollectiveJudgment(judgmentStorage);
    }
    
    incorrectJudge.removeEventListener('click', prevIncorrectJudgmentFunction)
    incorrectJudge.addEventListener('click', incorrectJudgmentFunction);
    
    prevIncorrectJudgmentFunction = incorrectJudgmentFunction;
    
    
  }
  
  sliderFunctionality = () => {
    const self = this;
    
    const swiper = new Swiper(".mySwiper", {
      effect: "cards",
      grabCursor: true,
      allowTouchMove: false,
      
      pagination: {
        el: '.swiper-pagination',
        dynamicBullets: true,
        dynamicMainBullets: 10,
      },
      navigation: {
        nextEl: '.swiper-next',
        prevEl: '.swiper-prev',
      },
      scrollbar: {
        el: '.swiper-scrollbar',
      },
      
      on: {
        slideNextTransitionStart: function () {
          self.correctJudgment(this.activeIndex)
          self.incorrectJudgment(this.activeIndex)
          self.swiperNextFunctionality();
        },
        slidePrevTransitionStart: function () {
          self.correctJudgment(this.activeIndex)
          self.incorrectJudgment(this.activeIndex)
          self.swiperPrevFunctionality();
          
        },
        init: function() {
          self.correctJudgment(this.activeIndex)
          self.incorrectJudgment(this.activeIndex)
        }
        
      },
      
    });
  }
    
  setTheme(themeProperties) {
    const root = document.documentElement;
    const headerLogo = document.querySelector('.slide-header-image img');
    headerLogo.src = `../assets/logos/${themeProperties.smallLogo}`
    
    root.style.setProperty('--primary-color', themeProperties.primaryColor);
    root.style.setProperty('--secondary-color', themeProperties.secondaryColor);
    root.style.setProperty('--background-color-500', themeProperties.background500);
    root.style.setProperty('--background-color-400', themeProperties.background400);
    root.style.setProperty('--background-color-300', themeProperties.background300);
    root.style.setProperty('--background-color-300-0', themeProperties.background3000);
    root.style.setProperty('--light-color-500', themeProperties.lightColor500);
    root.style.setProperty('--light-color-600', themeProperties.lightColor600);
    root.style.setProperty('--light-color-700', themeProperties.lightColor700);
  }
  
}




window.addEventListener('DOMContentLoaded', async () => {
  const res = await Request.getAllReq(cardUrl, token, deckId);
  const currentCards = res.data.cards;
  
  if(!Theme.getTheme()) Theme.setTheme();
  const themeProperties = Theme.getTheme();
  console.log(res)
  const ui = new UI;
  ui.setTheme(themeProperties);
  ui.cardDisplayFunctionality([...currentCards]);
  ui.sliderFunctionality();
  
  
  
});