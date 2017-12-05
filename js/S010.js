/*

 ** To load this script, use this in the console...

var e = document.createElement("script");e.src = 'https://www.johnrnelson.com/js/S010.js';document.head.appendChild(e);
    


** Extra CDN files can be found at https://cdnjs.com/libraries/extjs/6.0.0   
** Full source from Sencha is at http://cdn.sencha.com/ext/gpl/ext-6.0.1-gpl.zip
    
*/

if (window.S010) {
    console.warn('S010 has already been loaded!!!!', S010.BornDate);
    // return;
}
else {


    window.S010 = {
        BornDate: new Date(),
        debug: 1,

        xhr(VERB, ROUTE, SENDMSG, OnData) {

            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                // debugger;
                if (this.readyState == 4 && this.status == 200) {
                    // debugger;
                    // console.log( this.responseText );
                    try {

                        OnData(this.responseText);

                    }
                    catch (badJSON) {
                        // console.warn('Bad JSON from route : ' + ROUTE);
                        // console.warn(badJSON.message);
                        OnData(this.responseText);
                    }
                }
            };
            xhttp.open(VERB, ROUTE, true);
            xhttp.send(JSON.stringify(SENDMSG));
        },

        FORMATING: {
            NumberWithCommas: function(x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        },
        Storage: {
            Get: function(KeyName) {
                var returnValue = null;
                try {
                    returnValue = JSON.parse(localStorage.getItem(KeyName));
                }
                catch (errGetFromStorage) {
                    returnValue = null;
                }
                return returnValue;;
            },
            Set: function(KeyName, KeyValue) {
                try {
                    localStorage.setItem(KeyName, JSON.stringify(KeyValue));
                }
                catch (errNoSave) {
                    console.warn(errNoSave);
                }
            },
            Remove: function(KeyName) {
                try {

                    localStorage.removeItem(KeyName);
                }
                catch (errNoDel) {
                    console.warn(errNoDel);
                }
            },
        },
        DEBUG: {
            Set: function(LEVEL) {
                // APP.DEBUG.Set(5);
                if (LEVEL < 1) {
                    localStorage.removeItem('DEBUG');
                }
                else {
                    localStorage.setItem('DEBUG', LEVEL);
                }
            }
        }
    };


    //Loads a script and calls back when finsihed...
    S010.LoadScript = function(NameSpace, URL, CallBackFunction, ParentWindow) {
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
            console.error('Loading network. BaseURI is <a target="_blank" href="' + URL + '" >' + URL + '</a>')

            onComplete(false);
        }
        elem.addEventListener("load", onLoad, false);
        elem.addEventListener("error", onError, false);
        elem.type = "text/javascript";
        elem.charset = "utf-8";
        elem.src = URL;
        ParentWindow.document.head.appendChild(elem);
    };
    S010.LoadStyle = function(NameSpace, URL, CallBackFunction, ParentWindow) {
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
        // elem.type = "text/javascript";
        // elem.charset = "utf-8";
        elem.href = URL;
        ParentWindow.document.head.appendChild(elem);
    };


    S010.UI = {
        v: 1,
        Init(OnInit) {
            var extJSPostFix = '';

            if (S010.debug) {
                const extJSPostFix = '-debug';
            }

            function AfterExtJS() {

                var showBox = Ext.MessageBox.show({
                    title: 'Please wait',
                    msg: 'Loading items...',
                    progressText: 'Initializing...',
                    width: 300,
                    progress: true,
                    closable: false,
                    animateTarget: 'mb6'
                });

                console.log(showBox);

                showBox.progressBar.setValue(.5);

                setTimeout(function() {
                    showBox.close();
                    OnInit();
                }, 1500);
            }

            
            function LoadExtJS(OnLoad) {
                /*
                    Load all the ExtJS files you need...
                */
                S010.LoadScript('ExtJS', '//cdnjs.cloudflare.com/ajax/libs/extjs/6.0.0/ext-all' + extJSPostFix + '.js', function() {
                    S010.LoadScript('ExtJS', '//cdnjs.cloudflare.com/ajax/libs/extjs/6.0.0/packages/charts/classic/charts' + extJSPostFix + '.js', function() {
                        AfterExtJS();
                    }, window);
                }, window);
                
                S010.LoadStyle('Desktop', '//cdnjs.cloudflare.com/ajax/libs/extjs/6.0.0/classic/theme-gray/resources/theme-gray-all' + extJSPostFix + '.css', function() {}, window);
                S010.LoadStyle('Desktop', '//cdnjs.cloudflare.com/ajax/libs/extjs/6.0.0/packages/charts/classic/classic/resources/charts-all' + extJSPostFix + '.css', function() {}, window);
            }
 
            //Is Ext already loaded?
            if (window.Ext) {
                AfterExtJS();
            }
            else {
                LoadExtJS();
            }
        }

    };


    S010.UI.Init(function() {



        // debugger;
        console.info('SO10 is now loaded-->',S010);

    });

}
