var gl;
function createGLContext(canvas) {
  var names = ["webgl", "experimental-webgl"];
  var context = null;
  for (var i=0; i < names.length; i++) {
    try {
      context = canvas.getContext(names[i]); //获取webgl context绘图上下文
    } catch(e) {}
    if (context) {
      break;
    }
  }
  if (context) {
    context.viewportWidth = canvas.width;
    context.viewportHeight = canvas.height;
  } else {
    alert("Failed to create WebGL context!");
  }
  return context;
}

function loadShader(type, shaderSource) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert("Error compiling shader" + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);   
      return null;
  }
  return shader;  
}

function setupShaders() {
    //顶点着色器程序
    var vertexShaderSource = 
      'attribute vec4 a_Position;\n' +
      'void main() {\n' +
      '  gl_Position = a_Position;\n' +
      '  gl_PointSize = 10.0;\n' +
      '}\n';

    //片元着色器程序
    var fragmentShaderSource = 
      'void main(){ \n' +
      '    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); \n' + //gl_FragColor指定像素的颜色
      '} \n';                                         

  var vertexShader = loadShader(gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = loadShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Failed to setup shaders");
  }

  gl.useProgram(shaderProgram);
  gl.program= shaderProgram;
}

function initVertexBuffers(gl) {
  var vertices = new Float32Array([
    0, 0.5,   -0.5, -0.5,   0.5, -0.5
  ]);
  var n = 3; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  var a_PosLocation = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_PosLocation < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_PosLocation, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_PosLocation);

  return n;
}

function startup(){
    var canvas = document.getElementById('myGLCanvas');//获取<canvas>元素
	//var ctx = canvas.getContext('2d');  //向元素请求二维图形的绘图上下文
    gl = createGLContext(canvas);
    setupShaders(); //链接着色器程序

  // Write the positions of vertices to a vertex shader
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the rectangle
  gl.drawArrays(gl.TRIANGLES, 0, n);
 }