
/**
 * 游戏网络消息的统一处理
 * 对收、发消息协议的包装、回调统一处理，封装了网络发送细节，使得游戏业务逻辑与网络收发隔离开来
 */
class GameMessageMgr{

    public static send(main: string, sub: string, args?: any, handler?:Laya.Handler): void {
        GameConnection.getInstance().sendRequest(main, sub, args, handler);
    }

    /**
     * 登陆认证
     * @param sessionCode 
     * @param signature 
     * @param rawData 
     * @param handler 
     */
    public static sendAuth(sessionCode: string, signature: string, rawData: string, handler: Laya.Handler) {
        var authData : AuthData = {
            session_code: sessionCode,
            signature: signature,
            rawData: rawData,
        }
        GameMessageMgr.send(CMD.MAIN.auth, CMD.SUB.do_auth, authData, handler);
    }

    /**
     * 请求开始
     */
    public static sendPreReward(): void {
        //GameMessageMgr.send(CMD.MAIN.rotary, CMD.SUB.pre_reward, null, Laya.Handler.create(this, this.responsePreReward));
        var data = {
            ret:true,
            arrList: [5,8,9,12,18],
            reward: {coin:1000},
        }
        GameMessageMgr.responsePreReward(data); 
    }

    public static responsePreReward(data: any): void {
        if(data != null){ 
            if(data["ret"]){
                var coinList = data["arrList"];
                var reward = data["reward"];

                var proxy = <GameProxy>GameFacade.getInstance().retrieveProxy(GameProxy.NAME);
                if(proxy != null){
                    proxy.preReward(coinList);
                }
            }
        }
    }

    /**
     * 请求奖励
     */
    public static sendGetReward(): void {
        //GameMessageMgr.send(CMD.MAIN.rotary, CMD.SUB.get_reward, null, Laya.Handler.create(this, this.responseGetReward));
        GameMessageMgr.responseGetReward(null);
    }

    public static responseGetReward(data: any): void {
        var proxy = <GameProxy>GameFacade.getInstance().retrieveProxy(GameProxy.NAME);
        if(proxy != null){
            proxy.getRewardRet();
        }
    }

    /** 请求获取家园信息 */
    public static sendReqGetHomeInfo(): void {
        GameMessageMgr.responseGetHomeInfo(null);
    }

    public static responseGetHomeInfo(data: any): void {
        var proxy = <GameProxy>GameFacade.getInstance().retrieveProxy(GameProxy.NAME);
        if(proxy != null){
            proxy.getHomeInfoRet();
        }
    }

    /** 请求清理某个区域某个位置  */
    public static sendReqCleanAreaPos(): void {
        GameMessageMgr.reponseCleanAreaPos(null);
    }

    public static reponseCleanAreaPos(data: any): void {
        var proxy = <GameProxy>GameFacade.getInstance().retrieveProxy(GameProxy.NAME);
        if(proxy != null){
            proxy.cleanAreaPosRet();
        }
    }

    /** 请求升级某个区域某个位置 */
    public static sendReqUpgradeAreaPos(): void {
        GameMessageMgr.reponseUpgradeAreaPos(null);
    }

    public static reponseUpgradeAreaPos(data: any): void {
        var proxy = <GameProxy>GameFacade.getInstance().retrieveProxy(GameProxy.NAME);
        if(proxy != null){
            proxy.upgradeAreaPOstRet();
        }
    }

    /** 请求拉取配置 */
    public static sendReqGetConf(): void {
        GameMessageMgr.reponseGetConf(null);
    }

    public static reponseGetConf(data: any): void {
        var proxy = <GameProxy>GameFacade.getInstance().retrieveProxy(GameProxy.NAME);
        if(proxy != null){
            proxy.updateConf();
        }
    }
}