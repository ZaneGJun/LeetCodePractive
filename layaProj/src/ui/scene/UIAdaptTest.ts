/**
 * 用于测试UI分辨率适配
 */
class UIAdaptTest extends UIScene{
    constructor(){
        super();
        this.init();
        //GameLogger.Log("UIAdaptTest constructor:" + Laya.timer.currTimer);
    }

    private _view: ui.game.UIAdaptUI;
    public get view(): ui.game.UIAdaptUI {
        return this._view;
    }


    public init(): void {
        Laya.loader.load(ResManager.getResDir("comp.atlas",RES.LOCAL), Laya.Handler.create(this, this.loadCompete));
    }

    private loadCompete(): void {
        this._view = new ui.game.UIAdaptUI();
        this.addChild(this._view);

        this.addChildToTop(this._view.boxTop);
        this.addChildToTopLeft(this._view.boxTopLeft);
        this.addChildToTopRight(this._view.boxTopRight);
        this.addChildToCenter(this._view.boxCenter);

        GameFacade.getInstance().registerSceneMediator(new UIAdaptTestMdeiator(this));
    }
}