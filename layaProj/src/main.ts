
class main{
    constructor(){
        //初始化微信小游戏
        Laya.MiniAdpter.init();
        //初始化引擎
        Laya.init(DESIGN_WIDTH, DESIGN_HEIGHT, Laya.WebGL);

        //适配模式
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.Stat.show();

        //激活资源版本控制
        //设置版本控制类型为使用文件名映射的方式
        //加载版本信息文件
        Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.goToMain), Laya.ResourceVersion.FILENAME_VERSION);
        //this.goToMain();
    }

    private gameMain: GameMain;

    private goToMain(): void{
        this.gameMain = new GameMain();
    }
}

new main();