const select = document.getElementById("LanguageSelect");
select.addEventListener("change", changeUrlLanguage);
const allLang = ['en', 'ru'];

function changeUrlLanguage() {
    let lang = select.value;
    location.href = window.location.pathname + "#" + lang;
    location.reload();
}

function changeLanguage() {
    let hash = window.location.hash.substring(1);
    if(!allLang.includes(hash)){
        location.href = window.location.pathname + "#en";
        location.reload();
    }
    select.value = hash;
    for (let key in langArray){
        if (langArray.hasOwnProperty(key)) {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = langArray[key][hash];
            }
        }
    }
    return select.value;
}
const lang = changeLanguage();
console.log(lang);