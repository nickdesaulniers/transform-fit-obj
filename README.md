#Transform Fit OBJ
Transforms an OBJ file to fit within the 2x2x2 culling cube.

`Usage: node index.js input_file output_file`

Before:

![before](before.png)

```
./index.js dragon.obj dragon2.obj
Before transforming
x: -7.0467 <---> 7.0467
y: 0 <---> 9.9399
z: -3.1513 <---> 3.1513

The mesh vertices can be translated by:
[ 0, -4.96995, 0 ]

The mesh vertices can be scaled by:
[ 0.14191039777484496, 0.2012092676988702, 0.3173293561387364 ]

After transforming
x: -1 <---> 1
y: -1 <---> 1
z: -1 <---> 1
Saved transformed mesh to dragon2.obj
```

After:

![after](after.png)

```
node index.js dragon2.obj dragon3.obj
Before transforming
x: -1 <---> 1
y: -1 <---> 1
z: -1 <---> 1
no transforming needed
```