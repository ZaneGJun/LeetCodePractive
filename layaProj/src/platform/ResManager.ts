

enum RES {
    LOCAL,  //本地
    GAME,   //远程加载
} 
  
/**
 * 资源管理
 */
class ResManager{
    public constructor() {

    }

    /**
     * 微信4M包中资源根目录
     */
    public static WX_LOCAL_RES_ROOT: string = "wxlocal/";
    /**
     * 微信50M缓存资源空间中的资源根目录
     */
    public static WX_EXTERNAL_RES_ROOT: string = "game/";
    /**
     * 远程资源地址
     */
    public static URL_BASE = "http://10.251.141.105/wechat_game/trunk/cdn_res/";//"http://localhost/wxres/";
    /**
     * 资源文件配置文件名
     */
    public static RES_CONFIG_FILENAME = "res.json";
    /**
     * 
     */
    public static RES_TYPE_GAME = "game";
    /**
     * 
     */
    public static RES_TYPE_LOCAL = "local";

    /**
     * 初始化
     */
    public static init(): void {
        
    }

    /**
     * 获取资源地址的统一接口
     * @param path 相对资源地址
     * @param type RES枚举
     */
    public static getResDir(path: any, type: RES = RES.GAME): any
    {
        if(!path) return "";

        var baseDir: string = ResManager.WX_EXTERNAL_RES_ROOT;
        if(type == RES.LOCAL)
        {
            baseDir = ResManager.WX_LOCAL_RES_ROOT;
        }

        if(path instanceof Array){
            var dirArr: string[] = [];
            for(var i=0; i< path.length; i++){
                var item = path[i];
                var fullRes = baseDir + item;
                dirArr.push(fullRes);
            }
            return dirArr;
        }else{
            return baseDir + path;
        }
    }
    
    /**
     * 获取文件类型
     * @param url 
     */
    public static getTypeFromUrl(url): string
    {
        var type = Laya.Utils.getFileExtension(url);
		if (type)
            return Laya.Loader.typeMap[type];
		console.warn("Not recognize the resources suffix",url);
		return "text";
    }   

    public static isImage(url)
    {
        var type = ResManager.getTypeFromUrl(url);
        if(type==="image" || type==="htmlimage" || type==="nativeimage") 
            return true;
        return false;
    }

    public static isSound(url){
        var type = ResManager.getTypeFromUrl(url);
        if(type==="sound")
            return true;
        return false;
    }

    public static getImageAndSoundFiles(arry: string[]): string[]
    {
        var result: string[]= [];
        for(var i=0;i < arry.length; i++){
            var item = arry[i];
            if(ResManager.isImage(item) || ResManager.isSound(item)){
                result.push(item);
            }
        }
        return result;
    }

    public static getOtherFiles(arry: string[]): string[]
    {
        var result: string[]= [];
        for(var i=0;i < arry.length; i++){
            var item = arry[i];
            if(!ResManager.isImage(item) || !ResManager.isSound(item)){
                result.push(item);
            }
        }
        return result;
    }

    /**
     * 解析json
     * @param jsonData 
     */
    public static parseGetFiles(jsonData: any): string[] {
        if(jsonData != null && jsonData["game"] != "undefined") {
            return jsonData["game"];
        }
        return [];
    }

    /**
     * 下载图片和声音资源
     * @param url 地址 
     * @param competeCallback 完成回调
     * @param progressCallback 进度回调
     */
    public static downloadImageOrSoundFile(url: any, competeCallback?: Laya.Handler, progressCallback?: Laya.Handler)
    {
        Laya.loader.load(url, competeCallback, progressCallback);
    }

    /**
     * 下载非图片和声音资源
     * @param url 地址
     * @param competeCallback 完成回调
     * @param progressCallback 进度回调
     */
    public static downloadOtherFile(url: any, competeCallback?: Laya.Handler, progressCallback?: Laya.Handler)
    {
        if(url instanceof Array)
        {
            ResManager._downloadOtherFileAssets(url, competeCallback, progressCallback);
            return;
        }

        var formatUrl = Laya.URL.formatURL(url);
        var type = ResManager.getTypeFromUrl(formatUrl);
        Laya.MiniAdpter.downLoadFile(formatUrl, type, Laya.Handler.create(null, function(retCode){
            if(competeCallback){
                competeCallback.runWith([retCode]);
            }
        },[],false));
    }

    /**
     * 处理多个下载
     * @param arr 下载arr 
     * @param competeCallback 完成回调 
     * @param progressCallback 进度回调
     */
    private static _downloadOtherFileAssets(arr, competeCallback: Laya.Handler, progressCallback: Laya.Handler )
    {
        var itemCount=arr.length;
		var loadedCount=0;      //下载的个数
		var success=true;
		for (var i=0;i < itemCount;i++)
        {
			var item=arr[i];
            item = Laya.URL.formatURL(item);
			var completeHandler = (competeCallback || progressCallback) ? Laya.Handler.create(null,loadComplete,[item],false):null;
			ResManager.downloadOtherFile(item, completeHandler);
		}
		function loadComplete (data, retCode){
            if(retCode != 2){   //2代表progress
                loadedCount++;

                GameLogger.Log("ResManager downloadOtherFilesAssets retCode:" + retCode);
                if(retCode != 0){
                    GameLogger.Log("ResManager downloadOtherFilesAssets failed");
                    success = false;
                }

                if(progressCallback != null){			
                    var v = loadedCount / itemCount;
                    progressCallback.runWith([v, data]);
                }
                
                if (loadedCount == itemCount && competeCallback){
                    competeCallback.runWith([success]);
                }
            }
		}
    }
}