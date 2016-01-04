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
                    case 2 :
                        new addToContainer3(_this.stage);
                        break;
                    case 3 :
                        new addToContainer4(_this.stage);
                        break;
                    case 4 :
                        new addToContainer5(_this.stage);
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
                    case 2 :
                        new addToContainer3(_this.stage);
                        break;
                    case 3 :
                        new addToContainer4(_this.stage);
                        break;
                    case 4 :
                        new addToContainer5(_this.stage);
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
    _this.topBmp.x = size.w*0.1;
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
    _this.text = new createjs.Text("","40px 微软雅黑","#111");
    _this.date = new createjs.Text("","80px 微软雅黑","#111");
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
    container.alpha = 0;
    _this.container.addChild(container);
    createjs.Tween.get(container,{loop:true},true).to({y : _this.size.h - 100 ,alpha : 0.5},1000);
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

//第二项动画开始
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
    _this.line;
    _this.leftRect;
    _this.rightRect;
    _this.text;
    _this.date;
    _this.line;
};

b.__initImages = function () {
    var _this = this;
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
    _this.__initLine();
    _this.__initContent();
    _this.__initArrows();
    _this.__initAnimate();
};

b.__initLeftImage = function (image) {
    var _this = this;
    var scale = _this.size.h*0.8/image.height;
    var leftBmp = new createjs.Bitmap(image);
    var Rect = new createjs.Shape();
    Rect.graphics.moveTo(0,_this.size.h*0.1).lineTo(_this.size.w*0.5,_this.size.h*0.1).lineTo(_this.size.w*0.4,_this.size.h*0.9).lineTo(-_this.size.w*0.1,_this.size.h*0.9).closePath();
    leftBmp.scaleX = leftBmp.scaleY = scale;
    leftBmp.y =_this.size.h*0.1;
    leftBmp.mask = Rect;
    _this.leftRect = new createjs.Container();
    _this.leftRect.addChild(leftBmp,Rect);
    _this.leftRect.regX = 0;
    _this.leftRect.regY = _this.size.h*0.8;
    _this.leftRect.y = _this.size.h*0.8;
    _this.leftRect.alpha = 0;
    _this.leftRect.rotation = -90;
    _this.container.addChild(_this.leftRect);
};

b.__initRightImage = function (image) {
    var _this = this;
    var size = _this.size;
    var rightBmp = new createjs.Bitmap(image);
    var scale = _this.size.h*0.8/image.height;
    var Rect = new createjs.Shape();
    Rect.graphics.moveTo(size.w*0.6,size.h*0.1).lineTo(size.w*1.1,size.h*0.1).lineTo(size.w,size.h*0.9).lineTo(size.w*0.5,size.h*0.9).closePath();
    rightBmp.scaleX = rightBmp.scaleY = scale;
    rightBmp.x = _this.size.w/2;
    rightBmp.y = _this.size.h*0.1;
    rightBmp.mask = Rect;
    _this.rightRect = new createjs.Container();
    _this.rightRect.addChild(Rect,rightBmp);
    _this.rightRect.regX = 0;
    _this.rightRect.regY = size.h*0.8;
    _this.rightRect.y = size.h*0.8;
    _this.rightRect.alpha = 0;
    _this.rightRect.rotation = 90;
    _this.container.addChild(_this.rightRect);
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
    container.alpha = 0;
    _this.container.addChild(container);
    createjs.Tween.get(container,{loop:true},true).to({y : _this.size.h - 100 ,alpha : 0.5},1000);
    _this.stage.update();
};

b.__initAnimate = function () {
    var _this = this;
    createjs.Tween.get(_this.title,{loop:false},true).to({
        y : 20,
        alpha : 1
    },1000);
    createjs.Tween.get(_this.line,{loop : false},true).wait(500).to({
        scaleX : 3,
        scaleY : 1,
        alpha : 1,
        x : _this.size.w*0.2
    },1000);
    createjs.Tween.get(_this.leftRect,{loop : false},true).wait(1000).to({
        rotation : 0,
        alpha : 1
    },1000);
    createjs.Tween.get(_this.rightRect,{loop : false},true).wait(1000).to({
        rotation : 0,
        alpha : 1
    },1000);
    createjs.Tween.get(_this.text,{loop:false},true).wait(1500).to({
        x : 30
    },1000);


    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick",_this.stage);
};

b.__initLine = function () {
    var _this = this;
    _this.line = new createjs.Shape();
    _this.line.graphics.beginFill("#000").rect(0,0,_this.size.w*0.2,40);
    _this.container.addChild(_this.line);
    _this.line.x = _this.size.w*0.5;
    _this.line.y = _this.size.h*0.06;
    _this.line.alpha = 0;
    _this.line.scaleX = _this.line.scaleY = 0;
    _this.stage.update();
};

b.__initContent = function () {
    var _this = this;
    _this.title = new createjs.Text("","60px 微软雅黑 bolder","regular","#111");
    _this.text = new createjs.Text("","30px 微软雅黑 ","regular","#111");
    _this.date = new createjs.Text("","80px 微软雅黑","regular","#111");
    _this.title.text = "年华";
    _this.title.lineWidth = 120;
    _this.title.lineHeight = 60;
    _this.title.textAlign = "center";
    _this.title.x = _this.size.w*0.5;
    _this.title.y = 100;
    _this.title.alpha = 0;
    _this.text.text = "请牢牢站在我身边，度春秋暖风尘";
    _this.text.lineWidth = _this.size.w*0.6;
    _this.text.lineHeight = 40;
    _this.text.x = -_this.size.w;
    _this.text.y = _this.size.h*0.9 + _this.size.h*0.05;
    _this.date.text = "12/14";
    _this.date.lineWidth = _this.size.w*0.3;
    _this.date.x = _this.size.w*1.2;
    _this.date.y = _this.size.h-90;
    _this.date.lineHeight = 24;
    _this.container.addChild(_this.title,_this.text,_this.date);
};
//第二项动画结束
//第三项动画开始
function addToContainer3(stage){
    this.__initDatas(stage);
    this.__initImages();
};

var c = addToContainer3.prototype;


c.__initDatas = function (stage) {
    var _this = this;
    _this.stage = stage;
    _this.container = stage.getChildAt(2);
    _this.assets = [];
    _this.size = getSize();
    _this.bmp1Con;
    _this.bmp2Con;
    _this.bmp3Con;
    _this.bmp4Con;
    _this.contentCon;
};

c.__initImages = function () {
    var _this = this;
    console.log(_this);
    var manifest = [
        {src : 'girl4.jpg',id: 'girl1'},
        {src : 'girl5.jpg',id : 'girl2'},
        {src : 'girl6.jpg',id : 'girl3'},
        {src : 'girl1.jpg',id : 'girl4'}
    ];
    var preload = new createjs.LoadQueue(true);
    preload.on("fileload",_this.handleImageLoad.bind(this));
    preload.on("complete",_this.handleImageComplete.bind(this));
    preload.loadManifest(manifest,true,"images/");
};

c.handleImageLoad = function (event) {
    this.assets.push(event);
};

c.handleImageComplete = function () {
    var _this = this;
    _this.__initBmps();
    _this.__initArrows();
    _this.__initAnimate();
};

c.__initBmps = function () {
    var _this = this;
    var size = _this.size;
    var image0 = _this.assets[0].result;
    var bmp1 = new createjs.Bitmap(image0);
    var scale1 = size.w*0.5/image0.width;
    bmp1.scaleX = bmp1.scaleY = scale1;
    var rect1 = new createjs.Shape();
    rect1.graphics.drawRect(0,0,size.w*0.5,size.w*0.5);
    bmp1.y = -(image0.height*scale1-size.h*0.2)/2;
    bmp1.mask = rect1;
    _this.bmp1Con = new createjs.Container();
    _this.bmp1Con.addChild(bmp1,rect1);
    _this.bmp1Con.y = size.h*0.2;
    _this.bmp1Con.x = -size.w* 0.5;
    _this.container.addChild(_this.bmp1Con);

    var image1 = _this.assets[1].result;
    var bmp2 = new createjs.Bitmap(image1);
    var scale2 = size.w*0.5/image1.width;
    bmp2.scaleX = bmp2.scaleY = scale2;
    var rect2 = new createjs.Shape();
    rect2.graphics.drawRect(0,0,size.w*0.5,size.w*0.5);
    bmp2.y = -(image1.height*scale2-size.h*0.2)/2;
    bmp2.mask = rect2;
    _this.bmp2Con = new createjs.Container();
    _this.bmp2Con.addChild(bmp2,rect2);
    _this.bmp2Con.x = size.w*0.5;
    _this.bmp2Con.y = -(image1.height*scale2+100);
    _this.container.addChild(_this.bmp2Con);

    var image2 = _this.assets[2].result;
    var bmp3 = new createjs.Bitmap(image2);
    var scale3 =size.w*0.6/image2.width;
    bmp3.scaleX = bmp3.scaleY =scale3;
    bmp3.y = -(image2.height*scale3 - size.h*0.25)/2;
    var rect3 = new createjs.Shape();
    rect3.graphics.drawEllipse(0,0,size.w* 0.6,size.h*0.25);
    bmp3.mask = rect3;
    _this.bmp3Con = new createjs.Container();
    _this.bmp3Con.addChild(rect3,bmp3);
    _this.bmp3Con.x = size.w;
    _this.bmp3Con.y = size.h*0.4;
    _this.container.addChild(_this.bmp3Con);

    _this.__initContent();

    var image3 = _this.assets[3].result;
    var bmp4 = new createjs.Bitmap(image3);
    var scale4= size.w*0.5/image3.width;
    bmp4.scaleX = bmp4.scaleY = scale4;
    bmp4.y = -(image3.height*scale4-size.w*0.5)/2;
    var circle = new createjs.Shape();
    circle.graphics.drawCircle(size.w* 0.25,size.w*0.25,size.w*0.25);
    bmp4.mask = circle;
    _this.bmp4Con = new createjs.Container();
    _this.bmp4Con.addChild(circle,bmp4);
    _this.bmp4Con.x = size.w;
    _this.bmp4Con.y = size.h*0.6;
    _this.container.addChild(_this.bmp4Con);
};

c.__initContent = function () {
    var _this = this;
    var w = _this.size.w;
    var h = _this.size.h;
    var line = new createjs.Shape();
    line.graphics.beginFill("red").beginStroke(5).moveTo(w*0.3,0).lineTo(w*0.7,0).arcTo(w,0,w,h*0.2,w*0.3).lineTo(w,h*0.3).arcTo(w,h*0.5,w*0.7,h*0.5,w*0.3).lineTo(w*0.3,h*0.5).arcTo(0,h*0.5,0,h*0.3,w*0.3).lineTo(0,h*0.2).arcTo(0,0,w*0.3,0,w*0.3);
    line.alpha = 0.3;

    var line2 = new createjs.Shape();
    line2.graphics.beginStroke("#fff").setStrokeStyle(10,"round","round").moveTo(w*0.3,h*0.05).lineTo(w*0.1,h*0.4);
    _this.contentCon = new createjs.Container();

    var content = new createjs.Text("","bold 50px Consolas","#fff");
    content.text = "In fact, you do not understand the true meaning of the so-called portrait. The true meaning of the portrait is a true reflection of their own real life like.";
    content.lineWidth = w*0.6;
    content.lineHeight = 50;
    content.y = h*0.12;
    content.x = w*0.3;
    _this.contentCon.addChild(line,line2,content);
    _this.contentCon.y = h*0.2;
    _this.contentCon.alpha = 0;
    _this.container.addChild(_this.contentCon);
};

c.__initArrows = function () {
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
    container.alpha = 0;
    _this.container.addChild(container);
    createjs.Tween.get(container,{loop:true},true).to({y : _this.size.h - 100 ,alpha : 0.5},1000);
};

c.__initAnimate = function () {
    var _this = this;
    var size = this.size;
    createjs.Tween.get(_this.bmp1Con,{loop : false},true).to({
        x : size.w*0.1
    },1000);
    createjs.Tween.get(_this.bmp2Con,{loop : false},true).wait(500).to({
        y : size.h* 0.03
    },1000);
    createjs.Tween.get(_this.bmp3Con,{loop : false},true).wait(1000).to({
        x : size.w*0.4
    },1000);
    createjs.Tween.get(_this.bmp4Con,{loop : false},true).wait(1500).to({
        x : size.w*0.3
    },1000);
    createjs.Tween.get(_this.contentCon,{loop: false},true).wait(2000).to({
        alpha : 1
    },1000);

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick",_this.stage);
};

//第三项动画结束
//第四项动画开始


function addToContainer4(stage){
    this.__initDatas(stage);
    this.__initImages();
};

var d = addToContainer4.prototype;


d.__initDatas = function (stage) {
    var _this = this;
    _this.stage = stage;
    _this.container = stage.getChildAt(3);
    _this.assets = [];
    _this.size = getSize();
    _this.bmp0Con = new createjs.Container();
    _this.bmp1;
    _this.bmp2;
};

d.__initImages = function () {
    var _this = this;
    console.log(_this);
    var manifest = [
        {src : 'girl1.jpg',id: 'girl1'},
        {src : 'icon11.png',id: 'icon11'},
        {src : 'icon12.png',id: 'icon12'}
    ];
    var preload = new createjs.LoadQueue(true);
    preload.on("fileload",_this.handleImageLoad.bind(this));
    preload.on("complete",_this.handleImageComplete.bind(this));
    preload.loadManifest(manifest,true,"images/");
};

d.handleImageLoad = function (event) {
    this.assets.push(event);
};

d.handleImageComplete = function () {
    var _this = this;
    _this.__initBmps();
    _this.__initArrows();
    _this.__initAnimate();
};

d.__initBmps = function () {
    var _this = this;
    var w = _this.size.w;
    var h = _this.size.h;
    var image0 = _this.assets[0].result;
    var bmp0 = new createjs.Bitmap(image0);
    var scale0 = w/image0.width;
    bmp0.scaleX = bmp0.scaleY = scale0;
    var rect0 = new createjs.Shape();
    rect0.graphics.drawRect(0,0,w,h*0.8);
    bmp0.mask = rect0;
    _this.bmp0Con.addChild(bmp0,rect0);
    _this.bmp0Con.y = h*0.1;
    _this.bmp0Con.x = w*0.5;
    _this.bmp0Con.regX = w*0.5;
    _this.bmp0Con.scaleX = -1;
    _this.bmp0Con.alpha = 0;
    _this.container.addChild(_this.bmp0Con);

    var image1 = _this.assets[1].result;
    _this.bmp1 = new createjs.Bitmap(image1);
    var scale1X = w/image1.width;
    var scale1Y = h*0.87/image1.height;
    _this.bmp1.scaleX = scale1X;
    _this.bmp1.scaleY = scale1Y;
    _this.bmp1.y = h;
    _this.container.addChild(_this.bmp1);

    var image2 = _this.assets[2].result;
    _this.bmp2 = new createjs.Bitmap(image2);
    var scale2 = w*0.3/image2.width;
    _this.bmp2.scaleX = _this.bmp2.scaleY = scale2;
    _this.bmp2.x= -w*0.6;
    _this.bmp2.y = h*0.3;
    _this.container.addChild(_this.bmp2);

};

d.__initArrows = function () {
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
    container.alpha = 0;
    _this.container.addChild(container);
    createjs.Tween.get(container,{loop:true},true).to({y : _this.size.h - 100 ,alpha : 0.5},1000);
};

d.__initAnimate = function () {
    var _this = this;
    var size = this.size;
    createjs.Tween.get(_this.bmp0Con,{loop : false},true).to({
        scaleX : 1,
        alpha : 1
    },2000,createjs.Ease.bounceInOut);
    createjs.Tween.get(_this.bmp1,{loop : false},true).wait(1000).to({
        y : _this.size.h*0.06
    },500);
    createjs.Tween.get(_this.bmp2,{loop : false},true).wait(1300).to({
        x : _this.size.w*0.1
    },500);

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick",_this.stage);
};

//第四个动画结束
//第五个动画开始

function addToContainer5(stage){
    this.__initDatas(stage);
    this.__initImages();
};

var e = addToContainer5.prototype;


e.__initDatas = function (stage) {
    var _this = this;
    _this.stage = stage;
    _this.container = stage.getChildAt(4);
    _this.assets = [];
    _this.size = getSize();
    _this.bmp0Con = new createjs.Container();
    _this.bmp1Con = new createjs.Container();
    _this.title;
    _this.text;
};

e.__initImages = function () {
    var _this = this;
    console.log(_this);
    var manifest = [
        {src : '17.jpg',id: '17'},
        {src : '18.jpg',id: '18'}
    ];
    var preload = new createjs.LoadQueue(true);
    preload.on("fileload",_this.handleImageLoad.bind(this));
    preload.on("complete",_this.handleImageComplete.bind(this));
    preload.loadManifest(manifest,true,"images/");
};

e.handleImageLoad = function (event) {
    this.assets.push(event);
};


e.handleImageComplete = function () {
    var _this = this;
    _this.__initBmps();
    _this.__initArrows();
    _this.__initContent();
    _this.__initAnimate();
};

e.__initBmps = function () {
    var _this = this;
    var w = _this.size.w;
    var h = _this.size.h;

    var image0 = _this.assets[0].result;
    var bmp0 = new createjs.Bitmap(image0);
    var scale0 = w*0.8/image0.width;
    bmp0.scaleX = scale0;
    bmp0.scaleY = h*0.6>image0.height? h*0.6/image0.height : 1;
    var rect0 = new createjs.Shape();
    rect0.graphics.beginStroke("#FFF").setStrokeStyle(20).drawRect(0,0,w*0.8,h*0.6);
    bmp0.mask = rect0;
    _this.bmp0Con.addChild(bmp0,rect0);
    _this.bmp0Con.regX = w*0.8;
    _this.bmp0Con.regY = h*0.6;
    _this.bmp0Con.x = w*0.9;
    _this.bmp0Con.y = h*0.65;
    _this.bmp0Con.rotation = 90;
    _this.bmp0Con.alpha = 0;
    _this.bmp0Con.cache(0,0,w,h);
    _this.container.addChild(_this.bmp0Con);

    var image1 = _this.assets[0].result;
    var bmp1 = new createjs.Bitmap(image1);
    var scale1 = w*0.5/image1.width;
    bmp1.scaleX = scale1;
    bmp1.scaleY = h*0.3>image0.height? h*0.3/image1.height : 1;
    var rect1 = new createjs.Shape();
    rect1.graphics.beginStroke("#FFF").setStrokeStyle(20).drawRect(0,0,w*0.5,h*0.2);
    bmp1.mask = rect1;
    _this.bmp1Con.addChild(bmp1,rect1);
    _this.bmp1Con.regX = -w*0.2;
    _this.bmp1Con.regY = h*0.25;
    _this.bmp1Con.y = h*0.85;
    _this.bmp1Con.x = w*0.2;
    _this.bmp1Con.rotation = -90;
    _this.bmp1Con.alpha = 0;
    _this.bmp1Con.cache(0,0,w,h);
    _this.container.addChild(_this.bmp1Con);
};

e.__initArrows = function () {
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
    container.alpha = 0;
    _this.container.addChild(container);
    createjs.Tween.get(container,{loop:true},true).to({y : _this.size.h - 100 ,alpha : 0.5},1000);
};

e.__initContent = function () {
    var _this = this;
    _this.title = new createjs.Text("","bold 80px 微软雅黑","#111");
    _this.title.text = "时 | 光";
    _this.title.y = _this.size.h*0.75;
    _this.title.x = _this.size.w*0.1;
    _this.container.addChild(_this.title);

    _this.text = new createjs.Text("","bold 40px Consolas","#fff");
    _this.text.text = "forever you are";
    _this.text.lineWidth = _this.size.w*0.5;
    _this.text.lineHeight = 50;
    _this.text.x = _this.size.w*0.02;
    _this.text.y = _this.size.h*0.95;
    _this.container.addChild(_this.text);
    _this.stage.update();
};

e.__initAnimate = function () {
    var _this = this;
    createjs.Tween.get(_this.bmp0Con,{loop : false},true).to({
        rotation : -3,
        alpha : 1
    },1000);
    createjs.Tween.get(_this.bmp1Con,{loop : false},true).wait(1000).to({
        rotation : 10,
        alpha : 1
    },500);

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick",_this.stage);
};
