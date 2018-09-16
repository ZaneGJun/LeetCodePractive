

enum SceneEnum {
    NONE,
    LOGIN,
    GAME_SCENE,
    FAMILY_SCENE,

    ADAPTUI,
}


/**
 * 游戏场景管理
 */
class SceneCommand extends puremvc.SimpleCommand{
    public constructor() {
        super();
    }

    /**
     * 切换场景
     */
    public static SWITCH_SCENE = "SWITCH_SCENE";

    /**
     * 注册消息
     */
    public static register(): void {
        GameFacade.getInstance().registerCommand(SceneCommand.SWITCH_SCENE, SceneCommand);
    }

    public execute(notification: puremvc.INotification): void {
        switch(notification.getName()) {
            case SceneCommand.SWITCH_SCENE: {
                var sceneInfo: {from: SceneEnum, to: SceneEnum} = <{from: SceneEnum, to: SceneEnum}>(notification.getBody());
                GameLogger.Log("scene from:" + sceneInfo.from + " to:" + sceneInfo.to);
                var orgScene: SceneEnum = sceneInfo.from;
                var newScene: SceneEnum = sceneInfo.to;

                //旧场景清除
                switch(orgScene) {
                    case SceneEnum.LOGIN: {

                        break;
                    }
                    case SceneEnum.GAME_SCENE: {
                        this.facade.removeCommand(GameCommand.NAME);
                        GameCommand.removeCommand();
                        this.facade.removeProxy(GameProxy.NAME);
                        break;
                    }
                    case SceneEnum.FAMILY_SCENE: {
                        break;
                    }
                    
                }

                //新场景生成
                switch(newScene) {
                    case SceneEnum.LOGIN: {
                        switchToScene(new LoginScene());
                        break;
                    }
                    case SceneEnum.GAME_SCENE: {
                        //注册游戏场景数据代理
                        this.facade.registerProxy(new GameProxy());
                        GameCommand.register();
                        switchToScene(new GameScene());
                        break;
                    }
                    case SceneEnum.FAMILY_SCENE: {
                        switchToScene(new FamilyScene());
                        break;
                    }
                    case SceneEnum.ADAPTUI: {
                        switchToScene(new UIAdaptTest());
                        break;
                    }
                }
                //切换场景触发一下GC
                WxUtils.triggerGC();

                break;
            }
        }
        
    }
}