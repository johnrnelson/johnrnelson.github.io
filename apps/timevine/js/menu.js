/*
      Manage the menu for this application...
*/


window.AppMenu = {
      //Set the UI elements and init what ya need....
      Hook() {
            AppMenu.OverLays.HostElement = document.getElementById("timeline_overlay");


            AppMenu.OverLays.HostElement.TitleElement = AppMenu.OverLays.HostElement.querySelector("#overlay_title");
            AppMenu.OverLays.HostElement.BodyElement = AppMenu.OverLays.HostElement.querySelector("#overlay_body");


            // console.warn('TEST OVERLAY!');
            // WebTimeLine.Overlay.style.display = "block";
            //Load the default help first so the user knows what they can do...
            AppMenu.OverLays.LoadOverlay("Basic Timeline Help", "/apps/timevine/help/index.html", function (err) {
                  if (err) {
                        console.warn('OverLay---', err);
                  }else{
                        AppMenu.OverLays.DisplayOverLay("Basic Timeline Help");                        
                  }
            });
      },
      OverLays: {
            HostElement: null, //Set via the hook...

            List: {

            },

            DisplayOverLay(Title){

                  const listItem = AppMenu.OverLays.List[Title];

                  AppMenu.OverLays.HostElement.TitleElement.innerHTML = listItem.Title;
                  AppMenu.OverLays.HostElement.BodyElement.innerHTML = listItem.Body;

            },

            /*
                  Load a flat file into our UI for whatever help they need...
            */
            LoadOverlay(Title, URL, OnData) {

                  AppMenu.OverLays.List[Title] = {
                        Title:Title
                  };

                  const listItem = AppMenu.OverLays.List[Title];


                  // AppMenu.OverLays.HostElement.TitleElement.innerHTML = "Loading...";
                  // AppMenu.OverLays.HostElement.BodyElement.innerHTML = "";

                  WebApp.xhr("GET", URL, "", function (error, data) {
                        if (error) {
                              console.warn(error);
                        } else {
                              //Set our title....
                              // AppMenu.OverLays.HostElement.TitleElement.innerHTML = Title;

                              try {
                                    listItem.Body = data;
                                    // AppMenu.OverLays.HostElement.BodyElement.innerHTML = data;
                                    OnData(null);
                              } catch (errParseData) {

                                    OnData(errParseData);
                              }

                        }//End xhr valid request....
                  });
            },
      },
      ToggleDisplay() {


            if (AppMenu.OverLays.HostElement.style.display == "block") {
                  AppMenu.OverLays.HostElement.style.display = "none";
            } else {
                  AppMenu.OverLays.HostElement.style.display = "block";
            }
      },
      ZoomTimeLine(ZoomValue) {
            if (ZoomValue > 0) {
                  WebTimeLine.VisTimeline.zoomIn(1);
            } else {
                  WebTimeLine.VisTimeline.zoomOut(1);
            }
      }
};
