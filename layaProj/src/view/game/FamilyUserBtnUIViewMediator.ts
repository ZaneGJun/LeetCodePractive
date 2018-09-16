class FamilyUserBtnUIViewMediator extends puremvc.Mediator{
    public static NAME: string = "FamilyUserBtnUIViewMediator";

    public constructor(viewComponent: any){
        super(FamilyUserBtnUIViewMediator.NAME, viewComponent);
        this.init();
    }

    public init(): void {
        this.userBtnUIView.btnRet.on(Laya.Event.CLICK, this, this.onBtnRet);
        this.userBtnUIView.btnClose.on(Laya.Event.CLICK, this, this.onBtnClose);

        this.userBtnUIView.btnUpgrade1.on(Laya.Event.CLICK, this, this.onBtnUpgrade);
    }

    public addFamilyMapCleanBtnListener(btn: Laya.Button): void {
        if(btn == null) return;

        btn.on(Laya.Event.CLICK, this, this.onBtnClean);
    }

    private onBtnClose(): void {
        this.userBtnUIView.hideUpgradeList();
    }

    private onBtnClean(): void {
        this.userBtnUIView.showUpgradeList([false, false, false, false, false]);
    }

    private onBtnRet(): void {
        this.sendNotification(SceneCommand.SWITCH_SCENE, {from: SceneEnum.FAMILY_SCENE, to: SceneEnum.GAME_SCENE});
    }

    private onBtnUpgrade(): void {
        
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

    public get userBtnUIView(): FamilyUserBtnUIView {
        return <FamilyUserBtnUIView>(this.viewComponent);
    }
}