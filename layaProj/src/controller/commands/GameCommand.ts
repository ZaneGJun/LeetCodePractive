
class GameCommand extends puremvc.SimpleCommand{
    public static NAME: string = "GameCommand";
    public constructor(){
        super();
    }

    //一局开始的请求
    public static PRE_REWARD: string = "PRE_REWARD";
    //结束请求奖励
    public static GET_REWARD: string = "GET_REWARD";

    //请求获取家园信息
    public static REQ_GET_HOME_INFO: string = "REQ_GET_HOME_INFO";
    //请求清理某个区域某个位置
    public static REQ_CLEAN_AREA_POS: string = "REQ_CLEAN_AREA";
    //请求升级某个区域某个位置
    public static REQ_UPGRADE_POS: string = "REQ_UPGRADE_POS";

    //请求拉取配置
    public static REQ_GET_CONF: string = "REQ_GET_CONF";

     /**
     * 注册消息
     */
    public static register(): void {
        GameFacade.getInstance().registerCommand(GameCommand.PRE_REWARD, GameCommand);
        GameFacade.getInstance().registerCommand(GameCommand.GET_REWARD, GameCommand);

        GameFacade.getInstance().registerCommand(GameCommand.REQ_GET_HOME_INFO, GameCommand);
        GameFacade.getInstance().registerCommand(GameCommand.REQ_CLEAN_AREA_POS, GameCommand);
        GameFacade.getInstance().registerCommand(GameCommand.REQ_UPGRADE_POS, GameCommand);
    }

    public static removeCommand(): void {
        GameFacade.getInstance().removeCommand(GameCommand.PRE_REWARD);
        GameFacade.getInstance().removeCommand(GameCommand.GET_REWARD);

        GameFacade.getInstance().removeCommand(GameCommand.REQ_GET_HOME_INFO);
        GameFacade.getInstance().removeCommand(GameCommand.REQ_CLEAN_AREA_POS);
        GameFacade.getInstance().removeCommand(GameCommand.REQ_UPGRADE_POS);
    }

    public execute(notification: puremvc.INotification): void {
        switch(notification.getName()) {
            case GameCommand.PRE_REWARD: {
                GameMessageMgr.sendPreReward();
                break;
            }
            case GameCommand.GET_REWARD: {
                GameMessageMgr.sendGetReward();
                break;
            }
            case GameCommand.REQ_GET_HOME_INFO: {
                GameMessageMgr.sendReqGetHomeInfo();
                break;
            }
            case GameCommand.REQ_CLEAN_AREA_POS: {
                GameMessageMgr.sendReqCleanAreaPos();
                break;
            }
            case GameCommand.REQ_UPGRADE_POS: {
                GameMessageMgr.sendReqUpgradeAreaPos();
                break;
            }
            case GameCommand.REQ_GET_CONF: {
                GameMessageMgr.sendReqGetConf();
                break;
            }
        }
    }
}