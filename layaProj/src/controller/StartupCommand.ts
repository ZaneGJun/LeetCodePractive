
class StartupCommand extends puremvc.MacroCommand {
    public constructor() {
        super();
    }

    public initializeMacroCommand(): void {
        //注册初始消息
        this.addSubCommand(ControllerPrepCommand);
        this.addSubCommand(ModelPrepCommand);
        this.addSubCommand(ViewPrepCommand);
    }

    public execute(notification: puremvc.INotification): void {
        super.execute(notification);
        //进入登录场景
        this.sendNotification(SceneCommand.SWITCH_SCENE, {from: SceneEnum.NONE, to: SceneEnum.LOGIN});
    }
}