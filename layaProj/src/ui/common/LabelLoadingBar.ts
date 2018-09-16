/**
 * 带Label的LoadingBar
 */
class LabelLoadingBar extends Laya.ProgressBar {
    public constructor(skin?: string) {
        super(skin);
        this.init();
    }

    public static EVENT_LOAD_FINISH: string = "EVENT_LOAD_FINISH";
    public static EVENT_LOAD_PROGRESS: string = "EVENT_LOAD_PROGRESS";

    protected _label: Laya.Label;
    public get loadingContent(): Laya.Label {
        return this._label;
    }

    protected _labelPrecent: Laya.Label;

    protected _destValue: number;
    public get destValue(): number {
        return this._destValue;
    }

    //最小value差值
    protected MIN_SUB_VALUE: number = 0.08;
    protected status;   //0:等待 1:正在运行动画

    public init(): void {
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        this.sizeGrid = "5,10,5,10";
        this.width = 553;
        this.height = 35;

        this.bg.width = 553;
        this.bg.height = 35;
        this.bg.anchorY = 0.5;
        this.bar.anchorY = 0.5;
        this.bar.pos(0, 0);

        this._label = new Laya.Label();
        this._label.anchorX = 1
        this._label.anchorY = 0.5
        this._label.fontSize = 25;
        this._label.color = "#0000000";
        this._label.valign = "middle";
        this._label.align = "center";
        this._label.pos(this.width/2.0, 0);
        this.addChild(this._label);

        this._labelPrecent = new Laya.Label();
        this._labelPrecent.anchorX = 0
        this._labelPrecent.anchorY = 0.5
        this._labelPrecent.fontSize = 25;
        this._labelPrecent.color = "#0000000";
        this._labelPrecent.valign = "middle";
        this._labelPrecent.align = "center";
        this._labelPrecent.pos(this.width/2.0, 0);
        this.addChild(this._labelPrecent);

        this.status = 0;
    }

    /**
     * 缓动改变进度条值
     * @param goToValue 
     */
    public goToValueAni(goToValue: number): void {
        if(goToValue < 0) goToValue = 0;

        if(goToValue != this.value){
            if((goToValue < this.value) || ((Math.abs(this._destValue - this.value) <= this.MIN_SUB_VALUE))){
                //goToValue比当前值小或者改变得太少，直接设置为goToValue并停止定时器
                this._destValue = goToValue;
                this.value = goToValue;
                this.clearTimer(this, this.goToValueAniLoop);
                this.status = 0;
            }else{
                this._destValue = goToValue; 
                if(this.status == 0){
                    Laya.timer.loop(this.MIN_SUB_VALUE*100, this, this.goToValueAniLoop);
                    this.status = 1;
                }
            }
        }
    }

    private goToValueAniLoop(): void {
        if(this.value < this.destValue){
            this.value += this.MIN_SUB_VALUE;
            var valuestr = Number(this.value*100).toFixed(2);
            this._labelPrecent.text = valuestr + "%";
            this.event(LabelLoadingBar.EVENT_LOAD_PROGRESS, this.value);
        }else{
            this.endAniLoop();
        }
    }

    private endAniLoop(): void {
        Laya.timer.clear(this, this.goToValueAniLoop);
        this.status = 0;
        this.event(LabelLoadingBar.EVENT_LOAD_FINISH, this.value);
    }
}