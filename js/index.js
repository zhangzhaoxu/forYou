window.onload = function () {
    new show();
};

function show(){
    this.__init();
}

var p = show.prototype;

p.__init = function () {
    this.__initData();
    this.__initBackground();
};

p.getSize = function () {
    var winW = window.innerWidth;
    var winH = window.innerHeight;
    return {
        w : winW,
        h : winH
    }
};

p.__initData = function () {
    this.size = this.getSize();
    this.canvas = document.getElementById("canvas");
    this.canvas.width = this.size.w;
    this.canvas.height = this.size.h;
    this.stage = new createjs.Stage(this.canvas);
    this.bgImage;
    this.rectImage;
};


p.__initBackground = function () {
    var _this = this;
    _this.bgImage = new Image();
    _this.size = _this.getSize();
    _this.bgImage.src = "images/1.jpg";
    _this.bgImage.addEventListener("load",_this.handleImageLoad.bind(_this))
};

p.handleImageLoad = function () {
    var _this = this;
    var bmp = new createjs.Bitmap(_this.bgImage);
    bmp.cache(0,0,_this.size.w,_this.size.h);
    bmp.scaleX = _this.size.w/_this.bgImage.width;
    bmp.scaleY = _this.size.h/_this.bgImage.height;
    _this.stage.addChild(bmp);
    _this.stage.update();
    this.__initRectImage();

};

p.__initRectImage = function () {
    var _this = this;
    _this.rectImage = new Image();
    _this.rectImage.src = "images/3.jpg";
    _this.rectImage.addEventListener("load",_this.handleRectImageLoad.bind(_this));
};

p.handleRectImageLoad = function () {
    var _this = this;
    _this.__initRect();
};

p.__initRect = function () {
    var _this = this;
    var size = _this.size;
    console.log(_this.rectImage);
    var rect = new createjs.Shape();
    rect.graphics.bf(_this.rectImage).ss(8).moveTo(10,size.h*0.3).lineTo(10,size.h*0.6).lineTo(size.w*0.6,size.h*0.6).lineTo(size.w*0.35,size.h*0.3).closePath();
    _this.stage.addChild(rect);
    _this.stage.update();
};
