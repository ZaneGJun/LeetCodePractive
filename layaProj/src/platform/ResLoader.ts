/**
 * 资源更新、加载、清理 
 */
class ResLoader extends Laya.EventDispatcher
{
    constructor(sceneType?: string)
    {
        super();
        this.updater = new WXResUpdater();
        this.sceneType = sceneType;
    }

    public static EVENT_UPDATE_PROGRESS = "EVENT_UPDATE_PROGRESS";
    public static EVENT_UPDATE_FINISH = "EVENT_UPDATE_FINISH";
    public static EVENT_PRELOAD_PROGRESS = "EVENT_PRELOAD_PROGRESS";
    public static EVENT_PRELOAD_FINISH = "EVENT_PRELOAD_FINISH";
    

    private updater: WXResUpdater;
    private resConfig;
    private sceneType: string;

    public start(){
        this.getResConfig();
    }

    /**
     * 从服务器下载新的资源配置
     */
    private getResConfig(): void {
        /*
        var self = this;
        if(Laya.Browser.onMiniGame){
            //需要动态下载设置URL_BASE
            Laya.URL.basePath = ResManager.URL_BASE;
            ResManager.downloadOtherFile(ResManager.RES_CONFIG_FILENAME, Laya.Handler.create(null, function(retCode){
                if(retCode == 0){
                    self.onResConfigFinish();
                }else if(retCode == 2){  
                }
                else{
                    ShowMsg("获取资源信息失败,请重试",["重试"],Laya.Handler.create(self, self.start));
                }
            },null,false));
        }else if(Laya.Browser.onPC){
            this.onResConfigFinish();
        }
        */

        this.onResConfigFinish(); 
    }

    /**
     * 资源配置下载完毕
     */
    private onResConfigFinish(): void {
        var self = this;
        Laya.loader.load(ResManager.RES_CONFIG_FILENAME,Laya.Handler.create(null,function(data){
            if(data){
                //解析json获取需要下载和加载的文件列表
                self.resConfig = ResManager.parseGetFiles(data);

                if(Laya.Browser.onMiniGame){
                    self.doPreload();
                }else if(Laya.Browser.onPC){
                    //PC上直接加载
                    self.doPreload();
                }
            }else{
                ShowMsg("获取资源信息失败,请重试",["重试"],Laya.Handler.create(self, self.start));
            }
        },null, false),null,Laya.Loader.JSON);
    }

    /**
     * 更新
     */
    private doUpdate(): void {
        this.updater.update(this.resConfig, Laya.Handler.create(this, this.onUpdateFinish, null, false), Laya.Handler.create(this, this.onUpdateProgress, null, false));
    }

    /**
     * 预加载
     */
    private doPreload(): void {
        if(!(this.resConfig instanceof Array)){
            this.onPreloadProgress(1);
            this.onPreloadFinish(true);
            return;
        }
        
        if(this.resConfig.length == 0){
            this.onPreloadProgress(1);
            this.onPreloadFinish(true);
            return;
        }

        Laya.loader.load(this.resConfig, Laya.Handler.create(this,this.onPreloadFinish, null, false), Laya.Handler.create(this, this.onPreloadProgress, null, false));
    }

    /**
     * 清理资源
     */
     private doClear(): void {
        
     }

    /**
     * 更新完毕
     * @param isSuccess 
     */
    private onUpdateFinish(isSuccess: boolean): void {
        GameLogger.Log("ResLoader onUpdateFinish:" + isSuccess);
        this.event(ResLoader.EVENT_UPDATE_FINISH,isSuccess);
        var self = this;
        if(isSuccess){
            this.doPreload();
        }else{
            ShowMsg("更新资源失败，请保证网络通畅然后重试",["重试"],Laya.Handler.create(null,function(){
                self.doUpdate();
            }));
        }
    }

    private onUpdateProgress(value: number): void {
        GameLogger.Log("ResLoader onUpdateProgress:" + value);
        this.event(ResLoader.EVENT_UPDATE_PROGRESS,value);
    }

    private onPreloadFinish(isSuccess: boolean): void {
        GameLogger.Log("ResLoader onPreloadFinish:" + isSuccess);
        this.event(ResLoader.EVENT_PRELOAD_FINISH,isSuccess);
    }

    private onPreloadProgress(value: number): void {
        GameLogger.Log("ResLoader onPreloadProgress:" + value);
        this.event(ResLoader.EVENT_PRELOAD_PROGRESS,value);
    }
}