
class GameUserBtnUIView extends ui.game.GameUserBtnUI {
    constructor(){
        super();
        this.init();
    }

    public init(): void {
        

        GameFacade.getInstance().registerMediator(new GameUserBtnUIViewMediator(this));
    }
}