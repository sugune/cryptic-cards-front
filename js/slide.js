import {TokenStorage, Request, deckUrl, Theme, cardUrl} from './utility.js ';



const token = TokenStorage.getToken();
const deckId = localStorage.getItem('deckId');

class UI {
  
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
  
}




window.addEventListener('DOMContentLoaded', async () => {
  const res = await Request.getAllReq(cardUrl, token, deckId);
  const currentCards = res.data.cards;
  
  if(!Theme.getTheme()) Theme.setTheme();
  const themeProperties = Theme.getTheme();
  
  const ui = new UI;
  ui.setTheme(themeProperties);
  
});