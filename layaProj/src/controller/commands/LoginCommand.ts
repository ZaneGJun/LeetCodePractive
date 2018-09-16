/**
 * 登录逻辑
 */
class LoginCommand extends puremvc.SimpleCommand {
    public static NAME: string = "LoginCommand";
    public constructor() {
        super();
    }
    
    /**
     * 开始登录
     */
    public static LOGIN: string = "LOGIN";
    

    /**
     * 注册消息
     */
    public static register(): void {
        GameFacade.getInstance().registerCommand(LoginCommand.LOGIN, LoginCommand);
    }

    public execute(notification: puremvc.INotification): void {
        if(Laya.Browser.onPC){ 
            this.sendNotification(SceneCommand.SWITCH_SCENE, {from: SceneEnum.LOGIN, to: SceneEnum.GAME_SCENE});
            //GameConnection.getInstance().doInnerLogin();
        }else if(Laya.Browser.onWeiXin){ 
            //GameConnection.getInstance().doWXLogin();
            this.sendNotification(SceneCommand.SWITCH_SCENE, {from: SceneEnum.LOGIN, to: SceneEnum.GAME_SCENE});
        }
    }
}