// date 2 is today;
alert("GIT HUB");
const date = new Date();
document.getElementById("day2").value = date.getDate();
document.getElementById("month2").selectedIndex = date.getMonth();
document.getElementById("year2").value = date.getFullYear();

function dateCalculator() {
    document.getElementById("result").innerHTML = "";
    document.getElementById("errors").innerHTML = "";
parseInt
    // first date
    const day1 = parseInt(document.getElementById("day1").value);
    const month1 = document.getElementById("month1").selectedIndex;
    const year1 = parseInt(document.getElementById("year1").value);
    const era1 = checkEra(document.getElementsByName('era1'));

    //second date
    const day2 = parseInt(document.getElementById("day2").value);
    const month2 = document.getElementById("month2").selectedIndex;
    const year2 = parseInt(document.getElementById("year2").value);
    const era2 = checkEra(document.getElementsByName('era2'));

    let check = checkingTheValidityOfDates(day1, day2, month1, month2, year1, year2, era1, era2);

    if (check) {
        const date1 = [day1, month1, year1, era1];
        const date2 = [day2, month2, year2, era2];

        check = checkingFirstDateIsLessThanTheSecond(date1, date2);

        if (check) {
            // const calculatingTheDateDifference = calculatingTheDateDifference(date1, date2);;
            const calculatingTheDateDifferenceInDays = calculatingTheDate(date1, date2);
            document.getElementById("result").innerHTML = calculatingTheDateDifferenceInDays;
        }
    }
}

function checkEra(era) {
    for (let i = 0; i < era.length; i++) {
        if (era[i].checked) {
            return i;
        }
    }
    return -1;
}

function leapYearCheck(year, era) {
    // Proleptic Julian calendar
    if ((era == 0) && ((year - 1) % 4 == 0)) {
        return true;
    }
    // Julian calendar
    if ((era == 1) && (year < 1582)) {
        if ((year % 4 == 0)) {
            return true;
        }
    }
    // Gregorian calendar
    if ((era == 1) && (year > 1582)) {
        if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) {
            return true;
        }
    }
    return false;
}

function checkingTheValidityOfDates(day1, day2, month1, month2, year1, year2, era1, era2) {
    let months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let errorStr = "";
    let result = true;

    if (leapYearCheck(year1, era1)) {
        months[1] = 29;
    } else {
        months[1] = 28;
    }

    if ((day1 % 1 != 0) || (day1 < 1) || (day1 > months[month1])) {
        errorStr += " The first day is incorrect!";
        result = false;
    }

    if (leapYearCheck(year2, era2)) {
        months[1] = 29;
    } else {
        months[1] = 28;
    }

    if ((day2 % 1 != 0) || (day2 < 1) || (day2 > months[month2])) {
        errorStr += " The second day is incorrect!";
        result = false;
    }

    if ((year1 % 1 != 0) || (year1 < 1)) {
        errorStr += " The first year is incorrect!";
        result = false;
    }

    if ((year2 % 1 != 0) || (year2 < 1)) {
        errorStr += " The second year is incorrect!";
        result = false;
    }

    if (era1 == -1) {
        errorStr += " Choose the first era!"
        result = false;
    }

    if (era2 == -1) {
        errorStr += " Choose the second era!"
        result = false;
    }

    document.getElementById("errors").innerHTML = errorStr;
    return result;
}

function checkingFirstDateIsLessThanTheSecond(date1, date2) {
    // date = [day, month, year, era];
    if (date1[3] == date2[3] && date1[2] == date2[2] && date1[1] == date2[1] && date1[0] == date2[0]) {
        // date1 == date2
        document.getElementById("errors").innerHTML = "Two identical dates have been entered!";
        return false;

    } else if (date1[3] > date2[3]) {
        // AD and BC
        document.getElementById("errors").innerHTML = "The first date is less than the second!";
        return false;

    } else if ((date1[3] == date2[3]) && (date1[3] == 0)) {
        // BC
        if (date1[2] > date2[2]) {
            return true;
        } else if (date1[2] == date2[2]) {
            if (date1[1] < date2[1]) {
                return true;
            } else if ((date1[1] == date2[1]) && (date1[0] < date2[0])) {
                return true;
            } else {
                document.getElementById("errors").innerHTML = "The first date is less than the second!";
                return false;
            }
        } else {
            document.getElementById("errors").innerHTML = "The first date is less than the second!";
            return false;
        }

    } else if ((date1[3] == date2[3]) && (date1[3] == 1)) {
        // AD
        if (date1[2] < date2[2]) {
            return true;
        } else if (date1[2] == date2[2]) {
            if (date1[1] < date2[1]) {
                return true;
            } else if ((date1[1] == date2[1]) && (date1[0] < date2[0])) {
                return true;
            } else {
                document.getElementById("errors").innerHTML = "The first date is less than the second!";
                return false;
            }
        } else {
            document.getElementById("errors").innerHTML = "The first date is less than the second!";
            return false;
        }

    } else {
        return true;
    }
}

function calculatingTheDateDifference(date1, date2) {
    return "calculatingTheDateDifference";
}

function calculatingTheDate(date1, date2) {
    let result;
    if ((date1[3] == date2[3]) && date1[3] == 1) {
        //AD
        result = date2[0] - date1[0] + numberOfDaysSinceTheBeginningOfTheYear(date2[1])
            - numberOfDaysSinceTheBeginningOfTheYear(date1[1]) + (date2[2] - date1[2]) * 365;
    } else if ((date1[3] == date2[3]) && date1[3] == 0) {
        //BC
        result = date2[0] - date1[0] + numberOfDaysSinceTheBeginningOfTheYear(date2[1])
            - numberOfDaysSinceTheBeginningOfTheYear(date1[1]) + (date1[2] - date2[2]) * 365;
    } else {
        // BC and AD
        result = date2[0] + date1[0] + numberOfDaysSinceTheBeginningOfTheYear(date2[1])
            + numberOfDaysSinceTheBeginningOfTheYear(date1[1]) + (date2[2] + date1[2]) * 365;
    }
    result += numberOfDaysInLeapYears(date1, date2) - (date1[1] >= 1) - (date2[1] < 1);
    return result;
}

function numberOfDaysSinceTheBeginningOfTheYear(date) {
    const months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (leapYearCheck(date[2], date[3])) {
        months[1] = 29;
    } else {
        months[1] = 28;
    }

    let i = 0;
    let result = 0;
    while (date[1] != i) {
        result += months[i];
        i++;
    }
    return result;
}

function numberOfDaysInLeapYears(date1, date2) {
    let result = 0;
    let year1 = date1[2], year2 = date2[2];
    if ((date1[3] == date2[3]) && (date1[3] == 0)) {
        //BC
        while(((year1 - 1) % 400) != 0){
            if (leapYearCheck(year1, date1[3])) {
                result++;
            }
            year1--;
            console.log(year1,year2, result);
        };
        if ((year1 - year2) >= 400){
            result += (Math.floor((year1 - year2) / 400) * 100);
            year1 -= (Math.floor((year1 - year2) / 400)) * 400;
            console.log(year1,year2, result);
        }
        for (year2; year2 <= year1; ++year2) {
            if (leapYearCheck(year2, date2[3])) {
                result++;
            }
            console.log(year1,year2, result);
        }
    }
    return result;
}