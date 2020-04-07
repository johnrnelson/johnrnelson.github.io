/*
      Timeline app code...
*/

window.WebTimeLine = {
      HTMLParent: {
            id: "timeline_viz"
      },
      Convert: {
            DateCast(DateRecord) {
                  console.log("Cast Title", DateRecord.title);

                  const CastRecord = {
                        id: WebApp.NewID(''),
                        content: 'item ' + DateRecord.title,
                        start: '2010-04-20'
                  }

                  try {
                        // { id: 11, content: 'item 1', start: '2010-04-20' }
                  } catch (errDateConvert) {
                        debugger;

                  }
                  return CastRecord
            }
      },
      GetData(DataURL, OnData) {


            WebApp.xhr("GET", "/data/timeline/jrn.json", "", function (error, data) {
                  if (error) {
                        console.warn(error);
                  } else {


                        try {
                              const xhrDATA = JSON.parse(data);
                              const dates_list = [];

                              for (let index = 0; index < xhrDATA.dates.length; index++) {
                                    const dateRecord = xhrDATA.dates[index];

                                    dates_list.push(WebTimeLine.Convert.DateCast(dateRecord));
                              }

                              OnData(null, dates_list);
                        } catch (errParseData) {

                              OnData(errParseData, null);
                        }

                  }//End xhr valid request....
            });
      }
};


/*
    When the browser if ready it will fire off this bad boy...
*/
window.onload = function () {
      WebTimeLine.HTMLParent.Control = document.getElementById(WebTimeLine.HTMLParent.id);


      window.WebTimeLine.GetData('/data/timeline/jrn.json', function (err, time_data) {
            if (err) {
                  console.warn("\r\nTimeline Data Error", err);
            } else {
                  console.dir("All JRN Data -->", time_data);

                  // Create a DataSet (allows two way data-binding)
                  // var items = new vis.DataSet([
                  //       { id: 1, content: 'item 1', start: '2014-04-20' },
                  //       { id: 2, content: 'item 2', start: '2014-04-14' },
                  //       { id: 3, content: 'item 3', start: '2014-04-18' },
                  //       { id: 4, content: 'item 4', start: '2014-04-16', end: '2014-04-19' },
                  //       { id: 5, content: 'item 5', start: '2014-04-25' },
                  //       { id: 6, content: 'item 6', start: '2014-04-27', type: 'point' }
                  // ]);
                  

                  /*
                        Examples...
                  */
                  time_data.push({ id: 4556, content: 'item 4', start: '2013-04-16', end: '2013-04-19' });
                  time_data.push({ id: 5598, content: 'item 4', start: '2014-04-27', type: 'point' });
                  
                  var items = new vis.DataSet(time_data);

                  //Remove loading...
                  // WebTimeLine.HTMLParent.Control.innerHTML = "";
                  WebTimeLine.HTMLParent.Loading = document.getElementById("timeline_loading");
                  WebTimeLine.HTMLParent.Loading.style.display = "none";

                  // Configuration for the Timeline
                  var options = {
                        // always snap to full hours, independent of the scale
                        snap: function (date, scale, step) {
                              var hour = 60 * 60 * 1000;
                              return Math.round(date / hour) * hour;
                        }
                  };

                  // Create a Timeline
                  var timeline = new vis.Timeline(WebTimeLine.HTMLParent.Control, items, options);

            }
      });

}