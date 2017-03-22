window.APP = {

};


document.addEventListener('contextmenu', event => event.preventDefault());


window.onload = function() {


    APP.DEBUGEL = document.getElementById('DEBUGEL');
    APP.DEBUGEL.innerHTML = 'Looks like scripting works. :-)';
    

    if (localStorage.getItem('DEBUG')) {
        window.AppScriptExtName = '';
        console.info("%c%s", "color: red;  font-size: 14px;", "You are in debug mode at level[" + localStorage.getItem('DEBUG') + "]. To clear your settings use this at the console...\r\n\r\n" + "\tAPP.DEBUG.Set(0);\r\n\r\n");
    }
    else {
        window.AppScriptExtName = '-min';
    }

    require.config({
        baseUrl: 'js/desktop'
    });



    //  require(["APP" + window.AppScriptExtName], function() {});

}
