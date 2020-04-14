/*
      Manage the menu for this application...
*/


window.AppMenu = {
      //Set the UI elements and init what ya need....
      Hook() {
            WebTimeLine.Overlay = document.getElementById("timeline_overlay");

            // console.warn('TEST OVERLAY!');
            // WebTimeLine.Overlay.style.display = "block";

      },

      /*
            Load a flat file into our UI for whatever help they need...
      */
      LoadOverlay(Title, URL, OnData) {

            const OverlayTitle = WebTimeLine.Overlay.querySelector("#overlay_title");
            const OverlayBody = WebTimeLine.Overlay.querySelector("#overlay_body");

            OverlayBody.innerHTML = "";
            OverlayTitle.innerHTML = "Loading...";

            WebApp.xhr("GET", URL, "", function (error, data) {
                  if (error) {
                        console.warn(error);
                  } else {
                        //Set our title....
                        OverlayTitle.innerHTML = Title;

                        try {
                              OverlayBody.innerHTML = data;
                              OnData(null);
                        } catch (errParseData) {

                              OnData(errParseData);
                        }

                  }//End xhr valid request....
            });
      },
      ToggleDisplay() {


            if (WebTimeLine.Overlay.style.display == "block") {
                  WebTimeLine.Overlay.style.display = "none";
            } else {
                  WebTimeLine.Overlay.style.display = "block";
            }
      },
      ZoomTimeLine(ZoomValue) {
            if(ZoomValue>0){
                  WebTimeLine.VisTimeline.zoomIn(1);
            }else{
                  WebTimeLine.VisTimeline.zoomOut(1);
            }
      }
};
