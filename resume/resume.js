/*
    Put some mojo in the resume... :-)
*/
window.onload = function () {
    console.log('ok ready for dates-->', moment);

    const wrkDates = document.querySelectorAll('.HistoryYear');
    for (let index = 0; index < wrkDates.length; index++) {
        const wrkDt = wrkDates[index];
        const dtsAry = wrkDt.innerText.split("-");
        const dispDate = "1/1/" + dtsAry[1];

        console.log(wrkDt.innerText, dispDate);

        wrkDt.title = "" + moment(dispDate).fromNow()


    }

};