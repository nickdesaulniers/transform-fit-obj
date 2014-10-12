#!/usr/bin/env node

if (process.argv.length !== 4) {
  console.error("Usage: ./index.js input_file output_file");
  process.exit(1);
}

var fs = require('fs');
var OBJ = require('webgl-obj-loader');
var toOBJ = require('array-to-wavefront-obj');
require('colors');

var meshPath = './dragon2.obj';
var opt = { encoding: 'utf8' };

fs.readFile(process.argv[2], opt, function (err, data){
  if (err) return console.error(err);
  var mesh = new OBJ.Mesh(data);

  var mm0 = minMaxVertices(mesh.vertices);

  console.log('Before transforming'.yellow);
  printAll(mm0);

  if (allValid(mm0)) return console.log('no transforming needed'.green);

  var translationVector = [
    translationFactor(mm0.xMax, mm0.xMin),
    translationFactor(mm0.yMax, mm0.yMin),
    translationFactor(mm0.zMax, mm0.zMin)
  ];
  var scaleVector = [
    scaleFactor(mm0.xMax + translationVector[0], mm0.xMin + translationVector[0]),
    scaleFactor(mm0.yMax + translationVector[1], mm0.yMin + translationVector[1]),
    scaleFactor(mm0.zMax + translationVector[2], mm0.zMin + translationVector[2])
  ];
  //var mm2 = maxMin(mesh.textures);
  //var mm3 = maxMin(mesh.indices);
  //console.log(mesh.vertices);

  //console.log('xMin:', mm0.xMin, 'xMax:', mm0.xMax);
  //console.log('yMin:', mm0.yMin, 'yMax:', mm0.yMax);
  //console.log('zMin:', mm0.zMin, 'zMax:', mm0.zMax);
  //console.log('normals max: ' + mm1.max + ', min: ' + mm1.min);

  console.log('\nThe mesh vertices can be translated by:'.yellow);
  console.log(translationVector);

  console.log('\nThe mesh vertices can be scaled by:'.yellow);
  console.log(scaleVector);
  console.log();

  transformVertices(mesh.vertices, translationVector, scaleVector);

  var xm0 = minMaxVertices(mesh.vertices);
  console.log('After transforming'.yellow);
  printAll(xm0);
  //console.log('xMin:', xm0.xMin, 'xMax:', xm0.xMax);
  //console.log('yMin:', xm0.yMin, 'yMax:', xm0.yMax);
  //console.log('zMin:', xm0.zMin, 'zMax:', xm0.zMax);

  var mesh2 = toOBJ(mesh.vertices, mesh.vertexNormals, mesh.textures, mesh.indices);

  //console.log(mesh2);
  //
  fs.writeFile(process.argv[3], mesh2, function (err) {
    if (err) return console.error('Error saving ' + process.argv[3]);
    console.log('Saved transformed mesh to ' + process.argv[3]);
  });
});

function valid (v) { return v >= -1.0 && v <= 1.0; };
function allValid (mm) {
  return valid(mm.xMin) && valid(mm.xMax) && valid(mm.yMin) &&
         valid(mm.yMax) && valid(mm.zMin) && valid(mm.zMax);
};

function print (axis, max, min) {
  console.log(axis, (min < -1.0 ? min.toString().red : min.toString().green) + ' <---> ' +
    (max > 1.0 ? max.toString().red : max.toString().green));
};

function printAll (mm) {
  print('x:', mm.xMax, mm.xMin);
  print('y:', mm.yMax, mm.yMin);
  print('z:', mm.zMax, mm.zMin);
};

// We want the inverse of the max - min scaled to fit into [-1, 1] (length 2)
// But we must also take into account the translation vector
function scaleFactor (max, min) {
  return 1 / ((max - min) / 2);
};

function translationFactor (max, min) {
  return -(min + (max - min) / 2);
};

function maxMin (arr) {
  var max = 0;
  var min = 0;
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] > max) max = arr[i];
    if (arr[i] < min) min = arr[i];
  }
  return {
    max: max,
    min: min,
  };
};

// expects arr to be an flat array of [x, y, z, x, y, z, ...]
// might not need averages?
function minMaxVertices (arr) {
  var xMin = 0;
  var xMax = 0;
  var yMin = 0;
  var yMax = 0;
  var zMin = 0;
  var zMax = 0;
  for (var i = 0, len = arr.length; i < len; i += 3) {
    var x = arr[i];
    var y = arr[i + 1];
    var z = arr[i + 2];
    if (x > xMax) {
      xMax = x;
    } else if (x < xMin) {
      xMin = x;
    }
    if (y > yMax) {
      yMax = y;
    } else if (y < yMin) {
      yMin = y;
    }
    if (z > zMax) {
      zMax = z;
    } else if (z < zMin) {
      zMin = z;
    }
  }
  return {
    xMin: xMin,
    xMax: xMax,
    yMin: yMin,
    yMax: yMax,
    zMin: zMin,
    zMax: zMax,
  };
};

function transformVertices (vertices, translationVector, scaleVector) {
  for (var i = 0; i < vertices.length; i += 3) {
    vertices[i    ] = (vertices[i    ] + translationVector[0]) * scaleVector[0];
    vertices[i + 1] = (vertices[i + 1] + translationVector[1]) * scaleVector[1];
    vertices[i + 2] = (vertices[i + 2] + translationVector[2]) * scaleVector[2];
  }
};

