
interface MiniUserInfo{
    //昵称
    nickName: string,
    //头像url
    avatarUrl: string,
    //性别 未知：0  男：1   女：2
    gender: number,
    //国家
    country: string,
    //省
    province: string,
    //城市
    city: string
}

class WxUtils extends Laya.EventDispatcher{

    private static _instance: WxUtils;
    public static getInstance(): WxUtils {
        if(WxUtils._instance == null){
            WxUtils._instance = new WxUtils();
        }
        return WxUtils._instance;
    }

    private constructor(){
        super();
    }

    public static EVENT_WX_LOGIN_RET = "EVENT_WX_LOGIN_RET";

    public static miniSessionCode = "";
    public static miniSessionKey = "";
    public static miniOpenId = "";

    public static miniUserInfo: MiniUserInfo = {
        nickName : "",
        avatarUrl : "",
        gender : 0,
        country : "",
        province : "",
        city: ""
    };

    /** 微信GC */
    public static triggerGC(): void {
        var isWX = Laya.Browser.onWeiXin;
        if(isWX){
            wx.triggerGC();
        }
    }
    
    public static dologin(): void {
        var isWX = Laya.Browser.onWeiXin;
        if(isWX){
            wx.login({
                success:function(res){
                    GameLogger.Log("WX login retCode:" + res.code);
                    WxUtils.miniSessionCode = res.code;
                    WxUtils.doGetUserInfo();
                },
                fail:function(res){
                    GameLogger.Log("WX login fail");
                    GameLogger.Log(res);
                },
                complete:function(res){
                    GameLogger.Log("WX login complete");
                    GameLogger.Log(res);
                }
            });
        }else{

        }
    }

    public static doAuthorize(scopeStr: string): void {
         var isWX = Laya.Browser.onWeiXin;
        if(isWX){
            wx.authorize({
                scope: scopeStr,
                success:function(res){
                    //授权成功
                    //WxUtils.doGetUserInfo();
                },
                fail: function(res){
                    //用户取消授权
                    if (res.errMsg.indexOf('auth deny') > -1 || res.errMsg.indexOf('auth denied') > -1 ) {
                    }
                },
                complete: function(res){

                }
            });
        }
    }

    public static doGetUserInfo(): void {  
        var isWX = Laya.Browser.onWeiXin;
        if(isWX){
             wx.getUserInfo({
                withCredentials:true,
                success: function(res) {
                    GameLogger.Log("GetUserInfo Ret:" + res);
                    var userinfo = res.userInfo
                   
                    //微信获取用户信息返回
                    WxUtils.miniUserInfo.nickName = userinfo.nickName;
                    WxUtils.miniUserInfo.avatarUrl = userinfo.avatarUrl;
                    WxUtils.miniUserInfo.gender = userinfo.gender;
                    WxUtils.miniUserInfo.country = userinfo.country;
                    WxUtils.miniUserInfo.province = userinfo.province;
                    WxUtils.miniUserInfo.city = userinfo.city;
                    
                    var encryptedData = res.encryptedData;
                    var iv = res.iv;
                    var rawData = res.rawData;
                    var signature = res.signature;

                    WxUtils.getInstance().event(WxUtils.EVENT_WX_LOGIN_RET, [{
                        sessionCode : WxUtils.miniSessionCode,
                        signature: signature,
                        rawData: rawData,
                    }]);
                },
                fail:function(res){
                    console.log("wx.getUserInfo fail");
                    console.log(res);
                    //用户取消授权
                    if (res.errMsg.indexOf('auth deny') > -1 || res.errMsg.indexOf('auth denied') > -1 ) {
                        ShowMsg("为了您的正常登录,请到【右上角菜单->关于->右上角菜单->设置】中打开相应权限后重试",["重试"],Laya.Handler.create(null,function(){
                            WxUtils.doGetUserInfo();
                        }))
                    }
                }
            });
        }
    }

    public static get wxAvail(): boolean {
        return typeof (wx) != "undefined";
    }
    public static FIXED_ODT_CANVAS_WIDTH = 720;
    public static init(): void {
        if (this.wxAvail) {
            /*
            if (wx.getOpenDataContext)
            {
                var canvas = wx.getOpenDataContext().canvas;
                canvas.width = this.FIXED_ODT_CANVAS_WIDTH;
                canvas.height = canvas.width*DESIGN_HEIGHT/DESIGN_WIDTH;
            }
            
            if (wx.onShareAppMessage)
            {
                LKShareMgr.getShareTxtImg(
                    function(id: number, txt: string, img: string){
                        wx.onShareAppMessage(() => {
                            // 用户点击了“转发”按钮
                            return {
                                title: txt,
                                imageUrl: img,
                                query: '?wie_ShareAdId='+id,
                            }
                        })
                    },
                    function(){
                        wx.onShareAppMessage(() => {
                            // 用户点击了“转发”按钮
                            return {
                                title: '手快还是脑快？来翻个牌就知道！',
                                imageUrl:ResManager.getResDir("f_pk_fenxiang_wd.jpg", ResManager.RES_TYPE_LOCAL)
                            }
                        })
                    }
                )
            }
            if (wx.showShareMenu)
            {
                wx.showShareMenu(
                    {
                    }
                )
            }
            */
        }
    }

    /*
    public static share(msg: {title: string, imagePath?: string, shareId?: string}, success: Function, fail: Function) {
        if (this.wxAvail) {
            if (wx.updateShareMenu && wx.shareAppMessage) {
                wx.updateShareMenu({
                    withShareTicket: true,
                    success: function () {
                        wx.shareAppMessage({
                            title: msg.title,
                            query: msg.shareId?('wie_ShareAdId='+msg.shareId):"",
                            imageUrl: msg.imagePath,
                            success: function (res) {
                                success();
                            },
                            fail: function () {
                                fail();
                            }
                        });
                    },
                    fail: function (err) {
                        // console.log('shareBattle e', e)
                        fail();
                    }
                });
            }
        }
        else {
            Laya.stage.addChild(new ShareEmuUI(success, fail));
        }
    }

    // 显示微信小游戏排行榜
    public static createRankSprite(): WxRankSprite
    {
        if (this.wxAvail) {
            var sharedCanvasSprite = new WxRankSprite();
            return sharedCanvasSprite;
        }
        else
        {
            return null;
        }
    }

    public static sendPost2OpenDataContext(data: any)
    {
        if (WxUtils.wxAvail) {
            if (wx.getOpenDataContext)
            {
                wx.getOpenDataContext().postMessage(data);
            }
        }
    }

    public static recharge(price : number){
        if (WxUtils.wxAvail) {
            if (wx.requestMidasPayment) {
                var rechargeInfo = {
                    "mode": "game",
                    "env": 1,	
                    "offerId": "1450016265",
                    "currencyType": "CNY",	
                    "platform": "android",
                    "zoneId" : "1",
                    "buyQuantity": price * 10,
                    "success":	function(){
                        //GameConnection.instance.sendData(new c2s.login_pay_get_balance.request());
                        var request = new c2s.game_flipCardGame_dimondExchangeChip.request();
                        request.diamond = price * 10;
                        request.room_id = QmFlopManager.instance.getCurRoomId();
                        request.table_id = QmFlopManager.instance.getCurTableId();
                        GameConnection.instance.sendData(request);
                    },
                    "fail": function (res : any){
                        if (res.errMsg)	{
                            console.log("--- recharge errMsg : " + res.errMsg);
                        }
                        if (res.errCode) {
                            console.log("--- recharge errCode : " + res.errCode);
                        }
                    },
                };
                wx.requestMidasPayment(rechargeInfo);
            }
        }
    }
    */

    public static getSystemInfo(callback ?: (data)=>void): void {
        if (WxUtils.wxAvail){
            if (wx.getSystemInfo){
                wx.getSystemInfo({
                    success : function(data){
                        if (callback != null) {
                            callback(data);
                        }
                    },
                    fail : function(){
                        console.log("获取系统信息失败")
                    }
                })
            }
        }
    }
}