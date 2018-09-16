/**
 * 声音播放相关
 */
class SoundCommand extends puremvc.SimpleCommand {
    public static NAME: string = "SoundCommand";
    public constructor() {
        super();
    }   

    /**
     * 播放音效
     */
    public static PLAY_EFFECT: string = "PLAY_EFFECT"; 

    /**
     * 播放音乐
     */
    public static PLAY_MUSIC: string = "PLAY_MUSIC";

    /**
     * 注册消息
     */
    public static register(): void {
        GameFacade.getInstance().registerCommand(SoundCommand.PLAY_EFFECT, SoundCommand);
    }

    public execute(notification: puremvc.INotification): void {
        switch(notification.getName()) {
            case SoundCommand.PLAY_EFFECT: {
                var body: string = notification.getBody();
                if(body === "hit"){
                    var r = Math.floor(Math.random() * 4);
                    if(r === 1 || r === 0)
                        Laya.SoundManager.playSound(ResManager.getResDir("sound/daji1.mp3",RES.LOCAL), 1);
                    else if(r === 2)
                        Laya.SoundManager.playSound(ResManager.getResDir("sound/daji2.mp3",RES.LOCAL), 1);
                    else if(r === 3)
                        Laya.SoundManager.playSound(ResManager.getResDir("sound/daji3.mp3",RES.LOCAL), 1);
                    else if(r === 4)
                        Laya.SoundManager.playSound(ResManager.getResDir("sound/daji4.mp3",RES.LOCAL), 1);
                }else if(body === "bomb"){
                    Laya.SoundManager.playSound(ResManager.getResDir("sound/bomb.mp3",RES.LOCAL), 1);
                }else if(body === "appear"){
                    Laya.SoundManager.playSound(ResManager.getResDir("sound/in.mp3",RES.LOCAL), 1);
                }
                break;
            }
        }
    }
}