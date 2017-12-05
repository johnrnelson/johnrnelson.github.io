/*

*/
Ext.define('JRN.UI.DisplayPort', {
    extend: 'Ext.container.Viewport',
    alias: 'widget.DisplayPort',
    requires: allRequires,
    // stateful: true,
    // stateId: 'DisplayPort',

    layout: {
        type: 'border'
    },
    border: 0,

    items: [

        {
            title: '<font style="font-variant:small-caps;text-shadow: 1px 1px 1px #ffffff;color:blue;font-size:14px;font-family:"Roboto", sans-serif;">System Components</font>',
            icon: iconPath + '/DIAMOND/webdesign/diamond_webdesign_architecture_info_16.png',
            region: 'west',
            // flex: 1,
            xtype: 'NaviGroups',

            border: 0,

            split: true,
            width: 230,
            minWidth: 200,
            maxWidth: 600,
            collapsible: true,
            // collapsed: true, //<--Should we go full screen for now???
            collapsed: window.mobilecheck(), //<--Should we go full screen for now???

            floatable: false,
            items: [
                //

                {
                    title: '<font style="text-shadow: 1px 1px 1px #ffffff;color:#000000;font-size:14px;">Messages</font>',
                    id: 'MSGTree',
                    icon: iconPath + '/LUMINA/communications/lumina_communications_messages_history_16.png',
                    flex: 2,
                    border: 0,
                    xtype: 'MSGTree',
                    useArrows: true,
                    rootVisible: false,

                    multiSelect: false,
                    // singleExpand: true,
                    // cls: 'PanelSmoothGrayBack',
                    cls: "NavHubTree",
                },

                {
                    // title: 'Files',
                    title: '<font style="text-shadow: 1px 1px 1px #ffffff;color:#000000;font-size:14px;">Files</font>',
                    id: 'FileTree',
                    icon: iconPath + '/PLASTICXP/general/plasticxp_general_folder_16.png',
                    flex: 2,
                    border: 0,
                    xtype: 'FileTree',
                    useArrows: true,
                    rootVisible: false,

                    multiSelect: false,
                    // singleExpand: true,
                    // cls: 'PanelSmoothGrayBack',
                    cls: "NavHubTree",
                },

                {
                    title: '<font style="text-shadow: 1px 1px 1px #ffffff;color:#000000;font-size:14px;">Users</font>',
                    icon: iconPath + '/PLASTICXP/general/plasticxp_general_clients_16.png',
                    region: 'east',
                    xtype: 'UsersList',
                    border: 0,
                    cls: 'PanelSmoothGrayBack'
                }, {
                    xtype: 'VideoTree',
                    title: '<font style="text-shadow: 1px 1px 1px #ffffff;color:#000000;font-size:14px;">Videos</font>',
                    icon: iconPath + '/DIAMOND/multimedia/diamond_multimedia_video_16.png',
                    region: 'east',
                    border: 0,
                    useArrows: true,
                    rootVisible: false,

                    multiSelect: false,
                    // singleExpand: true,
                    // cls: 'PanelSmoothGrayBack',
                    cls: "NavHubTree",
                }, {
                    title: '<font style="text-shadow: 1px 1px 1px #ffffff;color:#000000;font-size:14px;">GitHub</font>',
                    id: 'GitTree',
                    // icon: iconPath + '/PLASTICXP/business/plasticxp_business_organigram_16.png',
                    icon: iconPath + '//social-github.png',
                    flex: 2,
                    border: 0,
                    cls: "NavHubTree",
                    xtype: 'GitTree',
                    useArrows: true,
                    rootVisible: false,

                    multiSelect: false,
                    // singleExpand: true,
                },

            ]
        },



        {
            region: 'north',
            xtype: 'MainToolBar',
            border: 0,
        },


        {
            region: 'south',
            xtype: 'MainStatusBar',
            border: 0,
        },


        {
            region: 'center',
            xtype: 'Taby',
            id: 'TabManager',
            flex: 3,

            items: [
                //

                {
                    title: 'Message Center',
                    id: 'MessagesList',
                    icon: iconPath + '/PLASTICXP/general/plasticxp_general_mailbox_16.png',
                    region: 'south',
                    xtype: 'MessagesList',

                    border: 0,
                    cls: 'PanelSmoothGrayBack',

                    closable: false,
                    // closeAction:'hide' 
                    // closeAction:'close' 

                },

                {
                    xtype: 'panel',
                    id: 'DesktopHTML',
                    icon: iconPath + '/PLASTICXP/networking/plasticxp_networking_groupware_16.png',
                    closable: true,
                    autoDestroy: true,
                    title: 'Desktop',
                    bodyPadding: 5,
                    overflowY: 'auto',
                    cls: 'PanelBlackBack',


                    loader: {
                        autoLoad: true,
                        url: WebApp.HostName + '/www/html/desktop.html'
                    },
                },



            ]
        }
    ],
    listeners: {
        render: function(view, other, andsome) {
            //we put a timout so this panel has a chance to setup the code... 
            //This prevents the error when you load a file from the tree..
            setTimeout(function() {

                // debugger;
                var pnlMSGS = view.down('[id="MessagesList"]');
                pnlMSGS.doLayout();

                var pnlDSK = view.down('[id="DesktopHTML"]');


                var tbManager = view.down('[id="TabManager"]');
                tbManager.setActiveTab(pnlDSK);





                // view.el.on('mouseover', function() {
                //     // console.info("mouseover");
                //     // WebApp.UI.Viewport.StatusBar.UpdateStatus("Desktop UI Active");



                // });

                // view.el.on('mouseout', function() {
                //     // console.info("mouseout");
                //     WebApp.UI.Viewport.StatusBar.UpdateStatus("");

                // });





                if (WebApp.Debug.Config.Level) {



                    // console.info('While in debug mode, we sometimes auto load panels...');
                    console.log("%c%s", "color: #0000cc; background: #e5ffe5; font-size: 12px;", " While in debug mode, we sometimes auto load panels...");



                    // SYSx["∷"].EventManager.New({
                    //     /*
                    //         Establish a user to user connection.... 
                    //     */
                    //     RT: 'WSS',
                    //     DATA: {
                    //         SN: 'HOME',
                    //         rt: 'NetInfo',
                    //         DATA: {
                    //             event: 'MACINFO',
                    //             mac: '78:24:af:7c:bd:98',
                    //         }
                    //     },
                    //     FN: function(err, MsgData) {
                    //         if (!MsgData) {
                    //             debugger;
                    //         }
                    //         else {

                    //             debugger;;
                    //         }

                    //     }
                    // });












                    //  http://www.macvendorlookup.com/api/v2/00-23-AB-7B-58-99

                    // SYSx["∷"].EventManager.New({
                    //     RT: 'XHR',
                    //     DATA: {

                    //         Method: 'GET',
                    //         URL: 'http://www.macvendorlookup.com/api/v2/C8-60-00-CA-EF-C3',
                    //         // URL: URL,
                    //         Message: '',
                    //     },
                    //     FN: function(err, ThePromisedEventData) {
                    //         if (err) {
                    //             debugger;;
                    //         }
                    //         else {
                    //             console.log(ThePromisedEventData);
                    //             debugger;;
                    //         }
                    //     }
                    // });





                    // SYSx["∷"].EventManager.New({
                    //     /*
                    //         Inform the worker which namespaces we want to load.... 
                    //     */
                    //     RT: 'LOAD',
                    //     DATA: {
                    //         files: [
                    //             'Pepe'
                    //         ]
                    //     },
                    //     FN: function(err, ThePromisedEventData) {
                    //         if (err) {
                    //             debugger;
                    //         }
                    //         else {
                    //             //++++++++++++++++++++++++++++++

                    //             console.info('Loaded PEPE')

                    //         };
                    //     }
                    // });





                    // Ext.require('JRN.UI.Steam.SteamDashboard', function() {
                    // //     // debugger;

                    //     var tb = WebApp.UI.Viewport.down('[id="TabManager"]');
                    //     var openPanel = tb.down('[id="SteamDashboard"]');
                    //     if (openPanel) {
                    //         openPanel.show();
                    //     }
                    //     else {
                    //         var newPanel = tb.add({
                    //             id: 'SteamDashboard',
                    //             xtype: 'SteamDashboard', 

                    //         });
                    //         newPanel.show();

                    //     }

                    // }); //Required....









                } //END DEBUG///



            }, 66.6);


        }
    },
    initComponent: function() {


        this.callParent();

        // debugger;;
        var thisPanel = this;



        var tbManager = thisPanel.down('[id="TabManager"]');


        //to make sure we can get to this by "WebApp.UI.Viewport.StatusBar" ....
        thisPanel.StatusBar = thisPanel.down('MainStatusBar');




        setTimeout(function() {
            WebApp.UI.Viewport.StatusBar.UpdateStatus('Loading UI...');
        }, .01);




        /*
        TESTING STUFF
        */
        try {
            if (WebApp.Debug.Config.Level) {
                // debugger;
                // console.info('Pick back up on the D3 panels!  :-)!');


                // (function() {
                //     /*
                //         Inform the worker which namespaces we want to load.... 
                //     */
                //     SYSx["∷"].EventManager.New({
                //         RT: 'LOAD',
                //         DATA: {

                //             files: [
                //                 'coinbase', 
                //             ]
                //         },
                //         FN: function(err, ThePromisedEventData) {
                //             if (err) {
                //                 console.warn('Error loading required namespaces.', err);
                //                 debugger;
                //             }
                //             else {};
                //         }
                //     });


                // })(); //End fun dec....


                // Ext.require('JRN.UI.D3.D3Test', function() {
                //     // debugger;
                //     var tb = WebApp.UI.Viewport.down('[id="TabManager"]');
                //     var openPanel = tb.down('[id="D3Test"]');
                //     if (openPanel) {
                //         openPanel.show();
                //     }
                //     else {
                //         var newPanel = tb.add({
                //             id: 'D3Test',
                //             xtype: 'D3Test',
                //         });
                //         newPanel.show();

                //     }
                // });   


                setTimeout(function() {

                    var JOHNDEBUGER = {
                        ThreeJSTEST: function() {
                            Ext.require('JRN.UI.ThreeJS.ThreeJSDashboard', function() {

                                var tb = WebApp.UI.Viewport.down('[id="TabManager"]');
                                var openPanel = tb.down('[id="ThreeJSDashboard"]');

                                if (openPanel) {
                                    openPanel.show();
                                }
                                else {
                                    var newPanel = tb.add({
                                        id: 'ThreeJSDashboard',
                                        xtype: 'ThreeJSDashboard',
                                    });
                                    newPanel.show();
                                }

                            });


                            // Ext.require('JRN.UI.ThreeJS.World', function() {
                            //     // debugger;
                            //     // console.log(WebApp.UI.WorldView);
                            //     WebApp.UI.WorldView.OpenPanel();

                            // });

                        },
                        babylonTEST: function() {

                            Ext.require('JRN.UI.Babylon.BabylonDashboard', function() {
                                // debugger;
                                var tb = WebApp.UI.Viewport.down('[id="TabManager"]');
                                var openPanel = tb.down('[id="BabylonDashboard"]');
                                if (openPanel) {
                                    openPanel.show();
                                }
                                else {
                                    var newPanel = tb.add({
                                        id: 'BabylonDashboard',
                                        xtype: 'BabylonDashboard',
                                    });
                                    newPanel.show();
                                }
                            });

                        },
                        TRADER: function() {

                            Ext.require('JRN.UI.TRADER.TraderDashboard', function() {
                                // debugger;
                                var tb = WebApp.UI.Viewport.down('[id="TabManager"]');
                                var openPanel = tb.down('[id="TraderDashboard"]');
                                if (openPanel) {
                                    openPanel.show();
                                }
                                else {
                                    var newPanel = tb.add({
                                        id: 'TraderDashboard',
                                        xtype: 'TraderDashboard',
                                    });
                                    newPanel.show();
                                }
                            });

                        },
                        BANK: function() {
                            Ext.require('JRN.UI.Bank.PortfolioDashboard', function() {
                                // debugger;
                                var tb = WebApp.UI.Viewport.down('[id="TabManager"]');
                                var openPanel = tb.down('[id="PortfolioDashboard"]');
                                if (openPanel) {
                                    openPanel.show();
                                }
                                else {
                                    var newPanel = tb.add({
                                        id: 'PortfolioDashboard',
                                        xtype: 'PortfolioDashboard',
                                    });
                                    newPanel.show();
                                }
                            });

                        },
                        MAP: function() {
                            console.info('John is NOT loading the map for testing...');
                            Ext.require('JRN.UI.GMaps.MainGMap', function() {
                                // debugger;
                                var tb = WebApp.UI.Viewport.down('[id="TabManager"]');
                                var openPanel = tb.down('[id="MainGMapDashboard"]');
                                if (openPanel) {
                                    openPanel.show();
                                }
                                else {
                                    var newPanel = tb.add({
                                        id: 'MainGMapDashboard',
                                        xtype: 'MainGMap',
                                    });
                                    newPanel.show();


                                    // WebApp.UI.Viewport.MAP.PlayerStats(WebApp.ActiveUser.ClientInfo.UserLogin.UserID);


                                }
                            });
                        },
                        xxxxxxx: function() {},
                    }

                    // debugger;

                    // Ext.require('JRN.CLS.FauxLife', function() {
                    // });



                    /*
                    
                        */


                    // debugger;
                    if (WebApp.ActiveUser.ClientInfo.UserLogin.UserID == 80) {
                        return;
                        // console.info('John is TESTING...');

                        // JOHNDEBUGER.ThreeJSTEST();
                    }




                }, 3500);
                //ONLY DEBUG....................................
            }

        }
        catch (errJohnTesting) {

        }



        /*
            If you are using S010 then boot that bad boy up!
        */
        if (WebApp.S010) {

            WebApp.S010.BOOT(function(err, info) {
                if (err) {
                    debugger;
                }
                if (info.msg) {
                    // console.info(info.msg);
                    //  var xx= WebApp.UI.Viewport.down('[id="TrafficInfo"]')
                    // debugger;
                    setTimeout(function() {
                        var NaviGroupsPanel = WebApp.UI.Viewport.down('NaviGroups');

                        NaviGroupsPanel.add({

                            layout: 'fit',
                            xtype: 'S010Navi'
                        });

                    }, 66.6);
                }
                // debugger;

            });

        }

    },
    SetUpdatedPanels: function() {

        if (WebApp.Debug.Config.Level) {
            debugger;

        }

    }
});
