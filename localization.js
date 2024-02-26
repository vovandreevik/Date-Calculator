const select = document.getElementById("LanguageSelect");
select.addEventListener("change", changeUrlLanguage);
const allLang = ['en', 'ru'];

const lang = changeLanguage();

function changeUrlLanguage() {
    let lang = select.value;
    location.href = window.location.pathname + "#" + lang;
    location.reload();
}

function changeLanguage() {
    let hash = window.location.hash.substring(1);
    if (!allLang.includes(hash)) {
        location.href = window.location.pathname + "#en";
        location.reload();
    }
    select.value = hash;
    for (let key in langArray) {
        if (langArray.hasOwnProperty(key)) {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = langArray[key][hash];
            }
        }
    }
    return select.value;
}

function checkingTheValidityOfDatesLocalization(str) {
    switch (str) {
        case "day1":
            return lang == "ru" ? "Первый день введён неверно!#" : "The first day is incorrect!#";
        case "day2":
            return lang == "ru" ? "Второй день введён неверно!#" : "The second day is incorrect!#";
        case "year1":
            return lang == "ru" ? "Первый год введён неверно!#" : "The first year is incorrect!#";
        case "year2":
            return lang == "ru" ? "Второй день введён неверно!#" : "The second year is incorrect!#";
        case "tooBigYear":
            return lang == "ru" ? "Введен слишком большой год!#" : "Enter a smaller year!#";
    };
}

// change text!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function isGregorianTransitionPeriodLocalization() {
    const ruErrorMessage = "Нет таких дат!";
    const enErrorMessage = "There are no such dates!";
    return lang == "ru" ? ruErrorMessage : enErrorMessage;
}

function daysLocalization(days) {
    if (lang == "ru") {
        return daysLocalizationRU(days);
    } else {
        return daysLocalizationEN(days);
    }
}

function daysLocalizationRU(days) {
    if (([11, 12, 13, 14].includes(days % 100)) || [5, 6, 7, 8, 9, 0].includes(days % 10)) return `${days} дней`;
    if (days % 10 == 1) return `${days} день`;
    return `${days} дня`;
}

function daysLocalizationEN(days) {
    return days == 1 ? "1 day" : `${days} days`;
}

function monthsLocalization(months) {
    if (lang == "ru") {
        return monthsLocalizationRU(months);
    } else {
        return monthsLocalizationEN(months);
    }
}

function monthsLocalizationRU(months) {
    if (months == 1) return `${months} месяц`;
    if (months < 5) return `${months} месяца`;
    return `${months} месяцев`;
}

function monthsLocalizationEN(months) {
    return months == 1 ? "1 month" : `${months} months`;
}

function yearsLocalization(years) {
    if (lang == "ru") {
        return yearsLocalizationRU(years);
    } else {
        return yearsLocalizationEN(years);
    }
}

function yearsLocalizationRU(years) {
    if (([11, 12, 13, 14].includes(years % 100)) || [5, 6, 7, 8, 9, 0].includes(years % 10)) return `${years} лет`;
    if (years % 10 == 1) return `${years} год`;
    return `${years} года`;
}

function yearsLocalizationEN(years) {
    return years == 1 ? "1 year" : `${years} years`;
}

function orLocalization(){
    return lang == "ru" ? "<br> или <br>" : "<br> or <br>";
}