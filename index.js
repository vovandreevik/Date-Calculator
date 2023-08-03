const tempDate = new Date(); //today
document.getElementById("day2").value = tempDate.getDate();
document.getElementById("month2").selectedIndex = tempDate.getMonth();
document.getElementById("year2").value = tempDate.getFullYear();

const FIRST_GRIGORIAN_YEAR = 1582;

function dateCalculator() {
    document.getElementById("result").innerHTML = "";
    document.getElementById("errors").innerHTML = "";

    const date1 = [parseInt(document.getElementById("day1").value), document.getElementById("month1").selectedIndex,
    parseInt(document.getElementById("year1").value), checkEra(document.getElementsByName('era1'))]

    const date2 = [parseInt(document.getElementById("day2").value), document.getElementById("month2").selectedIndex,
    parseInt(document.getElementById("year2").value), checkEra(document.getElementsByName('era2'))]

    if (checkingTheValidityOfDates(date1, date2)) {
        const dateArray = datesInChronologicalOrder(date1, date2);
        // const datesDifference = calculatingTheDateDifference(dateArray);
        // const event = whatEventHappend(dateArray);
        const datesDifferenceInDays = calculatingTheDatesDifferenceInDays(dateArray);
        document.getElementById("result").innerHTML = datesDifferenceInDays;
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
    if ((era == 1) && (year < FIRST_GRIGORIAN_YEAR)) {
        if ((year % 4 == 0)) {
            return true;
        }
    }
    // Gregorian calendar
    if ((era == 1) && (year > FIRST_GRIGORIAN_YEAR)) {
        if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) {
            return true;
        }
    }
    return false;
}

function checkingTheValidityOfDates(date1, date2) {
    // date = [day, month, year, era];
    let months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let errorStr = "";
    let result = true;

    if (leapYearCheck(date1[2], date1[3])) {
        months[1] = 29;
    } else {
        months[1] = 28;
    }

    if ((date1[0] % 1 != 0) || (date1[0] < 1) || (date1[0] > months[date1[1]])) {
        errorStr += " The first day is incorrect!";
        result = false;
    }

    if (leapYearCheck(date2[2], date2[3])) {
        months[1] = 29;
    } else {
        months[1] = 28;
    }

    if ((date2[0] % 1 != 0) || (date2[0] < 1) || (date2[0] > months[date2[1]])) {
        errorStr += " The second day is incorrect!";
        result = false;
    }

    if ((date1[2] % 1 != 0) || (date1[2] < 1)) {
        errorStr += " The first year is incorrect!";
        result = false;
    }

    if ((date2[2] % 1 != 0) || (date2[2] < 1)) {
        errorStr += " The second year is incorrect!";
        result = false;
    }

    if (date1[3] == -1) {
        errorStr += " Choose the first era!"
        result = false;
    }

    if (date2[3] == -1) {
        errorStr += " Choose the second era!"
        result = false;
    }

    if (date1[3] == date2[3] && date1[2] == date2[2] && date1[1] == date2[1] && date1[0] == date2[0]) {
        errorStr += "Two identical dates have been entered!";
        result = false;
    }

    document.getElementById("errors").innerHTML = errorStr;
    return result;
}

function datesInChronologicalOrder(date1, date2) {
    // date = [day, month, year, era];

    if (date1[3] > date2[3]) {
        // AD and BC
        date2[2]--;
        return [date2, date1];

    } else if ((date1[3] == date2[3]) && (date1[3] == 0)) {
        // BC
        if (date1[2] > date2[2]) {
            return [date1, date2];
        } else if (date1[2] == date2[2]) {
            if (date1[1] < date2[1]) {
                return [date1, date2];
            } else if ((date1[1] == date2[1]) && (date1[0] < date2[0])) {
                return [date1, date2];
            } else {
                return [date2, date1];
            }
        } else {
            return [date2, date1];
        }

    } else if ((date1[3] == date2[3]) && (date1[3] == 1)) {
        // AD
        if (date1[2] < date2[2]) {
            return [date1, date2];
        } else if (date1[2] == date2[2]) {
            if (date1[1] < date2[1]) {
                return [date1, date2];
            } else if ((date1[1] == date2[1]) && (date1[0] < date2[0])) {
                return [date1, date2];
            } else {
                return [date2, date1];
            }
        } else {
            return [date2, date1];
        }

    } else {
        date1[2]--;
        return [date1, date2];
    }
}

function calculatingTheDatesDifferenceInDays(dateArray) {
    // date = [day, month, year, era];
    const date1 = dateArray[0], date2 = dateArray[1];
    let result = 0;
    console.log(date1[2], date2[2], result,
        numberOfDaysSinceTheBeginningOfTheYear(date2), numberOfDaysSinceTheBeginningOfTheYear(date1));

    if ((date1[3] == date2[3]) && date1[3] == 1) {
        //AD
        ///????
        if ((date1[2] < FIRST_GRIGORIAN_YEAR) && (date2[2] > FIRST_GRIGORIAN_YEAR)) { /// ??? > / >=
            
        } else {
            result = date2[0] - date1[0] + numberOfDaysSinceTheBeginningOfTheYear(date2)
                - numberOfDaysSinceTheBeginningOfTheYear(date1) + (date2[2] - date1[2]) * 365;
        }

    } else if ((date1[3] == date2[3]) && date1[3] == 0) {
        //BC
        result = date2[0] - date1[0] + numberOfDaysSinceTheBeginningOfTheYear(date2)
            - numberOfDaysSinceTheBeginningOfTheYear(date1) + (date1[2] - date2[2]) * 365;
    } else {
        // BC and AD
        // ??? 
        result = date2[0] + date1[0] + numberOfDaysSinceTheBeginningOfTheYear(date2)
            + (365 - numberOfDaysSinceTheBeginningOfTheYear(date1)) + (date2[2] + date1[2] - 1) * 365;
    }
    console.log(date1[2], date2[2], result);
    result += calculateNumberOfDaysInLeapYears(date1, date2);
    console.log(date1[2], date2[2], result);
    if (result == 1) {
        return "1 day";
    }
    return result + " days";
}

function numberOfDaysSinceTheBeginningOfTheYear(date) {
    // date = [day, month, year, era];
    let months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
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

function calculateNumberOfDaysInLeapYears(date1, date2) {
    // date = [day, month, year, era];
    let result = 0;
    if ((date1[3] == date2[3]) && (date1[3] == 0)) {
        //BC
        if ((date1[2] - date2[2]) >= 400) {
            result += (Math.floor((date1[2] - date2[2]) / 400) * 100);
            date1[2] -= (Math.floor((date1[2] - date2[2]) / 400)) * 400;
        }
        console.log(date1[2], date2[2], result);
        if (date1[2] > date2[2]) {
            for (date2[2]; date2[2] <= date1[2]; ++date2[2]) {
                if (leapYearCheck(date2[2], date2[3])) {
                    result++;
                }
                console.log(date1[2], date2[2], result);
            }
        }
    }

    if ((date1[3] == date2[3]) && (date1[3] == 1)) {
        //AD
        if (date2[2] <= FIRST_GRIGORIAN_YEAR) {
            if ((date2[2] - date1[2]) >= 400) {
                result += (Math.floor((date2[2] - date1[2]) / 400) * 100);
                date2[2] -= (Math.floor((date2[2] - date1[2]) / 400)) * 400;
                console.log(date1[2], date2[2], result);
            }
            if (date2[2] > date1[2]) {
                for (date1[2]; date1[2] <= date2[2]; ++date1[2]) {
                    if (leapYearCheck(date1[2], date1[3])) {
                        result++;
                    }
                    console.log(date1[2], date2[2], result);
                }
            }
        }
        if (date1[2] >= FIRST_GRIGORIAN_YEAR) {
            if ((date2[2] - date1[2]) >= 400) {
                result += (Math.floor((date2[2] - date1[2]) / 400) * 97);
                date2[2] -= (Math.floor((date2[2] - date1[2]) / 400)) * 400;
                console.log(date1[2], date2[2], result);
            }
            if (date2[2] > date1[2]) {
                for (date1[2]; date1[2] <= date2[2]; ++date1[2]) {
                    if (leapYearCheck(date1[2], date1[3])) {
                        result++;
                    }
                    console.log(date1[2], date2[2], result);
                }
            }
        }
        if ((date1[2] <= FIRST_GRIGORIAN_YEAR) && (date2[2] >= FIRST_GRIGORIAN_YEAR)) {
            result = 0;
            //5 - 15 October 1582
        }
    }

    if ((date1[3] != date2[3])) {
        //BC and AD
        if (date2[2] < FIRST_GRIGORIAN_YEAR) {
            result = 0;
        }
        if (date2[2] >= FIRST_GRIGORIAN_YEAR) {
            result = 0;
        }
    }
    return result;
}