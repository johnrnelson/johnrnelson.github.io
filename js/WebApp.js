/*
      Generic web app code I have been dragging around with me for years
      and update from time to time.. :-)
*/ 

window.WebApp = {
      AppName:'JohnNelsonWebSite',
      StartDate: new Date(), //Born date... :-)
      LoadHTML(ElementID, FilePath, OnLoad) {
            var targetEL = document.getElementById(ElementID);
            if (!targetEL) {
                  console.warn('NO ELEMENT!');
                  debugger;
            }

            WebApp.xhr('GET', FilePath, '', function (err, data) {
                  try {
                        // debugger;
                        targetEL.innerHTML = data;
                        if (OnLoad) {
                              OnLoad();
                        }

                  }
                  catch (e) {
                        console.warn(e, e.message);
                        console.info(ElementID, FilePath);
                        debugger;
                  }
            });
      },
      FORMATTING: {
            NumberWithCommas(x) {
                  //  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                  return parseFloat(x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","))

            },
            Money(x) {

                  if (typeof (x) == "string") {
                        debugger;
                        x = parseFloat(x);
                  }

                  if (x == 0) {
                        return 0;
                  }
                  else {

                        return x.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
                  }
                  // x.toFixed(2).replace(/./g, function(c, i, a) {
                  //     return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
                  // });
            }
      },
      /*
          This is the client side stats
      */
      Stats: {
            xhr: {
                  TOTAL: 0,
                  SENT: 0,
                  RECV: 0
            },
      },
      /*
          Generic http request to get something from the web. Since this app is local 
          we an get from a file on the HD just as easy as we an from any other host 
          on the internet. 
      */
      xhr(VERB, ROUTE, SENDMSG, OnData) {
            try {

                  var xhttp = new XMLHttpRequest();

                  xhttp.onloadend = function () {


                        if (xhttp.status == 404) {
                              // console.warn("The file requested was not found on the server.");
                              OnData("The file requested was not found on the server.",null);
                        }
                        //Server is down!
                        if (xhttp.status == 502) {
                              OnData("Generic server error.",null);
                              // window.location = '/html/errors/no_server.html'

                        }
                  }
                  xhttp.onerror = function () {

                        console.warn("Unknown error using xhr in the browser.");

                  }

                  xhttp.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                              WebApp.Stats.xhr.RECV += this.responseText.length;
                              try {
                                    OnData(null, this.responseText);
                              }
                              catch (errOnData) {
                                    // OnData('Ready State Error. Network is not reachable or bad gateway.', this.responseText);
                                    OnData(errOnData.message, this.responseText);
                              }
                        }
                  };
                  // Put in origin...

                  xhttp.open(VERB, (window.location.origin + ROUTE), true);


                  //This server only accepts string!!!
                  if (typeof (SENDMSG) == 'object') {
                        SENDMSG = JSON.stringify(SENDMSG);
                  }
                  xhttp.send(SENDMSG);

                  //Let our stats know we did another api call..
                  WebApp.Stats.xhr.TOTAL++;
                  WebApp.Stats.xhr.SENT += SENDMSG.length;
            }
            catch (xhrError) {
                  console.warn(xhrError);


            }
      },
      NS: {
            DEBUG: false,
            ALL: {},
      },
      //Loads a script and calls back when finished...
      LoadScript(NameSpace, URL, CallBackFunction, ParentWindow) {

            if (URL.substring(0, 4) != 'http') {
                  // if we are not debugging, use the min source code....
                  if (WebApp.Preferences.DebugMode == true) {
                        URL = '/js/' + URL;
                  } else {
                        URL = '/js-min/' + URL;
                  }
            }
            var loadedNS = WebApp.NS.ALL[NameSpace];

            if (loadedNS) {
                  CallBackFunction(NameSpace, URL, true);
                  return;
            }
            else {

                  WebApp.NS.ALL[NameSpace] = URL;
            }

            if (ParentWindow == undefined) {
                  ParentWindow = window;
            }
            var elem = document.createElement("script");
            elem.setAttribute('NameSpace', NameSpace);
            // elem.setAttribute('async', 'true');

            function onComplete(success) {
                  elem.removeEventListener("load", onLoad, false);
                  elem.removeEventListener("error", onError, false);

                  if (CallBackFunction) {
                        CallBackFunction(NameSpace, URL, success);
                  }
            }

            function onLoad() {
                  onComplete(true);
            }

            function onError(err) {
                  console.dir(err)
                  console.error('Loading network. BaseURI is <a target="_blank" href="' + URL + '" >' + URL + '</a>');
                  onComplete(false);
            }
            elem.addEventListener("load", onLoad, false);
            elem.addEventListener("error", onError, false);
            elem.type = "text/javascript";
            elem.charset = "utf-8";
            elem.src = URL;
            ParentWindow.document.head.appendChild(elem);
      },
      //Loads a style and calls back when finished...
      LoadStyle(NameSpace, URL, CallBackFunction, ParentWindow) {
            if (ParentWindow == undefined) {
                  ParentWindow = window;
            }
            var elem = document.createElement("link");
            elem.setAttribute('rel', 'stylesheet');
            elem.setAttribute('type', 'text/css');
            elem.setAttribute('NameSpace', NameSpace);


            function onComplete(success) {
                  elem.removeEventListener("load", onLoad, false);
                  elem.removeEventListener("error", onError, false);

                  if (CallBackFunction) {
                        CallBackFunction(NameSpace, URL, success);
                  }
            }

            function onLoad() {
                  onComplete(true);
            }

            function onError(err) {
                  console.dir(err)
                  console.error('Loading network. BaseURI is <a target="_blank" href="' + URL + '" >' + URL + '</a>')

                  onComplete(false);
            }
            elem.addEventListener("load", onLoad, false);
            elem.addEventListener("error", onError, false);
            elem.href = URL;
            ParentWindow.document.head.appendChild(elem);
      },
      ReadCookie(name) {

            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                  var c = ca[i];
                  while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                  if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
      },
      ReadQSParm(name) {
            const url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                  results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
      },






      //Load the user prefs from local storage or cookies...
      LoadPrefs() {
            if (!WebApp.ReadCookie(WebApp.AppName)) {
                  // 
                  // console.info('User is  NOT logged in!');
            }

            //Define our prefs before anything else...
            WebApp.Preferences = {
                  DebugMode: false
            };

            /*
                Set default for debugging Namespaces. It has to be a number 
                and not a string!!!
            */
            var isDebug = localStorage.getItem('debug');
            if (!isDebug) {
                  localStorage.setItem('debug', false);
                  WebApp.Preferences.DebugMode = false;

                  //Use this to test or debug...
                  // localStorage.setItem('debug', true);
            }
            else {
                  if (isDebug == "true") {
                        WebApp.Preferences.DebugMode = true;
                  }
            }
      },
      isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
      SanitizeHtml(String2Strip) {
            // return String2Strip.replace('<', '%3C').replace('>', '%3E');
            return String2Strip.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
      },
      HexToRgbA(hex, alpha) {
            var c;
            if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
                  c = hex.substring(1).split('');
                  if (c.length == 3) {
                        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
                  }
                  c = '0x' + c.join('');
                  return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')';
            }
            throw new Error('Bad Hex');
      },
      GetServerTimeDiff(Server_Date, Client_Date) {

            var ahead = 0;
            var diff;
            //Set the negative if behind...
            if (Server_Date > Client_Date) {
                  ahead = -1
                  diff = Server_Date - Client_Date;
            } else {
                  ahead = 1
                  diff = Client_Date - Server_Date;
            }

            if (diff < 1000) {
                  return {
                        ahead: ahead, // plus or minus is 1 or -1
                        days: 0,
                        hours: 0,
                        minutes: 0,
                        seconds: 0
                  };
            }

            // "36e5" is the scientific notation for 60*60*1000, dividing by which converts the milliseconds difference into hours.
            var hours = Math.floor(diff / 36e5);
            var minutes = Math.floor((diff % 36e5) / 6e4);
            var seconds = Math.floor((diff % 6e4) / 1000);
            var days = 0;

            if (hours > 24) {
                  days = Math.floor(hours / 24);
                  hours = hours - (days * 24);
            }


            var TimeDiff = {
                  ahead: ahead, // plus or minus is 1 or -1
                  days: days,
                  hours: hours,
                  minutes: minutes,
                  seconds: seconds
            };


            return TimeDiff;
      },
      /* 
          Make our own console outputs stand out from the rest of the 
          crap that flies through the console log...
      */
      Console: {
            /* 
                Provide a log function to everyone. Overload the function 
                by checking for an object with certain props...
            */
            Log() {
                  var LogMsgs = [];
                  var LogColor = '#666666';

                  //Fake function overloading old school style... :-) 
                  if (arguments.length == 1) {
                        const LogItem = arguments[0];
                        if (LogItem.t) {

                              switch (LogItem.t) {
                                    case 1:
                                          LogColor = '#558000';
                                          LogMsgs.push(LogItem.m);
                                          break;
                                    case 2:
                                          LogColor = '#003cb3';
                                          LogMsgs.push(LogItem.m);
                                          break;
                                    default:
                                          LogMsgs.push(LogItem.m);
                                          break;
                              }

                        } else {
                              // debugger;
                              LogMsgs.push('' + JSON.stringify(LogItem) + '');
                        }

                  } else {
                        for (let index = 0; index < arguments.length; index++) {
                              const argLog = arguments[index];
                              LogMsgs.push('' + argLog + '');
                        }
                  }

                  console.info("%c%s",
                        "color: " + LogColor + ";font-size: 16px;margin-left:5px;",
                        LogMsgs.join('\r\n') + "\r\n");
            }
      },

      //Get a random ID for components...
      NewID(IDPreface) {
            if (IDPreface == undefined) {
                  var IDPreface = "";
            }
            return IDPreface + "-" + (Math.random().toString(16) + '000000000').substr(2, 8);
      },
};

// debugger;
 


window.onload = function () {

      try {
            //Load the prefs from local storage...
            WebApp.LoadPrefs();
            // localStorage.clear();
 


            console.log('Debug WebApp --->', WebApp);

      } catch (errOnLoad) {
            // debugger;
            console.warn('\r\nError on page load!', errOnLoad.message);

      }
}