/*
This is served from S010...    
*/

// console.clear();

window.onload = function() {


    (function() {

        var dispConStatus = document.getElementById('DisplayConStatus');
        var dispHist = document.getElementById('DisplayConHist');
        var dispMsgIn = document.getElementById('DisplayMsgIn');
        var dispMsgOut = document.getElementById('DisplayMsgOut');


        var S010Hook = {
            AlertDisplay: function() {
                // debugger;;
                var ALERTDISPLAY = document.getElementById('ALERTDISPLAY');
                ALERTDISPLAY.style.display = "block";
            },
            Socket: {
                WSS: null,
           
                Welcome: function(ServerData) {
                    dispHist.innerHTML = '';

                    // console.log(ServerData);
                    for (var ip in ServerData) {
                        var ipData = ServerData[ip];
                        if (ipData.hst.length > 0) {

                            var DisplayElement = document.createElement('tr');

                            var tdIP = document.createElement('td');
                            var tdAttp = document.createElement('td');
                            tdIP.innerHTML = '<a target="_blank" href="' + ipData.IP + '">' + ipData.IP + '</a>' +
                                ' [' + ipData.Hostname + '] ';

                            tdAttp.innerHTML = 'Total Attempts:' + ipData.hst.length;


                            DisplayElement.appendChild(tdIP);
                            DisplayElement.appendChild(tdAttp);

                            dispHist.appendChild(DisplayElement);

 
                            for (var h = 0; h < ipData.hst.length; h++) {
                                var trHST = document.createElement('tr');
                                var tdHST = document.createElement('td');
                                tdHST.colSpan = 2;
                                    // console.info(ipData.hst[h]);
                                tdHST.innerHTML = '<div class="ConHistPath">' + ipData.hst[h].qs + ' <br/><div class="ConHistAgent">' + ipData.hst[h].cl + '</<div></<div>'

                                trHST.appendChild(tdHST);

                                // DisplayElement.innerHTML = '' + htmlDISP + '';
                                dispHist.appendChild(trHST);
                            }




                        }
                    }
                },
                Open: function() {
                    
                    console.info('NO using socket yet');
                    return;


                    if (document.location.protocol == "http:") {
                        // debugger;
                        S010Hook.Socket.WSS = new WebSocket("ws://" + window.location.hostname + ":" + window.location.port + "/api" + document.location.hostname);
                        // S010Hook.Socket.WSS = new WebSocket("ws://echo.websocket.org");
                    }
                    else {
                        S010Hook.Socket.WSS = new WebSocket("wss://" + window.location.hostname + ":" + window.location.port + "/api" + document.location.hostname);

                    }

                    var wss = S010Hook.Socket.WSS;
                    wss.onerror = function(err) {
                        debugger;
                        console.warn(err);

                    };

                    wss.onopen = function() {

                        var openHTML = 'You are currently connected as of ' + new Date().toLocaleTimeString();

                        dispConStatus.innerHTML = openHTML;

                        // debugger;
                        var msgdata2send = {
                            verb: 'hello',
                            meta: {
                                nav: navigator.appVersion
                            }
                        };
                        // S010Hook.Socket.WSS.send(JSON.stringify(msgdata2send));
                        S010Hook.Socket.WSS.send(JSON.stringify(msgdata2send));

                    };
                    wss.onclose = function() {
                        dispConStatus.innerHTML = 'closed...';

                        S010Hook.AlertDisplay();

                    };
                    wss.onmessage = function(evt) {
                        // debugger;
                        var msgData = JSON.parse(evt.data);
                        // console.warn('EVAL',evt.data)
                        var evalCode = msgData.data.eval;

                        //All messages must have the proper envolpe..
                        var returnMSG = {
                            ID: msgData.ID,
                            data: {
                                dt: new Date().toISOString(),
                            }
                        };
                        try {


                            (function() {

                                // console.log(evalCode);
                                eval(evalCode);
                                wss.send(JSON.stringify(returnMSG));

                            })();

                        }
                        catch (errEval) {
                            console.warn('Error Eval!', errEval.message);
                        }

                        return;
                    };

                }

            }

        };

        window.S010Hook = S010Hook;
        S010Hook.SendMSG = function(MSG) {
            // debugger;
            if (!MSG) {
                MSG = dispMsgOut.value;
            }
            var returnMSG = {
                vb: "SendChat",
                data: {
                    txt: MSG
                }
            };
            // debugger;
            S010Hook.Socket.WSS.send(JSON.stringify(returnMSG));
            // debugger;
            S010Hook.ReadMSG({
                FM: '<b>YOU</b>',
                dt: new Date(),
                txt: MSG
            });

            dispMsgOut.value = '';


        };


        S010Hook.ReadMSG = function(MSG) {
            // dispMsgIn.innerHTML = JSON.stringify(MSG);
            var newMSG = document.createElement('div');
            var dvFrom = document.createElement('span');
            var dvDT = document.createElement('span');
            var dvTXT = document.createElement('div');



            //                        <i class="fa fa-user-o" aria-hidden="true"></i>

            newMSG.className = 'MSG';

            dvFrom.className = 'FROM';
            dvDT.className = 'DT';
            dvTXT.className = 'TXT';

            dvTXT.innerHTML = MSG.txt;
            dvFrom.innerHTML = MSG.FM;
            dvDT.innerHTML = new Date(MSG.dt).toLocaleTimeString();

            newMSG.appendChild(dvFrom);
            newMSG.appendChild(dvDT);
            newMSG.appendChild(dvTXT);


            dispMsgIn.appendChild(newMSG);
        };


        S010Hook.ShowPane = function(PaneID) {
            // debugger;
            if (!S010Hook.ActivePane) {
                S010Hook.ActivePane = document.getElementById('mnuHome');
            }
            S010Hook.ActivePane.style.display = 'none';
            S010Hook.ActivePane = document.getElementById(PaneID);
            S010Hook.ActivePane.style.display = '';
            // console.log(S010Hook.ActivePane);
        }

        dispConStatus.innerHTML = 'Connecting...';
        S010Hook.Socket.Open();



    })();


}

/*
    Easy sample code that shows your not gonna fuzz your way 
    into the system.... 

 
window.MMMMMMMSSSGGG = function(msg) {
    S010Hook.SendMSG(msg);
   
}

window.WWWWWWWTEST = function() {
    var returnMSG = {
        test: 5
    };
    debugger;
    S010Hook.Socket.WSS.send(JSON.stringify(returnMSG));
}

window.FFFFFFFFun = function() {

    S010Hook.Socket.WSS.send('/test');
}
*/