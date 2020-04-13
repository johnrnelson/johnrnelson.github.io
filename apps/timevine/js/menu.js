/*
      Manage the menu for this application...
*/


window.AppMenu = {
      //Set the UI elements and init what ya need....
      Hook() {
            WebTimeLine.Overlay = document.getElementById("timeline_overlay");
      },
      ToggleDisplay() {            
            
            if(WebTimeLine.Overlay.style.display == "block"){
                  WebTimeLine.Overlay.style.display = "none";                  
            }else{
                  WebTimeLine.Overlay.style.display = "block";
            }
      },
      /*
            Load a flat file into our UI for whatever help they need...
      */
      LoadOverlay(URL,OnData){

            WebApp.xhr("GET", URL, "", function (error, data) {
                  if (error) {
                        console.warn(error);
                  } else {

                        try {
                              WebTimeLine.Overlay.innerHTML = data;
                              console.log(data);
                              // const dates_list = [];
 

                              OnData(null);
                        } catch (errParseData) {

                              OnData(errParseData);
                        }

                  }//End xhr valid request....
            });            
      }
};
