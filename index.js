const tempDate2 = new Date(); //today
document.getElementById("day2").value = tempDate2.getDate();
document.getElementById("month2").selectedIndex = tempDate2.getMonth();
document.getElementById("year2").value = tempDate2.getFullYear();

document.getElementById("day1").value = 2;
document.getElementById("month1").selectedIndex = 8;
document.getElementById("year1").value = 2019;

const FIRST_GREGORIAN_DATE = [1, 1582, 9, 15];
const LAST_BC_DATE = [0, 1, 11, 31];
const FIRST_AD_DATE = [1, 1, 0, 1];

const button = document.getElementById("button");
button.addEventListener("click", dateCalculator);

document.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("button").click();
  }
});

function dateCalculator() {
  document.getElementById("result").innerHTML = "";
  document.getElementById("errors").innerHTML = "";

  const date1 = [
    checkEra(document.getElementsByName("era1")),
    parseFloat(document.getElementById("year1").value),
    document.getElementById("month1").selectedIndex,
    parseFloat(document.getElementById("day1").value),
  ];

  const date2 = [
    checkEra(document.getElementsByName("era2")),
    parseFloat(document.getElementById("year2").value),
    document.getElementById("month2").selectedIndex,
    parseFloat(document.getElementById("day2").value),
  ];

  if (checkingTheValidityOfDates(date1, date2)) {
    const dateArray = gettingDatesInChronologicalOrder(date1, date2);

    // const event = whatEventHappend(dateArray);
    const datesDifferenceInDays = calculatingTheDatesDifferenceInDays(dateArray);
    const datesDifference = calculatingTheDateDifference(dateArray, parseInt(datesDifferenceInDays.split(" ")[0]));

    const resultElement = document.getElementById("result");
    resultElement.innerHTML = datesDifferenceInDays + datesDifference;
    resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function checkEra(era) {
  for (let i = 0; i < era.length; i++) {
    if (era[i].checked) {
      return i;
    }
  }
  return 0;
}

function leapYearCheck(date) {
  // date = [era, year, month, day];

  // Proleptic Julian calendar
  if (date[0] == 0 && (date[1] - 1) % 4 == 0) {
    return true;
  }

  // Julian calendar
  if (date[0] == 1 && date[1] <= FIRST_GREGORIAN_DATE[1]) {
    if (date[1] % 4 == 0) {
      return true;
    }
  }

  // Gregorian calendar
  if (date[0] == 1 && date[1] >= FIRST_GREGORIAN_DATE[1]) {
    if ((date[1] % 4 == 0 && date[1] % 100 != 0) || date[1] % 400 == 0) {
      return true;
    }
  }

  return false;
}

function checkingTheValidityOfDates(date1, date2) {
  // date = [era, year, month, day];

  let months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let errorStr = "";
  let result = true;

  months[1] = leapYearCheck(date1) ? 29 : 28;

  if (date1[3] % 1 != 0 || date1[3] < 1 || date1[3] > months[date1[2]]) {
    errorStr += checkingTheValidityOfDatesLocalization("day1");
    result = false;
  }

  months[1] = leapYearCheck(date2) ? 29 : 28;
  if (date2[3] % 1 != 0 || date2[3] < 1 || date2[3] > months[date2[2]]) {
    errorStr += checkingTheValidityOfDatesLocalization("day2");
    result = false;
  }

  if (date1[1] % 1 != 0 || date1[1] < 1) {
    errorStr += checkingTheValidityOfDatesLocalization("year1");
    result = false;
  }

  if (date2[1] % 1 != 0 || date2[1] < 1) {
    errorStr += checkingTheValidityOfDatesLocalization("year2");
    result = false;
  }

  if ((date1[1] + date2[1]) > Number.MAX_SAFE_INTEGER || Math.abs(date2[2] - date1[1]) > Number.MAX_SAFE_INTEGER) {
    errorStr += checkingTheValidityOfDatesLocalization("tooBigYear");
    result = false;
  }

  function isGregorianTransitionPeriod(date) {
    return date[0] === 1 && date[1] === 1582 && date[2] === 9 && date[3] > 4 && date[3] < 15;
  }

  document.getElementById("errorNote").textContent = "";
  if (result && (isGregorianTransitionPeriod(date1) || isGregorianTransitionPeriod(date2))) {
    document.getElementById("errorNote").textContent = isGregorianTransitionPeriodLocalization();
    result = false;
  }

  document.getElementById("errors").textContent = errorStr;
  return result;
}

function gettingDatesInChronologicalOrder(date1, date2) {
  // date = [era, year, month, day];
  if (date1[0] == date2[0] && date1[0] == 0) {
    // BC
    if (date1[1] < date2[1]) {
      return [date2, date1];
    }
    if (date1[1] > date2[1]) {
      return [date1, date2];
    }
  }
  for (let i = 0; i < date1.length; i++) {
    if (date1[i] < date2[i]) {
      return [date1, date2];
    }
    if (date1[i] > date2[i]) {
      return [date2, date1];
    }
  }
  return [date1, date2];
}

function calculatingTheDatesDifferenceInDays(dateArray) {
  //Difference between Gregorian And Julian Calendar in 1582 = 10;
  // date = [era, year, month, day];
  const date1 = dateArray[0];
  const date2 = dateArray[1];
  let result = 0;

  if (date1[0] == date2[0]) {
    //AD or BC 
    result = date2[3] - date1[3] + numberOfDaysSinceTheBeginningOfTheYear(date2) -
      numberOfDaysSinceTheBeginningOfTheYear(date1) + (Math.abs(date2[1] - date1[1])) * 365;
  } else {
    // BC and AD
    const tempResult1 = LAST_BC_DATE[3] - date1[3] - numberOfDaysSinceTheBeginningOfTheYear(date1) +
      numberOfDaysSinceTheBeginningOfTheYear(LAST_BC_DATE) + (date1[1] - LAST_BC_DATE[1]) * 365;
    const tempResult2 = date2[3] - FIRST_AD_DATE[3] + numberOfDaysSinceTheBeginningOfTheYear(date2) +
      (date2[1] - FIRST_AD_DATE[1]) * 365;
    result = tempResult1 + tempResult2 + 1;
  }
  result += calculatingNumberOfDaysInLeapYears(date1, date2) - changingJulianToGregorian(date1, date2);
  return daysLocalization(result);
}

function numberOfDaysSinceTheBeginningOfTheYear(date) {
  // date = [era, year, month, day];
  let months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  months[1] = leapYearCheck(date) ? 29 : 28;

  let result = 0;
  for (let i = 0; i < date[2]; i++) {
    result += months[i];
  }
  return result;
}

function calculatingNumberOfDaysInLeapYears(date1, date2) {
  // date = [era, year, month, day];
  let result = 0;
  if (date1[0] == date2[0]) {
    result = (date1 == 0) ? calculatingNumberOfDaysInLeapYearsHelperBC(date1, date2) :
      calculatingNumberOfDaysInLeapYearsHelperAD(date1, date2);
  } else {
    result = calculatingNumberOfDaysInLeapYearsHelperBC(date1, LAST_BC_DATE) +
      calculatingNumberOfDaysInLeapYearsHelperAD(FIRST_AD_DATE, date2);
  }
  return result;
}

function calculatingNumberOfDaysInLeapYearsHelperBC(tempDate1, tempDate2) {
  // date = [era, year, month, day];
  let date1 = tempDate1.slice();
  let date2 = tempDate2.slice();
  let result = 0;
  if (date1[1] - date2[1] >= 400) {
    result += Math.floor((date1[1] - date2[1]) / 400) * 100;
    date1[1] -= Math.floor((date1[1] - date2[1]) / 400) * 400;
  }
  if (date1[1] > date2[1]) {
    for (date2[1]++; date2[1] <= date1[1]; ++date2[1]) {
      if (leapYearCheck(date2)) {
        result++;
      }
    }
  }
  return result;
}

function calculatingNumberOfDaysInLeapYearsHelperAD(date1, date2) {
  if (changingJulianToGregorian(date1, date2)) {
    return calculateExtraLeapDays(date1, FIRST_GREGORIAN_DATE, 100) +
      calculateExtraLeapDays(FIRST_GREGORIAN_DATE, date2, 97);
  } else {
    const extraDays = (date2 == gettingDatesInChronologicalOrder(FIRST_GREGORIAN_DATE, date2)[1]) ? 97 : 100;
    return calculateExtraLeapDays(date1, date2, extraDays);
  }
}

function calculateExtraLeapDays(tempDate1, tempDate2, extraDays) {
  // date = [era, year, month, day];
  let date1 = tempDate1.slice();
  let date2 = tempDate2.slice();
  let result = 0;
  if (date2[1] - date1[1] >= 400) {
    result += Math.floor((date2[1] - date1[1]) / 400) * extraDays;
    date2[1] -= Math.floor((date2[1] - date1[1]) / 400) * 400;
  }
  if (date2[1] > date1[1]) {
    for (date1[1]; date1[1] < date2[1]; ++date1[1]) {
      if (leapYearCheck(date1)) {
        result++;
      }
    }
  }
  return result;
}

function changingJulianToGregorian(date1, date2) {

  if ((date1 == gettingDatesInChronologicalOrder(FIRST_GREGORIAN_DATE, date1)[0]) &&
    (date2 == gettingDatesInChronologicalOrder(FIRST_GREGORIAN_DATE, date2)[1])) {
    console.log("!!!!!")
    return 10;
  }

  return 0;
}

function calculatingTheDateDifference(dateArray, datesDifferenceInDays) {
  let result = "";
  // date = [era, year, month, day];
  let date1 = dateArray[0].slice();
  let date2 = dateArray[1].slice();
  let numberOfYears = 0;
  let numberOfMOnths = 0;
  let numberOfDays = 0;
  datesDifferenceInDays += calculatingTheDateDifferenceHelper(date1, date2) -
    calculatingNumberOfDaysInLeapYears(date1, date2) + changingJulianToGregorian(date1, date2);

  //number of years
  if (datesDifferenceInDays >= 365) {
    if (date1[0] == date2[0]) {
      numberOfYears = (Math.abs(date2[1] - date1[1]) - 1);
      datesDifferenceInDays -= (Math.abs(date2[1] - date1[1]) - 1) * 365;
    } else {
      datesDifferenceInDays--;
      numberOfYears = date1[1];
      datesDifferenceInDays -= date1[1] * 365;
      if (datesDifferenceInDays >= 365) {
        numberOfYears += date2[1] - 2;
        datesDifferenceInDays -= (date2[1] - 2) * 365;
      }
    }
  }
  while (datesDifferenceInDays >= 365) {
    numberOfYears++;
    datesDifferenceInDays -= 365;
  }
  if (numberOfYears) {
    result += yearsLocalization(numberOfYears);
  }

  //number of months
  if (datesDifferenceInDays >= 28) {
    if (date2[2] > date1[2]) {
      [numberOfMOnths, datesDifferenceInDays] = numberOfMonthsHelper(date1[2], date2[2], numberOfMOnths, datesDifferenceInDays);
    }
    if (date2[2] < date1[2]) {
      [numberOfMOnths, datesDifferenceInDays] = numberOfMonthsHelper(date1[2], 11, numberOfMOnths, datesDifferenceInDays);
      [numberOfMOnths, datesDifferenceInDays] = numberOfMonthsHelper(0, date2[2], numberOfMOnths, datesDifferenceInDays);
    }
  }
  if (numberOfMOnths) {
    result += result ? " " : "";
    result += monthsLocalization(numberOfMOnths);
  }

  //number of days
  numberOfDays = datesDifferenceInDays;
  if (datesDifferenceInDays && result) {
    result += " " + daysLocalization(numberOfDays);
  }
  return result ? orLocalization() + result : result;
}

function calculatingTheDateDifferenceHelper(date1, date2) {
  // the function corrects calculatingNumberOfDaysInLeapYears
  // that the leap day count meets the requirements of the calculatingTheDateDifference
  let result = 0;
  // date = [era, year, month, day];
  if (leapYearCheck(date1) && date1[2] >= 2) {
    result++;
  }
  if (leapYearCheck(date2) && date2[2] >= 2) {
    result--;
  }
  return result;
}

function numberOfMonthsHelper(month1, month2, numberOfMOnths, datesDifferenceInDays) {
  let months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  for (let i = month1; i <= month2; i++) {
    if (datesDifferenceInDays - months[i] >= 0) {
      numberOfMOnths++;
      datesDifferenceInDays -= months[i];
    }
  }
  return [numberOfMOnths, datesDifferenceInDays];
}