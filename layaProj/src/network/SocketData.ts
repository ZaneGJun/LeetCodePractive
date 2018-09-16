

 /**
     cleint to server
     {
        'cmd': '',#命令号，字符串
        'sub_cmd': '',#子命令号，字符串
        'args': '',#参数，json串
        'session_id': '',#连接号，字符串或者int都行，服务器原样返回
        'session_code': '',#wx.login的返回值，字符串
        'user_id': '',#玩家号，字符串，刚开始客户端没有发空串，服务器会根据session_code返回
        'ctrl': '',#控制字段，json字符串或者空串，暂时用不到吧，客户端没有向服务器控制的必要
        'client_ver': 客户端版本号
    }

    server to client
    {
        'session_id': '',#字符串或者int都行，服务器原样返回，用于区分请求
        'ret': '{"xx"：xxx}',#json字符串，内容对于不同命令不一样
        'ctrl': '{"code":'', 'details': ''}',#json字符串，主要用于控制，大部分情况下为空串，可以忽略，否则当成特殊包来处理，比如鉴权失败之类的，客户端要重新发起鉴权逻辑
    }

    流指令
    {
        'cmd': '',#命令号，字符串
        'sub_cmd': '',#子命令号，字符串
        'args': '',#参数，json串
        'session_id': '',#连接号，字符串或者int都行，服务器原样返回
        'ctrl': '',#控制字段，json字符串或者空串，暂时用不到吧，客户端没有向服务器控制的必要
    }
 */

//客户端->服务端
interface C2SData {
    "cmd": string,
    "sub_cmd": string,
    "args": any,
    "session_id": number,
    "session_code": string,
    "user_id": string,
    "ctrl": any,
    "client_ver": string,
}

//服务端->客户端普通命令
interface S2CData {
    "session_id": number,
    "ret": any,
    "ctrl": any,
}

//服务端->客户端流命令
interface S2CStreamData {
    "cmd": string,
    "sub_cmd": string,
    "args": any,
    "session_id": number,
    "ctrl": any,
}

/**
 * 负责对网络消息进行处理
 */
class SocketData{

    /**
     * encode
     * @param cmd 
     * @param subCmd 
     * @param args 
     * @param sessionId 
     * @param sessionCode 
     * @param userId 
     * @param ctrl 
     */
    public static encode(cmd: any, subCmd: any, args: any, sessionId: any, sessionCode: any, userId: any, ctrl: any, clientVer: any): any{
        return SocketData.encodeJson(cmd, subCmd, args, sessionId, sessionCode, userId, ctrl, clientVer);
    }

    /**
     * 转化为json格式的协议
     * @param cmd 
     * @param subCmd 
     * @param args 
     * @param sessionId 
     * @param sessionCode 
     * @param userId 
     * @param ctrl 
     */
    private static encodeJson(cmd: string, subCmd: string, args: any, sessionId: number, sessionCode: string, userId: string, ctrl: string, clientVer: string): string{
        if(args == null || args == "undefined")
            args = {};

        var d: C2SData = {
            cmd: cmd,
            sub_cmd: subCmd,
            args: args,
            session_id: sessionId,
            session_code: sessionCode,
            user_id: userId,
            ctrl: ctrl,
            client_ver: clientVer,
        }

        return JSON.stringify(d);
    }

    /**
     * decode
     * @param data 
     */
    public static decode(data: any): any{
        return SocketData.decodeJson(data);
    }

    /**
     * 解析json
     * @param jsonData 
     */
    private static decodeJson(jsonData: string): any{
        var decodeData = JSON.parse(jsonData);
        return decodeData;
    }
}