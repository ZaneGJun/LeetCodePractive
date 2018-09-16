

//设计分辨率
var DESIGN_WIDTH = 720
var DESIGN_HEIGHT = 1280

var loginAddr: string = "ws://10.251.141.140:5000";//"ws://192.168.42.124:5000"

var clientVer: string = "100000000"

var g_CurScene: UIScene;
/**
 * 切换场景
 * @param scene 要切换的场景 
 */
function switchToScene(scene: UIScene)
{
    g_CurScene = scene;
    UIScene.destroyAllScenesExcept(scene);
    Laya.stage.addChild(scene);
}

function getRunningScene(): UIScene
{
    return g_CurScene;
}

/**
 * 显示消息
 * @param msg 
 * @param btnText 
 * @param sureCallback 
 * @param cancleCallback 
 * @param msgName 
 */
function ShowMsg(msg: string, btnText?: string[], sureCallback?: Laya.Handler, cancleCallback?: Laya.Handler, msgName?: string): void {
    GameLogger.Log(msg);
}

/////////////////////////////////////////////////
// EventDispatcherEx
// 对于Laya.Node实例，在其destroy时自动off掉所有其监听的event，以免出现问题
function _evnt_destroy(destroyChild?: boolean): void
{
    var _evnt_ons = this["_evnt_ons"] as {ed: Laya.EventDispatcher, type:string, caller: any, listener: Function}[];
    for (var i=0, c=_evnt_ons.length; i<c; ++i)
    {
        var theon = _evnt_ons[i];
        theon.ed.off(theon.type, theon.caller, theon.listener);
    }
    this._old_destroy(destroyChild);
}

Laya.Node.prototype["_old_getChildByName"]=Laya.Node.prototype["getChildByName"];
Laya.Node.prototype["getChildByName"]=function(name){
    var nodes=this._childs;
    if(nodes==null){
        return null;
    }else{
        return this["_old_getChildByName"](name);
    }
}

Laya.EventDispatcher.prototype["_old_createListener"] = Laya.EventDispatcher.prototype["_createListener"];
Laya.EventDispatcher.prototype["_createListener"]=function(type,caller,listener,args,once,offBefore){
    // 对于Node实例，更改其destroy方法以自动off
    if (caller instanceof Laya.Node)
    {
        if (!caller["_event_modified"])
        {
            caller["_event_modified"] = true;
            caller["_evnt_ons"] = [] as {type:string, caller: any, listener: Function}[];
            caller["_old_destroy"] = caller.destroy;
            caller.destroy = _evnt_destroy;
        }
        var _evnt_ons = caller["_evnt_ons"] as {ed: Laya.EventDispatcher, type:string, caller: any, listener: Function}[];
        _evnt_ons.push({ed: this, type: type, caller: caller, listener: listener});
    }
    return this._old_createListener(type, caller, listener, args,once,offBefore);
}

