/**
 * 家园场景
 */
class FamilyScene extends UIScene{
    public constructor(){
        super();
        this.init();
    }

    //GUI
    private userBtn: FamilyUserBtnUIView;
    //场景地图      
    private familyMap: FamilyMapView;

    public init(): void {
        Laya.loader.load(ResManager.getResDir("home.atlas",RES.GAME), Laya.Handler.create(this, this.loadCompete));
    }

    private loadCompete(): void {
        this.zOrder = 10;
        this.mouseThrough = true;

        this.familyMap = new FamilyMapView();
        this.addChild(this.familyMap);
        this.addFullScreenUI(this.familyMap);

        this.userBtn = new FamilyUserBtnUIView();
        this.addChildToBottom(this.userBtn);

        GameFacade.getInstance().registerSceneMediator(new FamilySceneMediator(this));
    }

    
}