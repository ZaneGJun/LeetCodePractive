/**
 * 游戏主导 
 * 负责监听网络状态以及一些统一处理，在游戏流程中不释放
 */
class GameMain{
    constructor(){
        this.init();
    }

    public init(): void {
         //监听
        GameConnection.getInstance().on(GameConnection.EVENT_CONNECTED,this,this.onConnected);
        GameConnection.getInstance().on(GameConnection.EVENT_CONNECT_FAILED, this, this.onConnectFailed);
        GameConnection.getInstance().on(GameConnection.EVENT_DISCONNECTED,this, this.onDisconnected);
        GameConnection.getInstance().on(GameConnection.EVENT_LOGIN_SUCCEEDED,this, this.loginSuccess);
        GameConnection.getInstance().on(GameConnection.EVENT_LOGIN_FAILED, this, this.loginFailed);

        this.goToMainUI();
    }

    private goToMainUI(): void{
        //init
        GameFacade.getInstance();

        GameFacade.getInstance().startUp();
    }

    private onConnected(): void {
        
    }

    private onConnectFailed(): void {
        
    }

    private onDisconnected(): void {

    }

    private loginSuccess(): void {

    }

    private loginFailed(): void {

    }
}
