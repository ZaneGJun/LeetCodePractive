/**
 * 玩家数据代理
 */
class PlayerProxy extends puremvc.Proxy implements puremvc.IProxy {
    public static NAME: string = "PlayerProxy";
    public constructor() {
        super(PlayerProxy.NAME);
        this.reset();
    }

    /**更新金币 */
    public static UPDATE_COIN: string = "UPDATE_COIN";
    /**更新昵称 */
    public static UPDATE_NICKNAME: string = "UPDATE_NICKNAME";
    /**更新体力 */
    public static UPDATE_STRENGTH: string = "UPDATE_STRENGTH";

    private _data: PlayerData;

    public reset(): void {
        if(this._data == null){
            this._data = {
                userId: "",
                coin: 0,
                nickname: "",
                strength: 0
            }
        }

        this._data.userId = "";
        this._data.coin = 0;
        this._data.nickname = "";
        this._data.strength = 0;
    }

    public get userId(): string {
        return this._data.userId;
    }

    public updateUserId(id: string) {
        this._data.userId = id;
    }

    public get coin(): number {
        return this._data.coin;
    }

    public updateCoin(value: number) {
        this._data.coin = value;
        this.sendNotification(PlayerProxy.UPDATE_COIN);
    }

    public get nickname(): string {
        return this._data.nickname;
    }

    public updateNickname(str: string) {
        this._data.nickname = str;
        this.sendNotification(PlayerProxy.UPDATE_NICKNAME);
    }

    public get strength(): number {
        return this._data.strength;
    }

    public updateStrength(value: number) {
        this._data.strength = value;
        this.sendNotification(PlayerProxy.UPDATE_STRENGTH);
    }
}