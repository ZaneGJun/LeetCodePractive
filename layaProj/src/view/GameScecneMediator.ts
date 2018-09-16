class GameSceneMediator extends puremvc.Mediator implements puremvc.IMediator{
    public static NAME: string = "GameSceneMediator";

    public constructor(viewComponent: any) {
        super(GameSceneMediator.NAME, viewComponent);
        this.init();
    }

    public init(): void {
        
    }

    /**
     * 监听消息列表
     */
    public listNotificationInterests(): Array<any> {
        return [GameProxy.GET_HOME_INFO_RET];
    }

    /**
     * 处理消息
     * @param notification 
     */
    public handleNotification(notification: puremvc.INotification): void {
        switch (notification.getName()) {
            case GameProxy.GET_HOME_INFO_RET: {
                //获取家园信息成功返回, 切换到家园场景
                this.sendNotification(SceneCommand.SWITCH_SCENE, {from: SceneEnum.GAME_SCENE, to: SceneEnum.FAMILY_SCENE});
                break;
            }
        }
    }

    public get gameScene(): GameScene {
        return <GameScene>(this.viewComponent);
    }
}