"use strict";

// global variables
var canvas;
var gl;
var changeFlag = 1;

// texture stuff 
var texCoordsArray = [];
var texture;
var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];


// lighting stuff
var normalsArray = [];

var currentColor = [1,1,1,1];

var lightPosition = vec4(0.2, 0.5, 0.7, 0.0 );
var lightAmbient = vec4(1.0, 1.0, 1.0, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightAttenuation = 0;
var attenuation_linnear = 0.1;
var attenuation_quadratic = 0.8;

var materialAmbient = vec4( 0.2, 0.2, 0.2, 1.0 );
var materialDiffuse = vec4( 1.0, 1.0, 1.0, 1.0);
var materialSpecular = vec4( 0.0, 0.0, 0.0, 1.0 );
var materialShininess = 1.0;

var ctm;
var ambientColor, diffuseColor, specularColor;

var dayFlag = 1;

// primitive stuff
var points = [];
var allPoints = [];
var colors = [];
var allColors = [];

var vertexColors = [
    [0.0, 0.0, 0.0, 1.0], // black 0
    [1.0, 0.0, 0.0, 1.0], // red 1
    [1.0, 1.0, 0.0, 1.0], // yellow 2
    [0.0, 1.0, 0.0, 1.0], // green 3
    [0.0, 0.0, 1.0, 1.0], // blue 4
    [1.0, 0.0, 1.0, 1.0], // magenta 5
    [0.0, 1.0, 1.0, 1.0], // cyan 6
    [0.79, 0.76, 0.21, 1.0], // grass1 7
    [0.43, 0.55, 0.21, 1.0], // grass2 8
    [0.48, 0.59, 0.78, 1.0], // water 9
    [0.92, 0.85, 0.58, 1.0], // hut 10
    [0.39, 0.32, 0.09, 1.0], // roof 11
    [0.58, 0.78, 1.0, 1.0], // white 12
    [1.0, 0.5, 0.0,1.0] // fire 13
];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

// UI inputs
var axis = 0;
var zoomFactor = 1.0;
var shapeChoice = "Igloo";

// Camera stuff
var near = -2;
var far = 2;
var radius = 1.0;
var theta2  = 0.3;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var left = -1.0;
var right = 1.0;
var ytop = 1.0;
var bottom = -1.0;


var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var eye;

const at = vec3(0.0, 0.5, 0.5);
const up = vec3(0.0, 1.0, 0.0);

// Uniforms
var objectID = 0;
var theta = [0.0, 0.0, 0.0];
var zoom = mat4(zoomFactor, 0.0, 0.0, 0.0,
    0.0, zoomFactor, 0.0, 0.0,
    0.0, 0.0, zoomFactor, 0.0,
    0.0, 0.0, 0.0, 1.0);
var objectAxis = [0.0,0.0,0.0,0.0];

// Uniform Locs
var thetaLoc;
var zoomLoc;
var objectIDLoc;
var objectAxisLoc;
var diffuseProductLoc;
var lightPositionLoc;
var lightDiffuseLoc;
var lightSpecularLoc;
var lightAmbientLoc;
var lightAttenuationLoc;
var attenuation_linnearLoc;
var attenuation_quadraticLoc;

var normalMatrix, normalMatrixLoc;

// scene Objects array
var sceneObjects = [];

// scene object prototype
function sceneObject(oN, oP, oC, oA, rT, dC) {
    this.objectName = oN;
    this.objectPoints = oP;
    this.objectColors = oC;
    this.objectAxis = oA;
    this.rotateAxis = 0;
    this.rotateTheta = [0.0, 0.0, 0.0];
    this.rotationFactor = 0.0;
}



window.onload = function init() {
    canvas = document.getElementById("gl-canvas");


    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    // generate scene objects and store them for use later when drawing
    
    plane(0, 0, 0, 7); // xxx, yyy, zzz, cl
    var ground = new sceneObject("Ground", points, colors, [0, 0, 0], theta);
    sceneObjects.push(ground);
    points = [];
    colors = [];

    circle(2, 10, -0.3, 0.01, 0.2,4); //size, facelength, xxx, yyy, zzz, cl
    var lake = new sceneObject("Lake", points, colors, [-0.2, 0.0, 0.2], theta);
    sceneObjects.push(lake);
    points = [];
    colors = [];

    cylinder(0.6, 0.2, 10, 0.0, 0.0, 0.0); // size, height, facelength, xxx,yyy,zzz
    cone(0.6, 0.2, 10, 0, 0.2, 0); //size,height,facelength,xxx,yyy,zzz
    var hut = new sceneObject("Hut", points, colors, [0, 0.0, 0], theta);
    sceneObjects.push(hut);
    points = [];
    colors = [];

    semiSphere(0.2, 20, 0.6, 0.00, 0,12); //size,facelength,xxx,yyy,zzz, cL
    var igloo = new sceneObject("Igloo", points, colors, [0.6, 0.00, 0.0], theta);
    sceneObjects.push(igloo);
    points = [];
    colors = [];

    // push all scene info onto the GPU arrays
    for (var o = 0; o < sceneObjects.length; o++) {
        allPoints = allPoints.concat(sceneObjects[o].objectPoints);
        allColors = allColors.concat(sceneObjects[o].objectColors);
    }


    for (var s=0;s<allPoints.length;s++)
    {
        normalsArray.push(allPoints[s][0],allPoints[s][1], allPoints[s][2], 0.0);
    }

    for (var s=0;s<allPoints.length;s++)
    {
        texCoordsArray.push(texCoord[0]);
        texCoordsArray.push(texCoord[1]);
        texCoordsArray.push(texCoord[2]);
        texCoordsArray.push(texCoord[0]);
        texCoordsArray.push(texCoord[2]);
        texCoordsArray.push(texCoord[3]);
        s+=5;
    }

    // GPU setup stuff
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");

    gl.useProgram(program);

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);


    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(allPoints), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );


    // grab variable memory locations
    thetaLoc = gl.getUniformLocation(program, "theta");
    zoomLoc = gl.getUniformLocation(program, "zoom");
    objectIDLoc = gl.getUniformLocation(program, "objectID");
    objectAxisLoc = gl.getUniformLocation(program, "objectAxis");

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    
    normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );

    diffuseProductLoc = gl.getUniformLocation(program, "diffuseProduct");
    lightPositionLoc = gl.getUniformLocation(program, "lightPosition");

    attenuation_quadraticLoc = gl.getUniformLocation(program, "attenuation_quadratic");
    attenuation_linnearLoc = gl.getUniformLocation(program, "attenuation_linnear");


    // lighting variables
    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

    //event listeners for buttons

    document.getElementById("xButton").onclick = function() {
        for (var i = 0; i < sceneObjects.length; i++) {
            if (shapeChoice == sceneObjects[i].objectName) {
                sceneObjects[i].rotateAxis = xAxis;
            }
        }
    };
    document.getElementById("yButton").onclick = function() {
        for (var i = 0; i < sceneObjects.length; i++) {
            if (shapeChoice == sceneObjects[i].objectName) {
                sceneObjects[i].rotateAxis = yAxis;
            }
        }
    };
    document.getElementById("zButton").onclick = function() {
        for (var i = 0; i < sceneObjects.length; i++) {
            if (shapeChoice == sceneObjects[i].objectName) {
                sceneObjects[i].rotateAxis = zAxis;
            }
        }
    };
    document.getElementById("startButton").onclick = function() {
        for (var i = 0; i < sceneObjects.length; i++) {
            if (shapeChoice == sceneObjects[i].objectName) {
                sceneObjects[i].rotationFactor = 2;
            }
        }
    };
    document.getElementById("stopButton").onclick = function() {
        for (var i = 0; i < sceneObjects.length; i++) {
            if (shapeChoice == sceneObjects[i].objectName) {
                sceneObjects[i].rotationFactor = 0;
            }
        }
    };

    document.getElementById("zoomSlider").onchange = function(event) {
        zoomFactor = parseFloat(event.target.value);
    };

    document.getElementById("rotationSpeedSlider").onchange = function(event) {
        for (var i = 0; i < sceneObjects.length; i++) {
            if (shapeChoice == sceneObjects[i].objectName) {
                sceneObjects[i].rotationFactor = event.target.value;
            }
        }
    };

    document.getElementById("shapeChoice").onchange = function(event) {
        shapeChoice = document.querySelector('input[name="shapeChoice"]:checked').value;
    };

    document.getElementById("dayButton").onclick = function() {
                    if (dayFlag == 1)
                    {
                        dayFlag = 0;
                    }
                    else 
                    {
                        dayFlag = 1;
                    }
    };


    //event listeners for context menu
    $(function() {
        $.contextMenu({
            selector: '.context-menu-one',
            callback: function(key, options) {
                var m = "clicked: " + key;

                if (key == "Zoom In") {
                    if (zoomFactor < 2.0)
                        zoomFactor += 0.25;
                }

                if (key == "Zoom Out") {
                    if (zoomFactor > 0.2)
                        zoomFactor -= 0.25;
                }

                if (key == "Start Rotation") {
                    for (var i = 0; i < sceneObjects.length; i++) {
                        if (shapeChoice == sceneObjects[i].objectName) {
                            sceneObjects[i].rotationFactor = 2;
                        }
                    }
                }

                if (key == "Stop Rotation") {
                    for (var i = 0; i < sceneObjects.length; i++) {
                        if (shapeChoice == sceneObjects[i].objectName) {
                            sceneObjects[i].rotationFactor = 0;
                        }
                    }
                }
                if (key == "Day / Night") {
                    if (dayFlag == 1)
                    {
                        dayFlag = 0;
                    }
                    else 
                    {
                        dayFlag = 1;
                    }
                }

                if (key == "Exit") {
                    location.reload();
                }
            },
            items: {
                "Zoom In": {
                    name: "Zoom In"
                },
                "Zoom Out": {
                    name: "Zoom Out"
                },
                "Start Rotation": {
                    name: "Start Rotation"
                },
                "Stop Rotation": {
                    name: "Stop Rotation"
                },
                "Day / Night": {
                    name: "Day / Night"
                },
                "Exit": {
                    name: "Exit (Reset)"
                }
            }
        });
    });

    // set memory locations for shader variables
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
       flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
       flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
       flatten(specularProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
       flatten(lightPosition) );

    gl.uniform1f(gl.getUniformLocation(program,
       "shininess"),materialShininess);

        gl.uniform1f(gl.getUniformLocation(program,
       "lightAttenuation"),lightAttenuation);
        gl.uniform1f(gl.getUniformLocation(program,
       "attenuation_quadratic"),attenuation_quadratic);
        gl.uniform1f(gl.getUniformLocation(program,
       "attenuation_linnear"),attenuation_linnear);


    var image = document.getElementById("texImage");
    
    texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

    render();

}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

// camera stuff
        eye = vec3(radius*Math.sin(phi), radius*Math.sin(theta2),
        radius*Math.cos(phi));

        modelViewMatrix = lookAt(eye, at , up);
        projectionMatrix = ortho(left, right, bottom, ytop, near, far);

normalMatrix = [
        vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
        vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
        vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];

        gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
        gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
        gl.uniformMatrix3fv( normalMatrixLoc, false, flatten(normalMatrix) );

// zoom application 
    zoom = mat4(zoomFactor, 0.0, 0.0, 0.0,
        0.0, zoomFactor, 0.0, 0.0,
        0.0, 0.0, zoomFactor, 0.0,
        0.0, 0.0, 0.0, 1.0);

// send zoom to shaders
    gl.uniformMatrix4fv(zoomLoc, false, flatten(zoom));

    var startPoint;
    var endPoint;

// process each object individualy to allow handling differently in the shaders
    for (var i = 0; i < sceneObjects.length; i++) {

        // for possible future use in the shader
        objectID = i;

        // rotate individual objects when required
        sceneObjects[i].rotateTheta[sceneObjects[i].rotateAxis] += Math.floor(sceneObjects[i].rotationFactor);
        axis = sceneObjects[i].rotateAxis;
        theta = sceneObjects[i].rotateTheta;
        objectAxis = sceneObjects[i].objectAxis;

        // send uniform data to shaders
        gl.uniform1i(objectIDLoc, objectID);
        gl.uniform3fv(thetaLoc, theta);
        gl.uniform3fv(objectAxisLoc, objectAxis);

       var diffuseProduct = mult(lightDiffuse, sceneObjects[i].objectColors[0]);
       gl.uniform4fv(diffuseProductLoc,diffuseProduct);
       
       if (dayFlag == 1)
       {
       lightPosition = vec4(0.15, 1.0, 1.0, 0.0 );
        lightAmbient = vec4(1.0, 1.0, 1.0, 1.0 );
        lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
        lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
        lightAttenuation = 0;
        }
        else 
        {
        lightPosition = vec4(0.7, 0.0, -0.4, 1.0 );
        lightAmbient = vec4(1.0, 1.0, 1.0, 1.0 );
        lightDiffuse = vec4( 1.0, 0.5, 0.0, 1.0 );
        lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
        lightAttenuation = 2;
        }

       gl.uniform4fv(lightPositionLoc,lightPosition);
       gl.uniform4fv(lightAmbientLoc,lightAmbient);
       gl.uniform4fv(lightDiffuseLoc,lightDiffuse);


       gl.uniform4fv(lightSpecularLoc,lightSpecular);
       gl.uniform1f(lightAttenuationLoc,lightAttenuation);
       gl.uniform1f(attenuation_quadraticLoc,attenuation_quadratic);   
       gl.uniform1f(attenuation_linnearLoc,attenuation_linnear);  

        // get object start and end vertices
        if (i == 0) {
            startPoint = 0
        } else {
            startPoint = startPoint + sceneObjects[i - 1].objectPoints.length;
        }

        endPoint = sceneObjects[i].objectPoints.length;

        // send object to shaders for drawing
        gl.drawArrays(gl.TRIANGLES, startPoint, endPoint);

    }

    requestAnimFrame(render);

}

// primitives

function circle(size, facelength, xxx, yyy, zzz, cl) {
    var sin80 = Math.sin(radians(80));
    var cos80 = Math.cos(radians(80));

    for (var theta = -180; theta <= 180; theta += facelength) {
        var thetar = radians(theta);
        points.push(vec4(xxx, yyy, zzz, 1));
        colors.push(vertexColors[cl]);
        points.push(vec4(size * (xxx + Math.sin(thetar) * cos80), yyy, size * (zzz + Math.cos(thetar) * cos80), 1));
        colors.push(vertexColors[cl]);
        theta += facelength;
        var thetar = radians(theta);
        points.push(vec4(size * (xxx + Math.sin(thetar) * cos80), yyy, size * (zzz + Math.cos(thetar) * cos80), 1));
        colors.push(vertexColors[cl]);
        theta -= facelength;
    }

}

function cone(size, height, facelength, xxx, yyy, zzz) {
    var sin80 = Math.sin(radians(80));
    var cos80 = Math.cos(radians(80));

    for (var theta = -180; theta <= 180; theta += facelength) {
        var thetar = radians(theta);
        points.push(vec4(xxx, yyy + height, zzz, 1));
        colors.push(vertexColors[11]);
        points.push(vec4(size * (xxx + Math.sin(thetar) * cos80), yyy, size * (zzz + Math.cos(thetar) * cos80), 1));
        colors.push(vertexColors[11]);
        theta += facelength;
        var thetar = radians(theta);
        points.push(vec4(size * (xxx + Math.sin(thetar) * cos80), yyy, size * (zzz + Math.cos(thetar) * cos80), 1));
        colors.push(vertexColors[11]);
        theta -= facelength;
    }

}

function cylinder(size, height, facelength, xxx, yyy, zzz) {
    var sin80 = Math.sin(radians(80));
    var cos80 = Math.cos(radians(80));

    for (var theta = -180; theta <= 180; theta += facelength) {

        //draw triangle face at the top of the cylinder
        var thetar = radians(theta);
        // x
        var vX = vec4(xxx, yyy + height, zzz, 1);
        points.push(vX);
        colors.push(vertexColors[7]);

        // y
        //console.log(x+(size*Math.sin(thetar)*cos80));
        var vY = vec4(xxx + size * (Math.sin(thetar) * cos80), yyy + height, zzz + size * (Math.cos(thetar) * cos80), 1);
        points.push(vY);
        colors.push(vertexColors[7]);

        theta += facelength;
        var thetar = radians(theta);
        // z
        var vZ = vec4(xxx + size * (Math.sin(thetar) * cos80), yyy + height, zzz + size * (Math.cos(thetar) * cos80), 1);
        points.push(vZ);
        colors.push(vertexColors[7]);

        theta -= facelength;

        //draw triangle face at the bottom of the cylinder
        var thetar = radians(theta);
        // a
        var vA = vec4(xxx, yyy, zzz, 1);
        points.push(vA);
        colors.push(vertexColors[7]);
        // b
        var vB = vec4(xxx + size * (Math.sin(thetar) * cos80), yyy, zzz + size * (Math.cos(thetar) * cos80), 1);
        points.push(vB);
        colors.push(vertexColors[7]);

        theta += facelength;
        var thetar = radians(theta);
        // c
        var vC = vec4(xxx + size * (Math.sin(thetar) * cos80), yyy, zzz + size * (Math.cos(thetar) * cos80), 1);
        points.push(vC);
        colors.push(vertexColors[7]);
        theta -= facelength;
        //connect two face triangles via 2 side triangles y-b-z & c-z-b

        points.push(vY);
        colors.push(vertexColors[7]);
        points.push(vB);
        colors.push(vertexColors[7]);
        points.push(vZ);
        colors.push(vertexColors[7]);
        points.push(vC);
        colors.push(vertexColors[7]);
        points.push(vZ);
        colors.push(vertexColors[7]);
        points.push(vB);
        colors.push(vertexColors[7]);

    }

}

function semiSphere(size, facelength, xxx, yyy, zzz, cL) // (2,10,0.2,0.05,0.2);
    {
        var sin80 = Math.sin(radians(80));
        var cos80 = Math.cos(radians(80));
        var sphereInd = [];
        var k = 0;
        var longbands = 0;
        var latbands = 0;

        for (var phi = -80; phi <= 80; phi += facelength) {
            var phir = radians(phi);
            var phir20 = radians(phi + facelength);

            //for (var theta = -180; theta <= 180; theta += facelength)
            for (var theta = -90; theta <= 90; theta += facelength) {
                var thetar = radians(theta);
                sphereInd[k] = vec4(xxx + size * Math.sin(thetar) * Math.cos(phir), yyy + size * Math.cos(thetar) * Math.cos(phir), zzz + size * Math.sin(phir), 1);
                k++;
                sphereInd[k] = vec4(xxx + size * Math.sin(thetar) * Math.cos(phir20), yyy + size * Math.cos(thetar) * Math.cos(phir20), zzz + size * Math.sin(phir20), 1);
                k++;
            }

        }

        for (var i = 0; i < k - 2; i += 2) {

            points.push(sphereInd[i]); // 0
            colors.push(vertexColors[cL]);
            points.push(sphereInd[i + 1]); // 1
            colors.push(vertexColors[cL]);
            points.push(sphereInd[i + 2]); // 2
            colors.push(vertexColors[cL]);

            points.push(sphereInd[i + 2]); // 2
            colors.push(vertexColors[cL]);
            points.push(sphereInd[i + 3]); // 3
            colors.push(vertexColors[cL]);
            points.push(sphereInd[i + 1]); // 1
            colors.push(vertexColors[cL]);

        }

    }


function plane(xxx, yyy, zzz, cl) {
    groundQuad(0, 1, 2, 3, cl, xxx, yyy, zzz);
}

function groundQuad(a, b, c, d, color, xxx, yyy, zzz) {
    var vertices = [
        vec4(xxx - 10, yyy + 0, zzz - 10, 1),
        vec4(xxx + 10, yyy + 0, zzz + 10, 1),
        vec4(xxx + 10, yyy + 0, zzz - 10, 1),
        vec4(xxx + -10, yyy + 0, zzz + 10, 1)
    ];

    var indices = [a, b, c, a, b, d];

    for (var i = 0; i < indices.length; ++i) {
        points.push(vertices[indices[i]]);
        colors.push(vertexColors[color]);

    }
}

// my cool firelight effect
window.setInterval(function(){

        var myR1 = Math.random()*0.1;
    if (changeFlag == 1)
    {
        if ((attenuation_quadratic += myR1 > 0.8) & (attenuation_quadratic += myR1 < 5))
        {
        attenuation_quadratic += myR1;
        }   
        changeFlag = 0;
    }
else
    {
        if ((attenuation_quadratic -= myR1 > 0.8) & (attenuation_quadratic -= myR1 < 5))
        {
        attenuation_quadratic -= myR1;
        }   
        changeFlag = 1; 
    }

}, 150);
