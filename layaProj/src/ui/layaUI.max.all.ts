
import View=laya.ui.View;
import Dialog=laya.ui.Dialog;
module ui.game {
    export class FamilyMapUI extends View {

        public static  uiView:any ={"type":"View","props":{"width":720,"height":1280}};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.game.FamilyMapUI.uiView);

        }

    }
}

module ui.game {
    export class FamilyUserBtnUI extends View {
		public btnRet:Laya.Button;
		public updateList:Laya.Image;
		public updateTitle:Laya.Label;
		public itemList:Laya.Box;
		public btnUpgrade1:Laya.Button;
		public imageFurnitiure:Laya.Image;
		public btnUpgrade2:Laya.Button;
		public btnUpgrade3:Laya.Button;
		public btnUpgrade4:Laya.Button;
		public btnUpgrade5:Laya.Button;
		public btnClose:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":720,"height":200},"child":[{"type":"Button","props":{"y":104,"x":33,"width":100,"var":"btnRet","skin":"wxlocal/comp/button.png","labelSize":30,"label":"返回","height":50}},{"type":"Image","props":{"y":100,"x":360,"width":720,"var":"updateList","skin":"game/commom/pnl_jiaju_bg.png","sizeGrid":"9,6,8,6","mouseThrough":false,"height":200,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":17,"x":300,"var":"updateTitle","text":"房间整理","fontSize":25,"color":"#623b3b"}},{"type":"Box","props":{"y":201,"x":358,"width":717,"var":"itemList","height":151,"anchorY":1,"anchorX":0.5},"child":[{"type":"Button","props":{"y":-6,"x":6,"width":138,"var":"btnUpgrade1","stateNum":1,"skin":"game/commom/btn_jiaju_bg1.png","sizeGrid":"9,10,12,11","height":151},"child":[{"type":"Image","props":{"y":120,"x":0,"width":137,"skin":"game/commom/btn_jiaju_bg.png","height":32}},{"type":"Image","props":{"y":111,"x":6,"width":32,"skin":"game/main/icon_gold01.png","height":38}},{"type":"Label","props":{"y":127,"x":40,"width":86,"text":"1333000","height":21,"fontSize":18}},{"type":"Image","props":{"y":9,"x":12,"width":110,"var":"imageFurnitiure","skin":"game/home/img_clean3.png","height":113}}]},{"type":"Button","props":{"y":-7,"x":150,"width":138,"var":"btnUpgrade2","stateNum":1,"skin":"game/commom/btn_jiaju_bg1.png","sizeGrid":"9,10,12,11","height":151},"child":[{"type":"Image","props":{"y":120,"x":0,"width":137,"skin":"game/commom/btn_jiaju_bg.png","height":32}},{"type":"Image","props":{"y":111,"x":1,"width":40,"skin":"game/main/icon_gold01.png","height":39}},{"type":"Label","props":{"y":127,"x":40,"width":86,"text":"1333000","height":21,"fontSize":18}},{"type":"Image","props":{"y":9,"x":12,"width":110,"skin":"game/home/img_clean3.png","height":113}}]},{"type":"Button","props":{"y":-7,"x":294,"width":138,"var":"btnUpgrade3","stateNum":1,"skin":"game/commom/btn_jiaju_bg1.png","sizeGrid":"9,10,12,11","height":151},"child":[{"type":"Image","props":{"y":120,"x":0,"width":137,"skin":"game/commom/btn_jiaju_bg.png","height":32}},{"type":"Image","props":{"y":111,"x":-1,"width":40,"skin":"game/main/icon_gold01.png","height":39}},{"type":"Label","props":{"y":127,"x":40,"width":86,"text":"1333000","height":21,"fontSize":18}},{"type":"Image","props":{"y":9,"x":12,"width":110,"skin":"game/home/img_clean3.png","height":113}}]},{"type":"Button","props":{"y":-7,"x":439,"width":138,"var":"btnUpgrade4","stateNum":1,"skin":"game/commom/btn_jiaju_bg1.png","sizeGrid":"9,10,12,11","height":151},"child":[{"type":"Image","props":{"y":120,"x":0,"width":137,"skin":"game/commom/btn_jiaju_bg.png","height":32}},{"type":"Image","props":{"y":111,"x":-1,"width":40,"skin":"game/main/icon_gold01.png","height":39}},{"type":"Label","props":{"y":127,"x":40,"width":86,"text":"1333000","height":21,"fontSize":18}},{"type":"Image","props":{"y":9,"x":12,"width":110,"skin":"game/home/img_clean3.png","height":113}}]},{"type":"Button","props":{"y":-8,"x":580,"width":138,"var":"btnUpgrade5","stateNum":1,"skin":"game/commom/btn_jiaju_bg1.png","sizeGrid":"9,10,12,11","height":151},"child":[{"type":"Image","props":{"y":120,"x":0,"width":137,"skin":"game/commom/btn_jiaju_bg.png","height":32}},{"type":"Image","props":{"y":109,"x":2,"width":40,"skin":"game/main/icon_gold01.png","height":39}},{"type":"Label","props":{"y":127,"x":40,"width":86,"text":"1333000","height":21,"fontSize":18}},{"type":"Image","props":{"y":9,"x":12,"width":110,"skin":"game/home/img_clean3.png","height":113}}]}]},{"type":"Button","props":{"y":6,"x":681,"var":"btnClose","skin":"wxlocal/comp/btn_close.png"}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.game.FamilyUserBtnUI.uiView);

        }

    }
}

module ui.game {
    export class GameUI extends View {

        public static  uiView:any ={"type":"View","props":{"width":720,"height":1280}};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.game.GameUI.uiView);

        }

    }
}

module ui.game {
    export class GameUserBtnUI extends View {
		public strengthLabel:Laya.Label;
		public coinLabel:Laya.Label;
		public btnJumpFamily:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":720,"mouseThrough":true,"height":1280},"child":[{"type":"Label","props":{"y":31,"x":45,"width":150,"var":"strengthLabel","text":"体力","height":50,"fontSize":40,"color":"#ffffff"}},{"type":"Label","props":{"y":32,"x":204,"var":"coinLabel","text":"金币","fontSize":40,"color":"#ffffff"}},{"type":"Button","props":{"y":61,"x":436,"width":120,"var":"btnJumpFamily","skin":"wxlocal/comp/button.png","pivotY":25,"pivotX":60,"labelSize":35,"label":"家园","height":50}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.game.GameUserBtnUI.uiView);

        }

    }
}

module ui.game {
    export class LoginUI extends View {
		public boxCenter:Laya.Box;
		public btnLogin:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":720,"height":1280},"child":[{"type":"Box","props":{"y":640,"x":360,"width":720,"var":"boxCenter","pivotY":640,"pivotX":360,"height":1280},"child":[{"type":"Button","props":{"y":885,"x":360,"width":160,"var":"btnLogin","skin":"wxlocal/comp/button.png","labelSize":35,"label":"登陆","height":72,"anchorY":0.5,"anchorX":0.5}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.game.LoginUI.uiView);

        }

    }
}

module ui.game {
    export class UIAdaptUI extends View {
		public boxCenter:Laya.Box;
		public btnCenter:Laya.Button;
		public boxTop:Laya.Box;
		public btnTop:Laya.Button;
		public boxTopLeft:Laya.Box;
		public btnTopLeft:Laya.Button;
		public boxTopRight:Laya.Box;
		public btnTopRight:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":720,"height":1280},"child":[{"type":"Box","props":{"y":640,"x":360,"width":720,"var":"boxCenter","mouseThrough":true,"height":1280,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Button","props":{"y":957,"x":372,"width":197,"var":"btnCenter","skin":"wxlocal/comp/button.png","labelSize":40,"label":"中间","height":117,"anchorY":0.5,"anchorX":0.5}}]},{"type":"Box","props":{"y":2,"x":360,"width":720,"var":"boxTop","mouseThrough":true,"height":200,"anchorX":0.5},"child":[{"type":"Button","props":{"y":80,"x":360,"width":133,"var":"btnTop","skin":"wxlocal/comp/button.png","labelSize":30,"label":"上","height":53,"anchorY":0.5,"anchorX":0.5}}]},{"type":"Box","props":{"width":720,"var":"boxTopLeft","mouseThrough":true,"height":200},"child":[{"type":"Button","props":{"y":58,"x":60,"width":103,"var":"btnTopLeft","skin":"wxlocal/comp/button.png","labelSize":30,"label":"左上","height":53}}]},{"type":"Box","props":{"x":720,"width":720,"var":"boxTopRight","mouseThrough":true,"height":200,"anchorX":1},"child":[{"type":"Button","props":{"y":58,"x":660,"width":99,"var":"btnTopRight","skin":"wxlocal/comp/button.png","labelSize":30,"label":"右上","height":51,"anchorX":1}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.game.UIAdaptUI.uiView);

        }

    }
}
