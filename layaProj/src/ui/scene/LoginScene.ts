/**
 * 登录场景
 */
class LoginScene extends UIScene {
    public constructor() {
        super();
        this.init();
    }

    private _view: ui.game.LoginUI;
    public get view(): ui.game.LoginUI {
        return this._view;
    }

    //资源加载器
    private _resLoader: ResLoader;
    public get resLoader(): ResLoader {
        return this._resLoader;
    }

    //进度条
    private _loadingBar: LabelLoadingBar;
    public get loadingBar(): LabelLoadingBar {
        return this._loadingBar;
    }

    public init(): void {
        Laya.loader.load(ResManager.getResDir("comp.atlas",RES.LOCAL), Laya.Handler.create(this, this.loadCompete));
    }

    private loadCompete(): void {
        this.addBg(ResManager.getResDir("turntable/img_bg.png",RES.LOCAL));
        
        this._view = new ui.game.LoginUI();
        this.addChild(this._view);

        this._loadingBar = new LabelLoadingBar(ResManager.getResDir("comp/progress.png",RES.LOCAL));
        this._loadingBar.pos(DESIGN_WIDTH/2, DESIGN_HEIGHT/2 + 250);
        this._loadingBar.value = 0.0;
        this._loadingBar.loadingContent.text = "进度条";
        this._view.boxCenter.addChild(this._loadingBar);

        this._resLoader = new ResLoader();

        this._view.btnLogin.visible = false;
        this._loadingBar.visible = false;

        this.addChildToCenter(this._view.boxCenter);
        GameFacade.getInstance().registerSceneMediator(new LoginSceneMediator(this));
    }

    public hideLoadingBarShowLoginBtn(): void {
        if(this._loadingBar != null)
            this._loadingBar.visible = false;

        if(this._view != null && this._view.btnLogin != null)
            this._view.btnLogin.visible = true;
    }

    public updateLoadingBar(value: number, str?: string): void {
        if(this._loadingBar != null){
            this._loadingBar.visible = true;
            this._loadingBar.goToValueAni(value);
            if(str)
                this._loadingBar.loadingContent.text = str;
        }
    }
}