
class FamilyUserBtnUIView extends ui.game.FamilyUserBtnUI{
    public constructor(){
        super();
        this.init();
    }

    private upgradeBtnList: Laya.Button[];

    public init(): void {
        this.upgradeBtnList = [];
        this.upgradeBtnList.push(this.btnUpgrade1);
        this.upgradeBtnList.push(this.btnUpgrade2);
        this.upgradeBtnList.push(this.btnUpgrade3);
        this.upgradeBtnList.push(this.btnUpgrade4);
        this.upgradeBtnList.push(this.btnUpgrade5);

        this.mouseThrough = false;

        this.hideUpgradeList();
        
        GameFacade.getInstance().registerMediator(new FamilyUserBtnUIViewMediator(this));
    }

    public showUpgradeList(showData: any): void {
        this.updateList.visible = true;
        this.btnRet.visible = false;

        for(var i=0;i<this.upgradeBtnList.length;i++){
            this.upgradeBtnList[i].gray = !showData[i];
        }
    }

    public hideUpgradeList(): void {
        this.updateList.visible = false;
        this.btnRet.visible = true;
    }
}