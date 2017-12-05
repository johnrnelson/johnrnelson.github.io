// var video, videoImage, videoImageContext, videoTexture;



window.WebApp = {
    WebCam: {
        Video: {
            Video: null,
            VideoImage: null,
            VideoImageContext: null,
            VideoTexture: null
        },
        //https://stemkoski.github.io/Three.js/Webcam-Texture.html
        Open() {

            var camvideo = document.getElementById('monitor');

            if (!navigator.getUserMedia) {
                alert('Sorry. <code>navigator.getUserMedia()</code> is not available.');
            }
            else {
                navigator.getUserMedia({
                    video: true
                }, gotStream, noStream);
            }

            function gotStream(stream) {
                if (window.URL) {
                    camvideo.src = window.URL.createObjectURL(stream);
                }
                else // Opera
                {
                    camvideo.src = stream;
                }

                camvideo.onerror = function(e) {
                    stream.stop();
                };

                stream.onended = noStream;
            }

            function noStream(e) {
                var msg = 'No camera available.';
                if (e.code == 1) {
                    msg = 'User denied access to use camera.';
                }
                alert(msg);
            }
        }
    },
    World: {
        Actors: {
            _ITEMS: {},
            //All the items in the world we keep track off...
            Add(ActorID) {



                // (width, height, depth)
                var geometry = new THREE.BoxGeometry(125, 125, 125);

                var loader = new THREE.TextureLoader();

                var texture0 = loader.load('/imgs/mymugshot_reg.png');
                var texture1 = loader.load('/imgs/mymugshot_reg.png');
                var texture2 = loader.load('/imgs/mymugshot_reg.png');
                var texture3 = loader.load('/imgs/mymugshot_reg.png');
                var texture4 = loader.load('/imgs/mymugshot_reg.png');
                var texture5 = loader.load('/imgs/mymugshot_reg.png');

                var materials = [
                    new THREE.MeshBasicMaterial({
                        map: texture0,
                        transparent: true,
                        opacity: 0.5,
                        // color: 0xFF0000
                    }),
                    new THREE.MeshBasicMaterial({
                        map: texture1,
                        transparent: true,
                        opacity: 0.5,
                        // color: 0xFF0000
                    }),
                    new THREE.MeshBasicMaterial({
                        map: texture2,
                        transparent: true,
                        opacity: 0.5,
                        // color: 0xFF0000
                    }),
                    new THREE.MeshBasicMaterial({
                        map: texture3,
                        transparent: true,
                        opacity: 0.5,
                        // color: 0xFF0000
                    }),
                    new THREE.MeshBasicMaterial({
                        map: texture4,
                        transparent: true,
                        opacity: 0.5,
                        // color: 0xFF0000
                    }),
                    new THREE.MeshBasicMaterial({
                        map: texture5,
                        transparent: true,
                        opacity: 0.5,
                        // color: 0xFF0000
                    })
                ];
                var faceMaterial = new THREE.MultiMaterial(materials);

                var mesh = new THREE.Mesh(geometry, faceMaterial);

                // debugger
                mesh.position.setZ(-200);
                mesh.animation = function() {

                    if (this.HOOK) {
                        // debugger;
                        var rect = this.HOOK.getBoundingClientRect();
                        // console.log(rect.top, rect.right, rect.bottom, rect.left);

                        // this.position.setY(rect.top);
                    }

                    var panelBounds = WebApp.World.HostElement.getBoundingClientRect();

                    // WebApp.World.Camera = new THREE.PerspectiveCamera(60, panelBounds.width / panelBounds.height, 1, 1000);
                    // debugger;
                    //  window.innerWidth / window.innerHeight;
                    var right = (panelBounds.width / WebApp.World.Camera.aspect);

                    this.position.setX((right / 20) - 100);


                    // return;
                    this.rotation.x += 0.005;
                    this.rotation.y += 0.008;
                }

                WebApp.World.Actors._ITEMS[ActorID] = mesh;
                WebApp.World.Scene.add(mesh);
                return mesh;




            }
        },
        Build() {

            WebApp.World.HostElement = document.body;
            // WebApp.World.HostElement.height = function(){
            //     return window.innerHeight;
            // };
            // WebApp.World.HostElement.width = function(){
            //     return window.innerWidth;
            // };


            // debugger;;
            var panelBounds = WebApp.World.HostElement.getBoundingClientRect();

            WebApp.World.Camera = new THREE.PerspectiveCamera(60, panelBounds.width / panelBounds.height, 1, 1000);
            // WebApp.World.Camera = new THREE.OrthographicCamera(panelBounds.width / -2, panelBounds.width / 2,
            //     panelBounds.height / 2, panelBounds.height / -2, 1, 1000);

            WebApp.World.Camera.position.z = 100;

            WebApp.World.WebRenderer = new THREE.WebGLRenderer({
                antialias: true
            });


            WebApp.World.WebRenderer.setClearColor(0xf0f0f0);
            // WebApp.World.WebRenderer.setClearColor( 0x000000, 0 ); // the default
            WebApp.World.WebRenderer.setPixelRatio(window.devicePixelRatio);
            WebApp.World.WebRenderer.setSize(panelBounds.width, panelBounds.height);


            WebApp.World.HostElement.appendChild(WebApp.World.WebRenderer.domElement);



            WebApp.World.Scene = new THREE.Scene();

            // WebApp.World.Scene.add(WebApp.World.Camera);


            //scene.fog=new THREE.FogExp2( 0xffffff, 0.015 );
            // WebApp.World.Scene.fog = new THREE.Fog(0xffffff, 0.015, 100);


            function onWindowResize() {
                // console.info('wtf?')
                try {
                    // debugger;
                    WebApp.World.Camera.aspect = window.innerWidth / window.innerHeight;
                    WebApp.World.Camera.updateProjectionMatrix();
                    WebApp.World.WebRenderer.setSize(window.innerWidth, window.innerHeight);

                }
                catch (errWindowResize) {
                    console.warn(errWindowResize)
                }

            };
            window.addEventListener('resize', onWindowResize, false);
            onWindowResize();





            // (color, intensity)
            var light = new THREE.PointLight(0xffffff, 1.2);
            // (x, y, z)
            light.position.set(0, 0, 6);
            WebApp.World.Scene.add(light);

            // var light = new THREE.PointLight(0xffffff);
            // // 	var light = new THREE.PointLight(0xFFFFFF, 1, 100000);
            // light.position.set(0, 250, 0);
            // WebApp.World.Scene.add(light);



            var ambientLight = new THREE.AmbientLight(0x111111);
            WebApp.World.Scene.add(ambientLight);


            // rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr

            function render() {

                try {


                    requestAnimationFrame(render);
                    for (var a in WebApp.World.Actors._ITEMS) {
                        const actor = WebApp.World.Actors._ITEMS[a];
                        if (actor.animation) {
                            actor.animation();
                        }
                    }
                    // window.TESTME.rotation.x += 0.05;
                    // window.TESTME.rotation.y += 0.08;

                    // debugger;

                    if (WebApp.WebCam.Video.readyState === WebApp.WebCam.Video.HAVE_ENOUGH_DATA) {
                         

                        WebApp.WebCam.Video.VideoImageContext.drawImage(WebApp.WebCam.Video, 0, 0,
                            WebApp.WebCam.Video.VideoImage.width, WebApp.WebCam.Video.VideoImage.height);
                        if (WebApp.WebCam.Video.VideoTexture)
                            WebApp.WebCam.Video.VideoTexture.needsUpdate = true;
                    } 


                    WebApp.World.WebRenderer.render(WebApp.World.Scene, WebApp.World.Camera);
                }
                catch (errRenderWorld) {
                    console.warn(errRenderWorld);
                    WebApp.World.WebRenderer.render(WebApp.World.Scene, WebApp.World.Camera);

                }
            }
            render();
        }
    },

};
window.onload = function() {







    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    window.URL = window.URL || window.webkitURL;





    WebApp.WebCam.Open();












    WebApp.HTMLDisplay = document.getElementsByTagName('htmldisplay')[0];

    WebApp.HTMLDisplay.onscroll = function(evt) {
        // console.info('srollll-->', evt);
        // debugger;
        //  console.log(WebApp.HTMLDisplay.offsetHeight);
        //  console.log(WebApp.HTMLDisplay.offsetTop);
        // console.log(WebApp.HTMLDisplay.scrollTop);

        /*
            window.TESTME.position.y = WebApp.HTMLDisplay.scrollTop - WebApp.World.Camera.aspect;
        
            */

    };

    WebApp.World.Build();






    // window.TESTME = WebApp.World.Actors.Add('TEST_this.stuff');
    // TESTME.HOOK = document.getElementById('HOOKEL');



    // // Sphere parameters: radius, segments along width, segments along height
    // var sphereGeometry = new THREE.SphereGeometry(50, 32, 16);
    // // use a "lambert" material rather than "basic" for realistic lighting.
    // //   (don't forget to add (at least one) light!)
    // var sphereMaterial = new THREE.MeshLambertMaterial({
    //     color: 0x8888ff
    // });
    // var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    // sphere.position.set(100, 50, -50);
    // WebApp.World.Scene.add(sphere);

    // custom global variables
    // var video, videoImage, videoImageContext, videoTexture;


    WebApp.WebCam.Video = document.getElementById('monitor');

    WebApp.WebCam.Video.VideoImage = document.getElementById('videoImage');
    WebApp.WebCam.Video.VideoImageContext = WebApp.WebCam.Video.VideoImage.getContext('2d');
    // background color if no video present
    WebApp.WebCam.Video.VideoImageContext.fillStyle = '#000000';
    WebApp.WebCam.Video.VideoImageContext.fillRect(0, 0, WebApp.WebCam.Video.VideoImage.width, WebApp.WebCam.Video.VideoImage.height);

    WebApp.WebCam.Video.VideoTexture = new THREE.Texture(WebApp.WebCam.Video.VideoImage);
    WebApp.WebCam.Video.VideoTexture.minFilter = THREE.LinearFilter;
    WebApp.WebCam.Video.VideoTexture.magFilter = THREE.LinearFilter;

    var movieMaterial = new THREE.MeshBasicMaterial({
        map: WebApp.WebCam.Video.VideoTexture,
        overdraw: true,
        side: THREE.DoubleSide
    });
    // the geometry on which the movie will be displayed;
    // 		movie image will be scaled to fit these dimensions.
    var movieGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
    var movieScreen = new THREE.Mesh(movieGeometry, movieMaterial);
    movieScreen.position.set(0, 50, 0);
    WebApp.World.Scene.add(movieScreen);

    WebApp.World.Camera.position.set(0, 150, 300);
    WebApp.World.Camera.lookAt(movieScreen.position);


    WebApp.WebCam.Video.play();

};
