/** 这个类会自动响应屏幕宽高比的变化。 */
class UIScene extends Laya.View
{
    public static EVENT_REFRESH_UI = "EVENT_REFRESH_UI";
    public static curUIScale = 1;           // 当前的UI缩放比
    constructor()
    {
        super();
        this.pivot(Laya.stage.width/2, Laya.stage.height/2);

        Laya.stage.on(Laya.Event.RESIZE, this,  this.onScreenResize);
        this.onScreenResize();
        UIScene.scenes.push(this);
    }

    public static destroyAllScenesExcept(scene: UIScene)
    {
        var copyed: UIScene[] = [];
        for (var v of UIScene.scenes)
        {
            if (v!=scene)
            {
                copyed.push(v);
            }
        }
        UIScene.scenes.splice(0);
        UIScene.scenes.push(scene);
        for (var v of copyed)
        {
            v.removeSelf();
            v.destroy();
        }
    }

    public static removeByValue(arr: Array<any>, val: any): void
    {
        for(var i=0; i<arr.length; i++)
        {
            if(arr[i] == val)
            {
                arr.splice(i, 1);
                break;
            }
        }
    }

    public destroy(destroyChild?: boolean)
    {
        UIScene.removeByValue(UIScene.scenes, this);
        super.destroy(destroyChild);
    }
    
    public removeSelf(): Laya.Node
    {
        UIScene.removeByValue(UIScene.scenes, this);
        return super.removeSelf();
    }

    public static scenes: UIScene[] = [];

    public static maxUIWHRatio = 11/16;

    // 游戏的界面为定宽模式。所有界面坐标都按屏幕宽为720排布。
    public static getDesignH()
    {
        var curHWRatio = Laya.stage.height/Laya.stage.width;
        if(curHWRatio < 1/UIScene.maxUIWHRatio){
            curHWRatio = 1/UIScene.maxUIWHRatio;
        }
        return DESIGN_WIDTH*curHWRatio;
    }
    
    public static getDesignRect(): Laya.Rectangle
    {
        var g_designRect = new Laya.Rectangle();
        g_designRect.x = -DESIGN_WIDTH/2;
        var dh = UIScene.getDesignH();
        g_designRect.y = -dh/2;
        g_designRect.width = DESIGN_WIDTH;
        g_designRect.height = dh;
        return g_designRect;
    }

    /** 重写这个函数来实现更自定义的屏幕宽高比适配。 */
    public customOffset(out: Laya.Point): void
    {
    }

    public refreshUI(): void
    {
    }

    public addBg(pic: string = "b180.png", zOrder = -1): Laya.Image
    {
        var self = this;
        var bg = new Laya.Image(pic);
        bg.mouseEnabled = true;
        bg.mouseThrough = false;
        bg.zOrder = -1;
        self.addChild(bg)
        self.addFullScreenUI(bg);
        return bg;
    }

    centerChildren = new Array<Laya.Sprite>();
    public addChildToCenter(child: Laya.Sprite): void
    {
        this.addChild(child);
        this.centerChildren.push(child);
        this.onScreenResize();
    }

    bottomChildren = new Array<Laya.Sprite>();
    public addChildToBottom(child: Laya.Sprite): void
    {
        this.addChild(child);
        this.bottomChildren.push(child);
        this.onScreenResize();
    }

    topChildren = new Array<Laya.Sprite>();
    public addChildToTop(child: Laya.Sprite): void
    {
        this.addChild(child);
        this.topChildren.push(child);
        this.onScreenResize();
    }

    rightChildren = new Array<Laya.Sprite>();
    public addChildToRight(child: Laya.Sprite): void
    {
        this.addChild(child);
        this.rightChildren.push(child);
        this.onScreenResize();
    }

    leftChildren = new Array<Laya.Sprite>();
    public addChildToLeft(child: Laya.Sprite): void
    {
        this.addChild(child);
        this.leftChildren.push(child);
        this.onScreenResize();
    }

    leftTopChildren = new Array<Laya.Sprite>();
    public addChildToLeftTop(child: Laya.Sprite): void
    {
        this.addChild(child);
        this.leftTopChildren.push(child);
        this.onScreenResize();
    }

    topLeftChildren = new Array<Laya.Sprite>();
    public addChildToTopLeft(child: Laya.Sprite): void
    {
        this.addChild(child);
        this.topLeftChildren.push(child);
        this.onScreenResize();
    }

    rightTopChildren = new Array<Laya.Sprite>();
    public addChildToRightTop(child: Laya.Sprite): void
    {
        this.addChild(child);
        this.rightTopChildren.push(child);
        this.onScreenResize();
    }

    topRightChildren = new Array<Laya.Sprite>();
    public addChildToTopRight(child: Laya.Sprite): void
    {
        this.addChild(child);
        this.topRightChildren.push(child);
        this.onScreenResize();
    }

    leftBottomChildren = new Array<Laya.Sprite>();
    public addChildToLeftBottom(child: Laya.Sprite): void
    {
        this.addChild(child);
        this.leftBottomChildren.push(child);
        this.onScreenResize();
    }

    bottomLeftChildren = new Array<Laya.Sprite>();
    public addChildToBottomLeft(child: Laya.Sprite): void
    {
        this.addChild(child);
        this.bottomLeftChildren.push(child);
        this.onScreenResize();
    }

    rightBottomChildren = new Array<Laya.Sprite>();
    public addChildToRightBottom(child: Laya.Sprite): void
    {
        this.addChild(child);
        this.rightBottomChildren.push(child);
        this.onScreenResize();
    }

    bottomRightChildren = new Array<Laya.Sprite>();
    public addChildToBottomRight(child: Laya.Sprite): void
    {
        this.addChild(child);
        this.bottomRightChildren.push(child);
        this.onScreenResize();
    }

    fullscrnUIs = new Array<Laya.Sprite>();
    public addFullScreenUI(child: Laya.Sprite): void
    {
        child.pos(0,0);
        var r = UIScene.getDesignRect();
        child.size(r.width,r.height);
        if (child["anchorX"]!==undefined)
        {
            child["anchorX"] = child["anchorY"] = 0;
        }
        else
        {
            child.pivot(0,0);
        }
        this.fullscrnUIs.push(child);
        this.timer.frameOnce(1, this, this.onScreenResize);
    }

    private pcTmpV = new Laya.Point();
    public posChild(child: Laya.Sprite, f1: number, f2: number, rect?: Laya.Rectangle): void
    {
        if (rect==null)
        {
            rect = UIScene.getUIRect();
        }
        var offset = this.pcTmpV;
        offset.x = 0;
        offset.y = 0;
        this.customOffset(offset);
        child.pivot(child.width*f1,child.height*f2);
        child.pos(rect.x + rect.width*f1 + offset.x, rect.y + rect.height*f2 + offset.y);
    }

    public posCenterChild(child: Laya.Sprite, rect?: Laya.Rectangle): void
    {
        this.posChild(child, 0.5, 0.5,rect);
    }

    public posBottomChild(child: Laya.Sprite, rect?: Laya.Rectangle): void
    {
        this.posChild(child, 0.5, 1,rect);
    }

    public posUpChild(child: Laya.Sprite, rect?: Laya.Rectangle): void
    {
        this.posChild(child, 0.5, 0,rect);
    }

    public posLeftChild(child: Laya.Sprite, rect?: Laya.Rectangle): void
    {
        this.posChild(child, 0, 0.5, rect);
    }

    public posRightChild(child: Laya.Sprite, rect?: Laya.Rectangle): void
    {
        this.posChild(child, 1, 0.5, rect);
    }

    public posUpLeftChild(child: Laya.Sprite, rect?: Laya.Rectangle): void
    {
        this.posChild(child, 0, 0, rect);
    }

    public posUpRightChild(child: Laya.Sprite, rect?: Laya.Rectangle): void
    {
        this.posChild(child, 1, 0, rect);
    }

    public posBottomLeftChild(child: Laya.Sprite, rect?: Laya.Rectangle): void
    {
        this.posChild(child, 0, 1, rect);
    }

    public posBottomRightChild(child: Laya.Sprite, rect?: Laya.Rectangle): void
    {
        this.posChild(child, 1, 1, rect);
    }

    public posFullScreen(child: Laya.Sprite, rect?: Laya.Rectangle): void
    {
        child.scale(rect.width/child.width, rect.height/child.height);
    }

    public autoSiding(view: Laya.View)
    {
        if (view["topleft"]!=null)
        {
            this.addChildToTopLeft(view["topleft"]);
        }
    }

    public static s_rect = new Laya.Rectangle();
    public static getUIRect(): Laya.Rectangle
    {
        var r = UIScene.s_rect;
        UIScene.curUIScale = UIScene.getUIScale();
        var w = Laya.stage.width/UIScene.curUIScale;
        var h = Laya.stage.height/UIScene.curUIScale;
        r.x = 0;
        r.y = 0;
        r.width = w;
        r.height = h;
        return r;
    }

    public static getUIScale(): number
    {
        var scale = 0;
        /*// width/height哪个小用哪个作UI缩放的依据
        var shortSide = Math.min(Laya.stage.width, Laya.stage.height);
        var longSide = Math.max(Laya.stage.width, Laya.stage.height);
        var maxUIRatio = UIScene.maxUIWHRatio;
        if (shortSide/longSide>maxUIRatio)
        {
            shortSide = longSide*maxUIRatio;
        }
        scale = shortSide/DESIGN_WIDTH;
        */
        var w = Laya.stage.width;
        var h = Laya.stage.height;
        var ratio = w/h;
        var maxUIRatio = UIScene.maxUIWHRatio;
        if (ratio>maxUIRatio)
        {
            w = h*maxUIRatio;
        }
        scale = w/DESIGN_WIDTH;
        return scale;
    }

    onScreenResize(): void
    {
        // 现在采用定宽策略，UI坐标中屏幕宽度固定为DESIGN_WIDTH
        var offsetx = Laya.stage.width/2;
        var offsety = Laya.stage.height/2;
        var scale = UIScene.getUIScale();
        UIScene.curUIScale = scale;
        this.x = offsetx;
        this.y = offsety;
        this.width = Laya.stage.width/scale;
        this.height = Laya.stage.height/scale;
        this.pivot(this.width/2, this.height/2);
        this.scale(scale, scale);

        var rect = UIScene.getUIRect();

        for (var child of this.centerChildren)
        {
            this.posCenterChild(child, rect);
        }

        for(var child of this.bottomChildren)
        {
            this.posBottomChild(child, rect);
        }

        for(var child of this.topChildren)
        {
            this.posUpChild(child,rect);
        }

        for(var child of this.leftChildren)
        {
            this.posLeftChild(child,rect);
        }

        for(var child of this.rightChildren)
        {
            this.posRightChild(child,rect);
        }

        for(var child of this.fullscrnUIs)
        {
            this.posFullScreen(child,rect);
        }

        for(var child of this.leftTopChildren)
        {
            this.posUpLeftChild(child,rect);
        }

        for(var child of this.topLeftChildren)
        {
            this.posUpLeftChild(child,rect);
        }

        for(var child of this.rightTopChildren)
        {
            this.posUpRightChild(child,rect);
        }

        for(var child of this.topRightChildren)
        {
            this.posUpRightChild(child,rect);
        }

        for(var child of this.leftBottomChildren)
        {
            this.posBottomLeftChild(child,rect);
        }

        for(var child of this.bottomLeftChildren)
        {
            this.posBottomLeftChild(child,rect);
        }

        for(var child of this.rightBottomChildren)
        {
            this.posBottomRightChild(child,rect);
        }

        for(var child of this.bottomRightChildren)
        {
            this.posBottomRightChild(child,rect);
        }
        this.refreshUI();
        this.event(UIScene.EVENT_REFRESH_UI);
    }

    public static onMouseEx(e): void
    {
        var btn = (this as any as Laya.Button);
        if (e.type==Laya.Event.MOUSE_DOWN)
        {
            btn.scale(0.83*btn["_oriScaleX"], 0.83*btn["_oriScaleY"]);
            btn.alpha = 0.9;
        }
        else
        {
            btn.scale(1*btn["_oriScaleX"],1*btn["_oriScaleY"]);
            btn.alpha = 1;
        }
    }

    public extendOneBtn(btn: Laya.Button): void
    {
        btn["onMouseEx"] = UIScene.onMouseEx;
        btn["_oriScaleX"] = btn.scaleX;
        btn["_oriScaleY"] = btn.scaleY;
        btn.on(/*laya.events.Event.MOUSE_OVER*/"mouseover",btn,btn["onMouseEx"]);
        btn.on(/*laya.events.Event.MOUSE_OUT*/"mouseout",btn,btn["onMouseEx"]);
        btn.on(/*laya.events.Event.MOUSE_DOWN*/"mousedown",btn,btn["onMouseEx"]);
        btn.on(/*laya.events.Event.MOUSE_UP*/"mouseup",btn,btn["onMouseEx"]);
    }

    public extendBtn(btns: Laya.Button[]): void
    {
        for (var btn of btns)
        {
            this.extendOneBtn(btn);
        }
    }

    /** 递归获取指定名字的Node */
    public static getChildEx(parent: Laya.Component, name: string): Laya.Node
    {
        if (parent.getChildByName==null)
        {
            return null;
        }
        var child = parent.getChildByName(name);
        if (child!=null)
        {
            return child;
        }
        for (var ch of parent._childs)
        {
            var ch2 = UIScene.getChildEx(ch, name);
            if (ch2!=null)
            {
                return ch2;
            }
        }
        return null;
    }

    public extendBtnByNames(parent: Laya.Component, names: string[]): void
    {
        for (var name of names)
        {
            var btn = UIScene.getChildEx(parent, name) as Laya.Button;
            this.extendOneBtn(btn);
        }
    }

    public setTextByName(parent: Laya.Component, name: string, text: any): void
    {
        var child = UIScene.getChildEx(parent, name) as Laya.Text;
        if (child!=null)
        {
            child.text = (text!=null?text.toString():"");
        }
    }

    public show()
    {
        this.visible = true;
        for(let child of this.topChildren)
        {
            var ySrc = child.y;
            child.y -= child.height;
            Laya.Tween.to(child, {y: ySrc},550, Laya.Ease.backOut,new laya.utils.Handler(this, function (content) {}));
        }
        for(let child of this.topLeftChildren)
        {
            var ySrc = child.y;
            child.y -= child.height;
            Laya.Tween.to(child, {y: ySrc},550, Laya.Ease.backOut,new laya.utils.Handler(this, function (content) {}));
        }
        for(let child of this.topRightChildren)
        {
            var ySrc = child.y;
            child.y -= child.height;
            Laya.Tween.to(child, {y: ySrc},550, Laya.Ease.backOut,new laya.utils.Handler(this, function (content) {}));
        }

        for(let child of this.bottomChildren)
        {
            var ySrc = child.y;
            child.y += child.height;
            Laya.Tween.to(child, {y: ySrc},550, Laya.Ease.cubicInOut,new laya.utils.Handler(this, function (content) {}));
        }
        for(let child of this.bottomLeftChildren)
        {
            var ySrc = child.y;
            child.y += child.height;
            Laya.Tween.to(child, {y: ySrc},550, Laya.Ease.cubicInOut,new laya.utils.Handler(this, function (content) {}));
        }
        for(let child of this.bottomRightChildren)
        {
            var ySrc = child.y;
            child.y += child.height;
            Laya.Tween.to(child, {y: ySrc},550, Laya.Ease.cubicInOut,new laya.utils.Handler(this, function (content) {}));
        }

        for(let child of this.leftChildren)
        {
            var xSrc = child.x;
            child.x -= child.width;
            Laya.Tween.to(child, {x: xSrc},550, Laya.Ease.cubicInOut,new laya.utils.Handler(this, function (content) {}));
        }
        for(let child of this.leftTopChildren)
        {
            var xSrc = child.x;
            child.x -= child.width;
            Laya.Tween.to(child, {x: xSrc},550, Laya.Ease.cubicInOut,new laya.utils.Handler(this, function (content) {}));
        }
        for(let child of this.leftBottomChildren)
        {
            var xSrc = child.x;
            child.x -= child.width;
            Laya.Tween.to(child, {x: xSrc},550, Laya.Ease.cubicInOut,new laya.utils.Handler(this, function (content) {}));
        }


        for(let child of this.rightChildren)
        {
            var xSrc = child.x;
            child.x += child.width;
            Laya.Tween.to(child, {x: xSrc},550, Laya.Ease.cubicInOut,new laya.utils.Handler(this, function (content) {}));
        }
        for(let child of this.rightTopChildren)
        {
            var xSrc = child.x;
            child.x += child.width;
            Laya.Tween.to(child, {x: xSrc},550, Laya.Ease.cubicInOut,new laya.utils.Handler(this, function (content) {}));
        }
        for(let child of this.rightBottomChildren)
        {
            var xSrc = child.x;
            child.x += child.width;
            Laya.Tween.to(child, {x: xSrc},550, Laya.Ease.cubicInOut,new laya.utils.Handler(this, function (content) {}));
        }
        for(let child of this.centerChildren)
        {
            let xScale = child.scaleX;
            let yScale = child.scaleY;
            child.scaleX = 0.7 * xScale;
            child.scaleY = 0.7 * yScale;
            Laya.Tween.to(child, {scaleX:xScale}, 550, Laya.Ease.backOut);
            Laya.Tween.to(child, {scaleY:yScale}, 550, Laya.Ease.backOut);
        }

        
    }
}