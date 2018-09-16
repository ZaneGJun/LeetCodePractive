class UIAdaptTestMdeiator extends puremvc.Mediator implements puremvc.IMediator{
    public static NAME: string = "UIAdaptTestMdeiator";

    constructor(viewComponent: any) {
        super(UIAdaptTestMdeiator.NAME, viewComponent);
        this.init();
    }

    public init(): void {
        this.uiAdaptView.view.btnCenter.on(Laya.Event.CLICK, this, this.buttonCenterClick);
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

    public get uiAdaptView(): UIAdaptTest {
        return <UIAdaptTest>(this.viewComponent);
    }

    private buttonCenterClick(): void {
        this.facade.sendNotification(SceneCommand.SWITCH_SCENE, {from: SceneEnum.ADAPTUI, to: SceneEnum.LOGIN});
    }
}