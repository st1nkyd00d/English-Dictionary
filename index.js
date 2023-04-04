const apiURL = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const searchButton = document.getElementById("search-button");
const searchResult = document.getElementById('search-result');
const pronunciationAudio = document.getElementById('pronunciation'); // Esta es para el boton con audio
const searchDebounced = debounce(search, 3000);
const loader = document.getElementById("loader");
const cover = document.getElementById("cover");
cover.classList.remove("active");
const logoLight = document.getElementById('logo-image');
const logoDark = document.getElementById('logo-image-dark');
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

applySavedTheme();
toggleSwitch.addEventListener('change', switchMode, false);

searchButton.addEventListener("click", function () {
    loader.classList.remove("invisible"); // muestra el loader
    cover.classList.add("active");
    searchDebounced(); // llama a search debounceado
});


function debounce(callback, delay) {
    let timeout
    return (...args) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            callback(...args)
        }, delay)
    }
}

function search() {
    let exampleTitle = document.getElementById('example-h3');
    let synonymTitle = document.getElementById('synonym-h3');
    let wordApi = document.getElementById('word-from-api');
    let pronunciationApi = document.getElementById('pronunciation-from-api');
    let wordMeaningApi = document.getElementById('meaning-from-api');
    let exampleApi = document.getElementById('example-from-api');
    let synonymApi = document.getElementById('synonym-from-api');
    let word = document.getElementById('input-word').value;
    if (word === '') {
        loader.classList.add("invisible");
        cover.classList.remove("active");
        alert('Please enter the word you are looking for');
        return;
    }
    fetch(`${apiURL}${word}`)
        .then((response) => response.json())
        .then((data) => {
            wordApi.innerHTML = `${word}`;
            pronunciationApi.innerHTML = `${data[0].phonetics.map((p) => p.text).join('     ')}`;
            let meaningsText = '';
            let examplesText = '';
            let synonymsText = '';
            data[0].meanings.forEach((m) => {
                meaningsText += `<p><strong>${m.partOfSpeech}</strong></p>`;
                m.definitions.forEach((d) => {
                    let newPara = document.createElement('p');
                    newPara.innerHTML = `${d.definition}`;
                    newPara.classList.add('meaning');
                    if (d.example) {
                        examplesText += `<p class="example">${d.example}</p>`;
                    }
                    if (d.synonyms && d.synonyms.length > 0) {
                        synonymsText += `<p class="synonym">${d.synonyms.join(', ')}</p>`;
                    }
                    meaningsText += newPara.outerHTML;
                });
            });
            if (examplesText) {
                exampleTitle.innerHTML = 'Examples';
            } else {
                exampleTitle.innerHTML = 'No examples available for this word';
            }
            if (synonymsText) {
                synonymTitle.innerHTML = 'Synonyms';
            } else {
                synonymTitle.innerHTML = 'No synonyms available for this word';
            }
            wordMeaningApi.innerHTML = meaningsText;
            exampleApi.innerHTML = examplesText;
            synonymApi.innerHTML = synonymsText;
            for (let k = 0; k < 5; k++) {
                if (data[0].phonetics[k].audio) {
                    pronunciationAudio.setAttribute('src', `${data[0].phonetics[k].audio}`)
                    break
                }
            }
        });
    loader.classList.add("invisible");
    cover.classList.remove("active");
}

function playAudio() {
    const audio = document.getElementById('pronunciation');
    audio.play();
}

function switchMode(e) {
    if (e.target.checked) {
        document.body.classList.add('dark-theme');
        logoLight.classList.add('hidden');
        logoDark.classList.remove('hidden');
        localStorage.setItem('theme', 'dark');
    }
    else {
        document.body.classList.remove('dark-theme');
        logoLight.classList.remove('hidden');
        logoDark.classList.add('hidden');
        localStorage.setItem('theme', 'light');
    }
}


function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        logoLight.classList.add('hidden');
        logoDark.classList.remove('hidden');
        toggleSwitch.checked = true

    }
    else {
        document.body.classList.remove('dark-theme');
        logoLight.classList.remove('hidden');
        logoDark.classList.add('hidden');
    }
}

