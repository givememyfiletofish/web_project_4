import Card from "./Card.js";
import FormValidator from "./FormValidator.js";

const profileName = document.querySelector(".profile__name");
const profileAboutMe = document.querySelector(".profile__about-me");

const editButton = document.querySelector(".profile__edit-button");
const editPopup = document.querySelector(".popup_type_edit");
const editForm = editPopup.querySelector(".popup__form");
const editCloseButton = editPopup.querySelector(".popup__close");
const nameInput = editForm.querySelector(".popup__input_type_name");
const aboutMeInput = editForm.querySelector(".popup__input_type_about-me");

const addButton = document.querySelector(".profile__add-button");
const addPopup = document.querySelector(".popup_type_add");
const addForm = addPopup.querySelector(".popup__form");
const addCloseButton = addPopup.querySelector(".popup__close");
const titleInput = addForm.querySelector(".popup__input_type_title");
const imageLinkInput = addForm.querySelector(".popup__input_type_image-link");

const elementsList = document.querySelector(".elements__list");

const imagePopup = document.querySelector(".popup_type_image");
const imageCloseButton = imagePopup.querySelector(".popup__close");

const locationTemplate = document.querySelector("#location-template").content;

const initialCards = [
  {
    name: "Lago di Braies",
    link: "https://code.s3.yandex.net/web-code/lago.jpg",
  },

  {
    name: "Vanois National Park",
    link: "https://code.s3.yandex.net/web-code/vanois.jpg",
  },
  {
    name: "Latemar",
    link: "https://code.s3.yandex.net/web-code/latemar.jpg",
  },

  {
    name: "Bald Mountains",
    link: "https://code.s3.yandex.net/web-code/bald-mountains.jpg",
  },

  {
    name: "Lake Louise",
    link: "https://code.s3.yandex.net/web-code/lake-louise.jpg",
  },
  {
    name: "Yosemite Valley",
    link: "https://code.s3.yandex.net/web-code/yosemite.jpg",
  },
];

const popupList = Array.from(document.querySelectorAll(".popup"));

// Creates a listener for Esc key to close popups
function escapeKeyClose(e) {
  if (e.key === "Escape") {
    popupList.forEach((popup) => {
      if (popup.classList.contains("popup_opened")) {
        togglePopup(popup);

        if (checkHasForm(popup)) {
          closeFormHandler(popup);
        }
        document.removeEventListener("keyup", escapeKeyClose);
      }
    });
  }
}

function attachEscapeListener() {
  document.addEventListener("keyup", escapeKeyClose);
}

// Function to populate edit form when opened
function populateProfileEditForm(form) {
  nameInput.value = profileName.textContent;
  aboutMeInput.value = profileAboutMe.textContent;
}

// Function to toggle popup
function togglePopup(formElement) {
  formElement.classList.toggle("popup_opened");
}

// Function to handle edit form when submitted. Edit form will save new name/about me.
function editFormSubmitHandler(e) {
  e.preventDefault();
  profileName.textContent = nameInput.value.trim();
  profileAboutMe.textContent = aboutMeInput.value.trim();
}

// Function to handle add location form when submitted. Will create new location card.
function addFormSubmitHandler(e) {
  e.preventDefault();
  const card = new Card(
    titleInput.value.trim(),
    imageLinkInput.value.trim(),
    locationTemplate
  );
  const newCard = card.generateCard();
  elementsList.prepend(newCard);
  addForm.reset();
}

// Function to check if popup contains a form element
function checkHasForm(popup) {
  if (popup.querySelector(".popup__form")) {
    return true;
  }
  return false;
}

function hideInputError(form, inputField) {
  const errorField = form.querySelector(`#${inputField.id}-error`);
  inputField.classList.remove("popup__input_type_error");
  errorField.classList.remove("popup__input-error_visible");
  errorField.textContent = "";
}

function hasInvalidInput(inputList) {
  return inputList.some((inputField) => {
    if (inputField.validity.valid === false) {
      return true;
    }
  });
}

function toggleButtonState(inputList, buttonElement) {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add("button_inactive");
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove("button_inactive");
    buttonElement.disabled = false;
  }
}

// Function to close form popup and reset input fields
function closeFormHandler(popup) {
  const popupForm = popup.querySelector(".popup__form");
  popup.classList.remove("popup_opened");
  popupForm.reset();

  const inputList = Array.from(popupForm.querySelectorAll(".popup__input"));
  const submitButton = popupForm.querySelector(".popup__submit");
  toggleButtonState(inputList, submitButton);

  inputList.forEach((input) => {
    hideInputError(popupForm, input);
  });
}

// Function to close image popup
function closeImageHandler() {
  imagePopup.classList.remove("popup_opened");
}

// Iterate through pre-existing locations with forEach to create initial location cards on page load
initialCards.forEach((location) => {
  const card = new Card(location.name, location.link, locationTemplate);
  const newCard = card.generateCard();
  elementsList.prepend(newCard);
});

editButton.addEventListener("click", () => {
  populateProfileEditForm(editForm);
  togglePopup(editPopup);
  attachEscapeListener();
});

editCloseButton.addEventListener("click", () => {
  closeFormHandler(editPopup);
});

editPopup.addEventListener("click", (e) => {
  const targetElement = e.target;
  if (targetElement.classList.contains("popup")) {
    closeFormHandler(editPopup);
  }
});

editForm.addEventListener("submit", (e) => {
  editFormSubmitHandler(e);
  closeFormHandler(editPopup);
});

addButton.addEventListener("click", () => {
  togglePopup(addPopup);
  attachEscapeListener();
});

addCloseButton.addEventListener("click", () => {
  closeFormHandler(addPopup);
});

addPopup.addEventListener("click", (e) => {
  const targetElement = e.target;
  if (targetElement.classList.contains("popup")) {
    closeFormHandler(addPopup);
  }
});

addForm.addEventListener("submit", (e) => {
  addFormSubmitHandler(e);
  closeFormHandler(addPopup);
});

imageCloseButton.addEventListener("click", () => {
  closeImageHandler();
});

imagePopup.addEventListener("click", (e) => {
  const targetElement = e.target;
  if (targetElement.classList.contains("popup")) {
    closeImageHandler();
  }
});

const settings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__submit",
  inactiveButtonClass: "button_inactive",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__input-error_visible",
};

const formsList = Array.from(document.forms);

formsList.forEach((form) => {
  const newFormValidator = new FormValidator(settings, form);
  newFormValidator.enableValidation();
});

