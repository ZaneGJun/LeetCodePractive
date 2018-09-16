/**
 * 客户端网络连接
 */
class GameConnection extends GameClient{
    private static _instance: GameConnection;
    public static getInstance(): GameConnection {
        if(GameConnection._instance == null){
            GameConnection._instance = new GameConnection();
        }
        return GameConnection._instance;
    }

    public static EVENT_LOGIN_SUCCEEDED = "EVENT_LOGIN_SUCCEEDED";       
    public static EVENT_LOGIN_FAILED = "EVENT_LOGIN_FAILED";
    public static EVENT_LOGIN_OTHER_PLACE = "EVENT_LOGIN_OTHER_PLACE";

    private constructor(){ 
        super();
        this._authData = {
            session_code: "",
            signature: "",
            rawData: "",
        }
    }

    private _authData: AuthData;

    /** 微信登陆 */
    public doWXLogin(): void {
        WxUtils.getInstance().on(WxUtils.EVENT_WX_LOGIN_RET, this, this.onWXLoginRet);
        WxUtils.dologin();
    }

    /** 内网测试登陆 */
    public doInnerLogin(): void {
        //测试数据
        var data = {
            sessionCode: "123123",
            signature: "aaaa",
            rawData: "aaaabbbb",
        };
        this.clientVer = clientVer;
        GameConnection.getInstance().loginSDK(data);
    }

     /**
     * 微信登陆返回 
     */
    private onWXLoginRet(data): void {
        GameConnection.getInstance().loginSDK(data);
    }

    /**
     * 登陆
     */
    public loginSDK(data: any){

        this._authData.session_code = data.sessionCode;
        this._authData.signature = data.signature;
        this._authData.rawData = data.rawData;

        //设置sessionCode
        this.sessionCode = this._authData.session_code;

        //连接服务器
        this.connect(loginAddr);
    }

    /**
     * 开始连接服务器
     * @param addr 地址
     */
    public connect(addr: string) {
        super.connect(addr);
        GameLogger.Log("GameConnection connect:" + addr);
    }

    /**
     * 断开服务器连接
     */
    public disconnect():void {
        super.disconnect();
    }

    public onPacket(data): void {
        super.onPacket(data);
        ClientPacket.onPacket(data);
    }

    /** 连接成功 */
    public onConnected(): void {
        super.onConnected();
        //连接成功，开始登陆认证
        this.doAuth();
    }

    public onConnectFailed(data): void {
        super.onConnectFailed(data);
    }

    public onDisconnected(data): void {
        super.onDisconnected(data);
    }

    /**
     * 向服务器发送消息
     * @param cmd 主命令
     * @param subCmd 子命令
     * @param args 参数，json字符串
     * @param handler 回调， 非必要
     * @param ctrl 控制命令，非必要
     */
    public sendRequest(cmd: string, subCmd: string, args: any, handler?: Laya.Handler, ctrl:string = ""): void{
        if(this.socketStatus == 0){
            return;
        }else if(this.socketStatus == 1){

        }

        super.sendRequest(cmd, subCmd, args, handler, ctrl);
    }

    //开始登陆
    public doAuth(): void {
        GameMessageMgr.sendAuth(this._authData.session_code, this._authData.signature,this._authData.rawData, Laya.Handler.create(this, this.onAuth));
    }

    //登陆回调
    private onAuth(data: any): void {
        if(data == null)
            return;

        data["user_id"] = "9999";
        
        var ret = data["ret"];
        if(ret){
            var userId = data["user_id"];
            this.userId = userId;
            var playerProxy: PlayerProxy = <PlayerProxy><any>(GameFacade.getInstance().retrieveProxy(PlayerProxy.NAME));
            playerProxy.updateUserId(userId);

            this.event(GameConnection.EVENT_LOGIN_SUCCEEDED);
        }else{
            GameLogger.Log("onAuth failed:" + data);
            //this.event(GameConnection.EVENT_LOGIN_FAILED);

            var userId = data["user_id"]; 
            this.userId = userId;
            var playerProxy: PlayerProxy = <PlayerProxy><any>(GameFacade.getInstance().retrieveProxy(PlayerProxy.NAME));
            playerProxy.updateUserId(userId);
            this.event(GameConnection.EVENT_LOGIN_SUCCEEDED);
        }
    }

}