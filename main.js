const draw = {
    //检测当前屏幕是否支持触摸
    isTouchDevice: "ontouchstart" in document.documentElement,
    features: document.querySelector('#features'),
    pencil: document.querySelector('#pencil'),
    rubber: document.querySelector('#rubber'),
    clean: document.querySelector('#clean'),
    download: document.querySelector('#download'),
    colors: document.querySelector('#colors'),
    lineStyle: document.querySelector('#line-style'),
    //设置鼠标按钮的开关
    painting: false,
    //储存上一次的坐标
    last: [],
    //储存canvas展示的区域
    ctx: undefined,
    //获取canvas的DOM节点
    canvas: undefined,
    //默认的功能,颜色,笔迹
    featuresMap: ['pencil', 'rubber'],
    currentFeature: 'pencil',

    colorMap: ['black', 'red', 'yellow', 'green', 'blue'],
    currentColor: 'black',

    lineStyleMap: {big: 10, normal: 6, small: 2},
    currentLineStyle: 'big',
    //橡皮擦功能是否开启
    onRubber: false,
    //储存当前viewport宽高
    viewportWidth: document.documentElement.clientWidth,
    viewportHeight: document.documentElement.clientHeight,
    init: () => {
        draw.initStyle()
        //获取画板的节点
        draw.canvas = document.getElementById("canvas");
        //获取canvas的content,图像将在这里被渲染
        draw.ctx = draw.canvas.getContext("2d");
        //将canvas的宽高设置为屏幕宽高
        draw.canvas.width = draw.viewportWidth
        draw.canvas.height = draw.viewportHeight
        //初始化canvas画笔
        draw.initCanvas()
        //触摸画线或者鼠标画线
        draw.isTouchDevice ? draw.bindTouchEvents() : draw.bindMouseEvents()
        draw.bindFeatureEvents()
        draw.bindColorEvents()
        draw.bindLineStyleEvents()
    },
    initCanvas: () => {
        //填充颜色
        draw.ctx.fillStyle = draw.currentColor;
        //边框
        draw.ctx.strokeStyle = draw.currentColor;
        //线宽
        draw.ctx.lineWidth = draw.lineStyleMap[draw.currentLineStyle];
        //设置转折圆角
        draw.ctx.lineCap = "round";
    },
    initFeatureStyle: () => {
        const featuresChildren = draw.features.children
        for (let i = 0; i < featuresChildren.length; i++) {
            if (featuresChildren[i].id === draw.currentFeature) {
                featuresChildren[i].classList.add('active')
            } else {
                featuresChildren[i].classList.remove('active')
            }
        }
    },
    initColorStyle: () => {
        const colorsChildren = draw.colors.children
        for (let i = 0; i < colorsChildren.length; i++) {
            if (colorsChildren[i].id === draw.currentColor) {
                colorsChildren[i].classList.add('active')
            } else {
                colorsChildren[i].classList.remove('active')
            }
        }
    },
    initLineStyle: () => {
        const lineStyleChildren = draw.lineStyle.children
        for (let i = 0; i < lineStyleChildren.length; i++) {
            if (lineStyleChildren[i].id === draw.currentLineStyle) {
                lineStyleChildren[i].classList.add('active')
            } else {
                lineStyleChildren[i].classList.remove('active')
            }
        }
    },
    initStyle: () => {
        //初始化Features的样式
        draw.initFeatureStyle()
        //初始化画笔的颜色的样式
        draw.initColorStyle()
        //初始化线宽的样式
        draw.initLineStyle()
    },
    drawLine: (x1, y1, x2, y2) => {
        draw.ctx.beginPath();
        draw.ctx.moveTo(x1, y1);
        draw.ctx.lineTo(x2, y2);
        draw.ctx.stroke();
    },
    bindMouseEvents: () => {
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
        draw.canvas.addEventListener('touchmove',(e)=>{
            //阻止iOS页面滑动
            e.preventDefault()
            draw.onTouchMove(e)
        },{passive:false})
    },
    bindFeatureEvents: () => {
        draw.pencil.onclick = (e) => {
            draw.currentFeature = e.currentTarget.id
            draw.initFeatureStyle()
            //关闭橡皮擦
            draw.onRubber = false
        }
        draw.rubber.onclick = (e) => {
            draw.currentFeature = e.currentTarget.id
            draw.initFeatureStyle()
            //开启橡皮擦
            draw.onRubber = true
        }
        draw.clean.onclick = () => {
            //增加清除功能
            draw.ctx.clearRect(0, 0, draw.canvas.width, draw.canvas.height);
        }
        draw.download.onclick = () => {
            //增加背景颜色
            draw.ctx.save();
            draw.ctx.globalCompositeOperation = 'destination-over';
            draw.ctx.fillStyle = "#FAF9DE";
            draw.ctx.fillRect(0, 0, draw.viewportWidth, draw.viewportHeight);
            //增加下载功能
            const MIME_TYPE = "image/png";
            const imgURL = draw.canvas.toDataURL("image/png");
            const dlLink = document.createElement('a');
            dlLink.download = '我的canvas画板';
            dlLink.href = imgURL;
            dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');
            document.body.appendChild(dlLink);
            dlLink.click();
            document.body.removeChild(dlLink);
        }

    },
    bindColorEvents: () => {
        draw.colors.onclick = (e) => {
            if (draw.colorMap.indexOf(e.target.id) >= 0) {
                draw.currentColor = e.target.id
                draw.initColorStyle()
                draw.initCanvas()
            }
        }
    },
    bindLineStyleEvents: () => {
        draw.lineStyle.onclick = (e) => {
            if (Object.keys(draw.lineStyleMap).indexOf(e.target.id) >= 0) {
                draw.currentLineStyle = e.target.id
                draw.initLineStyle()
                draw.initCanvas()
            }
        }
    },
    getCurrentTouchXY: (e) => {
        return [e.touches[0].clientX, e.touches[0].clientY]
    },
    onTouchStart: (e) => {
        draw.last = draw.getCurrentTouchXY(e);
    },
    onTouchMove: (e) => {
        const [x, y] = draw.getCurrentTouchXY(e)
        if (draw.onRubber) {
            draw.ctx.clearRect(draw.last[0] - 5, draw.last[1] - 5, 20, 20)
        } else {
            draw.drawLine(draw.last[0], draw.last[1], x, y);
        }
        draw.last = [x, y];
    },
    onMouseDown: (e) => {
        draw.painting = true;
        draw.last = [e.clientX, e.clientY];
    },
    onMouseMove: (e) => {
        if (draw.painting === true) {
            if (draw.onRubber) {
                draw.ctx.clearRect(draw.last[0] - 5, draw.last[1] - 5, 20, 20)
            } else {
                draw.drawLine(draw.last[0], draw.last[1], e.clientX, e.clientY);
            }
            draw.last = [e.clientX, e.clientY];
        }
    },
}

draw.init()



