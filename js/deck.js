import {TokenStorage, Request, deckUrl, Theme, cardUrl} from './utility.js ';

// html elements

// header elements
const backNavigator = document.querySelector('.deck-header-name');
const headerPlusIcon = document.querySelector('.create-icon .fa-plus');
const createIcon = document.querySelector('.create-icon');
const deckHeaderName = document.querySelector('.deck-header-name');

// create card elements
const createCardWindow = document.querySelector('.create-card-window');
const createCardNameInput = document.querySelector('.create-card-name-input');
const createDefinitionInput = document.querySelector('.create-definition-input');
const createCardFormBtn = document.querySelector('.create-card-form-btn'); 
const blackOverlay = document.querySelector('.black-overlay');
const createDefinitionInputBoxes = document.querySelector('.create-definition-input-boxes');
const createDefinitionBtn = document.querySelector('.create-card-definition-icon');

// edit card elements
const editOptionBtn = document.querySelector('.edit-option');
const editCardWindow = document.querySelector('.edit-card-window');
const editCardNameInput = document.querySelector('.edit-card-name-input');
const editDefinitionInput = document.querySelector('.edit-definition-input');
const editCardFormBtn = document.querySelector('.edit-card-form-btn'); 
const editDefinitionInputBoxes = document.querySelector('.edit-definition-input-boxes');
const editDefinitionBtn = document.querySelector('.edit-card-definition-icon');

const cardsContainer = document.querySelector('.cards-container')

// mastery elements
const masteryBtn = document.querySelector('.mastery-btn');
const cardsBtn = document.querySelector('.cards-btn');
const cardMasteryContainer = document.querySelector('.card-mastery-container');
let cardMastery = document.querySelector('.card-mastery');

//options
const fixedBlackOverlay = document.querySelector('.fixed-black-overlay')
const optionsContainer = document.querySelector('.options-container');
const optionsXBtn = document.querySelector('.options-x-btn');

// confirmation modal elements
const deleteOptionBtn = document.querySelector('.delete-option');
const confirmationModal = document.querySelector('.confirmation-modal');
const confirmationModalOverlay = document.querySelector('.confirmation-modal-overlay');
const yesConfirmation = document.querySelector('.confirmation-modal div span:first-child');
const noConfirmation = document.querySelector('.confirmation-modal div span:last-child'); 

// card display elements

const cardDisplayOverlay = document.querySelector('.card-display-overlay');
const cardDisplay = document.querySelector('.card-display');
const cardDisplayTag = document.querySelector('.card-display .card-tag span');
const cardDisplayCardname = document.querySelector('.card-display-cardname');
const cardDisplayDefinitionList = document.querySelector('.definition-list');


const token = TokenStorage.getToken();
const deckId = localStorage.getItem('deckId');
let cardId;
let initialCardname = '';

class UI {
  
   
  deckPageFunctionality() {
    this.displayDeckName();
    this.backNavigation();
    this.headerPlusIconFunctionality();
    this.definitionBoxesFunctionality();
    this.masteryFunctionality();
    this.optionFunctionality();
    
    createCardFormBtn.addEventListener('click', this.createCardFormCB);
    editCardFormBtn.addEventListener('click', this.editCardFormCB);
    
    
   
    
  }
  
  createCardFormCB = async (e) => {
    e.preventDefault();
    
    let definitions = [...createDefinitionInputBoxes.querySelectorAll('.create-definition-input')];
    definitions = definitions.filter(definition => definition.value).map(definition => definition.value);
    
    let data = {
      cardname: createCardNameInput.value,
      definition: definitions,
      deck: deckId
    }
    
    this.emptyDefinitionsValue(createDefinitionInputBoxes);
    const res = await Request.postReq(cardUrl, data, token);
    
    // handling the errors
    if (res.response && res.response.status === 400) {
      const cardNameRegex = /cardname/i;
      const definitionRegex = /definition/i;
      const messages = res.response.data.message.split(',')
      messages.forEach(message => {
        if(cardNameRegex.test(message)) {
          this.displayError(message, createCardNameInput);
        }
        if(definitionRegex.test(message)) {
          this.displayError(message, createDefinitionInput);
        }
      });
      return
    }
    const newCard = res.data.card;
    
    createCardNameInput.value = '';
    this.displayCard([newCard]);
    this.displayTags();
    this.displayCardMastery([newCard]);
    this.displayCardNumber();
    
    
  }
  
  editCardFormCB = async (e) => {
    e.preventDefault();
    
    let definitions = [...editDefinitionInputBoxes.querySelectorAll('.edit-definition-input')];
    definitions = definitions.filter(definition => definition.value).map(definition => definition.value);
    
    let data = {
      definition: definitions,
      deck: deckId
    }
    
    if (editCardNameInput.value !== initialCardname) data.cardname = editCardNameInput.value;
    
    this.emptyDefinitionsValue(editDefinitionInputBoxes);
    this.toggleEditCardWindow(); 
    
    const res = await Request.updateReq(`${cardUrl}${cardId}`, data, token);
    
    // handling the errors
    if (res.response && res.response.status === 400) {
      
      const cardNameRegex = /cardname/i;
      const definitionRegex = /definition/i;
      const messages = res.response.data.message.split(',')
      messages.forEach(message => {
        if(cardNameRegex.test(message)) {
          this.displayError(message, editCardNameInput);
        }
        if(definitionRegex.test(message)) {
          this.displayError(message, editDefinitionInput);
        }
      });
      return
    }
    const newCard = res.data.card;
    
    editCardNameInput.value = ''; 
    this.displayEditedCard([newCard]);
    this.displayTags();
    this.displayEditedCardMastery(newCard)
    
    
  }
  
  // functionality functions
  definitionBoxesFunctionality() {
    createDefinitionBtn.addEventListener('click', () => {
      this.addCreateDefinitionInputBox();
    });
    
    editDefinitionBtn.addEventListener('click', () => {
      this.addEditDefinitionInputBox();
    });
    
  }
  
  backNavigation() {
    backNavigator.addEventListener('click', () => {
      localStorage.removeItem('deckId');
      window.location.href = './home.html';
    });
  }
  
  headerPlusIconFunctionality() {
    headerPlusIcon.addEventListener('click', () => {
      if (createCardWindow.matches('.show-card-window')) {
        this.toggleCreateCardWindow();
        return
      }
      
      if (editCardWindow.matches('.show-card-window')) {
        this.toggleEditCardWindow();
        return
      }
      
      if (cardDisplay.matches('.show-card-display')) {
        this.toggleCardDisplay();
        return
      }
      
      this.toggleCreateCardWindow();
    });
  }
  
  addCreateDefinitionInputBox() {
    createDefinitionInputBoxes.removeChild(createDefinitionBtn);
    const div = document.createElement('div');
    div.classList.add('input-box');
    div.innerHTML = `              
      <input class="card-definition-input create-definition-input" type="text" id="card-definition" required>
      <label for="card-definition">Definition</label>
      <span class="card-definition-delete-btn">
        <i class="fa-solid fa-trash"></i>
      </span>
      <div class="">error</div>`;
      
    const cardDefinitionDeleteBtn = div.querySelector('.card-definition-delete-btn');
    this.cardDefinitionDeleteBtnFunctionality(cardDefinitionDeleteBtn, createDefinitionInputBoxes);
    
    createDefinitionInputBoxes.appendChild(div);
    createDefinitionInputBoxes.appendChild(createDefinitionBtn);
  }
  
  addEditDefinitionInputBox() {
    editDefinitionInputBoxes.removeChild(editDefinitionBtn);
    const div = document.createElement('div');
    div.classList.add('input-box');
    div.innerHTML = `              
      <input class="card-definition-input edit-definition-input" type="text" id="card-definition" required>
      <label for="card-definition">Definition</label>
      <span class="card-definition-delete-btn">
        <i class="fa-solid fa-trash"></i>
      </span>
      <div class="">error</div>`;
      
    const cardDefinitionDeleteBtn = div.querySelector('.card-definition-delete-btn');
    this.cardDefinitionDeleteBtnFunctionality(cardDefinitionDeleteBtn, editDefinitionInputBoxes);
    
    editDefinitionInputBoxes.appendChild(div);
    editDefinitionInputBoxes.appendChild(editDefinitionBtn);
  }
  
  emptyDefinitionsValue(inputContainer) {
    const inputBoxes = [...inputContainer.querySelectorAll('.input-box input')];
    
    inputBoxes.forEach(inputBox => {
      inputBox.value = '';
    });
  }
  
  cardDefinitionDeleteBtnFunctionality(deleteBtn, container) {
    deleteBtn.addEventListener('click', () => {
      const parent = deleteBtn.parentNode;
      container.removeChild(parent);
    });
    
  }
  
  masteryFunctionality() {
    masteryBtn.addEventListener('click', () => {
      cardsBtn.disabled = true;
      
      cardMasteryContainer.classList.add('show-card-mastery-container');
      createIcon.classList.add('hide-create-icon')
      masteryBtn.classList.add('focused');
      cardsBtn.classList.remove('focused');
      setTimeout(() => {
        cardMastery.classList.add('show-card-mastery');
      }, 400);
      
      setTimeout(() => {
        cardsBtn.disabled = false;
      }, 800);
    });
    
    cardsBtn.addEventListener('click', () => {
      masteryBtn.disabled = true;
      
      createIcon.classList.remove('hide-create-icon')
      masteryBtn.classList.remove('focused');
      cardsBtn.classList.add('focused');
      cardMastery.classList.remove('show-card-mastery');
      setTimeout(() => {
      cardMasteryContainer.classList.remove('show-card-mastery-container');
      }, 400);
      
      setTimeout(() => {
        masteryBtn.disabled = false;
      }, 800);
    });
  }
  
  deckOptionsFunctionality(option) {
    option.addEventListener('click', () => {
        cardId = option.id;
        this.toggleOptionsWindow();
        this.populateEditWindow();
        
    });
  }
  
  async populateEditWindow() {
    const res = await Request.getReq(`${cardUrl}${deckId},${cardId}`, token);
    const card = res.data.card;
    initialCardname = card.cardname;
    const [definition, ...definitions] = card.definition;
    const [inputBox, ...inputBoxes] = [...editDefinitionInputBoxes.querySelectorAll('.input-box')];
    
    
    // cleaning edit window
    inputBoxes.forEach(input => {
      editDefinitionInputBoxes.removeChild(input);
    });
    this.emptyDefinitionsValue(editDefinitionInputBoxes);
    
    
    // populating the edit window
    editCardNameInput.value = card.cardname;
    editDefinitionInput.value = definition;
    
    definitions.forEach(def => {
      
      this.addEditDefinitionInputBox();
      const inputBoxes = [...editDefinitionInputBoxes.querySelectorAll('.input-box input')];
      inputBoxes[inputBoxes.length - 1].value = def;
      
    });
    
  }
  
  optionFunctionality() {
      this.confirmationModalFunctionality();
      
      editOptionBtn.addEventListener('click', () => {
      this.toggleEditCardWindow();
      this.toggleOptionsWindow();
      });
    
      deleteOptionBtn.addEventListener('click', () => {
        this.toggleConfirmationModal();
      });
    }
    
    confirmationModalFunctionality() {
      yesConfirmation.addEventListener('click', async () => {
        this.toggleConfirmationModal();
        this.toggleOptionsWindow();
        this.deleteCardMastery();
        this.removeElement(cardId);
        this.displayTags();
        const res = await Request.deleteReq(`${cardUrl}${deckId},${cardId}`, token);
      });
      
      noConfirmation.addEventListener('click', () => {
        this.toggleConfirmationModal();
      });
    }
    
    async removeElement(cardId) {
      const element = document.getElementById(cardId);
      const cardElement = element.parentElement;
      cardsContainer.removeChild(cardElement);
    }
    
    cardDisplayFunctionality(card) {
    const cardContents = card || [...document.querySelectorAll('.card-content')];
    
    cardContents.forEach(cardContent => {
      cardContent.addEventListener('click', async (e) => {
        
        if (e.target.matches('i') || e.target.matches('.card-tag') || e.target.matches('span')) {
          return
        }
        
        this.toggleCardDisplay();
        
        const element = e.currentTarget;
        const id = element.id;
        
        const res = await Request.getReq(`${cardUrl}${deckId},${id}`, token);
        const cardInfo = res.data.card;
        
        // information to display
        const tagNumber = element.querySelector('.card-tag span').innerHTML;
        const cardName = cardInfo.cardname;
        const definitions = cardInfo.definition
        
        cardDisplayCardname.textContent = cardName;
        cardDisplayTag.textContent = tagNumber;
        
        
        cardDisplayDefinitionList.innerHTML = '';
        definitions.forEach(def => {
          const li = document.createElement('li');
          li.textContent = def;
          cardDisplayDefinitionList.appendChild(li);
        });
      });
    });
  }
  
  
  
  // displaying functions
  displayError(message, element) {
    const parent = element.parentNode;
    let error = parent.lastElementChild;
    
    error.classList.add('error');
    error.innerHTML = message;
    
    setTimeout(function() {
      error.classList.remove('error');
    }, 2000);
    return
  }
  
  displayTags() {
    const cards = [...cardsContainer.querySelectorAll('.card')];
    
    let tagNumber = 1;
    cards.forEach(card => {
      const tag = card.querySelector('.card-tag span');
      tag.innerHTML = tagNumber;
      tagNumber++;
    });
  }
  
  displayCard(cards) {
    cards.forEach(card => {
      const div = document.createElement('div');
      div.classList.add('card');
      div.innerHTML = `
      <div class="card-content" id="${card._id}">
        <div class="card-tag">
        <span>1</span>
        </div>
        <h2>${card.cardname}</h2>
        <i id="${card._id}" class="fa-solid fa-ellipsis-vertical"></i>
      </div>`;
      const deckOption = div.querySelector('.fa-ellipsis-vertical');
      const cardContent = div.querySelector('.card-content');
      this.cardDisplayFunctionality([cardContent]);
      this.deckOptionsFunctionality(deckOption);
      cardsContainer.appendChild(div);
    });
  }
  
  displayEditedCard(cards) {
    cards.forEach(card => {
      const element = document.getElementById(cardId);
      const cardElement = element.parentNode;
      cardElement.innerHTML = `
      <div class="card-content" id="${card._id}">
        <div class="card-tag">
        <span>1</span>
        </div>
        <h2>${card.cardname}</h2>
        <i id="${card._id}" class="fa-solid fa-ellipsis-vertical"></i>
      </div>`;
      const deckOption = cardElement.querySelector('.fa-ellipsis-vertical');
      const cardContent = cardElement.querySelector('.card-content');
      this.cardDisplayFunctionality([cardContent])
      this.deckOptionsFunctionality(deckOption);
    });
  }
  
  displayCardMastery(cards) {
    cards.forEach((card, index) => {
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      const div3 = document.createElement('div');
      
      div1.classList.add('card-mastery-number');
      div2.classList.add('card-mastery-name');
      div2.classList.add(`a${card._id}`);
      div3.classList.add('card-mastery-proficiency');
      
      div1.id = `id${card._id}`;
      div2.id = `id${card._id}`;
      div3.id = `id${card._id}`;
      
      
      div1.textContent = `1`;
      div2.innerHTML = card.cardname;
      div3.textContent = card.mastery;
      
      cardMastery.appendChild(div1);
      cardMastery.appendChild(div2);
      cardMastery.appendChild(div3);
      
      
    });
  }
  
  displayEditedCardMastery(card) {
    const cardNameMastery = cardMastery.querySelector(`#id${card._id}`);
    
    cardNameMastery.innerHTML = card.cardname;
  }
  
  deleteCardMastery() {
    const masteryNumber = cardMastery.querySelector(`.card-mastery-number#id${cardId}`);
    const masteryName = cardMastery.querySelector(`.card-mastery-name#id${cardId}`);
    const masteryProficiency = cardMastery.querySelector(`.card-mastery-proficiency#id${cardId}`);
    
    cardMastery.removeChild(masteryNumber)
    cardMastery.removeChild(masteryName)
    cardMastery.removeChild(masteryProficiency)
    
    this.displayCardNumber()
  }
  
  displayCardNumber() {
    const cards = [...cardMastery.querySelectorAll('.card-mastery-number')];
    let tagNumber = 1;
    cards.forEach(card => {
      card.innerHTML = tagNumber;
      tagNumber++;
    });
  }
  
  async displayDeckName() {
    const res = await Request.getReq(`${deckUrl}${deckId}`, token);
    
    const deckInfo = res.data.deck;
    deckHeaderName.textContent = deckInfo.deckname;
  }
  
  setMainHeight() {
    const headerHeight = document.querySelector('.deck-header').offsetHeight;
    const windowHeight = window.innerHeight;
    const mainHeight = windowHeight - headerHeight;
    document.querySelector('body').style.setProperty('--main-height', `${mainHeight}px`)
  }
  
  setTheme(themeProperties) {
    const root = document.documentElement;
    
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
  
  // element toggle functions
  toggleCreateCardWindow() {
    createCardWindow.classList.toggle('show-card-window');
    headerPlusIcon.classList.toggle('animate-icon');
    blackOverlay.classList.toggle('show-overlay');
  }
  
  toggleOptionsWindow() {
    fixedBlackOverlay.classList.toggle('show-fixed-black-overlay');
    optionsContainer.classList.toggle('show-options');
    optionsXBtn.addEventListener('click', () => {
      fixedBlackOverlay.classList.remove('show-fixed-black-overlay');
      optionsContainer.classList.remove('show-options');
      
    });
  }
  
  toggleEditCardWindow() {
    headerPlusIcon.classList.toggle('animate-icon');
    blackOverlay.classList.toggle('show-overlay');
    editCardWindow.classList.toggle('show-card-window');
  }
  
  toggleConfirmationModal() {
    confirmationModal.classList.toggle('show-confirmation-modal');
    confirmationModalOverlay.classList.toggle('show-confirmation-modal-overlay');
  }
  
  toggleCardDisplay() {
    cardDisplay.classList.toggle('show-card-display');
    cardDisplayOverlay.classList.toggle('show-display-overlay');
    headerPlusIcon.classList.toggle('animate-icon');
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
  
  const ui = new UI;
  ui.setTheme(themeProperties);
  ui.displayCardMastery(currentCards);
  ui.displayCard(currentCards);
  ui.displayTags();
  ui.displayCardNumber();
  ui.deckPageFunctionality();
  
});