
//协议命令
class CMD{
    //主命令
    public static MAIN = {
        "auth": "auth",

        "rotary": "rotary",

        "home": "home",

        "conf": "conf",
    }

    //子命令
    public static SUB = {
        //登陆
        "do_auth": "do_auth",

        //转盘
        "pre_reward": "pre_reward",
        "get_reward": "get_reward",

        //家园
        "home_info": "home_info",
        "clean_area_pos": "clean_area_pos",
        "upgrade_area_pos": "upgrade_area_pos",
        "upgrade_area": "upgrade_area",

        //拉取配置文件
        "get_conf": "get_conf",
    }
}

//----------------------协议结构--------------------------
//认证信息
interface AuthData {
    "session_code": string,
    "signature": string,
    "rawData": string,
}

interface UpgradeArea{
    
}