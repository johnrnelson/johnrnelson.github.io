/*
    Put some mojo in the resume... :-)
*/


/*
    New history HTML element....
*/
function NewHistoryElement(HistoryInformation) {
    // console.log(HistoryInformation);

    const HistoryElement = `
 
        <div class="col-md-4 HistoryRowWhenWhere">
            <span class="HistoryYear">${HistoryInformation.YearStart}-2015</span><br>
            <span class="HistoryCompany">${HistoryInformation.Company}</span><br>
            <span class="HistoryTitle">${HistoryInformation.Title}</span><br>
            <a title="Click to see map" class="HistoryLoc" target="_blank"
                    href="${HistoryInformation.LocationHref}">${HistoryInformation.Location}"</a>
        </div>
        <div class="col-md-8 HistoryTDDesc">
            <div class="HistoryDivDuty">
                    Design, code, debug, and publish custom applications for clients.
            </div>
            <div class="HistoryDivDuty">
                    Product development and proof of concepts.
            </div>
        </div>
  
    `;

    return HistoryElement;
}



function GetWorkHistory() {

    // WebApp.xhr("GET", "/data/resume/resume.json", "", function (error, data) {
    WebApp.xhr("GET", "/data/resume/work_history.json", "", function (error, data) {
        if (error) {
            console.warn(error);
        } else {
            const resume_history = document.getElementById("resume_history");
            resume_history.innerHTML = "<hr><hr>";


            try {
                const xhrDATA = JSON.parse(data);

                console.dir(xhrDATA);
                for (let index = 0; index < xhrDATA.history.length; index++) {
                    const element = xhrDATA.history[index];
                    // const doh = NewHistoryElement(element);
                    // console.info(doh);
                    const NewRow = document.createElement("div");
                    NewRow.className = "row HistoryRowHeader";
                    NewRow.innerHTML = NewHistoryElement(element);

                    resume_history.appendChild(NewRow);


                }

                // resume_history.innerHTML = "DEBUG!!!";
                // document.getElementById("result").innerHTML = JSON.stringify(xhrDATA, null, "\t");

            } catch (errJSON) {
                console.warn("bad JSON -->", data);
            }

        }
        //    debugger;
    });
}

window.onload = function () {


    if (!window.WebApp) {
        debugger;
    }
    GetWorkHistory();

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