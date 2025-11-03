var canvas;
var gl;

var maxNumVertices = 200;
var index = 0;
var SHAPE_points = [];
var selectedColorIndex = 0;

var colors = [
    vec4(0.0, 0.0, 0.0, 1.0),  // black
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(1.0, 0.0, 1.0, 1.0),  // magenta
    vec4(0.0, 1.0, 1.0, 1.0)   // cyan
];

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    // Add points by clicking
    canvas.addEventListener("click", function(event){
        if(index < maxNumVertices) {
            var t = vec2(
                2 * event.clientX / canvas.width - 1,
                2 * (canvas.height - event.clientY) / canvas.height - 1
            );
            SHAPE_points.push(t);
            index++;
        }
    });

    // Print shape with chosen color
    document.getElementById("print_shape").addEventListener("click", function(){
        console.log("Shape Points:", SHAPE_points);
        

        // Draw all points with the selected color
        drawShape();
    });

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.5, 0.5, 0.5, 1.0);

    // Load shaders
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Vertex buffer
    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumVertices, gl.DYNAMIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // Color buffer
    cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 16 * maxNumVertices, gl.DYNAMIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    render();
}

function drawShape() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    if(SHAPE_points.length > 0) {
        // Fill vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(SHAPE_points));

        // Fill color buffer with the selected color
        var pointColors = [];
        for(var i = 0; i < SHAPE_points.length; i++) {
            pointColors.push(colors[selectedColorIndex]);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(pointColors));

        // Draw points
        gl.drawArrays(gl.POINTS, 0, SHAPE_points.length);
    }
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    window.requestAnimFrame(render);
}
