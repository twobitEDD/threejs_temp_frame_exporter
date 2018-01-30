var shared_renderer = function(){
	this.w = 1920;
    this.h = 1080;

	this.matrix = new THREE.OrthographicCamera( -.5, .5, .5, -.5, 1, 10 );
    this.matrix.position.z = 5;

    this.timer = 0;
    this.frame = 0;

    this.mouse_x = 0.;
    this.mouse_y = 0.;
    this.mouse_norm_x = 0.;
    this.mouse_norm_y = 0.;
    this.mouse_delta_x = 0.;
    this.mouse_delta_y = 0.;
    this.p_mouse_norm_x = 0.;
    this.p_mouse_norm_y = 0.;

    this.init_renderer();

    this.register_dom_events();
};





shared_renderer.prototype.init_renderer = function(){
    this.renderer = new THREE.WebGLRenderer({
        preserveDrawingBuffer: false 
    });

    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( this.w, this.h );
    this.renderer.autoClear = false;

    console.log("shared_renderer : renderer is set with", this.w, "by", this.h);
};





shared_renderer.prototype.render = function(_queue){
    requestAnimationFrame( this.render.bind(this, _queue) );

    var _size = _queue.length;
    for(var i = 0; i < _size; i++){
        _queue[i]();
    }

    var saveFile = function (strData, filename) {
        var link = document.createElement('a');
        if (typeof link.download === 'string') {
            document.body.appendChild(link); //Firefox requires the link to be in the body
            link.download = filename;
            link.href = strData;
            link.click();
            document.body.removeChild(link); //remove the link when done
        } else {
            location.replace(uri);
        }
    }

    saveFile(this.renderer.domElement.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream"), "test_" + ("0000000000" + this.frame.toString()).slice(-10) + ".jpg");

    this.timer+= .001;
    this.frame++;

    if(this.timer > 999999.){
        this.timer = 0.;
    }

    this.mouse_delta_x = 0;
    this.mouse_delta_y = 0;
};





shared_renderer.prototype.mouse_handler = function(_evt){
    if(_evt.targetTouches){
        var touch = event.targetTouches[0];

        this.mouse_x = touch.pageX;
        this.mouse_y = touch.pageY;
    } else {
        this.mouse_x = _evt.clientX;
        this.mouse_y = _evt.clientY;
    }

    this.mouse_norm_x = this.mouse_x / this.w;
    this.mouse_norm_y = 1. - this.mouse_y / this.h;

    this.mouse_delta_x = this.mouse_norm_x - this.p_mouse_norm_x;
    this.mouse_delta_y = this.mouse_norm_y - this.p_mouse_norm_y;

    this.p_mouse_norm_x = this.mouse_norm_x;
    this.p_mouse_norm_y = this.mouse_norm_y;
};





shared_renderer.prototype.append_renderer_to_dom = function(_target){
    _target.appendChild(this.renderer.domElement);

    console.log("shared_renderer : renderer is appended to", _target.nodeName);
};





shared_renderer.prototype.register_dom_events = function(){
    document.body.addEventListener("mousemove", this.mouse_handler.bind(this), false);
    document.body.addEventListener("touchmove", this.mouse_handler.bind(this), false);

    console.log("shared_renderer : mouse_handler() is registered to body mousemove event listener");

    document.addEventListener('touchstart', function(event){
        event.preventDefault();
    }, {passive: false});

    console.log("shared_renderer : preventDefault is enabled");
};