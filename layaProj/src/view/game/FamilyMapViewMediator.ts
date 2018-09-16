class FamilyMapViewMediator extends puremvc.Mediator {
    public static NAME: string = "FamilyMapViewMediator";
    public constructor(viewComponent: any){
        super(FamilyMapViewMediator.NAME, viewComponent);
        this.init();
    }

    public init(): void {
        this.familyMapView.initMap();
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

    public get familyMapView(): FamilyMapView { 
        return <FamilyMapView>(this.viewComponent);
    }
}