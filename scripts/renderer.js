class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // limit_fps_flag:      bool 
    // fps:                 int
    constructor(canvas, limit_fps_flag, fps) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.slide_idx = 0;
        this.limit_fps = limit_fps_flag;
        this.fps = fps;
        this.start_time = null;
        this.prev_time = null;
        //everything defined in constructor because drawSlide is redone every frame
        //slide0:
        this.dx = 10;
        this.dy = 10;
        this.diamond = [
            Vector3(100, 50, 1),
            Vector3(50, 150, 1),
            Vector3(100, 250, 1),
            Vector3(200, 250, 1),
            Vector3(250, 150, 1),
            Vector3(200, 50, 1)
        ]
        // console.log(this.diamond[0]);
        this.teal = [0, 128, 128, 255];
        this.tealTranslate = new Matrix(3,3);
        mat3x3Translate(this.tealTranslate, 20, 20);
        
        //slide1:
        this.polygon = [ 
            Vector3(100, 50, 1),
            Vector3(50, 150, 1),
            Vector3(100, 250, 1),
            Vector3(200, 250, 1),
            Vector3(250, 150, 1),
            Vector3(200, 50, 1)
        ];
        this.red = [200, 0, 0, 255];
        this.redRotate = new Matrix(3,3);
        mat3x3Rotate(this.redRotate, 5, 5);
        this.redTranslate1 = new Matrix(3,3);
        this.redTranslate2 = new Matrix(3,3);
        this.redOrigin= new Matrix(3,3);
        mat3x3Translate(this.redTranslate1, -150, -150);
        mat3x3Translate(this.redTranslate2, 150, 150);
        this.redOrigin = Matrix.multiply([this.redTranslate2, this.redRotate]);
        // console.log(this.redOrigin);
        this.redOrigin = Matrix.multiply([this.redOrigin, this.redTranslate1]);

        this.orangePoly = [
            Vector3(400, 150, 1),
            Vector3(500, 300, 1),
            Vector3(400, 450, 1),
            Vector3(300, 300, 1)
        ];
        //add side-hitting ifs to a translate/rotate matrix translate 1 * rotate
        this.orange = [200,150,0,255];
        this.orangeRotate = new Matrix(3,3);
        mat3x3Rotate(this.orangeRotate, -15, 15);
        this.orangeTranslate1 = new Matrix(3,3);
        this.orangeTranslate2 = new Matrix(3,3);
        this.orangeOrigin= new Matrix(3,3);
        mat3x3Translate(this.orangeTranslate1, -400, -300);
        mat3x3Translate(this.orangeTranslate2, 400, 300);
        this.orangeOrigin = Matrix.multiply([this.orangeTranslate2, this.orangeRotate]);
        // console.log(this.redOrigin);
        this.orangeOrigin = Matrix.multiply([this.orangeOrigin, this.orangeTranslate1]);

        this.bluePoly = [
            Vector3(450, 400, 1),
            Vector3(400, 500, 1),
            Vector3(500, 600, 1),
            Vector3(600, 500, 1),
            Vector3(550, 400, 1),
        ];
        //add side-hitting ifs to a translate/rotate matrix translate 1 * rotate
        this.blue = [0,100,255,255];
        this.blueRotate = new Matrix(3,3);
        mat3x3Rotate(this.blueRotate, -10, 10);
        this.blueTranslate1 = new Matrix(3,3);
        this.blueTranslate2 = new Matrix(3,3);
        this.blueOrigin= new Matrix(3,3);
        mat3x3Translate(this.blueTranslate1, -500, -500);
        mat3x3Translate(this.blueTranslate2, 500, 500);
        this.blueOrigin = Matrix.multiply([this.blueTranslate2, this.blueRotate]);
        // console.log(this.redOrigin);
        this.blueOrigin = Matrix.multiply([this.blueOrigin, this.blueTranslate1]);


        //slide2:
    }

    // flag:  bool
    limitFps(flag) {
        this.limit_fps = flag;
    }

    // n:  int
    setFps(n) {
        this.fps = n;
    }

    // idx: int
    setSlideIndex(idx) {
        this.slide_idx = idx;
    }

    animate(timestamp) {
        // Get time and delta time for animation
        if (this.start_time === null) {
            this.start_time = timestamp;
            this.prev_time = timestamp;
        }
        let time = timestamp - this.start_time;
        let delta_time = timestamp - this.prev_time;
        //console.log('animate(): t = ' + time.toFixed(1) + ', dt = ' + delta_time.toFixed(1));

        // Update transforms for animation
        this.updateTransforms(time, delta_time);

        // Draw slide
        this.drawSlide();

        // Invoke call for next frame in animation
        if (this.limit_fps) {
            setTimeout(() => {
                window.requestAnimationFrame((ts) => {
                    this.animate(ts);
                });
            }, Math.floor(1000.0 / this.fps));
        }
        else {
            window.requestAnimationFrame((ts) => {
                this.animate(ts);
            });
        }

        // Update previous time to current one for next calculation of delta time
        this.prev_time = timestamp;
    }

    //
    updateTransforms(time, delta_time) {
        // TODO: update any transformations needed for animation
        //change positions and all side-hitting ifs
        // console.log(this.diamond[1].values[0]);
        
        for (let i=-0; i< this.diamond.length; i++) {
            // console.log(this.diamond();
            if(this.diamond[i].values[0] >= this.canvas.width){
                //hits right edge
                mat3x3Translate(this.tealTranslate, -this.dx, -this.dy);
            }
            if(this.diamond[i].values[0] <= 0) {
                //hits left edge
                mat3x3Translate(this.tealTranslate, -this.dx, this.dy);
            }
            if(this.diamond[i].values[1] <= 0) {
                //hits bottom
                mat3x3Translate(this.tealTranslate, this.dx, this.dy);
            }
            if(this.diamond[i].values[1] >= this.canvas.height){
                //hits top
                mat3x3Translate(this.tealTranslate, -this.dx, -this.dy);
                
            }
            
        }

    }

    //
    drawSlide() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        switch (this.slide_idx) {
            case 0:
                this.drawSlide0();
                break;
            case 1:
                this.drawSlide1();
                break;
            case 2:
                this.drawSlide2();
                break;
            case 3:
                this.drawSlide3();
                break;
        }
    }

    //
    drawSlide0() {
        // TODO: draw bouncing ball (circle that changes direction whenever it hits an edge)
        // TODO: draw the ball every dt
        //don't want to define anything at this  level, will be reset every frame

        // Following line is example of drawing a single polygon
        // (this should be removed/edited after you implement the slide)

        
        this.drawConvexPolygon(this.diamond, this.teal);
        for (let i = 0; i < this.diamond.length; i++){
            
            this.diamond[i] = Matrix.multiply([this.tealTranslate, this.diamond[i]]);
        }
        
    }

    //
    drawSlide1() {
        // TODO: draw at least 3 polygons that spin about their own centers
        //   - have each polygon spin at a different speed / direction
        this.drawConvexPolygon(this.polygon, this.red);
        this.drawConvexPolygon(this.orangePoly, this.orange)
        this.drawConvexPolygon(this.bluePoly, this.blue);
        for (let i = 0; i < this.polygon.length; i++){
            
            this.polygon[i] = Matrix.multiply([this.redOrigin, this.polygon[i]]);
            // this.polygon[i] = Matrix.multiply([this.redTranslate2, this.polygon[i]]);
        }

        for (let i = 0; i < this.orangePoly.length; i++){
            this.orangePoly[i] = Matrix.multiply([this.orangeOrigin, this.orangePoly[i]]);
            // this.polygon[i] = Matrix.multiply([this.redTranslate2, this.polygon[i]]);
        }
        
        for (let i = 0; i < this.bluePoly.length; i++){
            this.bluePoly[i] = Matrix.multiply([this.blueOrigin, this.bluePoly[i]]);
            // this.polygon[i] = Matrix.multiply([this.redTranslate2, this.polygon[i]]);
        }

    }

    //
    drawSlide2() {
        // TODO: draw at least 2 polygons grow and shrink about their own centers
        //   - have each polygon grow / shrink different sizes
        //   - try at least 1 polygon that grows / shrinks non-uniformly in the x and y directions


    }

    //
    drawSlide3() {
        // TODO: get creative!
        //   - animation should involve all three basic transformation types
        //     (translation, scaling, and rotation)


    }

    // vertex_list:  array of object [Matrix(3, 1), Matrix(3, 1), ..., Matrix(3, 1)]
    // color:        array of int [R, G, B, A]
    drawConvexPolygon(vertex_list, color) {
        this.ctx.fillStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (color[3] / 255) + ')';
        this.ctx.beginPath();
        let x = vertex_list[0].values[0][0] / vertex_list[0].values[2][0];
        let y = vertex_list[0].values[1][0] / vertex_list[0].values[2][0];
        this.ctx.moveTo(x, y);
        for (let i = 1; i < vertex_list.length; i++) {
            x = vertex_list[i].values[0][0] / vertex_list[i].values[2][0];
            y = vertex_list[i].values[1][0] / vertex_list[i].values[2][0];
            this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.fill();
    }
};
