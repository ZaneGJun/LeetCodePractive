
class ControllerPrepCommand extends puremvc.SimpleCommand implements puremvc.ICommand{
    public constructor() {
        super();
    }

    public execute(notification: puremvc.INotification): void {
        //注册初始消息
        SceneCommand.register();
        LoginCommand.register();
        SoundCommand.register();
    }
}