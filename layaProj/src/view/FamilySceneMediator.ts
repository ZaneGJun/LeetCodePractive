class FamilySceneMediator extends puremvc.Mediator implements puremvc.IMediator{
    public static NAME: string = "FamilySceneMediator";

    public constructor(viewComponent: any) {
        super(FamilySceneMediator.NAME, viewComponent);
        this.init();
    }

    public init(): void {
        
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

    public get familyScene(): FamilyScene {
        return <FamilyScene>(this.viewComponent);
    }
}