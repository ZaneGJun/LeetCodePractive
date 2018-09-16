/**
 * 处理协议消息
 */
class ClientPacket{

    /**
     * 处理服务器返回的非回调消息
     * @param data 
     */
    public static onPacket(data: any): void {
        //
    }

    public msgHandle:{[main: string]: {[sub: string]: Function}} = {
        
    }
    
}