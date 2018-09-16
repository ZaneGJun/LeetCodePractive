/**
 * 家园地图界面
 */
class FamilyMapView extends ui.game.FamilyMapUI{
    public constructor(){
        super();
        this.init();
    }

    /** 地图区域大小 */
    public MAP_WIDTH: number = DESIGN_WIDTH*3;
    public MAP_HEIGHT: number = DESIGN_HEIGHT*2;

    /** 地图对象 */
    private tiledmap: Laya.TiledMap;
    /** 家具层 */
    private furnituremap: Laya.Sprite;

    private lastMouseDownPos: {x:number, y:number} = {x: 0, y: 0}
    private lastMousePos: {x:number, y:number} = {x: 0, y: 0}
    private mouseDir: {x:number, y:number} = {x: 0, y: 0}    
    private mapMove: {x:number, y:number} = {x: 0, y: 0}

    private mapMovePosTween: Laya.Tween;
    private isMove: boolean;

    /** 家具列表 */
    private furnituremapList: FurnitureItem[];
    /** 清理按钮列表 */
    private clearBtnList: Laya.Button[];

    public destroy(destroyChild?: boolean) {
        if(this.tiledmap != null){
            this.tiledmap.destroy();
        }
        super.destroy(destroyChild);
    }

    public init(): void {
        this.furnituremapList = [];

        GameFacade.getInstance().registerMediator(new FamilyMapViewMediator(this));
    }

    /**
     * 初始化地图
     */
    public initMap(): void {
        if(Laya.Browser.onMiniGame){
            Laya.URL.basePath = ResManager.URL_BASE;
        }

        this.tiledmap = new Laya.TiledMap();
        this.tiledmap.setViewPortPivotByScale(0,0);
        this.tiledmap.scale = Laya.Browser.width/DESIGN_WIDTH;

        //创建地图，适当的时候调用destory销毁地图
		this.tiledmap.createMap(ResManager.getResDir("map/family721.json"), new Laya.Rectangle(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT), new Laya.Handler(this, this.comleteHandler));
    }

    /** 加载完成 */
    private comleteHandler(): void {
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);//注册鼠标事件
		Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
        Laya.stage.on(Laya.Event.RESIZE, this, this.resize);
        this.resize();

        this.initFurnitures();
    }

    /** 初始化家具 */
    private initFurnitures(): void {
        //tilemap中家具对象层
        var mapFurnitureLayer = this.tiledmap.getLayerByName("furnitureLayer");
        //真正的家具层
        this.furnituremap = new Laya.Sprite();
        this.furnituremap.size(this.MAP_WIDTH, this.MAP_HEIGHT);
        this.pivot(0,0);
        this.pos(0,0);
        this.furnituremap.zOrder = 10;
        mapFurnitureLayer.addExSprite(this.furnituremap);

        this.initFurnitureDatas();
    }

    private initFurnitureDatas(): void {
         var resM = {
            [0]: "home/img_clean1.png",
            [1]: "home/img_clean2.png",
            [2]: "home/img_clean3.png",
            [3]: "home/img_clean4.png",
            [4]: "home/img_clean5.png",
            [5]: "home/img_clean6.png",
        }

        if(this.furnituremap != null){
            var furniture1 = this.createFurniture({x: 230, y:630}, {x:1, y:1}, ResManager.getResDir(resM[0]));
            var furniture2 = this.createFurniture({x: 100, y:630}, {x:1, y:1}, ResManager.getResDir(resM[1]));
            var furniture3 = this.createFurniture({x: 550, y:680}, {x:1, y:1}, ResManager.getResDir(resM[2]));
            var furniture4 = this.createFurniture({x: 550, y:400}, {x:1, y:1}, ResManager.getResDir(resM[3]));
            this.furnituremap.addChild(furniture1);
            this.furnituremap.addChild(furniture2);
            this.furnituremap.addChild(furniture3);
            this.furnituremap.addChild(furniture4);

            var clearBtn = this.createClearBtn(ResManager.getResDir("comp/button.png",RES.LOCAL), {x:400, y:750});
            this.furnituremap.addChild(clearBtn);

            var familyBtnMediator = <FamilyUserBtnUIViewMediator>GameFacade.getInstance().retrieveMediator(FamilyUserBtnUIViewMediator.NAME);
            if(familyBtnMediator != null){
                familyBtnMediator.addFamilyMapCleanBtnListener(clearBtn);
            }
        }
    }

    /** 创建家具 */
    private createFurniture(pos:{x:number, y:number}, scale:{x:number, y:number}, skin: string): FurnitureItem {
        if(this.furnituremap == null){
            return;
        }
        
        var furniture = new FurnitureItem();
        furniture.loadImage(skin);
        furniture.pivot(furniture.width/2, furniture.height/2);
        furniture.pos(pos.x, pos.y);
        furniture.scale(scale.x, scale.y);
        return furniture;
    }
    
    /** 鼠标按下拖动地图 */
    private mouseDown(): void {
        this.lastMouseDownPos.x = Laya.stage.mouseX;
        this.lastMouseDownPos.y = Laya.stage.mouseY;
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);

        Laya.timer.clear(this, this.mapInertiaMove);
        if(this.mapMovePosTween != null){
            Laya.Tween.clear(this.mapMovePosTween);
            this.mapMovePosTween = null;
        }
    }

    /** 鼠标移动 */
    private mouseMove(): void {
        var moveX:number = this.mapMove.x - (Laya.stage.mouseX - this.lastMouseDownPos.x);
        var moveY:number = this.mapMove.y - (Laya.stage.mouseY - this.lastMouseDownPos.y);

        moveX = Math.max(moveX, 0);
        moveY = Math.max(moveY, 0);

        //移动地图视口
        if(this.tiledmap)
            this.tiledmap.moveViewPort(moveX, moveY);

        this.mouseDir.x = this.lastMousePos.x - Laya.stage.mouseX;
        this.mouseDir.y = this.lastMousePos.y - Laya.stage.mouseY;

        this.lastMousePos.x = Laya.stage.mouseX;
        this.lastMousePos.y = Laya.stage.mouseY;
    }

    /** 鼠标松开 */
    private mouseUp(): void {
        this.mapMove.x = this.mapMove.x - (Laya.stage.mouseX - this.lastMouseDownPos.x);
        this.mapMove.y = this.mapMove.y - (Laya.stage.mouseY - this.lastMouseDownPos.y);
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);

        var speedX = 15;
        var speedY = 15;
        let destX = this.mapMove.x + this.mouseDir.x * speedX;
        let destY = this.mapMove.y + this.mouseDir.y * speedY;

        destX = Math.max(10, destX);
        destY = Math.max(10, destY);
        destX = Math.min(DESIGN_WIDTH*3, destX);
        destY = Math.min(DESIGN_HEIGHT*2, destY);

        this.mapMovePosTween = Laya.Tween.to(this.mapMove,{
            x: destX,
            y: destY,
        }, 1000, Laya.Ease.circOut, new Laya.Handler(this, function(){
            Laya.Tween.clear(this.mapMovePosTween);
            this.mapMovePosTween = null;
        }));

        Laya.timer.frameLoop(1,this,this.mapInertiaMove);
    }

    /** 窗口大小改变，把地图的视口区域重设下 */
    private resize(): void {
        //改变地图视口大小
        this.tiledmap.changeViewPort(this.mapMove.x, this.mapMove.y, Laya.Browser.width, Laya.Browser.height);
    }

    /** 地图惯性运动 */
    private mapInertiaMove(): void {
        if(this.tiledmap != null){
            this.tiledmap.moveViewPort(this.mapMove.x, this.mapMove.y);
        }
    }

    /** 地图移动 */
    private mapStartMoveTo(): void {

    }

    /** 创建清洁按钮 */
    private createClearBtn(skin: string, pos:{x:number, y:number}): Laya.Button {
        var btn = new Laya.Button(skin);
        btn.label = "clear";
        btn.pos(pos.x, pos.y);
        return btn;
    }
}