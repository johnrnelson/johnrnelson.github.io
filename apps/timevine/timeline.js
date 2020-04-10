/*
      Timeline app code...
*/

window.WebTimeLine = {
      HTMLParent: {
            //Check the HTML page for this value...
            id: "timeline_viz"
      },
      Convert: {
            /*
                  Convert our JSON record into something our
                  HTML control can use....
            */
            DateCast(GroupID, DateRecord) {

                  const dateStart = DateRecord.date.YearEnd;

                  /*
                        Give our record a unique ID if there is 
                        not one already supplied...
                  */
                  if (!DateRecord.id) {
                        DateRecord.id = WebApp.NewID('');
                  }



                  const CastRecord = {
                        id: DateRecord.id,
                        group: GroupID,
                        content: DateRecord.title,
                        start: DateRecord.date.YearStart + '-' +
                              DateRecord.date.MonthStart + '-' +
                              DateRecord.date.DayStart + ''
                  }
                  if (DateRecord.date.YearEnd == 0) {
                        //it's a point
                        CastRecord.type = 'point';
                  } else {

                  }
                  try {
                        // { id: 11, content: 'item 1', start: '2010-04-20' }
                  } catch (errDateConvert) {
                        debugger;

                  }
                  return CastRecord
            }
      },
      GetData(dates_list, GroupID, DataURL, OnData) {


            WebApp.xhr("GET", DataURL, "", function (error, data) {
                  if (error) {
                        console.warn(error);
                  } else {

                        try {
                              const xhrDATA = JSON.parse(data);
                              // const dates_list = [];

                              for (let index = 0; index < xhrDATA.length; index++) {
                                    const dateRecord = xhrDATA[index];

                                    dates_list.push(WebTimeLine.Convert.DateCast(GroupID, dateRecord));
                              }

                              OnData(null, dates_list);
                        } catch (errParseData) {

                              OnData(errParseData, null);
                        }

                  }//End xhr valid request....
            });
      },

      /*
            Based on this data, build our timeline html and any options
            needed or wanted...
      */
      BuildTimelineHTML(TimelineItems) {

            //Remove loading...
            // WebTimeLine.HTMLParent.Control.innerHTML = "";
            WebTimeLine.HTMLParent.Loading = document.getElementById("timeline_loading");
            WebTimeLine.HTMLParent.Loading.style.display = "none";

            // Configuration for the Timeline
            var options = {
                  // max: new Date() + 360,
                  max: '2025-01-1', //Do I really need to hard code this???
                  min: '1980-01-1',
                  // zoomMax:50000,
                  // zoomMin:10000,
                  // zoomFriction:500,


                  // always snap to full hours, independent of the scale
                  // snap: function (date, scale, step) {
                  //       var hour = 60 * 60 * 1000;
                  //       return Math.round(date / hour) * hour;
                  // }, 

                  //No need to order, we do that in the code....
                  groupOrder: 'none'
            };

            // Create a Timeline..
            WebTimeLine.VisTimeline = new vis.Timeline(
                  WebTimeLine.HTMLParent.Control,
                  TimelineItems,
                  WebTimeLine.Groups.BuildGroups(),
                  options);

      },
      /*
      Load multiple data sources for the groups...
      */
      Groups: {
            //List of URLS for a group to load in our time line...
            ListURLS: [],

            //Build the groups you need for the time line...
            BuildGroups() {

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







            AddTimeByGroup(OnData) {


                  function AddExamples(TimelineItems) {
                        /*
                                   Examples...
                             */
                        TimelineItems.push({
                              id: WebApp.NewID(''),
                              group: 4404,
                              content: 'Open Source Test', start: '2012-01-1', end: '2017-04-19'
                        });
                        TimelineItems.push({
                              id: WebApp.NewID(''),
                              group: 411,
                              content: 'TimeVine Proof', start: '2020-04-1', type: 'point'
                        });


                  }

                  function GetGroup() {

                  }

                  var completed_group_total = 0;
                  const total_group_total = WebTimeLine.Groups.ListURLS.length;


                  var time_data = [];

                  for (let index = 0; index < WebTimeLine.Groups.ListURLS.length; index++) {
                        const URLData = WebTimeLine.Groups.ListURLS[index];

                        //Load up my timeline..
                        window.WebTimeLine.GetData(time_data, URLData.group_id, URLData.url, function (err) {
                              if (err) {
                                    console.warn("\r\nTimeline Data Error", err);
                              } else {
                                    completed_group_total++;
                                    if (completed_group_total == 1) {

                                          AddExamples(time_data);
                                    }

                                    if (completed_group_total == total_group_total) {
                                          // debugger;

                                          OnData(time_data);
                                    }

                              }
                        });
                  }

            },
      },


};



/*
    When the browser if ready it will fire off this bad boy...
*/
window.onload = function () {

      //Hook our control so we can deal with it later...
      WebTimeLine.HTMLParent.Control = document.getElementById(WebTimeLine.HTMLParent.id);



      console.info('Push all the URLS you need for the default time line...', WebTimeLine.Groups.ListURLS);

      //Add all the groups URLS you need to fill the time line...
      WebTimeLine.Groups.ListURLS.push({
            group_id: 411,
            url: '/data/timeline/jrn.json'
      });

      WebTimeLine.Groups.ListURLS.push({
            group_id: 71,
            url: '/data/timeline/microsoft-windows.json'
      });

      WebTimeLine.Groups.AddTimeByGroup(function (time_data) {
            //


            var items = new vis.DataSet(time_data);

            WebTimeLine.BuildTimelineHTML(items);
      });




}