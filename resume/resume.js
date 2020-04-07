/*
    Put some mojo in the resume... :-)
*/


/*
    New history HTML element....
*/
function NewHistoryElement(HistoryInformation) {
    // console.log(HistoryInformation);
    var DutyHTMLItems = [];
    for (let index = 0; index < HistoryInformation.duties.length; index++) {
        const element = HistoryInformation.duties[index];
        DutyHTMLItems.push(`<div class="HistoryDivDuty">${element}</div>`);
    }
 

    var TargetEndYear = parseInt(HistoryInformation.YearEnd);
    var displayYearDiff = "";
    const today = new Date();
 
    if (TargetEndYear) {         
        displayYearDiff = '<span style="color:gray">' + moment(new Date('01/01/' + TargetEndYear)).fromNow() + '<span><br>';         
    }
 
    const HistoryElement = ` 
        <div class="col-md-4 HistoryRowWhenWhere">
            <span class="HistoryYear">
            ${HistoryInformation.YearStart}-${HistoryInformation.YearEnd}</span><br>
            ${displayYearDiff}            
            <span class="HistoryCompany">${HistoryInformation.Company}</span><br>
            <span class="HistoryTitle">${HistoryInformation.Title}</span><br>
            <a title="Click to see map" class="HistoryLoc" target="_blank"
                    href="${HistoryInformation.LocationHref}">${HistoryInformation.Location}</a>
        </div>
        <div class="col-md-8 HistoryTDDesc">
            ${DutyHTMLItems.join('')}
        </div>
  
    `;

    return HistoryElement;
}



function GetWorkHistory() {
    WebApp.xhr("GET", "/data/resume/work_history.json", "", function (error, data) {
        if (error) {
            console.warn(error);
        } else {
            const resume_history = document.getElementById("resume_history");
 
            try {
                const xhrDATA = JSON.parse(data);

                console.dir(xhrDATA);
                for (let index = 0; index < xhrDATA.history.length; index++) {
                    const element = xhrDATA.history[index]; 
                    const NewRow = document.createElement("div");
                    NewRow.className = "row HistoryRowHeader";
                    NewRow.innerHTML = NewHistoryElement(element);
                    resume_history.appendChild(NewRow);
                }


            } catch (errParseData) {
                console.warn("\r\nGetWorkHistory ERROR -->", errParseData);
            }

        }//End xhr valid request....
    });
}


/*
    When the browser if ready it will fire off this bad boy...
*/
window.onload = function () {


    if (!window.WebApp) {
        debugger;
    }
    GetWorkHistory();

    return;

    /*
        Show the years for the dates in the work history...
    */
    const wrkDates = document.querySelectorAll('.HistoryYear');


    for (let index = 0; index < wrkDates.length; index++) {
        try {
            const wrkDt = wrkDates[index];
            const dtsAry = wrkDt.innerText.split('-');
            if (index > 0) {
                wrkDt.innerHTML += '<span style="color:gray"> (' + moment(new Date('01/01/' + dtsAry[1])).fromNow() + ')<span>';
            }
        } catch (errDate) {
            //Today is not a date so just ignore...
        }

    }

};