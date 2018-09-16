/**
 * 微信小游戏更新
 */
class WXResUpdater{
    constructor(){
        this.totalCount = 0;
        this.imageAndSoundList = [];
        this.otherFileList = [];
        this.curTryCount = 0;
    }

    private MAX_RETRY_COUNT: number = 1;
    private curTryCount: number;

    public totalCount: number;
    public imageAndSoundList;
    public otherFileList;
    public progress: number;

    private competeHandler: Laya.Handler;
    private progressHandler: Laya.Handler;

    /**
     * 资源更新
     * @param updateList 
     * @param competeHanlder 
     * @param progressHandler 
     */
    public update(updateList: any, competeHanlder?: Laya.Handler, progressHandler?: Laya.Handler): void
    {
        this.curTryCount = 1;
        this.competeHandler = competeHanlder;
        this.progressHandler = progressHandler;

        if(!(updateList instanceof Array)){
            this.notifyProgress(1);
            this.notifyCompete(true);
            return;
        }
        
        if(updateList.length == 0){
            this.notifyProgress(1);
            this.notifyCompete(true);
            return;
        }

        this.totalCount = updateList.length;

        //区分image、sound和其他类型
        for(var i=0; i < updateList.length; i++)
        {
            var item = updateList[i];
            if((typeof item == 'string')){
                if (ResManager.isImage(item) || ResManager.isSound(item))
                    this.imageAndSoundList.push(item);
                else
                    this.otherFileList.push(item);
            }
        }

        this.doUpdateImageAndSound();
    }

    /**
     * 更新图片和音效
     */
    private doUpdateImageAndSound(): void {
        GameLogger.Log("ResUpdater start doUpdateImageAndSound");
        if(this.imageAndSoundList.length == 0){
            this.loadImageAndSoundCompete(true);
            return;
        }

        ResManager.downloadImageOrSoundFile(this.imageAndSoundList, Laya.Handler.create(this, this.loadImageAndSoundCompete), Laya.Handler.create(this, this.loadImageAndSoundProgress, null, false));
    }

    private loadImageAndSoundCompete(isSuccess: boolean): void {
        GameLogger.Log("ResUpdater loadImageAndSoundCompete:" + isSuccess);
        if(isSuccess){
            this.doUpdateOtherFile();
        }else{
            if(this.curTryCount >= this.MAX_RETRY_COUNT){
                //达到最大重试次数
                this.notifyCompete(false);
                return;
            }else{
                this.curTryCount++;
                this.doUpdateImageAndSound();
            } 
        }
    }

    private loadImageAndSoundProgress(progress: number): void {
        var realCount = progress * this.imageAndSoundList.length;
        this.progress = realCount / this.totalCount;
        this.notifyProgress(this.progress);
    }

    /**
     * 更新非图片音效资源
     */
    private doUpdateOtherFile(): void{
        GameLogger.Log("ResUpdater start doUpdateOtherFile");
        if(this.otherFileList.length == 0){
            this.loadOtherCompete(true);
            return;
        }

        ResManager.downloadOtherFile(this.otherFileList, Laya.Handler.create(this, this.loadOtherCompete), Laya.Handler.create(this, this.loadOtherProgress, null, false));
    }

    private loadOtherCompete(isSuccess: boolean): void {
        GameLogger.Log("ResUpdater loadOtherCompete:" + isSuccess);
        if(isSuccess){
            var result = (this.progress == 1) ? true : false;
            this.notifyCompete(result);
        }else{
            if(this.curTryCount >= this.MAX_RETRY_COUNT){
                //达到最大重试次数
                this.notifyCompete(false);
                return;
            }else{
                this.curTryCount++;
                this.doUpdateOtherFile();
            } 
        }
    }

    private loadOtherProgress(progress: number): void {
        var realCount = progress * this.otherFileList.length;
        this.progress = (this.imageAndSoundList.length + realCount) / this.totalCount;
        this.notifyProgress(this.progress);
    }

    private notifyProgress(value: number): void {
        if(this.progressHandler)
            this.progressHandler.runWith(value);
    }

    private notifyCompete(isSuccess: boolean): void {
        if(this.competeHandler)
            this.competeHandler.runWith(isSuccess);
    }
}