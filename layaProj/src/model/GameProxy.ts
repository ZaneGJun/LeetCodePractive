
class GameProxy extends puremvc.Proxy {
    public static NAME: string = "GameProxy";
    public constructor() {
        super(GameProxy.NAME);
        this.reset();
    }

    //配置
    public static GET_CONF_RET: string = "GET_CONF_RET";

    //点金
    public static UPDATE_SCORE: string = "UPDATE_SCORE";
    public static PRE_REWARD_RET: string = "PRE_REWARD_RET";
    public static GET_REWARD_RET: string = "GET_REWARD_RET";

    //家园
    public static GET_HOME_INFO_RET: string = "GET_HOME_INFO_RET";
    public static CLEAN_AREA_POS_RET: string = "CLEAN_AREA_POS_RET";
    public static UPGRADE_AREA_POS_RET: string = "UPGRADE_AREA_POS_RET";

    private _data: GameData;

    private isWin: boolean;

    private _coinList: number[];

    public get coinList(): number[] {
        return this._coinList;
    }

    public reset(): void {
        if(this._data == null){
            this._data = {
                score: 0,
            }
        }

        this._data.score = 0;
        this.isWin = false;

        this._coinList = [];
    }

    public preReward(list: number[]): void {
        for(var i=0; i < list.length; i++){
            this._coinList[i] = list[i];
        }
        this.sendNotification(GameProxy.PRE_REWARD_RET);
    }

    public getRewardRet(): void {
        this.sendNotification(GameProxy.GET_REWARD_RET);
    } 

    public getHomeInfoRet(): void {
        this.sendNotification(GameProxy.GET_HOME_INFO_RET);
    }

    public cleanAreaPosRet(): void {
        this.sendNotification(GameProxy.CLEAN_AREA_POS_RET);
    }

    public upgradeAreaPOstRet(): void {
        this.sendNotification(GameProxy.UPGRADE_AREA_POS_RET);
    }

    public updateConf(): void {
        this.sendNotification(GameProxy.GET_CONF_RET);
    }
}