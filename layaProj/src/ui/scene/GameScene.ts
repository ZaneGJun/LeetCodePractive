
/**
 * 游戏场景界面zOrder
 */
enum GameSceneZOrder {

    GameUIView = 10,

    UserBtnView = 20,
}
  
 /**
 * 游戏场景
 */
class GameScene extends UIScene {
    public constructor() {
        super();
        this.init();
    }

    //游戏主要操作界面
    private gameUIView: GameUIView;
    private userBtnUIView: GameUserBtnUIView;

    public init(): void {
        Laya.loader.load([ResManager.getResDir("comp.atlas",RES.LOCAL),ResManager.getResDir("main.atlas")], Laya.Handler.create(this, this.loadCompete));

    }

    private loadCompete(): void {
        this.addBg(ResManager.getResDir("turntable/img_bg.png",RES.LOCAL));

        this.gameUIView = new GameUIView();
        this.gameUIView.zOrder = GameSceneZOrder.GameUIView;
        this.addChild(this.gameUIView);
        this.addFullScreenUI(this.gameUIView);

        this.userBtnUIView = new GameUserBtnUIView();
        this.userBtnUIView.zOrder = GameSceneZOrder.UserBtnView;
        this.addChildToLeftTop(this.userBtnUIView);

        GameFacade.getInstance().registerSceneMediator(new GameSceneMediator(this));
    }
}