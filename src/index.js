import './sass/main.scss';
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";
import { alert, error } from '@pnotify/core';
  
import countriesService from './fetchCountries'

import _ from 'lodash.debounce';


const inputForm = document.querySelector('#country-input')
const countryList = document.querySelector('.country-list')
inputForm.addEventListener('input', _(onInputCountry, 500))

function onInputCountry(event) {
    event.preventDefault();
    const search = event.target.value;

    if (search === '') { countryList.innerHTML = ''; return; }

    countriesService(search)
        .then(countries => {
            const filteredCountries = makeCountryList(countries);
            console.log(countries)

            if (filteredCountries.length > 10) {
                countryList.innerHTML = '';
                console.log(filteredCountries.length)
                alertMsg()
            }
            else if (countries.length >= 2 && countries.length <= 10) {
                renderFilteredCountries(filteredCountries)
            }
            else if (countries.length === 1) {
                countryList.innerHTML = '';
               renderCountryInfo(countries[0])
            }
            
        }).catch(error => errortMsg());
}

function makeCountryList(countries) {
    return countries.map(country => country.name)
}

function renderFilteredCountries(filteredCountries) {
    countryList.innerHTML = '';
    const countryRefs = filteredCountries.map(createCountryRefs);

    countryList.append(...countryRefs);
}

function createCountryRefs(country) {
    const countryRef = document.createElement('h2');
    countryRef.classList.add('country');
    countryRef.textContent = country;
    return countryRef;
}

function renderCountryInfo({ name, capital, population, languages, flag }) {
    const markup =  `
    <h1><b>${name}</b></h1>
    <div>
        <div class="country-info">
            <div class="country-details">
                <p><b>Capital:</b> ${capital}</p>
                <p><b>Population:</b> ${population}</p>
                <p><b>Languages:</b> ${languages.map(language => language.name).join(', ')}</p>
            </div>
            <img src="${flag}" alt="flag">
        </div>
    </div>
    `
    return countryList.insertAdjacentHTML("beforeend", markup)
}

function alertMsg() {
    alert({
        text: "Пожалуйста, сделайте Ваш запрос более точным."
    });
}

function errortMsg() {
    error({
        text: "Oops! Что-то пошло не так. Введите корректное название страны."
    });
}