import {TokenStorage, Request, deckUrl, Theme, cardUrl} from './utility.js ';

const selectCardContainer = document.querySelector('.select-wrapper');
const loadingSpinner = document.querySelector('.loading-spinner-container');
const exitBtn = document.querySelector('.select-x-btn');

const token = TokenStorage.getToken();
const deckId = localStorage.getItem('chosenDeckId');

let definitions = [];
let judgmentStorage = {}

class UI {
  
  mainSelectFunctionality(currentCards) {
    this.selectComposition(
      this.shuffleCards,
      this.gatherDefinitions,
      this.createCardElements,
      this.createRandomizedChoices,
      this.createUpdateMasteryCard,
      this.appendCards,
      this.swiperFunctionality,
      this.createChoicesFunctionality,
      this.exitBtnFunctionality
      )(currentCards);
  }
  
  selectComposition(...fns) {
    return cards => {
      return fns.reduce((composed, f) => f(composed), cards)}
  }
  
  shuffleCards(cards) {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }
  
  appendCards(cards) {
    cards.forEach(card => {
      selectCardContainer.appendChild(card)
    }) 
    
    return cards
  }
  
  exitBtnFunctionality() {
    exitBtn.addEventListener('click', () => {
      localStorage.removeItem('chosenDeckId');
      window.location.href = './home.html';
    });
  }
  
  createCardElements(cards) {
    const cardElements = cards.map(card => {
      const selectCard = document.createElement('div');
      selectCard.classList.add('select-slide');
      selectCard.classList.add('swiper-slide');
      selectCard.id = `id_${card._id}`;
      
      const cardDefinitions = card.definition.map(def => {
        return `<li class="single-definition">${def}</li>`
      });
      
      selectCard.innerHTML = `
          <div class="select-cardname">
            <div class="cardname">
              ${card.cardname}
            </div>
          </div>
          <div class="select-definition">
            <ul class="select-list-definition">
              ${cardDefinitions.join(' ')}
            </ul>
          </div>
      `;
      
      return selectCard;
    });
    
    return cardElements;
  }
  
  createRandomizedChoices = (cards) => {
    const cardElements = cards.map(card => {
      
      let correctDefinitions = [...card.querySelectorAll('.single-definition')]
      let incorrectDefinitions = [];
        
      const lengthOfCorrectAnswer = correctDefinitions.length;
      const lengthOfChoices = lengthOfCorrectAnswer > 2 ? lengthOfCorrectAnswer * 2 : 4;
      
      // select random definition to incorrect choices
      for (let i = lengthOfCorrectAnswer; i < lengthOfChoices; i++) {
        const randomDefinition = this.getRandomDefinition(correctDefinitions);
        
        incorrectDefinitions.push(randomDefinition);
      }
      
      
      // specifying that a choice is correct or incorrect
      correctDefinitions = correctDefinitions.map(cD => {
        cD.setAttribute('data-identity', 'correct');
        return cD.outerHTML;
        })
      incorrectDefinitions = incorrectDefinitions.map(def => {
        return `<li class="single-definition" data-identity="incorrect" >${def}</li>`
      });
      
      // appending to the DOM (shuffled)
      let cardDefinitions = [...correctDefinitions, ...incorrectDefinitions];
      cardDefinitions = this.shuffleCards(cardDefinitions);
      card.querySelector('.select-list-definition').innerHTML = cardDefinitions.join(' ');
      
      //specifying the length of correct answer on each card
      card.dataset.lengthOfCorrectAnswer = lengthOfCorrectAnswer;
      return card;
    });
    
    return cardElements;
  }
  
  gatherDefinitions(cards) {
    definitions = cards.map(card => card.definition);
    definitions = definitions.reduce((array, definition) => {
      return array.length ? [...array, ...definition] : [...definition];
    }, []);
    
    return cards;
  }
  
  getRandomDefinition(correctDefinitions) {
    const existingDefinition = correctDefinitions.map(def => def.textContent);
    const randomIndex = Math.floor(Math.random() * definitions.length);
    const randomDefinition = definitions[randomIndex];
    
    return existingDefinition.includes(randomDefinition) ? this.getRandomDefinition(correctDefinitions) : randomDefinition;
  }
  
  swiperFunctionality(cards) {
    const swiper = new Swiper('.mySwiper', {
      // spaceBetween: 30,
      allowTouchMove: false,
      pagination: {
        el: '.swiper-pagination',
        type: 'progressbar'
      }
    });
    
    const array = [...cards, swiper];
    return array;
  }
  
  createChoicesFunctionality = (cards) => {
    const swiper = cards.pop();
    console.log(cards)
    cards.forEach(card => {
      let lengthOfCorrectAnswer = card.dataset.lengthOfCorrectAnswer;
      const id = card.id.split('_')[1];
      let answer = [];
      
      const listDefinitionsContainer = card.querySelector('.select-list-definition');
      if (!listDefinitionsContainer) return card
      
      listDefinitionsContainer.addEventListener('click', (e) => {
        if (e.target.matches('.single-definition') && lengthOfCorrectAnswer > 0) {
          
          if(e.target.dataset.identity === 'correct') {
            e.target.classList.add('correct-single-definition')
            e.target.classList.add('disable-single-definition')
            answer.push('correct')
          }
          
          if(e.target.dataset.identity === 'incorrect') {
            e.target.classList.add('incorrect-single-definition')
            e.target.classList.add('disable-single-definition')
            answer.push('incorrect')
          }
          
          lengthOfCorrectAnswer--;
          if (lengthOfCorrectAnswer === 0) {
            const mainSection = document.querySelector('.main-section');
            const cardElement = card.querySelector('.select-cardname');
            
            // overall answer is correct
            if (!answer.includes('incorrect')) {
              cardElement.classList.add('correct-answer');
              judgmentStorage[id] = true
            }
            
            // overall answer is incorrect
            if (answer.includes('incorrect')) {
              cardElement.classList.add('incorrect-answer');
              judgmentStorage[id] = false
            }
            
            // adding tap-to slide next
            const slideNext = () => {
              swiper.slideNext()
              if (this.isLastCard(swiper)) {
                this.updateResult();
                // add an update functionality
                this.updateJudgmentToDB();
              }
            }
            
            setTimeout(function() {
              mainSection.addEventListener('click', slideNext);
              mainSection.addEventListener('click', () => {
                mainSection.removeEventListener('click', slideNext);
              })
            }, 1);
          }
        }
      });
    });
  }
  
  createUpdateMasteryCard(cards) {
    const selectCard = document.createElement('div');
    selectCard.classList.add('select-card');
    selectCard.classList.add('swiper-slide');
    selectCard.classList.add('update-card');
    
    selectCard.innerHTML = `
    <div class="update-card-container">
      <div class="correct">
        <h4>
          correct
        </h4>
        <div>0</div>
      </div>
      <div class="incorrect">
        <h4>
          incorrect
        </h4>
        <div>0</div>
      </div>
      
      <button class="update-mastery-btn">
        Update Mastery
      </button>
    </div>
    `;
    cards.push(selectCard);
    
    return cards
  }
  
  isLastCard(swiper) {
    const totalSlides = swiper.slides.length;
    const activeIndex = swiper.activeIndex;
  
    return activeIndex === totalSlides - 1;
  }
  
  updateResult() {
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
    
    
    const correctStorage = document.querySelector('.select-card .correct div ');
    const incorrectStorage = document.querySelector('.select-card .incorrect div ');
    
    correctStorage.textContent = judgment.correct
    incorrectStorage.textContent = judgment.incorrect;
  }
  
  updateJudgmentToDB() {
    const updateBtn = document.querySelector('.update-mastery-btn');
    
    updateBtn.addEventListener('click', async () => {
      if (Object.keys(judgmentStorage).length === 0) return
      loadingSpinner.classList.add('show-loading-spinner');
      for (const [id, judgment] of Object.entries(judgmentStorage)) {
        const data = {
          $inc: {mastery: judgment ? 1 : -1},
          deck: deckId
        }
        const res = await Request.updateReq(`${cardUrl}${id}`, data, token);
      }
      loadingSpinner.classList.remove('show-loading-spinner');
      location.reload();
    });
  }
  
  setMainHeight() {
    const headerHeight = document.querySelector('.select-header').offsetHeight;
    const windowHeight = window.innerHeight;
    const mainHeight = windowHeight - headerHeight;
    document.querySelector('.main-section').style.setProperty('--main-height', `${mainHeight}px`);
  }
    
  setTheme(themeProperties) {
    const root = document.documentElement;
    const headerLogo = document.querySelector('.select-header-image img');
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

window.addEventListener('load', () => {
  const ui = new UI;
  ui.setMainHeight();
});
window.addEventListener('resize', () => {
  const ui = new UI;
  ui.setMainHeight();
}); 


window.addEventListener('DOMContentLoaded', async () => {
  const res = await Request.getAllReq(cardUrl, token, deckId);
  const currentCards = res.data.cards;
  
  if(!Theme.getTheme()) Theme.setTheme();
  const themeProperties = Theme.getTheme();
  console.log(res)
  const ui = new UI;
  ui.setTheme(themeProperties);
  ui.mainSelectFunctionality(currentCards);
  
  
});