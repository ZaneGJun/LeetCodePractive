class GameUIViewMediator extends puremvc.Mediator {
    public static NAME: string = "GameUIViewMediator";

    public constructor(viewComponent: any) {
        super(GameUIViewMediator.NAME, viewComponent);
        this.init();
    }

    public init(): void {
        this.gameUIView.on(Laya.Event.CLICK, this, this.btnStart);
        
        this.gameUIView.on(GameUIView.EVENT_TURNTABLE_BE_HIT, this, this.turntableBtHit);
        this.gameUIView.on(GameUIView.EVENT_TURNTABLE_BOMB, this, this.turntableBomb);
        this.gameUIView.on(GameUIView.EVENT_TURNTABLE_APPEAR, this, this.turntableAppear);
        this.gameUIView.on(GameUIView.EVENT_REQ_PRE_REWARD, this, this.onReqReStart);
        this.gameUIView.on(GameUIView.EVENT_REQ_GET_REWARD, this, this.onReqGetReward);
    }

    /**
     * 发射飞刀
     */
    private btnStart(): void {
        this.gameUIView.shootKnife();
    }

    /**
     * 请求开始
     */
    private onReqReStart(): void {
        this.sendNotification(GameCommand.PRE_REWARD);
    }

    /**
     * 请求奖励
     */
    private onReqGetReward(): void {
        this.sendNotification(GameCommand.GET_REWARD);
    }

    private turntableBtHit(): void {
        this.sendNotification(SoundCommand.PLAY_EFFECT, "hit");
    }

    private turntableBomb(): void {
        this.sendNotification(SoundCommand.PLAY_EFFECT, "bomb");
    }

    private turntableAppear(): void {
        this.sendNotification(SoundCommand.PLAY_EFFECT, "appear");
    }

    /**
     * 监听消息列表
     */
    public listNotificationInterests(): Array<any> {
        return [GameProxy.PRE_REWARD_RET, GameProxy.GET_REWARD_RET];
    }

    /**
     * 处理消息
     * @param notification 
     */
    public handleNotification(notification: puremvc.INotification): void {
        switch (notification.getName()) {
            case GameProxy.PRE_REWARD_RET: {
                this.gameUIView.changeStatus(GameUIStatus.END_REQ_PRE_REWARD);
                break;
            }
            case GameProxy.GET_REWARD_RET: {
                this.gameUIView.changeStatus(GameUIStatus.END_REQ_GET_REWARD);
                break;
            }
        }
    }

    public get gameUIView(): GameUIView {
        return <GameUIView>(this.viewComponent);
    }
}