window.onload = function () {
    new show();
};

var getSize = function () {
    var winW = window.innerWidth;
    var winH = window.innerHeight;
    return {
        w : winW,
        h : winH
    }
};

function show(){
    this.__initData();
    this.__initBackgrounds();
}

var p = show.prototype;

p.__initData = function () {
    var _this = this;
    createjs.MotionGuidePlugin.install(createjs.Tween);
    _this.size = getSize();
    _this.canvas = document.getElementById("canvas");
    _this.canvas.width = _this.size.w;
    _this.canvas.height = _this.size.h;
    _this.stage = new createjs.Stage(_this.canvas);
    _this.container = new createjs.Container();
    _this.bgNum = 0;
    _this.n = 0;
    _this.moveMark = 0;
};

p.__initBackgrounds = function () {
    var _this = this;
    _this.maniFest = [
        {src:'7.jpg',id:'image0'},
        {src:'1.jpg',id:'image1'},
        {src:'2.png',id:'image2'},
        {src:'3.jpg',id:'image3'},
        {src:'4.jpg',id:'image4'}
    ];
    _this.preload = new createjs.LoadQueue(true);
    _this.preload.on("fileload",_this.handleFileLoad.bind(this));
    _this.preload.on("complete",_this.handleFileComplete.bind(this));
    _this.preload.loadManifest(_this.maniFest,true,"images/");
};

p.handleFileLoad = function (evt) {
    var _this = this;

    var container = new createjs.Container();
    var bmp = new createjs.Bitmap(evt.result);
    bmp.cache(0,0,_this.size.w,_this.size.h);
    bmp.scaleX = _this.size.w/evt.result.width;
    bmp.scaleY = _this.size.h/evt.result.height;
    container.addChild(bmp);
    _this.stage.addChild(container);
    if(_this.bgNum == 0){
        _this.bgNum++;
    }else{
        container.y = _this.size.h;
    }
    _this.stage.update();
};

p.handleFileComplete = function () {
    new addToContainer1(this.stage);
    this.__containerChange();
};


p.__containerChange = function () {
    var _this = this;
    createjs.Touch.enable(_this.stage);
    var markerDown = 0;
    var moveMarker = 0;
    _this.stage.on("stagemousedown", function (evt) {
        markerDown = evt.stageY;
    });
    _this.stage.on("pressmove", function (evt) {
        moveMarker = evt.stageY;
    });
    _this.stage.on("stagemouseup", function () {
        if(moveMarker-markerDown<=-200&&_this.moveMark<4){
            var container0 = _this.stage.getChildAt(_this.moveMark);
            var container1 = _this.stage.getChildAt(++_this.moveMark);
            createjs.Tween.get(container0,{loop:false},true).to({y : -_this.size.h},1000).call(function () {
                var container = _this.stage.getChildAt(_this.moveMark-1);
                for(var i = 0 ;i < container.getNumChildren()+7 ; i++){
                    container.removeChildAt(1);
                }
            });
            createjs.Tween.get(container1,{loop:false},true).to({y : 0},1000).call(function () {
                switch (_this.moveMark){
                    case 1 :
                        new addToContainer2(_this.stage);
                        break;
                }
            });
        }else if(moveMarker - markerDown >= 200&&_this.moveMark>0){
            var container0 = _this.stage.getChildAt(_this.moveMark);
            var container1 = _this.stage.getChildAt(--_this.moveMark);
            createjs.Tween.get(container0,{loop:false},true).to({y : _this.size.h},1000).call(function () {
                var container = _this.stage.getChildAt(_this.moveMark+1);
                for(var i = 0 ;i < container.getNumChildren()+7 ; i++){
                    container.removeChildAt(1);
                }
            });
            createjs.Tween.get(container1,{loop:false},true).to({y : 0},1000).call(function () {
                switch (_this.moveMark){
                    case 0 :
                        new addToContainer1(_this.stage)
                        break;
                    case 1 :
                        new addToContainer2(_this.stage);
                        break;
                }
            });
        }
    });
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick",_this.stage);
};

/*第一项动画*/


function addToContainer1(stage){
    this.__initData(stage);
    this.__initImages();
}

var a = addToContainer1.prototype;


a.__initData = function (stage) {
    var _this = this;
    _this.stage = stage;
    _this.container = stage.getChildAt(0);
    _this.assets = [];
    _this.size = getSize();
    _this.rectCon;
    _this.topBmp;
    _this.rightBmp;
    _this.text;
    _this.date;
};


a.__initImages = function () {
    var _this = this;
    console.log(_this);
    var manifest = [
        {src : 'girl.jpg',id: 'rectImage'},
        {src : 'icon9.png',id : 'topImage'},
        {src : 'icon10.png',id : 'rightImage'}
    ];
    var preload = new createjs.LoadQueue(true);
    preload.on("fileload",_this.handleImageLoad.bind(this));
    preload.on("complete",_this.handleImageComplete.bind(this));
    preload.loadManifest(manifest,true,"images/");
};


a.handleImageLoad = function (event) {
    this.assets.push(event);
};

a.handleImageComplete = function () {
    var _this = this;
    for(var i=0;i<_this.assets.length;i++){
        var event = _this.assets[i];
        var id = event.item.id;
        var result = event.result;

        switch (id){
            case 'rectImage':
                _this.__initRect(result);
                break;
            case 'topImage':
                _this.__initTopPng(result);
                break;
            case 'rightImage':
                _this.__initRightPng(result);
                break;
        }
    }
    _this.__initContent();
    _this.__initArrows();
    _this.__initAnimate();
};

a.__initRect = function (image) {
    var _this = this;
    var size = _this.size;
    var rectBmp = new createjs.Bitmap(image);
    var rect = new createjs.Shape();
    rect.graphics.moveTo(10,size.h*0.3).lineTo(10,size.h*0.7).lineTo(size.w*0.7,size.h*0.7).lineTo(size.w*0.4,size.h*0.3).closePath();
    rectBmp.mask = rect;
    rectBmp.y = 200;
    rectBmp.x = -(image.width-size.w*0.8)/2-100;
    _this.rectCon = new createjs.Container();
    _this.rectCon.addChild(rect,rectBmp);
    _this.rectCon.alpha = 0;
    _this.rectCon.x = -size.w;

    _this.container.addChild(_this.rectCon);
};

a.__initTopPng = function (image) {
    var _this = this;
    var size = _this.size;
    _this.topBmp = new createjs.Bitmap(image);
    _this.topBmp.x = size.w*0.2;
    _this.topBmp.y = -image.height;

    _this.container.addChild(_this.topBmp);
};

a.__initRightPng = function (image) {
    var _this = this;
    var size = _this.size;
    _this.rightBmp = new createjs.Bitmap(image);
    _this.rightBmp.x = size.w;
    _this.rightBmp.y = size.h/2 - image.height/2;
    _this.rightBmp.scaleX = _this.rightBmp.scaleY = 0.1;

    _this.container.addChild(_this.rightBmp);
};

a.__initContent = function () {
    var _this = this;
    _this.text = new createjs.Text("","40px 微软雅黑","regular","#111");
    _this.date = new createjs.Text("","80px 微软雅黑","regular","#111");
    _this.text.text = "这是我们的留念~我们的每一天!";
    _this.text.lineWidth = 300;
    _this.text.lineHeight = 18;
    _this.text.x = _this.size.w* 0.1;
    _this.text.y = -100;
    _this.date.text = "12/14";
    _this.date.lineWidth = _this.size.w*0.3;
    _this.date.x = _this.size.w*1.2;
    _this.date.y = _this.size.h-90;
    _this.date.lineHeight = 24;
    _this.container.addChild(_this.text);
    _this.container.addChild(_this.date);
};

a.__initArrows = function () {
    var _this  = this;
    var Arrow1 = new createjs.Shape();
    Arrow1.graphics.setStrokeStyle(15,"round","round").beginStroke("#000").moveTo(0,0).lineTo(40,25).lineTo(80,0).endStroke();
    Arrow1.alpha = 0.8;
    var Arrow2 = new createjs.Shape();
    Arrow2.graphics.setStrokeStyle(15,"round","round").beginStroke("#000").moveTo(0,0).lineTo(35,25).lineTo(70,0).endStroke();
    Arrow2.y = 40;
    Arrow2.x = 5;
    Arrow2.alpha = 0.6;
    var Arrow3 = new createjs.Shape();
    Arrow3.graphics.setStrokeStyle(15,"round","round").beginStroke("#000").moveTo(0,0).lineTo(30,25).lineTo(60,0).endStroke();
    Arrow3.y = 80;
    Arrow3.x = 10;
    Arrow3.alpha = 0.4;
    var container = new createjs.Container;
    container.addChild(Arrow1,Arrow2,Arrow3);
    container.cache(0,0,100,120);
    container.x = _this.size.w/2 - 40;
    container.y = _this.size.h - 250;
    _this.container.addChild(container);
    createjs.Tween.get(container,{loop:true},true).to({y : _this.size.h - 100 ,alpha : 0},1000);
};

a.__initAnimate = function () {
    var _this = this;
    createjs.Tween.get(_this.rectCon,{loop : false},true).to({
        x : 0,
        alpha : 0.7
    },1000,createjs.Ease.linear);
    createjs.Tween.get(_this.topBmp,{loop:false},true)
        .to({y:0},1000,createjs.Ease.bounceOut);
    createjs.Tween.get(_this.rightBmp,{loop:false},true)
        .wait(800)
        .to({x : _this.size.w-300,scaleX : 1,scaleY : 1},1000);
    createjs.Tween.get(_this.text,{loop:false},true)
        .wait(1500)
        .to({y:_this.size.h*0.8},1000,createjs.Ease.bounceOut);
    createjs.Tween.get(_this.date,{loop:false},true)
        .wait(2000)
        .to({x:_this.size.w* 0.6},1000,createjs.Ease.cubicInOut);

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick",_this.stage);
};

//第一项动画结束

function addToContainer2(stage){
    this.__initDatas(stage);
    this.__initImages();
}

var b = addToContainer2.prototype;

b.__initDatas = function (stage) {
    var _this = this;
    _this.stage = stage;
    _this.container = stage.getChildAt(1);
    _this.assets = [];
    _this.size = getSize();
    _this.leftBmp;
    _this.rightBmp;
    _this.text;
    _this.date;
};

b.__initImages = function () {
    var _this = this;
    console.log(_this);
    var manifest = [
        {src : 'girl1.jpg',id: 'leftImage'},
        {src : 'girl2.jpg',id : 'rightImage'}
    ];
    var preload = new createjs.LoadQueue(true);
    preload.on("fileload",_this.handleImageLoad.bind(this));
    preload.on("complete",_this.handleImageComplete.bind(this));
    preload.loadManifest(manifest,true,"images/");
};

b.handleImageLoad = function (event) {
    this.assets.push(event);
};

b.handleImageComplete = function () {
    var _this = this;
    for(var i=0;i<_this.assets.length;i++){
        var event = _this.assets[i];
        var id = event.item.id;
        var result = event.result;

        switch (id){
            case 'leftImage':
                _this.__initLeftImage(result);
                break;
            case 'rightImage':
                _this.__initRightImage(result);
                break;
        }
    }
    //_this.__initContent();
    _this.__initArrows();
    _this.__initAnimate();
};

b.__initLeftImage = function (image) {
    var _this = this;
    _this.leftBmp = new createjs.Bitmap(image);
    var scale = _this.size.h*0.7/image.height;
    _this.leftBmp.scaleX = _this.leftBmp.scaleY = scale;
    _this.leftBmp.y =image.height*scale+_this.size.h*0.2;
    _this.leftBmp.x = -image.width*scale*0.2
    _this.leftBmp.regX = 0;
    _this.leftBmp.regY = image.height;
    _this.leftBmp.alpha = 0;
    _this.leftBmp.rotation = -90;
    _this.container.addChild(_this.leftBmp);
};

b.__initRightImage = function (image) {
    var _this = this;
    _this.rightBmp = new createjs.Bitmap(image);
    var scale = _this.size.h*0.7/image.height;
    _this.rightBmp.scaleX = _this.rightBmp.scaleY = scale;
    _this.rightBmp.x = _this.size.w/2+image.width*scale*0.2;
    _this.rightBmp.y = _this.size.h*0.2+image.height*scale;
    _this.rightBmp.regX = 0;
    _this.rightBmp.regY = image.height;
    _this.rightBmp.alpha = 0;
    _this.rightBmp.rotation = 90;
    _this.container.addChild(_this.rightBmp);
};

b.__initArrows = function () {
    var _this  = this;
    var Arrow1 = new createjs.Shape();
    Arrow1.graphics.setStrokeStyle(15,"round","round").beginStroke("#000").moveTo(0,0).lineTo(40,25).lineTo(80,0).endStroke();
    Arrow1.alpha = 0.8;
    var Arrow2 = new createjs.Shape();
    Arrow2.graphics.setStrokeStyle(15,"round","round").beginStroke("#000").moveTo(0,0).lineTo(35,25).lineTo(70,0).endStroke();
    Arrow2.y = 40;
    Arrow2.x = 5;
    Arrow2.alpha = 0.6;
    var Arrow3 = new createjs.Shape();
    Arrow3.graphics.setStrokeStyle(15,"round","round").beginStroke("#000").moveTo(0,0).lineTo(30,25).lineTo(60,0).endStroke();
    Arrow3.y = 80;
    Arrow3.x = 10;
    Arrow3.alpha = 0.4;
    var container = new createjs.Container;
    container.addChild(Arrow1,Arrow2,Arrow3);
    container.cache(0,0,100,120);
    container.x = _this.size.w/2 - 40;
    container.y = _this.size.h - 250;
    _this.container.addChild(container);
    createjs.Tween.get(container,{loop:true},true).to({y : _this.size.h - 100 ,alpha : 0},1000);
    _this.stage.update();
};

b.__initAnimate = function () {
    var _this = this;
    createjs.Tween.get(_this.leftBmp,{loop : false},true).to({
        rotation : 5,
        alpha : 1
    },1000);
    createjs.Tween.get(_this.rightBmp,{loop : false},true).to({
        rotation : 5,
        alpha : 1
    },1000);

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick",_this.stage);
};

