/*
    Put some mojo in the resume... :-)
*/
window.onload = function () {
 
    /*
        Show the years for the dates in the work history...
    */
    const wrkDates = document.querySelectorAll('.HistoryYear');
 
    for (let index = 0; index < wrkDates.length; index++) {
        const wrkDt = wrkDates[index];
        const dtsAry = wrkDt.innerText.split("-");        
        wrkDt.title = "" + moment(new Date("01/01/" + dtsAry[1])).fromNow();
    }
};