var config = { attributes: true, characterData:true, subtree: true };

if(document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', afterDOMLoaded);
} else {
  afterDOMLoaded();
  var observer =  new MutationObserver(reload);
  observer.observe(document.body, config);
}

function afterDOMLoaded() {
  var year = document.getElementsByClassName("js-text")[0].innerText;
  var leaveTable = document.getElementsByTagName("table")[0];
  var totalVacationHours = 0;
  if (leaveTable) {
    for (let row of leaveTable.rows) {
      if (row.cells[1].innerText.includes("Annual vacation - " + year) &&
        row.cells[11].innerText === " Approved") {
        let duration = parseInt(row.cells[7].innerText);
        totalVacationHours += parseInt(duration);
      }
    }

    var leaveCollection = document.getElementsByClassName("cu-displayHorizontalGroup");
    var leaveVacationDays = 0;
    for (let leave of leaveCollection) {
      if (leave.innerText.includes(year)) {
        let value = leave.getElementsByClassName("cu-displayHorizontalValue")[0];
        leaveVacationDays = parseInt(value.innerText);
      }
    }
    var remainingVacationDays = 0;
    if (leaveVacationDays === 0) {
      remainingVacationDays = leaveVacationDays;
    } else {
      remainingVacationDays = leaveVacationDays - (totalVacationHours / 8);
    }
    
    localStorage.setItem(year, remainingVacationDays);
    var newPage = document.getElementById("PageContent");
    var dataCell = document.createElement("div");
    var spanTag = document.createElement("span");
    dataCell.setAttribute("id", "remaining-days");
    dataCell.style.cssText = `white-space: nowrap; font-weight: bold; background-color: #ffff;
                              max-width: 600px; padding: 15px;`;
    spanTag.style.cssText = "display:block; font-weight: normal;";
    if (Number(year) > 0) {
      dataCell.innerText = `Remaining Vacation Days ${year}`;
      spanTag.innerText = `${remainingVacationDays}`;
      var yearInt = parseInt(year) - 1;
      var yearStorageDays = localStorage.getItem(yearInt.toString());

      if (yearStorageDays) {
        var totalVacationHoursY = 0;
        for (let row of leaveTable.rows) {
          if (row.cells[1].innerText.includes("Annual vacation - " + yearInt) &&
            row.cells[11].innerText === " Approved") {
            let durationY = parseInt(row.cells[7].innerText);
            totalVacationHoursY += parseInt(durationY);
          }
        }
        var remainingVacationDaysY = 0;
        if (Number(yearStorageDays) === 0) {
          remainingVacationDaysY = yearStorageDays;
        } else {
          remainingVacationDaysY = yearStorageDays - (totalVacationHoursY / 8);
        }
        var dataCellY = document.createElement("div");
        var spanTagY = document.createElement("span");
        dataCellY.style.cssText = `white-space: nowrap; font-weight: bold; background-color: #ffff;
                                   max-width: 600px; padding: 15px 15px 0px 15px;`;
        spanTagY.style.cssText = "display:block; font-weight: normal;";
        dataCellY.innerText = `Remaining Vacation Days ${yearInt}`;
        spanTagY.innerText = `${remainingVacationDaysY}`;
        dataCellY.appendChild(spanTagY);
        newPage.appendChild(dataCellY);
      }
    } else {
      dataCell.innerText = "Please select a year number to see the remaining days, e.g. 2023, 2024..\n\n";
      let img = document.createElement('img');
      img.src = chrome.runtime.getURL("assets/year.png");
      spanTag.appendChild(img);
    }
    dataCell.appendChild(spanTag);
    newPage.appendChild(dataCell);
  }
};

function reload() {
  if (!document.getElementById("remaining-days")) {
    afterDOMLoaded();
  }
}