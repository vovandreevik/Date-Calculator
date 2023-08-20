const tempDate2 = new Date(); //today
document.getElementById("day2").value = tempDate2.getDate();
document.getElementById("month2").selectedIndex = tempDate2.getMonth();
document.getElementById("year2").value = tempDate2.getFullYear();

const FIRST_GREGORIAN_DATE = [1, 1582, 9, 15];

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
    parseInt(document.getElementById("year1").value),
    document.getElementById("month1").selectedIndex,
    parseInt(document.getElementById("day1").value),
  ];

  const date2 = [
    checkEra(document.getElementsByName("era2")),
    parseInt(document.getElementById("year2").value),
    document.getElementById("month2").selectedIndex,
    parseInt(document.getElementById("day2").value),
  ];

  if (checkingTheValidityOfDates(date1, date2)) {
    const dateArray = gettingDatesInChronologicalOrder(date1, date2);
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
    errorStr += "The first day is incorrect!";
    result = false;
  }

  months[1] = leapYearCheck(date2) ? 29 : 28;

  if (date2[3] % 1 != 0 || date2[3] < 1 || date2[3] > months[date2[2]]) {
    errorStr += " The second day is incorrect!";
    result = false;
  }

  if (date1[1] % 1 != 0 || date1[1] < 1) {
    errorStr += " The first year is incorrect!";
    result = false;
  }

  if (date2[1] % 1 != 0 || date2[1] < 1) {
    errorStr += " The second year is incorrect!";
    result = false;
  }

  if (date1[0] == -1) {
    errorStr += " Choose the first era!";
    result = false;
  }

  if (date2[0] == -1) {
    errorStr += " Choose the second era!";
    result = false;
  }

  if (result) {
    if (date1[0] == 1 && date1[1] == 1582 && date1[2] == 9) {
      if (date1[3] > 4 && date1[3] < 15) {
        errorStr += "GREGORIAN";
        result = false;
      }
    }
    if (date2[0] == 1 && date2[1] == 1582 && date2[2] == 9) {
      if (date2[3] > 4 && date2[3] < 15) {
        errorStr += "GREGORIAN";
        result = false;
      }
    }
  }

  document.getElementById("errors").innerHTML = errorStr;
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
    const tempDate = [0, 1, 11, 31];
    const tempResult1 = 31 - date1[3] - numberOfDaysSinceTheBeginningOfTheYear(date1) +
      numberOfDaysSinceTheBeginningOfTheYear(tempDate) + (date1[1] - 1) * 365;
    const tempResult2 = date2[3] - 1 + numberOfDaysSinceTheBeginningOfTheYear(date2) +
      (date2[1] - 1) * 365;
    result = tempResult1 + tempResult2 + 1;
  }
  console.log(result)
  result += calculateNumberOfDaysInLeapYears(date1, date2) - changingJulianToGregorian(date1, date2);

  if (result == 1) {
    return "1 day";
  }
  return result + " days";
}

function numberOfDaysSinceTheBeginningOfTheYear(date) {
  // date = [era, year, month, day];
  let months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (leapYearCheck(date)) {
    months[1] = 29;
  }

  let result = 0;
  for (let i = 0; i < date[2]; i++) {
    result += months[i];
  }
  return result;
}

function calculateNumberOfDaysInLeapYears(date1, date2) {
  // date = [era, year, month, day];
  let result = 0;



  if (changingJulianToGregorian(date1, date2)){
    console.log("Gregorian")
    result += JulianCalendar(date1, date2) + GregorianCalendar(date1, date2);
  }
  else {
    console.log("Julian")
    result += JulianCalendar(date1, date2);
  }
  return result;
}

function changingJulianToGregorian(date1, date2){
  if ((date1 == gettingDatesInChronologicalOrder(date1, FIRST_GREGORIAN_DATE)[0]) &&
      (date2 == gettingDatesInChronologicalOrder(FIRST_GREGORIAN_DATE, date2)[1])) {
      return 10;
    }
  return 0;
}

function JulianCalendar(date1, date2){
  if (date1[0] == date2[0]){
    if (date1[0] == 0){
      return JulianCalendarBC(date1, date2);
    }
    else {
      return JulianCalendarAD(date1, date2)
    }
  } else {
    const tempDate1 = [0, 1, 0, 1], tempDate2 = [1, 1, 0, 1]
    return JulianCalendarBC(date1, tempDate1) + JulianCalendarAD(tempDate2, date2)
  }
}

function JulianCalendarBC(date1, date2){
  console.log("!!!")
  let result = 0;
  if (date1[1] - date2[1] >= 400) {
    result += Math.floor((date1[1] - date2[1]) / 400) * 100;
    date1[1] -= Math.floor((date1[1] - date2[1]) / 400) * 400;
  }
  console.log(result)
  if (date1[1] > date2[1]) {
    let tempDate = date2;
    for (tempDate[1]++; tempDate[1] <= date1[1]; ++tempDate[1]) {
      if (leapYearCheck(tempDate)) {
        result++;
      }
    }
  }
  return result;
}

function JulianCalendarAD(date1, date2){
  if (date2[1] - date1[1] >= 400) {
    result += Math.floor((date2[1] - date1[1]) / 400) * 100;
    date2[1] -= Math.floor((date2[1] - date1[1]) / 400) * 400;
  }
  if (date2[1] > date1[1]) {
    for (date1[1]; date1[1] < date2[1]; ++date1[1]) {
      if (leapYearCheck(date1)) {
        result++;
      }
    }
  }
}

function GregorianCalendar(date1, date2){
  return 0;
}

      // if (date1[0] == date2[0]) {
      //   if (date1[0] == 1) {
          
      //   } else {
      //     // BC

      //     result += JulianCalendarBC(date1, date2);
      //   }
      // } else {
      //   //BC and AD before 15.10.1582
      //   const tempDate1 = [0, 1, 0, 1];
      //   if (date1[1] - tempDate1[1] >= 400) {
      //     result += Math.floor((date1[1] - tempDate1[1]) / 400) * 100;
      //     date1[1] -= Math.floor((date1[1] - tempDate1[1]) / 400) * 400;
      //   }
      //   if (date1[1] > tempDate1[1]) {
      //     for (tempDate1[1]; tempDate1[1] <= date1[1]; ++tempDate1[1]) {
      //       if (leapYearCheck(tempDate1)) {
      //         result++;
      //       }
      //     }
      //   }
      //   const tempDate2 = [1, 1, 0, 1];
      //   if (date2[1] - tempDate2[1] >= 400) {
      //     result += Math.floor((date2[1] - tempDate2[1]) / 400) * 97;
      //     date2[1] -= Math.floor((date2[1] - tempDate2[1]) / 400) * 400;
      //   }
      //   if (date2[1] > tempDate2[1]) {
      //     for (tempDate2[1]; tempDate2[1] < date2[1]; ++tempDate2[1]) {
      //       if (leapYearCheck(tempDate2)) {
      //         result++;
      //       }
      //     }
      //   }
      // }



