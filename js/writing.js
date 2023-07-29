import { TokenStorage, Request, deckUrl, Theme, cardUrl } from "./utility.js ";

const writingCardContainer = document.querySelector(".writing-wrapper");
const loadingSpinner = document.querySelector(".loading-spinner-container");
const exitBtn = document.querySelector(".writing-x-btn");
const checkBtn = document.querySelector(".check-btn");

const token = TokenStorage.getToken();
const deckId = localStorage.getItem("chosenDeckId");

let cardDefinitions = {};
let judgmentStorage = {};

class UI {
  mainWritingFunctionality(cards) {
    this.writingComposition(
      this.shuffleCards,
      this.gatherDefinitions,
      this.createCardElements,
      this.createUpdateMasteryCard,
      this.appendCards,
      this.swiperFunctionality,
      this.checkAnswer,
      this.exitBtnFunctionality 
    )(cards);
  }

  writingComposition(...fns) {
    return (cards) => {
      return fns.reduce((composed, f) => f(composed), cards);
    };
  }

  shuffleCards(cards) {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }

  gatherDefinitions(cards) {
    cards.forEach((card) => {
      cardDefinitions[card._id] = card.definition.map((def) =>
        def.toLowerCase().replace(/\s/g, "")
      );
    });
    console.log(cardDefinitions);
    return cards;
  }

  appendCards(cards) {
    cards.forEach((card) => {
      writingCardContainer.appendChild(card);
    });

    return cards;
  }

  exitBtnFunctionality() {
    exitBtn.addEventListener("click", () => {
      localStorage.removeItem("chosenDeckId");
      window.location.href = "./home.html";
    });
  }

  checkAnswer = (cards) => {
    const swiper = cards.pop();
    checkBtn.addEventListener("click", (e) => {
      const mainSection = document.querySelector(".main-section");
      const id = checkBtn.id.split("_")[1];
      const cardForm = document.querySelector(`#form_${id}`);
      const cardName = cardForm.parentNode.previousElementSibling;
      const cardFormInputs = [...cardForm.querySelectorAll("input")];

      if (this.noAnswer(cardFormInputs)) {
        return;
      }

      const correctAnswers = cardDefinitions[id];
      let judgedAnswers = [];

      cardFormInputs.forEach((input) => {
        const ans = input.value.toLowerCase().replace(/\s/g, "");

        if (correctAnswers.includes(ans)) {
          judgedAnswers.push("correct");
          input.classList.remove("incorrect-answer");
          input.classList.add("correct-answer");
        } else {
          judgedAnswers.push("incorrect");
          input.classList.remove("correct-answer");
          input.classList.add("incorrect-answer");
        }
      });

      this.clearCardName(cardName);
      if (judgedAnswers.includes("incorrect")) {
        cardName.classList.add("incorrect-answer");
        judgmentStorage[id] = false;
      } else {
        cardName.classList.add("correct-answer");
        judgmentStorage[id] = true;
      }

      this.disableInputs(cardFormInputs);
      e.target.classList.add("hide-check-btn");

      // adding tap-to slide next
      const slideNext = () => {
        swiper.slideNext();
        if (this.isLastCard(swiper)) {
          checkBtn.style.display = "none";
          // add an update functionality
          this.updateResult();
          this.updateJudgmentToDB();
        }
      };

      setTimeout(function () {
        mainSection.addEventListener("click", slideNext);
        mainSection.addEventListener("click", () => {
          mainSection.removeEventListener("click", slideNext);
        });
      }, 1);
    });
  };

  createCardElements(cards) {
    const cardElements = cards.map((card) => {
      const writingCard = document.createElement("div");
      writingCard.classList.add("writing-card");
      writingCard.classList.add("swiper-slide");
      writingCard.id = `id_${card._id}`;

      const cardInputs = card.definition.map((def) => {
        return `<input type="text" class="writing-input" />`;
      });

      writingCard.innerHTML = `              
      <div class="writing-cardname">
        <div class="cardname">
          ${card.cardname}
        </div>
      </div>
      <div class="writing-definition" onsubmit="return false;">
        <form class="writing-definition-inputs" id="form_${card._id}">
          ${cardInputs.join("")}
        </form>
      </div>`;

      return writingCard;
    });

    return cardElements;
  }

  createUpdateMasteryCard(cards) {
    const writingCard = document.createElement("div");
    writingCard.classList.add("writing-card");
    writingCard.classList.add("swiper-slide");
    writingCard.classList.add("update-card");

    writingCard.innerHTML = `
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
    cards.push(writingCard);

    return cards;
  }

  swiperFunctionality(cards) {
    const writingCards = [...document.querySelectorAll(".writing-card")];

    const swiper = new Swiper(".mySwiper", {
      // spaceBetween: 30,
      allowTouchMove: false,
      pagination: {
        el: ".swiper-pagination",
        type: "progressbar",
      },
      on: {
        init: function () {
          const card = writingCards[this.activeIndex];
          checkBtn.id = card.id;
        },
        slideChangeTransitionEnd: function () {
          const card = writingCards[this.activeIndex];
          checkBtn.id = card.id;
          checkBtn.classList.remove("hide-check-btn");
        },
      },
    });

    const array = [...cards, swiper];
    return array;
  }

  isLastCard(swiper) {
    const totalSlides = swiper.slides.length;
    const activeIndex = swiper.activeIndex;

    return activeIndex === totalSlides - 1;
  }

  clearCardName(cardName) {
    cardName.classList.remove("correct-answer");
    cardName.classList.remove("incorrect-answer");
  }

  disableInputs(inputs) {
    inputs.forEach((input) => {
      input.readOnly = true;
    });
  }

  noAnswer(inputs) {
    return inputs.every((input) => input.value === "");
  }

  updateResult() {
    const judgment = Object.values(judgmentStorage).reduce(
      (judgment, value) => {
        if (!judgment["correct"]) {
          judgment["correct"] = 0;
        }
        if (!judgment["incorrect"]) {
          judgment["incorrect"] = 0;
        }

        if (value) {
          judgment["correct"] = 1 + judgment.correct;
        }
        if (!value) {
          judgment["incorrect"] = 1 + judgment.incorrect;
        }

        return judgment;
      },
      {}
    );

    const correctStorage = document.querySelector(".update-card .correct div ");
    const incorrectStorage = document.querySelector(
      ".update-card .incorrect div "
    );

    correctStorage.textContent = judgment.correct;
    incorrectStorage.textContent = judgment.incorrect;
  }

  updateJudgmentToDB() {
    const updateBtn = document.querySelector(".update-mastery-btn");

    updateBtn.addEventListener("click", async () => {
      if (Object.keys(judgmentStorage).length === 0) return;
      loadingSpinner.classList.add("show-loading-spinner");
      for (const [id, judgment] of Object.entries(judgmentStorage)) {
        const data = {
          $inc: { mastery: judgment ? 1 : -1 },
          deck: deckId,
        };
        const res = await Request.updateReq(`${cardUrl}${id}`, data, token);
      }
      loadingSpinner.classList.remove("show-loading-spinner");
      location.reload();
    });
  }

  setMainHeight() {
    const headerHeight = document.querySelector(".writing-header").offsetHeight;
    const windowHeight = window.innerHeight;
    const mainHeight = windowHeight - headerHeight;
    document
      .querySelector(".main-section")
      .style.setProperty("--main-height", `${mainHeight}px`);
  }

  setTheme(themeProperties) {
    const root = document.documentElement;
    const headerLogo = document.querySelector(".writing-header-image img");
    headerLogo.src = `../assets/logos/${themeProperties.smallLogo}`;

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

window.addEventListener("load", () => {
  const ui = new UI();
  ui.setMainHeight();
});
window.addEventListener("resize", () => {
  const ui = new UI();
  ui.setMainHeight();
});

window.addEventListener("DOMContentLoaded", async () => {
  const res = await Request.getAllReq(cardUrl, token, deckId);
  const currentCards = res.data.cards;

  if (!Theme.getTheme()) Theme.setTheme();
  const themeProperties = Theme.getTheme();

  const ui = new UI();
  ui.setTheme(themeProperties);
  ui.mainWritingFunctionality(currentCards);
});
