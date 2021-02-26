const draw = {
    //检测当前屏幕是否支持触摸
    isTouchDevice: "ontouchstart" in document.documentElement,
    //设置鼠标按钮的开关
    painting: false,
    //储存上一次的坐标
    last: [],
    //储存canvas展示的区域
    ctx:undefined,
    //获取canvas的DOM节点
    canvas:undefined,
    init: () => {
        //获取画板的节点
        draw.canvas = document.getElementById("canvas");
        //获取canvas的content,图像将在这里被渲染
        draw.ctx = draw.canvas.getContext("2d");
        //将canvas的宽高设置为屏幕宽高
        draw.getCurrentViewPort()
        //初始化canvas画笔
        draw.initCanvas()
        //触摸画线或者鼠标画线
        draw.isTouchDevice ? draw.bindTouchEvents() : draw.bindClickEvents()
    },
    initCanvas: () => {
        //填充颜色
        draw.ctx.fillStyle = "black";
        //边框
        draw.ctx.strokeStyle = "none";
        //线宽
        draw.ctx.lineWidth = 10;
        //设置转折圆角
        draw.ctx.lineCap = "round";
    },
    drawLine: (x1, y1, x2, y2) => {
        draw.ctx.beginPath();
        draw.ctx.moveTo(x1, y1);
        draw.ctx.lineTo(x2, y2);
        draw.ctx.stroke();
    },
    bindClickEvents: () => {
        //检测鼠标按下事件
        draw.canvas.onmousedown = (e) => {
            draw.onMouseDown(e)
        }
        //检测鼠标弹起事件
        draw.canvas.onmouseup = () => {
            draw.painting = false;
        }
        //鼠标移动时检测鼠标是否按下,如果按下就开始画图
        draw.canvas.onmousemove = (e) => {
            draw.onMouseMove(e)
        }
    },
    bindTouchEvents: () => {
        //获取当前触摸开始的坐标
        draw.canvas.ontouchstart = (e) => {
            draw.onTouchStart(e)
        };
        //获取当前的坐标,并将开始坐标和当前坐标之间画线,将当前坐标赋值到上次坐标
        draw.canvas.ontouchmove = (e) => {
            draw.onTouchMove(e)
        };
    },
    getCurrentViewPort:()=>{
        //获取当前屏幕的宽高
        draw.canvas.width = document.documentElement.clientWidth;
        draw.canvas.height = document.documentElement.clientHeight;
    },
    getCurrentTouchXY: (e) => {
        return [e.touches[0].clientX, e.touches[0].clientY]
    },
    onTouchStart: (e) => {
        draw.last = draw.getCurrentTouchXY(e);
    },
    onTouchMove: (e) => {
        const [x, y] = draw.getCurrentTouchXY(e)
        draw.drawLine(draw.last[0], draw.last[1], x, y);
        draw.last = [x, y];
    },
    onMouseDown: (e) => {
        draw.painting = true;
        draw.last = [e.clientX, e.clientY];
    },
    onMouseMove: (e) => {
        if (draw.painting === true) {
            draw.drawLine(draw.last[0], draw.last[1], e.clientX, e.clientY);
            draw.last = [e.clientX, e.clientY];
        }
    }
}

draw.init()



