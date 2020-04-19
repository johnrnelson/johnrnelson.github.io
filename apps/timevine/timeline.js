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

                  try {

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
                              Meta: {
                                    test: "woot"
                              }
                        }

                        //Using moment solves a lot of problems.. :-) 
                        CastRecord.start = moment(new Date(DateRecord.date.start));

                        //Set a default class incase the data in not so complete..
                        if (!DateRecord.className) {
                              DateRecord.className = "basic";
                        }

                        CastRecord.className = DateRecord.className;
                        CastRecord.Meta.Type = DateRecord.className;

                        if (!DateRecord.date.end) {
                              //it's a point
                              CastRecord.type = 'point';
                        } else {
                              CastRecord.end = moment(new Date(DateRecord.date.end));
                        }
                        return CastRecord

                  } catch (errDateConvert) {
                        debugger;
                        alert('Error in timevine data');
                        return false;

                  }
            }
      },
      /*
            Grab data from a URL and push it to our dates list. We only 
            want to load data one time from a remote resource. 
      */
      GetData(dates_list, GroupID, DataURL, OnData) {

            //WebApp.js will wrap this up for you...
            WebApp.xhr("GET", DataURL, "", function (error, data) {
                  if (error) {
                        console.warn(error);
                  } else {
                        try {
                              const xhrDATA = JSON.parse(data);
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

            WebTimeLine.HTMLParent.Loading = document.getElementById("timeline_loading");
            WebTimeLine.HTMLParent.TimeSpanDisplay = document.getElementById("timeline_info");
            WebTimeLine.HTMLParent.Loading.style.display = "none";

            /* 
                  Configuration for the Timeline
                  Docs at (https://visjs.github.io/vis-timeline/docs/timeline/)

            */
            var options = {
                  // max: new Date() + 360,
                  max: '2025-01-1', //Do I really need to hard code this???
                  min: '1980-01-1',
                  zoomMax: 315360000000000,
                  zoomMin: 10000000000,

                  // Use the buttons for better performance....
                  moveable: true,
                  zoomable: false,

                  //No need to order, we do that in the code....
                  groupOrder: 'none',

                  showTooltips: true,

                  //Handle the scroll issues...
                  verticalScroll: true,
                  // horizontalScroll: true,

                  //zoomKey: 'altKey', // 'altKey', 'ctrlKey', 'shiftKey' or 'metaKey'                

                  //Reset as the window is resized....
                  height: window.innerHeight - 100
            };

            // Create a Timeline..
            WebTimeLine.VisTimeline = new vis.Timeline(
                  WebTimeLine.HTMLParent.Control,
                  TimelineItems,
                  WebTimeLine.Groups.BuildGroups(),
                  options);

            WebTimeLine.VisTimeline.on('select', function (properties) {

                  if (properties.items.length) {
                        const selectedNode = TimelineItems.get(properties.items[0]);
                        // console.log(selectedNode, selectedNode.Meta);
                        WebTimeLine.VisTimeline.focus(selectedNode.id);
                        WebTimeLine.Details.SelectNode(selectedNode);
                  } else {
                        // console.info('Click on timeline without an item...');
                        WebTimeLine.Details.SelectNode(false);
                  }
            });

            // This event fires during change...
            // WebTimeLine.VisTimeline.on('rangechange', function (start, end) { });

            //This event fires after the change...
            WebTimeLine.VisTimeline.on('rangechanged', function (DateChanged, end) {
                  WebTimeLine.TimeDisplayStart.innerHTML = moment(DateChanged.start).format("MMMM YYYY");
                  WebTimeLine.TimeDisplayEnd.innerHTML = moment(DateChanged.end).format("MMMM YYYY");
            });

            WebTimeLine.VisTimeline.on('contextmenu', function (props) {
                  props.event.preventDefault();

                  if (props.item) {
                        //Mobile does not have context menu so..  :-(
                        //console.log('ITEM!',props.item, props);                        
                  }
            });

            WebTimeLine.HTMLParent.TimeSpanDisplay.style.display = "block";
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
                              content: "John Nelson",
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
                              content: "Open Source",
                              nestedGroups: [81, 82, 83],
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
                              // showNested: true
                        },
                        {
                              id: 73,
                              content: "Office",
                              // showNested: true
                        },

                  ]);

                  //Open Source Group....                 
                  groups.add([
                        {
                              id: 81,
                              content: "OS"
                        },
                        {
                              id: 82,
                              content: "JavaScript",
                        },
                        {
                              id: 83,
                              content: "Node.js"
                        },

                  ]);

                  return groups;
            },

            /*
                  Load our timeline data via the URLS...
            */
            AddTimeByGroup(OnData) {

                  var time_data = [];

                  /*
                             Examples to use for timeline items....
                  */
                  function AddExamples(TimelineItems) {
                        TimelineItems.push({
                              id: WebApp.NewID(''),
                              group: 4404,
                              className: "basic",
                              content: 'Open Source Test', start: '2012-01-1', end: '2017-04-19'
                        });

                        TimelineItems.push({
                              id: WebApp.NewID(''),
                              group: 411,
                              className: "basic",
                              content: 'TimeVine Proof', start: new Date('2020-04-01'), type: 'point'
                        });


                  }

                  function GetGroup() {

                  }

                  // console.warn('NOT loading data to test styles...');
                  // console.warn('NOT loading data to test styles...');
                  // AddExamples(time_data);
                  // OnData(time_data);
                  // return;



                  var completed_group_total = 0;
                  const total_group_total = WebTimeLine.Groups.ListURLS.length;



                  for (let index = 0; index < WebTimeLine.Groups.ListURLS.length; index++) {
                        const URLData = WebTimeLine.Groups.ListURLS[index];

                        //Load up my timeline..
                        window.WebTimeLine.GetData(time_data, URLData.group_id, URLData.url, function (err) {
                              if (err) {
                                    console.warn("\r\nTimeline Data Error", err);
                              } else {
                                    //We have loaded a remote data source...
                                    completed_group_total++;

                                    //Check to see if we have loaded all that we needed to...
                                    if (completed_group_total == total_group_total) {
                                          // debugger;
                                          OnData(time_data);
                                    }
                              }
                        });
                  }//End running through our lists...

            },
      },
      Details: {

            isFullScreen: false,          //Set via ToggleFullScreen...
            ParentControl: null,          //Set via the hook...
            FullScreenControl: null,      //Set via the hook...
            BodyControl: null,            //Set via the hook...
            BodyControl: null,            //Set via the hook...

            Hook() {
                  WebTimeLine.Details.ParentControl = document.getElementById('timeline_details');
                  // WebTimeLine.Details.FullScreenControl = document.getElementById('timeline_details');
                  WebTimeLine.Details.FullScreenControl = WebTimeLine.Details.ParentControl.querySelector(".details_fullscreen");

                  WebTimeLine.Details.TitleControl = WebTimeLine.Details.ParentControl.querySelector(".details_title");
                  WebTimeLine.Details.BodyControl = WebTimeLine.Details.ParentControl.querySelector(".details_body");


            },
            ToggleFullScreen() {
                  if (WebTimeLine.Details.ParentControl.isFullScreen) {
                        WebTimeLine.Details.ParentControl.isFullScreen = false;
                        WebTimeLine.Details.ParentControl.style.height = "90px";

                        WebTimeLine.Details.ParentControl.querySelector(".details_fullscreen").innerHTML = '<i class="fas fa-arrow-alt-circle-up"></i>';
                  } else {
                        WebTimeLine.Details.ParentControl.isFullScreen = true;
                        WebTimeLine.Details.ParentControl.style.height = (window.innerHeight - 10) + "px";
                        WebTimeLine.Details.ParentControl.querySelector(".details_fullscreen").innerHTML = '<i class="fas fa-arrow-alt-circle-down"></i>';
                  }
            },
            SelectNode(SelectedNode) {

                  if (SelectedNode) {
                        // console.log('show details for selected node', SelectedNode);
                        WebTimeLine.Details.TitleControl.innerHTML = SelectedNode.content;
                        WebTimeLine.Details.BodyControl.innerHTML = "Date : " + SelectedNode.start.format("MMMM DD YYYY (dddd)") +
                              "<br>" +
                              "Additional details are not yet available.";
                  } else {
                        WebTimeLine.Details.TitleControl.innerHTML = "Select an item";
                        WebTimeLine.Details.BodyControl.innerHTML = "";
                  }
            }
      },
      Redraw() {
            //Redraw our timeline to respect the window size...
            if (WebTimeLine.VisTimeline) {
                  WebTimeLine.VisTimeline.setOptions({
                        // height: window.innerHeight - 20
                        height: window.innerHeight - 100
                  });
            }

            //Correct the fullscreen details panel..
            if (WebTimeLine.Details.ParentControl.isFullScreen) {
                  WebTimeLine.Details.ParentControl.style.height = (window.innerHeight - 10) + "px";
            }
      }
};



/*
    When the browser if ready it will fire off this bad boy...
*/
window.onload = function () {

      //Kill the context menu...
      document.addEventListener("contextmenu", function (e) {
            e.preventDefault();
      }, false);

      //Hook our details panel...
      WebTimeLine.Details.Hook();

      //Hook our menu after everything is loaded and good to go...
      window.AppMenu.Hook();

      //Hook our control so we can deal with it later...
      WebTimeLine.HTMLParent.Control = document.getElementById(WebTimeLine.HTMLParent.id);





      //Add all the groups URLS you need to fill the time line...
      WebTimeLine.Groups.ListURLS.push({
            group_id: 411,
            url: '//apps/timevine/data/timeline/jrn.json'
      });

      WebTimeLine.Groups.ListURLS.push({
            group_id: 71,
            url: '//apps/timevine/data/timeline/microsoft-windows.json'
      });
      WebTimeLine.Groups.ListURLS.push({
            group_id: 72,
            url: '//apps/timevine/data/timeline/microsoft-net.json'
      });
      WebTimeLine.Groups.ListURLS.push({
            group_id: 73,
            url: '//apps/timevine/data/timeline/microsoft-office.json'
      });


      WebTimeLine.Groups.ListURLS.push({
            group_id: 81,
            url: '//apps/timevine/data/timeline/open-source-OS.json'
      });

      WebTimeLine.Groups.ListURLS.push({
            group_id: 82,
            url: '//apps/timevine/data/timeline/open-source-JS.json'
      });
      WebTimeLine.Groups.ListURLS.push({
            group_id: 83,
            url: '//apps/timevine/data/timeline/open-source-NODEJS.json'
      });





      WebTimeLine.Groups.AddTimeByGroup(function (time_data) {

            // window.onresize();
            var items = new vis.DataSet(time_data);
            WebTimeLine.BuildTimelineHTML(items);
      });



}

/*
      Resize and/or redraw whatever is needed for the timeline to 
      respect the new size of the window...
*/
window.onresize = function () {
      WebTimeLine.Redraw();
}