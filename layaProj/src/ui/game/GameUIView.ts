
enum GameUIStatus{
    IDLE,      //空闲状态，可以发射飞刀
    PRE_NEW_KNIFE,   //正在准备新飞刀的状态，不可发射

    START_BOMB,      //开始爆炸
    BOMBING,         //插满飞刀，播放爆炸效果，不可发射

    REQ_PRE_REWARD,    //开始请求开始信息
    WAITING_PRE_REWARD_RET,//正在等待开始信息
    END_REQ_PRE_REWARD,//结束请求开始信息

    RE_START,        //重新开始
    RE_STARTING,     //正在重新开始

    REQ_GET_REWARD,     //开始请求奖励
    WAIT_GET_REWARD_RET,    //正在等待请求奖励返回
    END_REQ_GET_REWARD,     //结束请求奖励

    SHOW_BIG_AWARD,     //显示大奖励
}

/** 飞刀界面 */
class GameUIView extends ui.game.GameUI {
    public constructor(){
        super();
        this.init();
    }

    public static EVENT_TURNTABLE_BE_HIT: string = "EVENT_TURNTABLE_BE_HIT";
    public static EVENT_TURNTABLE_BOMB: string = "EVENT_TURNTABLE_BOMB";
    public static EVENT_TURNTABLE_APPEAR: string = "EVENT_TURNTABLE_APPEAR";

    public static EVENT_REQ_PRE_REWARD: string = "EVENT_REQ_PRE_REWARD";
    public static EVENT_REQ_GET_REWARD: string = "EVENT_REQ_GET_REWARD";

    public destroy(destroyChild?: boolean)
    {
        GameFacade.getInstance().removeMediator(GameUIViewMediator.NAME);

        //停止物理引擎和渲染
        if(this.engineRender != null){
            this.LayaRender.stop(this.engineRender);
        }
        if(this.engine != null){
            this.Matter.Engine.clear(this.engine);
        }

        super.destroy(destroyChild);
    }

    private Matter: any = Laya.Browser.window.Matter;
	private LayaRender: any = Laya.Browser.window.LayaRender;
    //物理引擎引用
    private engine: any;
    private engineRender: any;
    //转盘
    private turntable: any;
    private turntableBody: any;
    //当前带发射飞刀
    private curKnife: any;

    private turntablePos: {x: number, y: number};
    private turntableRadius: number;
    private turntableTexturePath: string;
    //转盘旋转速度
    private turntableRotateSpeed: number;
    //转盘被击中偏移值
    private turntableHitOffset: {x: number, y: number};
    //转盘被击中动作持续时间
    private turntableHitAniDuration: number;
    //转盘简单状态值， 0： 正常  1：正在做被击中动作
    private turntableStatus: number;

    //刀位置
    private knifeStartPos: {x: number, y: number};
    private knifeSize: {width: number, height: number};
    //飞刀发射力
    private knifeShootForce: {x: number, y: number};
    private knifeTexturePath: string;
    //刀准备发射移动速度
    private knifePreSpeed: number;
    //停止转动的刀
    private stopKnifes: any[];
    //最多可有飞刀数
    private maxKnife: number;
    //转盘炸开持续时间
    private bombDuration: number;
    //重力
    private worldGravity: number;

    private _status: GameUIStatus;
    public get status(): GameUIStatus{
        return this._status;
    }

    public init(): void {
        //转盘位置
        this.turntablePos = {
            x: this.width / 2,
            y: 400,
        }
        //转盘半径
        this.turntableRadius = 180;
        this.turntableTexturePath = ResManager.getResDir("main/img_turntable.png", RES.GAME);
        //转盘旋转速度
        this.turntableRotateSpeed = 0.04;
        //转盘被击中动作位移
        this.turntableHitOffset = {
            x: 0,
            y: -5,
        }
        //转盘击中动作持续时间
        this.turntableHitAniDuration = 75;
        //转盘status
        this.turntableStatus = 0;

        //飞刀待发射位置
        this.knifeStartPos = {
            x: this.width / 2,
            y: 1000,
        }
        //飞刀碰撞区大小
        this.knifeSize = {
            width: 40,
            height: 100,
        }
        //飞刀skin
        this.knifeTexturePath = ResManager.getResDir("main/img_kinfe.png", RES.GAME);
        //飞刀准备动作移动速度
        this.knifePreSpeed = -100;
        //飞刀发射力
        this.knifeShootForce = {
            x: 0,
            y: -0.8,
        }

        this.stopKnifes = [];
        //最多可以插中飞刀数量
        //this.maxKnife = Math.floor(Math.random()*4 + 4);
        this._status = GameUIStatus.IDLE;

        //转盘炸开持续时间(毫秒)
        this.bombDuration = 1000;
        //物理重力
        this.worldGravity = 2.5;

        this.initMatter();
        this.initWorld();
        
        GameFacade.getInstance().registerMediator(new GameUIViewMediator(this));
    }

    public changeStatus(status: GameUIStatus) {
        //GameLogger.Log("changeStatus:" + status);
        if(status == this.status)
            return;

        this._status = status;
        switch(status) {
            case GameUIStatus.IDLE: 
            case GameUIStatus.RE_STARTING:
            case GameUIStatus.WAITING_PRE_REWARD_RET:
            case GameUIStatus.END_REQ_PRE_REWARD:
            case GameUIStatus.WAIT_GET_REWARD_RET:
            case GameUIStatus.END_REQ_GET_REWARD:
            {
                break;
            }
            case GameUIStatus.PRE_NEW_KNIFE: {
                this.prepareNewKnife();
                break;
            }
            case GameUIStatus.START_BOMB: {
                this.turntableStartBomb();
                break;
            }
            case GameUIStatus.BOMBING: {
                this.turntableBombing();
                break;
            }
            case GameUIStatus.RE_START: {
                this.startPrepare();
                break;
            }
            case GameUIStatus.REQ_PRE_REWARD: {
                this.reqPreReward();
                break;
            }
            case GameUIStatus.REQ_GET_REWARD: {
                this.reqGetReward();
                break;
            }
            case GameUIStatus.SHOW_BIG_AWARD: {
                this.showBigAward();
                break;
            }
        }
    }

    /**
     * 初始化物理引擎
     */
    private initMatter(): void {
		// 初始化物理引擎
		this.engine = this.Matter.Engine.create(
		{
			enableSleeping: true
		});
		this.Matter.Engine.run(this.engine);

		this.engineRender = this.LayaRender.create(
		{
			engine: this.engine,
			container: this,
			width: this.width,
			height: this.height,
			options:
			{
				wireframes: true,
			}
		});
		this.LayaRender.run(this.engineRender);
	}

	private initWorld(): void {
        Laya.timer.once(500, this, function(){
            //请求新的一局的准备
            this.changeStatus(GameUIStatus.REQ_PRE_REWARD);
        });

        var self = this;
        this.Matter.Events.on(this.engine, 'beforeUpdate', function(event) {
            //转盘旋转
            if(self.turntable != null && self.status != GameUIStatus.BOMBING){
                self.Matter.Composite.rotate(self.turntable, self.turntableRotateSpeed, self.turntablePos);
            }
            
            //刀准备状态
            if(self.status == GameUIStatus.PRE_NEW_KNIFE && self.curKnife != null){
                self.Matter.Body.translate(self.curKnife, {x: 0, y: self.knifePreSpeed});
                if(self.curKnife.position.y <= self.knifeStartPos.y){
                    self.changeStatus(GameUIStatus.IDLE);
                }
            }

            if(self.status == GameUIStatus.REQ_PRE_REWARD)
            {
                //已经开始请求，开始等待返回
                self.changeStatus(GameUIStatus.WAITING_PRE_REWARD_RET);
            }
            else if(self.status == GameUIStatus.END_REQ_PRE_REWARD)
            {
                //请求开始返回，转向开始
                self.changeStatus(GameUIStatus.RE_START);
            }
            else if(self.status == GameUIStatus.REQ_GET_REWARD)
            {
                //已经请求了，开始等待返回
                self.changeStatus(GameUIStatus.WAIT_GET_REWARD_RET);
            }
            else if(self.status == GameUIStatus.END_REQ_GET_REWARD)
            {
                //显示获得建立
                self.changeStatus(GameUIStatus.SHOW_BIG_AWARD);
            }
            else if(self.status == GameUIStatus.START_BOMB)
            {
                //执行炸开状态处理
                self.changeStatus(GameUIStatus.BOMBING);
            }
            else if(self.status == GameUIStatus.BOMBING)
            {
                self.changeStatus(GameUIStatus.REQ_GET_REWARD);
            }
            else if(self.status == GameUIStatus.RE_START)
            {
                //转盘缩放出现
                if(self.turntableBody.layaSprite != null){
                    self.event(GameUIView.EVENT_TURNTABLE_APPEAR);
                    self.changeStatus(GameUIStatus.RE_STARTING);
                    Laya.Tween.to(self.turntableBody.render.sprite, {
                        xScale:self.turntableBody.rScaleX,
                        yScale:self.turntableBody.rScaleY,
                    }, 300, Laya.Ease.backOut, Laya.Handler.create(self, function(){
                         if(this.turntableBody.render.sprite.xScale >= this.turntableBody.rScaleX){
                            //准备完毕
                            this.changeStatus(GameUIStatus.IDLE);
                        }
                    }));  
                }
            }
            
        });

        //监听碰撞开始事件
        this.Matter.Events.on(this.engine, "collisionStart", function(event){
            var pairs = event.pairs;
            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i];
                if(pair.bodyA.label === "turntableBody" && pair.bodyB.label === "knife"){
                    //bodyA是转盘，bodyB是飞刀
                    pair.bodyB.isStatic = true;
                    self.Matter.Composite.addBody(self.turntable, pair.bodyB);
                    self.stopKnifes.push(pair.bodyB);

                    if(self.stopKnifes.length <= self.maxKnife){
                        self.changeStatus(GameUIStatus.PRE_NEW_KNIFE);
                        self.turnTableDoHitAni();
                    }

                }else if(pair.bodyA.label === "knife" && pair.bodyB.label === "turntableBody"){
                    //bodyA是飞刀，bodyB是转盘
                    pair.bodyB.isStatic = true;
                    self.Matter.Composite.addBody(self.turntable, pair.bodyB);
                    self.stopKnifes.push(pair.bodyA);

                    if(self.stopKnifes.length <= self.maxKnife){
                        self.changeStatus(GameUIStatus.PRE_NEW_KNIFE);
                        self.turnTableDoHitAni();
                    }
                }
            }
        });

        //监听碰撞结束事件
        this.Matter.Events.on(this.engine, "collisionEnd", function(event){
            var pairs = event.pairs;
            for(var i=0; i<pairs.length; i++) {
                var pair = pairs[i];
                if((pair.bodyA.label === "turntableBody" && pair.bodyB.label === "knife") || (pair.bodyA.label === "knife" && pair.bodyB.label === "turntableBody")){
                    if(self.stopKnifes.length > self.maxKnife && self.status != GameUIStatus.BOMBING && self.status != GameUIStatus.START_BOMB){
                        self.changeStatus(GameUIStatus.START_BOMB);
                    }
                }
            }
        });
	}

    /**
     * 开始一局的准备
     */
    private startPrepare(): void {
        //清理之前的飞刀
         //遍历所有飞刀，施加从转盘圆心指向飞刀方向的力
        for(var knife of this.stopKnifes) {
            this.Matter.World.remove(this.engine.world, knife);
        }
        this.stopKnifes = [];
        if(this.curKnife != null){

        }
        
        //无重力
        this.engine.world.gravity.y = 0;
        //最多可以插中飞刀数量
        this.maxKnife = Math.floor(Math.random()*5 + 5);

        if(this.turntable == null && this.turntableBody == null){
            //创建转盘
            var ret = this.createTurnTableComposite(this.turntablePos, this.turntableRadius, this.turntableTexturePath);
            this.turntable = ret.t;
            this.turntableBody = ret.b;
            this.Matter.World.add(this.engine.world, this.turntable);
        }else if(this.turntable != null && this.turntableBody == null){
            var body = this.createTurntableBody(this.turntablePos, this.turntableRadius, this.turntableTexturePath);
            this.Matter.Composite.addBody(this.turntable, body);
            this.turntableBody = body;
        }

        if(this.curKnife == null){
            //创建飞刀
            this.curKnife = this.createKnife(this.knifeStartPos, this.knifeSize, this.knifeTexturePath);
            this.Matter.World.add(this.engine.world, this.curKnife);
        }
    }

    /**
     * 请求开始信息
     */
    private reqPreReward(): void {
        this.event(GameUIView.EVENT_REQ_PRE_REWARD);
    }

    /**
     * 请求奖励
     */
    private reqGetReward(): void {
        this.event(GameUIView.EVENT_REQ_GET_REWARD);
    }

    /**
     * 生成新的飞刀
     */
    private prepareNewKnife(): void {
        var newKnife = this.createKnife({x: this.knifeStartPos.x, y: this.knifeStartPos.y + 150}, this.knifeSize, this.knifeTexturePath);
        this.Matter.World.add(this.engine.world, newKnife);
        this.curKnife = newKnife;
    }

    /**
     * 转盘被击中动作
     */
    private turnTableDoHitAni(): void {
        if(this.status == GameUIStatus.BOMBING || this.status == GameUIStatus.START_BOMB)
            return;

        if(this.turntableStatus === 0){
            this.turntableStatus = 1;
            //分数
            this.createHitScore(Math.floor(Math.random()*10+1) + this.stopKnifes.length*20, {x:this.turntablePos.x, y:this.turntablePos.y+this.turntableRadius});
            this.event(GameUIView.EVENT_TURNTABLE_BE_HIT);

            //变亮
            if(this.turntableBody != null && this.turntableBody.layaSprite != null){
                //由 20 个项目（排列成 4 x 5 矩阵）组成的数组，红色
                var rFactor = Math.abs(this.stopKnifes.length - this.maxKnife);
                var v = 0.45 + rFactor/10;
                var lightMat =
                [
                    1, 0.05, 0.05, 0.05, 0, //R
                    0.05, 1, 0.05, 0.05, 0, //G
                    0.05, 0.05, 1, 0.05, 0, //B
                    0, 0, 0, 1, 0, //A
                ];
                //创建一个颜色滤镜对象
                var lightcaleFilter = new Laya.ColorFilter(lightMat);
                this.turntableBody.layaSprite.filters = [lightcaleFilter];
            }
            
            this.Matter.Composite.translate(this.turntable, {x: this.turntableHitOffset.x, y: this.turntableHitOffset.y});
            Laya.timer.once(this.turntableHitAniDuration, this, function(){
                this.Matter.Composite.translate(this.turntable, {x: this.turntableHitOffset.x, y: -this.turntableHitOffset.y});
                this.turntableStatus = 0;

                //复原
                if(this.turntableBody != null && this.turntableBody.layaSprite != null){
                    //正常滤镜
                    var normalMat =
                    [
                        1, 0, 0, 0, 0, //R
                        0, 1, 0, 0, 0, //G
                        0, 0, 1, 0, 0, //B
                        0, 0, 0, 1, 0, //A
                    ];
                    //创建一个颜色滤镜对象
                    var normalcolorFilter = new Laya.ColorFilter(normalMat);
                    this.turntableBody.layaSprite.filters = [normalcolorFilter];
                }
            });
        }
    }

    //转盘开始炸开
    private turntableStartBomb(): void {
        //转盘移除
        var turntablePos = this.turntableBody.position;
        if(this.turntable && this.turntableBody){
            this.turntableBody.layaSprite.destroy();
            this.Matter.Composite.remove(this.turntable, this.turntableBody);
            this.turntableBody = null;
        }
        //恢复重力
        this.engine.world.gravity.y = this.worldGravity;
        this.event(GameUIView.EVENT_TURNTABLE_BOMB);
    }

    //转盘炸开进行时
    private turntableBombing(): void {
        //遍历所有飞刀，施加从转盘圆心指向飞刀方向的力
        for(let knife of this.stopKnifes) {
            this.Matter.Composite.remove(this.turntable, knife);
            this.Matter.World.add(this.engine.world, knife);
            this.Matter.Body.setStatic(knife, false);
            let force = this.Matter.Vector.sub(knife.position, this.turntablePos);
            force.x = force.x / Math.abs(force.x) * Math.random() * 0.07;
            force.y = force.y / Math.abs(force.y) * Math.random() * 0.07;
            let torque = {x:Math.random() * 80, y:Math.random() * 80};
            this.Matter.Body.applyForce(knife, this.Matter.Vector.add(knife.position, torque), force);
        }
    }

    //显示大奖励
    private showBigAward(): void {
        this.createBigScore(100, this.turntablePos);

        //开始新的一局
        Laya.timer.once(this.bombDuration, this, function(){
            this.changeStatus(GameUIStatus.REQ_PRE_REWARD);
        })
    }

    //改变转盘转动速率
    private changeTurntablRotateSpeedRandom(): void {
        var r = Math.random();  //r: 0-1
        r -= 0.5;   //正负随机
        var dir = r / Math.abs(r);
        var newSpeed = this.turntableRotateSpeed + dir * 0.005;

        if(Math.abs(newSpeed) >= 0.1){
            newSpeed = 0;
        }

        this.turntableRotateSpeed = (this.turntableRotateSpeed + newSpeed) * 0.5;
    }

    /**
     * 发射飞刀
     */
    public shootKnife(): void {
        if(this.curKnife != null && this.status == GameUIStatus.IDLE){
            this.Matter.Body.applyForce(this.curKnife, this.curKnife.position, this.knifeShootForce);
            this.curKnife = null;
        }
    }

    /**
     * 创建转盘Composite
     * @param pos 
     * @param radius 
     * @param skin 
     */
    private createTurnTableComposite(pos: {x: number, y: number}, radius: number, skin: string): any {
        var turntableBody = this.createTurntableBody(pos, radius, skin);
        
        var table = this.Matter.Composite.create({ 
            label: "turntable"
        });
        this.Matter.Composite.addBody(table, turntableBody);
        return {t:table, b: turntableBody};
    }

    /**
     * 创建转盘body
     * @param pos 
     * @param radius 
     * @param skin 
     */
    private createTurntableBody(pos: {x: number, y: number}, radius: number, skin: string): any {
        var tmpSp = new Laya.Sprite();
         tmpSp.loadImage(skin);
         //缩放
         var spScaleX = 2 * radius / tmpSp.width;
         var spScaleY = 2 * radius / tmpSp.height;
         //位移
         var offsetX = tmpSp.width / 2;
         var offsetY = tmpSp.height / 2;

         var turntableBody = this.Matter.Bodies.circle(pos.x, pos.y, radius, {
            label:"turntableBody",
            isStatic:true,
            render: {
                visible: true,
                opacity: 1,
                sprite: {
                    xScale: 0.1, 
                    yScale: 0.1, 
                    xOffset: offsetX, 
                    yOffset: offsetY, 
                    texture: skin,
                    zOrder: 20,
                },
                lineWidth: 1.5
            }
        });

        turntableBody.rScaleX = spScaleX;
        turntableBody.rScaleY = spScaleY;

        return turntableBody;
    }

    /**
     * 创建飞刀body
     * @param pos 
     * @param size 
     * @param skin 
     */
    private createKnife(pos: {x: number, y: number}, size: {width: number, height: number}, skin: string): any {
        var tmpSp = new Laya.Sprite();
         tmpSp.loadImage(skin);
         //缩放,只根据width进行缩放
         var spScaleX = size.width / tmpSp.width;
         //var spScaleY = size.height / tmpSp.height;
         //位移
         var offsetX = tmpSp.width / 2;
         var offsetY = tmpSp.height / 2 + size.height / 2 - 1;

        var knife = this.Matter.Bodies.rectangle(pos.x, pos.y, size.width, size.height, {
            label:"knife",
            collisionFilter: {
                category: 0x0001,
                mask: 0xFFFFFFFF,
                group: -1,
            },
            render: {
                visible: true,
                opacity: 1,
                sprite: {
                    xScale: spScaleX, 
                    yScale: spScaleX, 
                    xOffset: offsetX, 
                    yOffset: offsetY, 
                    texture: skin,
                    zOrder: 10,
                },
                lineWidth: 1.5
            }  
        });

        return knife;
    }

    /**
     * 创建被击中数字
     * @param scoreVal 
     * @param pos 
     */
    private createHitScore(scoreVal: number, position: {x: number, y: number}): void {
        var coinSp = new Laya.Sprite();
        coinSp.loadImage(ResManager.getResDir("main/icon_gold01.png", RES.GAME));
        coinSp.pos(position.x, position.y);
        coinSp.zOrder = 50;
        coinSp.pivot(137, 63);
        coinSp.scale(0.1,0.1);
        coinSp.alpha = 0.3;
        this.addChild(coinSp);

        var scoreLabel = new Laya.Label("+" + scoreVal.toLocaleString());
        scoreLabel.pos(position.x, position.y);
        scoreLabel.zOrder = 60;
        scoreLabel.fontSize = 40;
        scoreLabel.pivot(0,20);
        scoreLabel.scale(0.1, 0.1);
        scoreLabel.color = "#000000";
        scoreLabel.alpha = 0.3;
        this.addChild(scoreLabel);

        var timeLine = new Laya.TimeLine();
        timeLine.addLabel("appear1", 0).to(scoreLabel, {alpha: 1, scaleX:1.3, scaleY:1.3}, 100, Laya.Ease.backOut);
        timeLine.addLabel("appear2", 0).to(scoreLabel, {scaleX:1, scaleY:1}, 100);
        timeLine.addLabel("move", 0).to(scoreLabel, {y:position.y - 100}, 300);
        timeLine.play(0,false);
        timeLine.on(Laya.Event.COMPLETE, this, function(){
            scoreLabel.destroy();
        });

        var timeLine2 = new Laya.TimeLine();
        timeLine2.addLabel("appear1", 0).to(coinSp, {alpha: 1, scaleX:0.6, scaleY:0.6}, 100, Laya.Ease.backOut);
        timeLine2.addLabel("appear2", 0).to(coinSp, {scaleX:0.5, scaleY:0.5}, 100);
        timeLine2.addLabel("move", 0).to(coinSp, {y:position.y - 100}, 300);
        timeLine2.play(0,false);
        timeLine2.on(Laya.Event.COMPLETE, this, function(){
            coinSp.destroy();
        });
    }

    /**
     * 爆开分数金币效果
     * @param scoreVal 
     */
    private createBigScore(scoreVal: number, pos: {x: number, y: number}): void {
        var res = {
            [0]: "main/img_turntable_icon01.png",
            [1]: "main/img_turntable_icon01.png",
            [2]: "main/img_turntable_icon02.png",
            [3]: "main/img_turntable_icon02.png",
            [4]: "main/img_turntable_icon05.png", 
            [5]: "main/img_turntable_icon05.png", 
        }

        var sp = new Laya.Sprite();
        var r = Math.floor(Math.random() * 5);
        var skin = res[r];
        sp.loadImage(ResManager.getResDir(skin,RES.GAME));
        sp.pivotX = sp.width / 2;
        sp.pivotY = sp.height / 2;
        sp.scale(0.1,0.1);
        sp.pos(this.turntablePos.x, this.turntablePos.y);
        sp.zOrder = 80;
        this.addChild(sp);

        Laya.Tween.to(sp, {scaleX: 1, scaleY:1}, 400, Laya.Ease.backOut);
        Laya.timer.once(1000, this, function(){
            sp.destroy();
        })
    }
}