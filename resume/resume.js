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
        const dispDate = "1/1/" + dtsAry[1]; 
        wrkDt.title = "" + moment(dispDate).fromNow();
    }
};