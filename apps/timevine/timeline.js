/*
      Timeline app code...
*/

window.WebTimeLine = {
      HTMLParent: {
            id: "timeline_viz"
      },
      Convert: {
            DateCast(DateRecord) {

                  const dateStart = DateRecord.date.YearEnd;
                  if (!DateRecord.id){
                        DateRecord.id = WebApp.NewID('');
                  }

                  const CastRecord = {
                        id: DateRecord.id,
                        group: 1,
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


            WebApp.xhr("GET", DataURL, "", function (error, data) {
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
      },
      AddTimeByGroup(GroupDataURL) {


      },
      //Build the groups you need for the time line...
      BuildGroups(){

                  // create a data set with groups
                  var groups = new vis.DataSet();

                  groups.add([
                        {
                              id: 411,
                              content: "Me",
                              // nestedGroups: [1]
                        },
                        {
                              id: 4215,
                              content: "Microsoft",
                              nestedGroups: [71, 72, 73],
                              showNested: true
                        },
                        {
                              id: 4404,
                              content: "OpenSource",
                              showNested: true
                        },

                  ]);

                  //Microsoft Group....
                  groups.add([
                        {
                              id: 71,
                              content: "Windows",
                              // nestedGroups: [1]
                        },
                        {
                              id: 72,
                              content: ".Net",
                              // nestedGroups: [55],
                              showNested: true
                        },
                        {
                              id: 73,
                              content: "Office",
                              showNested: true
                        },

                  ]);

                  return groups;
      },

      BuildTimelineHTML(TimelineItems) {

            //Remove loading...
            // WebTimeLine.HTMLParent.Control.innerHTML = "";
            WebTimeLine.HTMLParent.Loading = document.getElementById("timeline_loading");
            WebTimeLine.HTMLParent.Loading.style.display = "none";

            // Configuration for the Timeline
            var options = {
                  // always snap to full hours, independent of the scale
                  // snap: function (date, scale, step) {
                  //       var hour = 60 * 60 * 1000;
                  //       return Math.round(date / hour) * hour;
                  // },
                  //Need groups!
                  // groupOrder can be a property name or a sorting function                        
                  // groupOrder: 'content' 
                  groupOrder: 'none'
            };

            // Create a Timeline
            WebTimeLine.VisTimeline = new vis.Timeline(WebTimeLine.HTMLParent.Control, TimelineItems, WebTimeLine.BuildGroups(), options);

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
                  console.log("All JRN Data -->", time_data);

                  console.warn("Group info still not working!");

                  console.info("Focus on this  -->", 'https://visjs.github.io/vis-timeline/examples/timeline/groups/nestedGroups.html');
 

                  /*
                        Examples...
                  */
                  time_data.push({
                        id: 4556,
                        group: 71,
                        content: 'Example A', start: '2013-04-16', end: '2013-04-19'
                  });
                  time_data.push({
                        id: 5598,
                        group: 72,
                        content: 'Microsoft Windows 1.0', start: '1992-04-27', type: 'point'
                  });

                 
                  // WebTimeLine.AddTimeByGroup(time_data,71, '/data/timeline/microsoft.json', function (err) {

                  // });                  

                  var items = new vis.DataSet(time_data);



                  /*


                        Need Groups!!!!
                        view-source:https://visjs.github.io/vis-timeline/examples/timeline/groups/nestedGroups.html
                  */
                  console.warn('\r\n\r\nPut this in man! :-)\r\n\r\n');

                  WebTimeLine.BuildTimelineHTML(items);
            }
      });

}