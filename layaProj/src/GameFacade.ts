/**
 * GameFacade,pureMVC框架主要入口类
 */
class GameFacade extends puremvc.Facade {
    constructor() {
        super();
    }

    public static readonly STARTUP: string = "startup";

    public static getInstance(): GameFacade {
        if(this.instance == null) this.instance = new GameFacade();
        return <GameFacade>(this.instance);
    }

    public initializeController(): void {
        super.initializeController();
        this.registerCommand(GameFacade.STARTUP, StartupCommand);
    }

    public startUp(): void {
        Laya.timer.once(500, this, ()=>{
            this.sendNotification(GameFacade.STARTUP);
            this.removeCommand(GameFacade.STARTUP);
        })
    }

    public static curSceneMediator: puremvc.Mediator;
    /**
     * 注册场景mediator
     * @param mdeiator 
     */
    public registerSceneMediator(mediator: puremvc.Mediator): void{
        if(GameFacade.curSceneMediator != null){
            this.removeMediator(GameFacade.curSceneMediator.mediatorName);
        }
        GameFacade.curSceneMediator = mediator;
        this.registerMediator(mediator);
    }
}