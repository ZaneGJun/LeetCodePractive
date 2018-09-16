class GameUserBtnUIViewMediator extends puremvc.Mediator {
    public static NAME: string = "GameUserBtnUIViewMediator";
    public constructor(viewCompeneton: any){
        super(GameUIViewMediator.NAME, viewCompeneton);
        this.init();
    }

    public init(): void {
        this.userBtnUIView.btnJumpFamily.on(Laya.Event.CLICK, this, this.onBtnJumpFamily);
    }

    private onBtnJumpFamily(): void {
        GameLogger.Log("onBtnJumpFamily");
        //请求家园信息
        this.sendNotification(GameCommand.REQ_GET_HOME_INFO);
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

    public get userBtnUIView(): GameUserBtnUIView {
        return <GameUserBtnUIView>(this.viewComponent);
    }
}