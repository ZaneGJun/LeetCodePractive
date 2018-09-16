class LoginSceneMediator extends puremvc.Mediator implements puremvc.IMediator {
    public static NAME: string = "LoginMediator";

    constructor(viewComponent: any){
        super(LoginSceneMediator.NAME, viewComponent);
        this.init();
    }

    public init(): void {
        this.loginScene.view.btnLogin.on(Laya.Event.CLICK, this, this.loginBtnClick);
        this.loginScene.resLoader.on(ResLoader.EVENT_PRELOAD_FINISH, this, this.preloadFinish);
        this.loginScene.resLoader.on(ResLoader.EVENT_PRELOAD_PROGRESS, this, this.preloadProgress);
        this.loginScene.resLoader.on(ResLoader.EVENT_UPDATE_FINISH, this, this.updateFinish);
        this.loginScene.resLoader.on(ResLoader.EVENT_UPDATE_PROGRESS, this, this.updateProgress);
        this.loginScene.loadingBar.on(LabelLoadingBar.EVENT_LOAD_FINISH, this, this.loadingBarFinish);

        GameConnection.getInstance().on(GameConnection.EVENT_LOGIN_SUCCEEDED, this, this.onLoginSuccess);

        this.loginScene.view.btnLogin.visible = false;
        this.loginScene.loadingBar.visible = true;
        //开始加载资源
        this.loginScene.resLoader.start();
    }

    /**
     * 登录成功
     */
    private onLoginSuccess(): void {
        this.sendNotification(SceneCommand.SWITCH_SCENE,{from: SceneEnum.LOGIN, to: SceneEnum.GAME_SCENE});
    }

    /**
     * 登录失败
     */
    private onLoginFailed(): void {

    }

    /**
     * 登录按钮按下响应
     */
    private loginBtnClick(): void {
        this.sendNotification(LoginCommand.LOGIN);
    }

    /**
     * 预加载完成
     */
    private preloadFinish(success: boolean): void {
        this.loginScene.updateLoadingBar(1.0);
    }

    /**
     * 进度条加载完成
     */
    private loadingBarFinish(): void {
        Laya.timer.once(200, this, ()=>{
            this.loginScene.hideLoadingBarShowLoginBtn();
        });
    }

    /**
     * 预加载进度
     */
    private preloadProgress(progress: number): void {
        var value = progress ? progress : 0;
        var labelStr = "更新资源:";
        this.loginScene.updateLoadingBar(value, labelStr);
    }

    /**
     * 更新完成
     */
    private updateFinish(success: boolean): void {

    }

    /**
     * 更新进度
     */
    private updateProgress(progress: number): void {
        var value = progress ? progress : 0;
        var labelStr = "加载资源:";
        this.loginScene.updateLoadingBar(value, labelStr);
    }

     /**
     * 监听消息列表
     */
    public listNotificationInterests(): Array<any> {
        return [];
    }

    /**
     * 处理消息
     * @param notification 
     */
    public handleNotification(notification: puremvc.INotification): void {
        switch (notification.getName()) {
        }
    }

    public get loginScene(): LoginScene {
        return <LoginScene>(this.viewComponent);
    }
}