import { TokenStorage, Request, deckUrl, cardUrl, Theme } from "./utility.js ";

const addIcon = document.querySelector(".fa-plus");
const blackOverlay = document.querySelector(".black-overlay");

const createDeckWindow = document.querySelector(".create-deck-window");
const createDeckNameInput = document.querySelector(".create-deck-name-input");
const createDescriptionInput = document.querySelector(
  ".create-description-input"
);
const createFormBtn = document.querySelector(".create-form-btn");

const deckSectionContainer = document.querySelector(".deck-section-container");

const fixedBlackOverlay = document.querySelector(".fixed-black-overlay");
const optionsContainer = document.querySelector(".options-container");
const optionsXBtn = document.querySelector(".options-x-btn");

const editOptionBtn = document.querySelector(".edit-option");
const editDeckWindow = document.querySelector(".edit-deck-window");
const editDeckNameInput = document.querySelector(".edit-deck-name-input");
const editDescriptionInput = document.querySelector(".edit-description-input");
const editFormBtn = document.querySelector(".edit-form-btn");

const deleteOptionBtn = document.querySelector(".delete-option");
const confirmationModal = document.querySelector(".confirmation-modal");
const confirmationModalOverlay = document.querySelector(
  ".confirmation-modal-overlay"
);
const yesConfirmation = document.querySelector(
  ".confirmation-modal div span:first-child"
);
const noConfirmation = document.querySelector(
  ".confirmation-modal div span:last-child"
);

const headerLogo = document.querySelector(".home-header-image img");
const profileContainer = document.querySelector(".profile-container");
const profileOverlay = document.querySelector(".profile-overlay");
const profileLogoutBtn = document.querySelector(".profile-logout-btn");
const profileUsername = document.querySelector(".profile-username span");

const themeContainer = document.querySelector(".theme-container");
const themeOverlay = document.querySelector(".theme-overlay");
const themeBtn = document.querySelector(".theme-setting");
const themeGrid = document.querySelector(".theme-grid");

// play elements
const playButton = document.querySelector(".play-button-container > i");
const chooseDeckContainer = document.querySelector(".choose-deck-container");
const chooseDeckOverlay = document.querySelector(".choose-deck-overlay");
const chooseDeck = document.querySelector(".choose-deck");

const chooseGameMethodOverlay = document.querySelector(
  ".choose-game-method-overlay"
);
const chooseGameMethodContainer = document.querySelector(
  ".choose-game-method-container"
);
const circleDisplay = document.querySelector(".circle-display");
const gameMethods = [
  ...document.querySelectorAll(".choose-game-method-container > div"),
];

const errorMessage = document.querySelector(".error-message-container");
const unavailableMessage = document.querySelector(
  ".unavailable-message-container"
);
const errorMessageOverlay = document.querySelector(".error-message-overlay");
const okBtn = document.querySelector(".ok-button");
const okButton = document.querySelector(".ok-btn");

// modal elements
const cardnameModal = document.querySelector(".cardname-modal");
const cardnameModalH2 = document.querySelector(".cardname-modal h2");
const descriptionModal = document.querySelector(".description-modal");
const descriptionModalP = document.querySelector(".description-modal p");
const modalOverlay = document.querySelector(".modal-overlay");
const cardnameModalXBtn = document.querySelector(".cardname-modal i");
const descriptionModalXBtn = document.querySelector(".description-modal i");

//const token = 'b'
const token = TokenStorage.getToken();
let deckId = "";
let initialDeckname;

class UI {
  deckFunctionality() {
    createFormBtn.addEventListener("click", this.createDeckFormCB);
    editFormBtn.addEventListener("click", this.editDeckFormCB);

    addIcon.addEventListener("click", this.addIconFunctionality);

    editOptionBtn.addEventListener("click", () => {
      this.toggleEditDeckWindow();
      this.toggleOptionsWindow();
    });

    deleteOptionBtn.addEventListener("click", () => {
      this.toggleConfirmationModal();
    });

    cardnameModalXBtn.addEventListener("click", () => {
      cardnameModal.classList.remove("show-cardname-modal");
      modalOverlay.classList.remove("show-modal-overlay");
    });
    descriptionModalXBtn.addEventListener("click", () => {
      descriptionModal.classList.remove("show-description-modal");
      modalOverlay.classList.remove("show-modal-overlay");
    });
  }

  profileFunctionality() {
    const username = localStorage.getItem("username");
    profileUsername.innerHTML = username;

    headerLogo.addEventListener("click", () => {
      if (
        !createDeckWindow.matches(".show-deck-window") &&
        !editDeckWindow.matches(".show-deck-window") &&
        !themeContainer.matches(".show-theme-container") &&
        !playButton.matches(".animate")
      ) {
        this.toggleProfile();
      }
    });

    profileLogoutBtn.addEventListener("click", () => {
      TokenStorage.removeToken();
      localStorage.removeItem("username");
      window.location.href = "../index.html";
    });

    themeBtn.addEventListener("click", () => {
      this.toggleProfile();
      this.toggleTheme();
    });
  }

  addIconFunctionality = () => {
    if (createDeckWindow.matches(".show-deck-window")) {
      createDeckWindow.classList.remove("show-deck-window");
      addIcon.classList.toggle("animate-icon");
      blackOverlay.classList.toggle("show-overlay");
      return;
    }

    if (profileContainer.matches(".show-profile-container")) {
      this.toggleProfile();
      return;
    }

    if (playButton.matches(".animate")) {
      this.toggleChooseDeck();
      if (errorMessage.matches(".show-error-message-container")) {
        this.toggleErrorMessage();
      }

      if (
        chooseGameMethodContainer.matches(".show-choose-game-method-container")
      ) {
        this.toggleGameMethods();
        circleDisplay.removeEventListener("click", this.toggleGameMethods);
      }

      return;
    }

    if (themeContainer.matches(".show-theme-container")) {
      this.toggleTheme();
      return;
    }

    if (editDeckWindow.matches(".show-deck-window")) {
      editDeckWindow.classList.remove("show-deck-window");
      addIcon.classList.toggle("animate-icon");
      blackOverlay.classList.toggle("show-overlay");
      return;
    }
    this.toggleCreateDeckWindow();
  };

  themeFunctionality() {
    themeGrid.addEventListener("click", (e) => {
      const element = e.target;
      const themeProperties = this.getThemeProperty(element);

      if (e.target.matches("#green-apple")) {
        themeProperties.smallLogo = "green-apple-small.png";
        themeProperties.bigLogo = "green-apple.png";
        themeProperties.focusedTheme = ".green-apple-background";
        this.setTheme(themeProperties);
        Theme.setTheme(themeProperties);
      }
      if (e.target.matches("#midnight-dusk")) {
        themeProperties.smallLogo = "midnight-dusk-small.png";
        themeProperties.bigLogo = "midnight-dusk.png";
        themeProperties.focusedTheme = ".midnight-dusk-background";
        this.setTheme(themeProperties);
        Theme.setTheme(themeProperties);
      }
      if (e.target.matches("#strawberry-daiquiri")) {
        themeProperties.smallLogo = "strawberry-daiquiri-small.png";
        themeProperties.bigLogo = "strawberry-daiquiri.png";
        themeProperties.focusedTheme = ".strawberry-daiquiri-background";
        this.setTheme(themeProperties);
        Theme.setTheme(themeProperties);
      }
      if (e.target.matches("#tako")) {
        themeProperties.smallLogo = "tako-small.png";
        themeProperties.bigLogo = "tako.png";
        themeProperties.focusedTheme = ".tako-background";
        this.setTheme(themeProperties);
        Theme.setTheme(themeProperties);
      }
      if (e.target.matches("#teal-and-turquoise")) {
        themeProperties.smallLogo = "teal-and-turquoise-small.png";
        themeProperties.bigLogo = "teal-and-turquoise.png";
        themeProperties.focusedTheme = ".teal-and-turquoise-background";
        this.setTheme(themeProperties);
        Theme.setTheme(themeProperties);
      }
      if (e.target.matches("#tidal-wave")) {
        themeProperties.smallLogo = "tidal-wave-small.png";
        themeProperties.bigLogo = "tidal-wave.png";
        themeProperties.focusedTheme = ".tidal-wave-background";
        this.setTheme(themeProperties);
        Theme.setTheme(themeProperties);
      }
      if (e.target.matches("#yin-and-yang")) {
        themeProperties.smallLogo = "yin-and-yang-small.png";
        themeProperties.bigLogo = "yin-and-yang.png";
        themeProperties.focusedTheme = ".yin-and-yang-background";
        this.setTheme(themeProperties);
        Theme.setTheme(themeProperties);
      }
      if (e.target.matches("#yotsuba")) {
        themeProperties.smallLogo = "yotsuba-small.png";
        themeProperties.bigLogo = "yotsuba.png";
        themeProperties.focusedTheme = ".yotsuba-background";
        this.setTheme(themeProperties);
        Theme.setTheme(themeProperties);
      }
      if (e.target.matches("#natural-sky")) {
        themeProperties.smallLogo = "natural-sky-small.png";
        themeProperties.bigLogo = "natural-sky.png";
        themeProperties.focusedTheme = ".natural-sky-background";
        this.setTheme(themeProperties);
        Theme.setTheme(themeProperties);
      }
      if (e.target.matches("#lavender")) {
        themeProperties.smallLogo = "lavender-small.png";
        themeProperties.bigLogo = "lavender.png";
        themeProperties.focusedTheme = ".lavender-background";
        this.setTheme(themeProperties);
        Theme.setTheme(themeProperties);
      }
    });
  }

  confirmationModalFunctionality() {
    yesConfirmation.addEventListener("click", async () => {
      this.toggleConfirmationModal();
      this.toggleOptionsWindow();
      this.removeElement(deckId);
      this.displayTags();
      this.displayDeckChoicesTags();
      const res = await Request.deleteReq(`${deckUrl}${deckId}`, token);
    });

    noConfirmation.addEventListener("click", () => {
      this.toggleConfirmationModal();
    });
  }

  deckOptionsFunctionality(option) {
    option.addEventListener("click", () => {
      deckId = option.id;
      this.toggleOptionsWindow();
      this.populateEditWindow();
    });
  }

  deckCardsNavigation(deckItemNavigator) {
    deckItemNavigator.addEventListener("click", () => {
      setTimeout(function () {
        window.location.href = "./deck.html";
      }, 300);
      localStorage.setItem("deckId", deckItemNavigator.id);
    });
  }

  playButtonFunctionality() {
    playButton.addEventListener("click", () => {
      addIcon.classList.toggle("animate-icon");
      playButton.classList.toggle("animate");
      chooseDeckOverlay.classList.toggle("show-choose-deck-overlay");
      addIcon.removeEventListener("click", this.addIconFunctionality);

      setTimeout(() => {
        chooseDeckContainer.classList.add("animate-choose-deck-container");
      }, 500);

      setTimeout(() => {
        addIcon.addEventListener("click", this.addIconFunctionality);
      }, 1000);
    });
  }

  async populateEditWindow() {
    const res = await Request.getReq(`${deckUrl}${deckId}`, token);
    const deck = res.data.deck;
    initialDeckname = deck.deckname;

    editDeckNameInput.value = deck.deckname;
    editDescriptionInput.value = deck.description;
  }

  async removeElement(id) {
    const element = document.getElementById(id);

    const chooseDeckElement = chooseDeck.querySelector(`#id_${id}`);
    const deckElement = element.parentElement.parentElement;

    deckElement.remove();
    chooseDeckElement.remove();
  }

  modalFunctionality(deckCardname, deckDescription) {
    deckCardname.addEventListener("click", (e) => {
      const content = e.target.textContent;

      cardnameModalH2.innerHTML = content;
      modalOverlay.classList.add("show-modal-overlay");
      cardnameModal.classList.add("show-cardname-modal");
    });

    deckDescription.addEventListener("click", (e) => {
      const content = e.target.textContent;

      descriptionModalP.innerHTML = content;
      descriptionModal.classList.add("show-description-modal");
      modalOverlay.classList.add("show-modal-overlay");
    });
  }

  toggleOptionsWindow() {
    fixedBlackOverlay.classList.toggle("show-fixed-black-overlay");
    optionsContainer.classList.toggle("show-options");
    optionsXBtn.addEventListener("click", () => {
      fixedBlackOverlay.classList.remove("show-fixed-black-overlay");
      optionsContainer.classList.remove("show-options");
    });
  }

  toggleChooseDeck() {
    chooseDeckContainer.classList.toggle("animate-choose-deck-container");
    addIcon.classList.toggle("animate-icon");
    setTimeout(() => {
      playButton.classList.toggle("animate");
      chooseDeckOverlay.classList.toggle("show-choose-deck-overlay");
    }, 500);
  }

  toggleEditDeckWindow() {
    addIcon.classList.toggle("animate-icon");
    blackOverlay.classList.toggle("show-overlay");
    editDeckWindow.classList.toggle("show-deck-window");
  }

  toggleCreateDeckWindow() {
    addIcon.classList.toggle("animate-icon");
    blackOverlay.classList.toggle("show-overlay");
    createDeckWindow.classList.toggle("show-deck-window");
  }

  toggleConfirmationModal() {
    confirmationModal.classList.toggle("show-confirmation-modal");
    confirmationModalOverlay.classList.toggle(
      "show-confirmation-modal-overlay"
    );
  }

  toggleProfile() {
    addIcon.classList.toggle("animate-icon");
    profileOverlay.classList.toggle("show-profile-overlay");
    profileContainer.classList.toggle("show-profile-container");
    headerLogo.classList.toggle("slide-header-logo");
  }

  toggleTheme() {
    addIcon.classList.toggle("animate-icon");
    themeContainer.classList.toggle("show-theme-container");
    themeOverlay.classList.toggle("show-theme-overlay");
  }

  toggleGameMethods() {
    chooseGameMethodOverlay.classList.toggle("show-choose-game-method-overlay");
    chooseGameMethodContainer.classList.toggle(
      "show-choose-game-method-container"
    );
    circleDisplay.classList.toggle("show-circle-display");
  }

  toggleErrorMessage() {
    errorMessage.classList.toggle("show-error-message-container");
    errorMessageOverlay.classList.toggle("show-error-message-overlay");
  }

  toggleUnavailableMessage() {
    unavailableMessage.classList.toggle("show-unavailable-message-container");
    errorMessageOverlay.classList.toggle("show-error-message-overlay");
  }

  createDeckFormCB = async (e) => {
    e.preventDefault();

    let data = {
      deckname: createDeckNameInput.value,
      description: createDescriptionInput.value,
    };
    createDeckNameInput.value = "";
    createDescriptionInput.value = "";
    this.toggleCreateDeckWindow();

    const res = await Request.postReq(deckUrl, data, token);
    const newDeck = res.data;
    
    // handling the errors
    if (res.response && res.response.status === 400) {
      const deckNameRegex = /deckname/i;
      const descriptionRegex = /description/i;
      const messages = res.response.data.message.split(",");
      messages.forEach((message) => {
        if (deckNameRegex.test(message)) {
          this.displayError(message, createDeckNameInput);
        }
        if (descriptionRegex.test(message)) {
          this.displayError(message, createDescriptionInput);
        }
      });
      return;
    }

    this.displayDeck([newDeck]);
    this.displayDeckChoices([newDeck]);
  };

  editDeckFormCB = async (e) => {
    e.preventDefault();

    let data = {
      description: editDescriptionInput.value,
    };

    if (editDeckNameInput.value !== initialDeckname)
      data.deckname = editDeckNameInput.value;
    editDeckNameInput.value = "";
    editDescriptionInput.value = "";
    this.toggleEditDeckWindow();

    const res = await Request.updateReq(`${deckUrl}${deckId}`, data, token);

    // handling the errors
    if (res.response && res.response.status === 400) {
      const deckNameRegex = /deckname/i;
      const descriptionRegex = /description/i;
      const messages = res.response.data.message.split(",");
      messages.forEach((message) => {
        if (deckNameRegex.test(message)) {
          this.displayError(message, editDeckNameInput);
        }
        if (descriptionRegex.test(message)) {
          this.displayError(message, editDescriptionInput);
        }
      });
      return;
    }
    const newDeck = res.data.deck;

    this.editDeck(newDeck);
    this.editDeckChoice(newDeck);
    this.displayTags();
  };

  async displayDeck(decks) {
    const deckLength = [...deckSectionContainer.querySelectorAll(".deck")]
      .length;

    let tagNumber = deckLength + 1;
    for (const deck of decks) {
      const res = await Request.getAllReq(cardUrl, token, deck._id);
      const cards = res.data.cards.length;
      const div = document.createElement("div");
      div.classList.add("deck");
      div.innerHTML = `
        <div class="deck-title">
          <div class="deck-tag">
            <span>${tagNumber}</span>
          </div>
          <h2>${deck.deckname}</h2>
          <p>${deck.description}</p>
          <i class="fa-solid fa-ellipsis-vertical" id="${deck._id}"></i>
        </div>
        <div id="${deck._id}" class="deck-items">
            <p>items</p>
          <span>${cards}</span>
        </div>
      
      `;

      const deckCardname = div.querySelector(".deck-title h2");
      const deckDescription = div.querySelector(".deck-title p");
      const deckOption = div.querySelector(".fa-ellipsis-vertical");
      const deckItemNavigator = div.querySelector(".deck-items");

      this.deckCardsNavigation(deckItemNavigator);
      this.deckOptionsFunctionality(deckOption);
      this.modalFunctionality(deckCardname, deckDescription);

      deckSectionContainer.appendChild(div);

      tagNumber++;
    }
  }

  gameMethodsFunctionality = () => {
    okBtn.addEventListener("click", () => {
      this.toggleErrorMessage();
    });
    okButton.addEventListener("click", () => {
      this.toggleUnavailableMessage();
    });

    gameMethods.forEach((method) => {
      method.addEventListener("click", (e) => {
        const id = localStorage.getItem("chosenDeckId");

        if (id === "invalid") {
          this.toggleErrorMessage();
          return;
        }

        if (e.currentTarget.matches(".slide-option")) {
          window.location.href = "./slide.html";
        }
        if (e.currentTarget.matches(".select-option")) {
          window.location.href = "./select.html";
        }
        if (e.currentTarget.matches(".writing-option")) {
          window.location.href = "./writing.html";
        }
        if (e.currentTarget.matches(".mix-option")) {
          this.toggleUnavailableMessage();
          // window.location.href = "./mix.html";
        }
      });
    });
  };

  gameMethodsToggleFunctionality = async (e) => {
    const id = e.currentTarget.id.split("_")[1];

    this.toggleGameMethods();

    circleDisplay.addEventListener("click", this.toggleGameMethods);
    circleDisplay.addEventListener("click", () => {
      if (
        !chooseGameMethodContainer.matches(".show-choose-game-method-container")
      ) {
        circleDisplay.removeEventListener("click", this.toggleGameMethods);
      }
    });

    const res = await Request.getAllReq(cardUrl, token, id);
    const cardLength = res.data.cards.length;

    if (cardLength < 5) {
      localStorage.setItem("chosenDeckId", "invalid");
    } else {
      localStorage.setItem("chosenDeckId", id);
    }
  };

  editDeck(deck) {
    const optionIcon = document.getElementById(deckId);
    const element = optionIcon.parentElement;
    element.innerHTML = `
          <div class="deck-tag">
            <span>1</span>
          </div>
          <h2>${deck.deckname}</h2>
          <p>${deck.description}</p>
          <i class="fa-solid fa-ellipsis-vertical" id="${deck._id}"></i>`;
    const deckOption = element.querySelector(".fa-ellipsis-vertical");
    const deckCardname = element.querySelector(".deck-title h2");
    const deckDescription = element.querySelector(".deck-title p");
    this.modalFunctionality(deckCardname, deckDescription);

    this.deckOptionsFunctionality(deckOption);
  }

  displayTags() {
    const decks = [...deckSectionContainer.querySelectorAll(".deck")];
    let tagNumber = 1;
    decks.forEach((deck) => {
      const tag = deck.querySelector(".deck-tag span");
      tag.innerHTML = tagNumber;
      tagNumber++;
    });
  }

  displayDeckChoicesTags() {
    const decks = [...chooseDeck.querySelectorAll(".choose-deck-single")];
    let tagNumber = 1;
    decks.forEach((deck) => {
      const tag = deck.querySelector(".choose-deck-tag span");
      tag.innerHTML = tagNumber;
      tagNumber++;
    });
  }

  displayDeckChoices(decks) {
    decks.forEach((deck) => {
      const div = document.createElement("div");
      div.classList.add("choose-deck-single");
      div.id = `id_${deck._id}`;
      div.innerHTML = `
      <div class="choose-deck-title">
        <div class="choose-deck-tag">
          <span>1</span>
        </div>
        <h2>${deck.deckname}</h2>
      </div>
      `;
      div.addEventListener("click", this.gameMethodsToggleFunctionality);
      chooseDeck.appendChild(div);
    });

    this.displayDeckChoicesTags();
  }

  editDeckChoice(deck) {
    const element = chooseDeck.querySelector(`#id_${deckId}`);
    element.innerHTML = `
      <div class="choose-deck-title">
        <div class="choose-deck-tag">
          <span>1</span>
        </div>
        <h2>${deck.deckname}</h2>
      </div>
      `;

    this.displayDeckChoicesTags();
  }

  displayError(message, element) {
    const parent = element.parentNode;
    let error = parent.lastElementChild;

    error.classList.add("error");
    error.innerHTML = message;

    setTimeout(function () {
      error.classList.remove("error");
    }, 2000);
    return;
  }

  getThemeProperty(element) {
    const computedStyle = window.getComputedStyle(element);

    const themeProperties = {};
    themeProperties.primaryColor =
      computedStyle.getPropertyValue("--primary-color");
    themeProperties.secondaryColor =
      computedStyle.getPropertyValue("--secondary-color");
    themeProperties.background500 = computedStyle.getPropertyValue(
      "--background-color-500"
    );
    themeProperties.background400 = computedStyle.getPropertyValue(
      "--background-color-400"
    );
    themeProperties.background300 = computedStyle.getPropertyValue(
      "--background-color-300"
    );
    themeProperties.background3000 = computedStyle.getPropertyValue(
      "--background-color-300-0"
    );
    themeProperties.lightColor500 =
      computedStyle.getPropertyValue("--light-color-500");
    themeProperties.lightColor600 =
      computedStyle.getPropertyValue("--light-color-600");
    themeProperties.lightColor700 =
      computedStyle.getPropertyValue("--light-color-700");

    return themeProperties;
  }

  setMainHeight() {
    const headerHeight = document.querySelector(".home-header").offsetHeight;
    const windowHeight = window.innerHeight;
    const mainHeight = windowHeight - headerHeight;
    document
      .querySelector("body")
      .style.setProperty("--main-height", `${mainHeight}px`);
  }

  setTheme(themeProperties) {
    const root = document.documentElement;
    const headerLogo = document.querySelector(".home-header-image img");
    const profileLogo = document.querySelector(".profile-logo img");

    const themeBackgrounds = document.querySelectorAll(".theme-cell > div");
    themeBackgrounds.forEach((background) => {
      background.classList.remove("focus-theme");
    });

    const themeBackground = document.querySelector(
      themeProperties.focusedTheme
    );
    
    themeBackground.classList.add("focus-theme");

    headerLogo.src = `../assets/logos/${themeProperties.smallLogo}`;
    profileLogo.src = `../assets/logos/${themeProperties.bigLogo}`;

    root.style.setProperty("--primary-color", themeProperties.primaryColor);
    root.style.setProperty("--secondary-color", themeProperties.secondaryColor);
    root.style.setProperty(
      "--background-color-500",
      themeProperties.background500
    );
    root.style.setProperty(
      "--background-color-400",
      themeProperties.background400
    );
    root.style.setProperty(
      "--background-color-300",
      themeProperties.background300
    );
    root.style.setProperty(
      "--background-color-300-0",
      themeProperties.background3000
    );
    root.style.setProperty("--light-color-500", themeProperties.lightColor500);
    root.style.setProperty("--light-color-600", themeProperties.lightColor600);
    root.style.setProperty("--light-color-700", themeProperties.lightColor700);
  }
}

window.addEventListener("pageshow", (e) => {
  if (e.persisted) {
    localStorage.removeItem("deckId");
    localStorage.removeItem("chosenDeckId");
    location.reload();
  }
});
window.addEventListener("load", () => {
  const ui = new UI();
  ui.setMainHeight();
});
window.addEventListener("resize", () => {
  const ui = new UI();
  ui.setMainHeight();
});

window.addEventListener("DOMContentLoaded", async () => {
  const res = await Request.getAllReq(deckUrl, token);
  const currentDecks = res.data.deck;
  if (!Theme.getTheme()) Theme.setTheme();
  const themeProperties = Theme.getTheme();

  const ui = new UI();
  ui.setTheme(themeProperties);
  ui.displayDeck(currentDecks);
  ui.playButtonFunctionality();
  ui.deckFunctionality();
  ui.displayDeckChoices(currentDecks);
  ui.confirmationModalFunctionality();
  ui.profileFunctionality();
  ui.themeFunctionality();
  ui.gameMethodsFunctionality();
});
