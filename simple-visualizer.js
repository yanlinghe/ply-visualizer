var camera, scene, webGLRenderer;

var mouse = new THREE.Vector2();
var controls;

var group, object;

var loader;

var stats;

var visualizerSize;

function start(ply_file, transformation_matrix, visualizerSize, container) {
    init(ply_file, transformation_matrix, visualizerSize, container);
    animate();
}

function init(ply_file, transformation_matrix, visualizerSize, container) {
    container.css('position','relative');
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.append( stats.domElement );
    // create a scene, that will hold all our elements such as objects, cameras and lights.
    scene = new THREE.Scene();
    
    // create a camera, which defines where we're looking at.
    camera = new THREE.PerspectiveCamera(30, visualizerSize.width / visualizerSize.height, 1, 1000);
    camera.position.set(1, 0, 0);
	
    controls = new THREE.OrbitControls( camera );
    camera.position = new THREE.Vector3(100, 100, 100);
    controls.addEventListener( 'change', render );

    
    // create a render and set the size
    webGLRenderer = new THREE.WebGLRenderer();
    webGLRenderer.setClearColorHex(0x000, 1.0);
    webGLRenderer.setSize(visualizerSize.width, visualizerSize.height);
    
    // add the output of the renderer to the html element
    container.append(webGLRenderer.domElement);
    
    
    // call the render function
    group = new THREE.Object3D();
    
    loader = new THREE.PLYLoader();
    
    object = new THREE.Object3D();
    
    loader.addEventListener( 'load', function ( event ) {
                            
                            var geometry = event.content;
                                var objectMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors, side: THREE.DoubleSide } );
                                object = new THREE.Mesh(geometry, objectMaterial);
                           
                            var H = transformation_matrix.clone();

                            object.matrix = H;  
                            object.matrixAutoUpdate = false;
                            
                            group.add(object);
                            } );
    
    loader.load( ply_file[0] );
    loader.load( ply_file[1] );
    loader.load()
    group.position.set( 0, 0, 0 );

    // Rotate group orientation so the Z-axis matches the Y-axis
    // This is important because the OrbitControls assume Y is up.
    var H = new THREE.Matrix4();
    H.makeRotationX(-Math.PI/2);
    group.matrix = H;
    group.matrixAutoUpdate = false;

    scene.add(new THREE.AxisHelper(0.25));
    scene.add(group);
    
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
}


function onDocumentMouseMove( event ) {
    event.preventDefault();
    
    mouse.x = ( event.clientX / visualizerSize.width ) * 2 - 1;
    mouse.y = - ( event.clientY / visualizerSize.height ) * 2 + 1;
}

function animate() {
    requestAnimationFrame( animate );
    controls.update();
    render();
    stats.update();
}

function render() {
    webGLRenderer.render(scene, camera);
}
