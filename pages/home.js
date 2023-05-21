import {TokenStorage, Request, deckUrl, Theme} from './utility.js ';

const addIcon = document.querySelector('.fa-plus');
const blackOverlay = document.querySelector('.black-overlay');

const createDeckWindow = document.querySelector('.create-deck-window');
const createDeckNameInput = document.querySelector('.create-deck-name-input');
const createDescriptionInput = document.querySelector('.create-description-input');
const createFormBtn = document.querySelector('.create-form-btn');

const deckSectionContainer = document.querySelector('.deck-section-container');


const fixedBlackOverlay = document.querySelector('.fixed-black-overlay')
const optionsContainer = document.querySelector('.options-container');
const optionsXBtn = document.querySelector('.options-x-btn');

const editOptionBtn = document.querySelector('.edit-option')
const editDeckWindow = document.querySelector('.edit-deck-window');
const editDeckNameInput = document.querySelector('.edit-deck-name-input');
const editDescriptionInput = document.querySelector('.edit-description-input');
const editFormBtn = document.querySelector('.edit-form-btn');

const deleteOptionBtn = document.querySelector('.delete-option');
const confirmationModal = document.querySelector('.confirmation-modal');
const confirmationModalOverlay = document.querySelector('.confirmation-modal-overlay');
const yesConfirmation = document.querySelector('.confirmation-modal div span:first-child');
const noConfirmation = document.querySelector('.confirmation-modal div span:last-child');

const headerLogo = document.querySelector('.home-header-image img');
const profileContainer = document.querySelector('.profile-container');
const profileOverlay = document.querySelector('.profile-overlay');
const profileLogoutBtn = document.querySelector('.profile-logout-btn');

const themeContainer = document.querySelector('.theme-container');
const themeOverlay = document.querySelector('.theme-overlay');
const themeBtn = document.querySelector('.theme-setting');
const themeGrid = document.querySelector('.theme-grid');


//const token = 'b'
const token = TokenStorage.getToken();
let deckId = '';

class UI {
  
  deckFunctionality() {
    
    createFormBtn.addEventListener('click', this.createDeckFormCB);
    editFormBtn.addEventListener('click', this.editDeckFormCB);
    
    addIcon.addEventListener('click', () => {
      if (createDeckWindow.matches('.show-deck-window')) {
        createDeckWindow.classList.remove('show-deck-window'); 
        addIcon.classList.toggle('animate-icon');
        blackOverlay.classList.toggle('show-overlay');
        return
      }
      
      if (profileContainer.matches('.show-profile-container')){
        this.toggleProfile();
        return
      }
      
      if (themeContainer.matches('.show-theme-container')) {
        this.toggleTheme();
        return
      }
      
      if (editDeckWindow.matches('.show-deck-window')) {
        editDeckWindow.classList.remove('show-deck-window');
        addIcon.classList.toggle('animate-icon');
        blackOverlay.classList.toggle('show-overlay');
        return
      }
      this.toggleCreateDeckWindow();
    });
    
    
    editOptionBtn.addEventListener('click', () => {
          this.toggleEditDeckWindow()
          this.toggleOptionsWindow()
    });
    
    deleteOptionBtn.addEventListener('click', () => {
      this.toggleConfirmationModal()
    });
    
  }
  
  profileFunctionality() {
    
    headerLogo.addEventListener('click', () => {
      if (!createDeckWindow.matches('.show-deck-window') && !editDeckWindow.matches('.show-deck-window') && !themeContainer.matches('.show-theme-container')) {
        this.toggleProfile()
      }
    });
    
    profileLogoutBtn.addEventListener('click', () => {
      TokenStorage.removeToken();
      window.location.href = '../index.html';
    });
    
    themeBtn.addEventListener('click', () => {
      this.toggleProfile();
      this.toggleTheme();
    });
    
  }
  
  themeFunctionality() {
    themeGrid.addEventListener('click', (e) => {
      const element = e.target;
      const themeProperties = this.getThemeProperty(element);
      
      
      if (e.target.matches('#green-apple')) {
        themeProperties.smallLogo = 'green-apple-small.png';
        themeProperties.bigLogo = 'green-apple.png';
        themeProperties.focusedTheme = '.green-apple-background';
        this.setTheme(themeProperties);
        Theme.setTheme(themeProperties)
        
      }
      if (e.target.matches('#midnight-dusk')) {
        themeProperties.smallLogo = 'midnight-dusk-small.png';
        themeProperties.bigLogo = 'midnight-dusk.png';
        themeProperties.focusedTheme = '.midnight-dusk-background';
        this.setTheme(themeProperties);
        Theme.setTheme(themeProperties)
        
      }
      if (e.target.matches('#strawberry-daiquiri')) {
        themeProperties.smallLogo = 'strawberry-daiquiri-small.png';
        themeProperties.bigLogo = 'strawberry-daiquiri.png';
        themeProperties.focusedTheme = '.strawberry-daiquiri-background';
        this.setTheme(themeProperties);
        Theme.setTheme(themeProperties)
        
      }
      if (e.target.matches('#tako')) {
        themeProperties.smallLogo = 'tako-small.png';
        themeProperties.bigLogo = 'tako.png';
        themeProperties.focusedTheme = '.tako-background';
        this.setTheme(themeProperties);
        Theme.setTheme(themeProperties)
        
      }
      if (e.target.matches('#teal-and-turquoise')) {
        themeProperties.smallLogo = 'teal-and-turquoise-small.png';
        themeProperties.bigLogo = 'teal-and-turquoise.png';
        themeProperties.focusedTheme = '.teal-and-turquoise-background';
        this.setTheme(themeProperties);
        Theme.setTheme(themeProperties)
        
      }
      if (e.target.matches('#tidal-wave')) {
        themeProperties.smallLogo = 'tidal-wave-small.png';
        themeProperties.bigLogo = 'tidal-wave.png';
        themeProperties.focusedTheme = '.tidal-wave-background';
        this.setTheme(themeProperties);
        Theme.setTheme(themeProperties)
        
      }
      if (e.target.matches('#yin-and-yang')) {
        themeProperties.smallLogo = 'yin-and-yang-small.png';
        themeProperties.bigLogo = 'yin-and-yang.png';
        themeProperties.focusedTheme = '.yin-and-yang-background';
        this.setTheme(themeProperties);
        Theme.setTheme(themeProperties)
        
      }
      if (e.target.matches('#yotsuba')) {
        themeProperties.smallLogo = 'yotsuba-small.png';
        themeProperties.bigLogo = 'yotsuba.png';
        themeProperties.focusedTheme = '.yotsuba-background';
        this.setTheme(themeProperties);
        Theme.setTheme(themeProperties)
        
      }
      if (e.target.matches('#natural-sky')) {
        themeProperties.smallLogo = 'natural-sky-small.png';
        themeProperties.bigLogo = 'natural-sky.png';
        themeProperties.focusedTheme = '.natural-sky-background';
        this.setTheme(themeProperties);
        Theme.setTheme(themeProperties)
        
      }
      if (e.target.matches('#lavender')) {
        themeProperties.smallLogo = 'lavender-small.png';
        themeProperties.bigLogo = 'lavender.png';
        themeProperties.focusedTheme = '.lavender-background';
        this.setTheme(themeProperties);
        Theme.setTheme(themeProperties)
        
      }
      
    });
  }
  
  confirmationModalFunctionality() {
    yesConfirmation.addEventListener('click', () => {
      this.removeElement(deckId);
      this.toggleConfirmationModal();
      this.toggleOptionsWindow();
      this.displayTags()
    });
    
    noConfirmation.addEventListener('click', () => {
      this.toggleConfirmationModal()
    });
  }
  
  deckOptionsFunctionality(option) {
    option.addEventListener('click', () => {
        deckId = option.id;
        this.toggleOptionsWindow();
        this.populateEditWindow();
        console.log('angelika')
        
    });
    
  }
  
  async populateEditWindow() {
    const res = await Request.getReq(`${deckUrl}${deckId}`, token);
    const deck = res.data.deck;
    
    editDeckNameInput.value = deck.deckname;
    editDescriptionInput.value = deck.description;
  }
  
   async removeElement(id) {
    const res = await Request.deleteReq(`${deckUrl}${id}`, token);
    
    const element = document.getElementById(id);
    const deckElement = element.parentElement.parentElement;
    deckElement.remove()
  }
  
  toggleOptionsWindow() {
    fixedBlackOverlay.classList.toggle('show-fixed-black-overlay');
    optionsContainer.classList.toggle('show-options');
    optionsXBtn.addEventListener('click', () => {
      fixedBlackOverlay.classList.remove('show-fixed-black-overlay');
      optionsContainer.classList.remove('show-options');
      
    });
  }
  
  toggleEditDeckWindow() {
    addIcon.classList.toggle('animate-icon');
    blackOverlay.classList.toggle('show-overlay');
    editDeckWindow.classList.toggle('show-deck-window');
  }
  
  toggleCreateDeckWindow() {
    addIcon.classList.toggle('animate-icon');
    blackOverlay.classList.toggle('show-overlay');
    createDeckWindow.classList.toggle('show-deck-window'); 
  }
  
  toggleConfirmationModal() {
    confirmationModal.classList.toggle('show-confirmation-modal');
    confirmationModalOverlay.classList.toggle('show-confirmation-modal-overlay');
  }
  
  toggleProfile() {
    addIcon.classList.toggle('animate-icon');
    profileOverlay.classList.toggle('show-profile-overlay');
    profileContainer.classList.toggle('show-profile-container');
    headerLogo.classList.toggle('slide-header-logo');
  }
  
  toggleTheme() {
    addIcon.classList.toggle('animate-icon');
    themeContainer.classList.toggle('show-theme-container');
    themeOverlay.classList.toggle('show-theme-overlay');
  }
  
  createDeckFormCB = async (e) => {
    e.preventDefault();
    
    let data = {
      deckname: createDeckNameInput.value,
      description: createDescriptionInput.value
    }
    
    const res = await Request.postReq(deckUrl, data, token);
    const newDeck = res.data;
    
    // handling the errors
    if (res.response && res.response.status === 400) {
      const deckNameRegex = /deckname/i;
      const descriptionRegex = /description/i;
      const messages = res.response.data.message.split(',')
      messages.forEach(message => {
        if(deckNameRegex.test(message)) {
          this.displayError(message, createDeckNameInput);
        }
        if(descriptionRegex.test(message)) {
          this.displayError(message, createDescriptionInput);
        }
      });
      return
    }
    
    this.toggleCreateDeckWindow()
    this.displayDeck([newDeck])
    this.displayTags();
    createDeckNameInput.value = '';
    createDescriptionInput.value = '';
    
  }
  
  editDeckFormCB = async (e) => {
    e.preventDefault();
    
    let data = {
      deckname: editDeckNameInput.value,
      description: editDescriptionInput.value
    }
    
    const res = await Request.updateReq(`${deckUrl}${deckId}`, data, token);
    const newDeck = res.data.deck;
    
    // handling the errors
    if (res.response && res.response.status === 400) {
      const deckNameRegex = /deckname/i;
      const descriptionRegex = /description/i;
      const messages = res.response.data.message.split(',')
      messages.forEach(message => {
        if(deckNameRegex.test(message)) {
          this.displayError(message, editDeckNameInput);
        }
        if(descriptionRegex.test(message)) {
          this.displayError(message, editDescriptionInput);
        }
      });
      return;
    }
    
    this.toggleEditDeckWindow();
    this.editDeck(newDeck);
    this.displayTags();
    editDeckNameInput.value = '';
    editDescriptionInput.value = '';
    
  }
  
  displayDeck(decks) {
    decks.forEach(deck => {
      const div = document.createElement('div');
      div.classList.add('deck');
      div.innerHTML = `
        <div class="deck-title">
          <div class="deck-tag">
            <span>1</span>
          </div>
          <h2>${deck.deckname}</h2>
          <p>${deck.description}</p>
          <i class="fa-solid fa-ellipsis-vertical" id="${deck._id}"></i>
        </div>
          <div class="deck-items">
            <p>items</p>
          <span>26</span>
        </div>
      
      `;
      const deckOption = div.querySelector('.fa-ellipsis-vertical');
      this.deckOptionsFunctionality(deckOption)
      deckSectionContainer.appendChild(div);
    });
  }
  
  editDeck(deck) {
    const optionIcon  = document.getElementById(deckId);
    const element = optionIcon.parentElement.parentElement;
    element.innerHTML = `
        <div class="deck-title">
          <div class="deck-tag">
            <span>1</span>
          </div>
          <h2>${deck.deckname}</h2>
          <p>${deck.description}</p>
          <i class="fa-solid fa-ellipsis-vertical" id="${deck._id}"></i>
        </div>
          <div class="deck-items">
            <p>items</p>
          <span>26</span>
        </div>
      `;
    const deckOption = element.querySelector('.fa-ellipsis-vertical');
    deckOption.addEventListener('click', () => {
      deckId = deckOption.id;
      this.toggleOptionsWindow();
    });
  }
  
  displayTags() {
    const decks = [...deckSectionContainer.querySelectorAll('.deck')];
    let tagNumber = 1;
    decks.forEach(deck => {
      const tag = deck.querySelector('.deck-tag span');
      tag.innerHTML = tagNumber;
      tagNumber++;
    });
    
  }
  
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
  
  getThemeProperty(element) {
    const computedStyle = window.getComputedStyle(element);
      
    const themeProperties = {}
    themeProperties.primaryColor = computedStyle.getPropertyValue('--primary-color');
    themeProperties.secondaryColor = computedStyle.getPropertyValue('--secondary-color');
    themeProperties.background500 = computedStyle.getPropertyValue('--background-color-500');
    themeProperties.background400 = computedStyle.getPropertyValue('--background-color-400');
    themeProperties.background300 = computedStyle.getPropertyValue('--background-color-300');
    themeProperties.background3000 = computedStyle.getPropertyValue('--background-color-300-0');
    themeProperties.lightColor500 = computedStyle.getPropertyValue('--light-color-500');
    themeProperties.lightColor600 = computedStyle.getPropertyValue('--light-color-600');
    themeProperties.lightColor700 = computedStyle.getPropertyValue('--light-color-700');
       
    return themeProperties;
  }
  
  setTheme(themeProperties) {
    const root = document.documentElement;
    const headerLogo = document.querySelector('.home-header-image img');
    const profileLogo = document.querySelector('.profile-logo img');
    
    const themeBackgrounds = document.querySelectorAll('.theme-cell > div');
    console.log(themeBackgrounds)
    themeBackgrounds.forEach(background => {
      background.classList.remove('focus-theme');
    });
    
    const themeBackground = document.querySelector(themeProperties.focusedTheme);
    console.log(themeBackground)
    themeBackground.classList.add('focus-theme')
    
    headerLogo.src = `./${themeProperties.smallLogo}`
    profileLogo.src = `./${themeProperties.bigLogo}`
    
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
  const res = await Request.getAllReq(deckUrl, token);
  const currentDecks = res.data.deck;
  if(!Theme.getTheme()) Theme.setTheme();
  const themeProperties = Theme.getTheme();
  
  const ui = new UI;
  ui.setTheme(themeProperties)
  ui.displayDeck(currentDecks);
  ui.displayTags();
  ui.deckFunctionality();
  ui.confirmationModalFunctionality();
  ui.profileFunctionality();
  ui.themeFunctionality();
  
});
