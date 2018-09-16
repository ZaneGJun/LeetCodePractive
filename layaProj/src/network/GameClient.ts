/**
 * 对socket进行封装
 */
class GameClient extends Laya.EventDispatcher{
    public static EVENT_PACKET = "packet";          
    public static EVENT_CONNECTED = "connected";
    public static EVENT_CONNECT_FAILED = "connectfailed";
    public static EVENT_DISCONNECTED = "disconnected";

    protected socket: Laya.Socket;      //socket对象

    protected _sessionId: number;        //客户端发送数据包所用的session
    protected get sessionId(): number {
        return this._sessionId;
    }
    protected set sessionId(id: number){
        this._sessionId = id;
    }

    protected _sessionCode: string;      //wx.login的返回值，字符串
    public get sessionCode(): string{
        return this._sessionCode;
    }
    public set sessionCode(code: string){
        this._sessionCode = code;
    }

    protected _userId: string;           //玩家号，字符串，刚开始客户端没有发空串，服务器会根据session_code返回
    public get userId(): string {
        return this._userId;
    }
    public set userId(userid: string) {
        this._userId = userid;
    }

    protected _socketStatus: number;          //0：“断开”，1：“连接中”，2：“已连上”
    public get socketStatus(): number{
        return this._socketStatus;
    }
    public set socketStatus(status: number){
        this._socketStatus = status;
    }

    protected _clientVer: string;       //客户端版本号
    public get clientVer(): string{
        return this._clientVer;
    }
    public set clientVer(ver: string){
        this._clientVer = ver;
    }

    protected pendingResponses = [] as { handler: Laya.Handler }[];     // 等待服务器回复的队列

    public constructor(){
        super();
        this.init();
    }

    public init(): void{
        this.sessionId = 0;
        this.sessionCode = "";
        this.userId = "";
        this.socketStatus = 0;
        this._clientVer = "";
    }

    public connect(logonAddr): void{
        if(this.socket != null){
            this.socket.close();
            this.socket = null;
        }
        this.pendingResponses.splice(0, this.pendingResponses.length);

        this.socket = new Laya.Socket();
        this.socket.on(Laya.Event.OPEN, this, this.onSocketOpen);
        this.socket.on(Laya.Event.CLOSE, this, this.onSocketClose);
        this.socket.on(Laya.Event.MESSAGE, this, this.onSocketMessage);
        this.socket.on(Laya.Event.ERROR, this, this.onSocketError);
        this.socket.connectByUrl(logonAddr);

        this.socketStatus = 1;
    }

    public disconnect(): void {
        var self = this;
        if (self.socket) {
            self.socket.close();
            self.clearSocket(self.socket);
            self.socket = null;
        }
    }

    public clearSocket(socket: Laya.Socket): void{
        this.sessionId = 0;
        this.socketStatus = 0;
        socket.off(Laya.Event.OPEN, this, this.onSocketOpen);
        socket.off(Laya.Event.CLOSE, this, this.onSocketClose);
        socket.off(Laya.Event.MESSAGE, this, this.onSocketMessage);
        socket.off(Laya.Event.ERROR, this, this.onSocketError);
    }

    public onSocketOpen(data): void {
        this.socketStatus = 2;
        this.onConnected();
    }

    public onSocketClose(e): void {
        this.clearSocket(this.socket);
        this.socket = null;
        this.onDisconnected(e);
    }

    public onSocketError(e): void {
        this.clearSocket(this.socket);
        this.socket = null;
        this.onConnectFailed(e);
    }

    public onConnected(): void {
        GameLogger.Log("-------GameClient onConnected-------");
        this.event(GameClient.EVENT_CONNECTED);
    }

    public onConnectFailed(data): void {
        GameLogger.Log("-------GameClient onConnectFailed-------");
        this.event(GameClient.EVENT_CONNECT_FAILED);
    }

    public onDisconnected(data): void {
        GameLogger.Log("-------GameClient onDisconnected-------");
        this.event(GameClient.EVENT_DISCONNECTED);
    }
    
    /**
     * 处理服务器消息返回
     * @param data 
     */
    public onSocketMessage(data): void{
        GameLogger.Log("-------GameClient onSocketMessage-------");
        GameLogger.Log("onSocketMessage:" + data);
        //解析
        var packetData = SocketData.decode(data);

        var sessionid = packetData["session_id"];
        if(sessionid != "undefined"){
            var pr = this.pendingResponses[sessionid];
            if(pr != null && pr.handler != null){
                //这是一个客户端等待服务器返回的请求
                if(packetData["ret"] != "undefined"){
                    //普通命令，只回调一次
                    this.pendingResponses[sessionid] = null;
                }

                // 对于Laya.Node实例，destroy后不再回调
                if (pr.handler.caller instanceof Laya.Node) {
                    var node = pr.handler.caller as Laya.Node;
                    if (!node.destroyed) {
                        pr.handler.runWith([packetData]);
                    }
                }
                else {
                    pr.handler.runWith([packetData]);
                }
            }else{
                //不是一个客户端等待服务器的返回请求
                this.onPacket(packetData);
            }
        }else{
            this.onPacket(packetData);
        }
    }

    public onPacket(data): void{
        GameLogger.Log("-------GameClient onPatcket-------");
        this.event(GameClient.EVENT_PACKET, data);
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
        if(this.socket === null){
            GameLogger.LogError("sendRequest socket == null");
            return;
        }

        if(cmd === "" || subCmd === ""){
            GameLogger.LogError("sendRequest require cmd && subCmd");
            return;
        }

        this.sessionId = this.sessionId + 1;
        if(handler != null){
            //需要处理回调
            this.pendingResponses[this.sessionId] = {handler: handler};
        }

        //封装数据
        var data = SocketData.encode(cmd, subCmd, args, this.sessionId, this.sessionCode, this.userId, ctrl, this.clientVer);
        GameLogger.Log("sendRequest:" + data);
        this.socket.send(data);
    }

    public getSocketStatus(): number {
        return this.socketStatus;
    }
}