(function(window,document){
    var ChartDraws = function(options){
        if(!(this instanceof ChartDraws))return new ChartDraws(options);
        this.options = $.extend({
            //报表所需的参数
            "containerId" : "",       //canvas所在容器id
            "canvasWidth" : 400,
            "canvasHeight" : 300,
            "paddingLeft" : 20,
            "paddingTop" : 20,
            "columnChartData" :[],   //柱形图的数量和对应得名称以及百分比
            "yChartData" :[],           //y轴的数量及名称
            "axisColor" : "white",      //坐标轴颜色
            "columnChartColor" : "#EEE685", //柱形图颜色
            "isNeedAnimation" : true, //是否需要动画
            "isNeedLineChart" : true,  //是否需要折线图
            "isNeedColumnChart" : true, //是否需要柱形图
            "lineChartColor" : "#90EE90", //折线图颜色，当isNeedLineChart=true时有效
            "isNeedBorder" : false,     //canvas是否需要外边框
            "borderColor" : "white"     //外边框颜色
        },options);
        if(this.options.canvasWidth<=500)
        {
            this.axisBorderWidth = 3;
            this.fontSize = 8;
        }
        else if(this.options.canvasWidth<=800){
            this.axisBorderWidth = 4;
            this.fontSize = 12;
        }
        else{
            this.axisBorderWidth = 5;
            this.fontSize = 16;
        }
        var self = this;
        _init();
        function _init(){
            var canvasDom = document.createElement("canvas");
            canvasDom.id = self.options.containerId+"_"+"canvas";
            canvasDom.width = self.options.canvasWidth;
            canvasDom.height = self.options.canvasHeight;
            if(self.options.isNeedBorder){
                canvasDom.style.borderWidth = 1;
                canvasDom.style.borderStyle = "solid";
                canvasDom.style.borderColor = self.options.borderColor;
            }
            document.getElementById(self.options.containerId).appendChild(canvasDom);
            self.context = document.getElementById(self.options.containerId+"_"+"canvas");
            self.ctx = self.context.getContext("2d");
            _drawAxis();
        }

        function _drawAxis(){
            var XYData =transformAxis( [{x:self.options.paddingLeft,y:self.options.canvasHeight-self.options.paddingTop},{x:self.options.paddingLeft,y:self.options.paddingTop},{x:self.options.canvasWidth-self.options.paddingLeft,y:self.options.paddingTop}]);
            self.ctx.strokeStyle=self.options.axisColor;
            drawLine(self.ctx,XYData,self.axisBorderWidth);
            //画三角箭头
            //画y轴三角箭头
            drawLine(self.ctx,transformAxis([{x:self.options.paddingLeft-self.axisBorderWidth,y:self.options.canvasHeight-self.options.paddingTop-self.axisBorderWidth*2},{x:self.options.paddingLeft,y:self.options.canvasHeight-self.options.paddingTop},{x:self.options.paddingLeft+self.axisBorderWidth,y:self.options.canvasHeight-self.options.paddingTop-self.axisBorderWidth*2}]),self.axisBorderWidth);
            //画x轴三角箭头
            drawLine(self.ctx,transformAxis([{x:self.options.canvasWidth-self.options.paddingLeft-self.axisBorderWidth*2,y:self.options.paddingTop+self.axisBorderWidth},{x:self.options.canvasWidth-self.options.paddingLeft,y:self.options.paddingTop},{x:self.options.canvasWidth-self.options.paddingLeft-self.axisBorderWidth*2,y:self.options.paddingTop-self.axisBorderWidth}]),self.axisBorderWidth);
            _drawCoordinatePoints();
        }

        function _drawCoordinatePoints(){
            self.reactAngleWidth = (1-2*0.04)*(self.options.canvasWidth-(2*self.options.paddingLeft))/(self.options.columnChartData.length*2-1);
            self.lineDataList = [];
            for(var i = 0;i<self.options.columnChartData.length;i++)
            {
                drawXText(self.ctx,2*self.options.columnChartData[i].NO*self.reactAngleWidth+self.options.paddingLeft+0.04*(self.options.canvasWidth-(2*self.options.paddingLeft))+self.reactAngleWidth/2,self.options.paddingTop/2,self.options.columnChartData[i].Name);
                self.lineDataList.push({
                    x:2*self.options.columnChartData[i].NO*self.reactAngleWidth+self.options.paddingLeft+0.04*(self.options.canvasWidth-(2*self.options.paddingLeft))+self.reactAngleWidth/2,
                    y:self.options.canvasHeight-(self.options.paddingTop+(self.options.canvasHeight-2*self.options.paddingTop)*self.options.columnChartData[i].PT)
                })
            }

            //画Y轴title  画y轴虚线
            self.reactAngleHeight = (self.options.canvasHeight-2*self.options.paddingTop)/(self.options.yChartData.length+1);
            for(var j = 0;j<self.options.yChartData.length;j++)
            {
                drawYText(self.ctx,3*self.options.paddingLeft/4,self.options.paddingTop+self.reactAngleHeight*(j+1),self.options.yChartData[j].Name);
                //画虚线
                drawDottedLine(self.ctx,self.options.paddingLeft,self.options.paddingTop+self.reactAngleHeight*(j+1),self.options.canvasWidth-self.options.paddingLeft,self.options.paddingTop+self.reactAngleHeight*(j+1),self.options.canvasWidth-2*self.options.paddingLeft,10,self.axisBorderWidth/2);
            }
            _drawColumnChart();
        }

        function _drawColumnChart(){
            //柱形图循环
            var reactAngleTimer = 1;
            function loopColumnChart()
            {
                var columnChartLooped = window.requestAnimationFrame(loopColumnChart);
                if(reactAngleTimer<=100)
                {
                    for(var k=0;k<self.options.columnChartData.length;k++)
                    {
                        self.ctx.fillStyle =self.options.columnChartColor;
                        drawRectangle(self.ctx,self.lineDataList[k].x-self.reactAngleWidth/2,self.options.canvasHeight-((self.options.canvasHeight-2*self.options.paddingTop)*self.options.columnChartData[k].PT*reactAngleTimer/100+self.options.paddingTop),self.reactAngleWidth,(self.options.canvasHeight-2*self.options.paddingTop)*self.options.columnChartData[k].PT*reactAngleTimer/100);
                    }
                    reactAngleTimer++;
                }
                else
                {
                    window.cancelAnimationFrame(columnChartLooped);
                    columnChartLooped = null;
                    reactAngleTimer = 1;
                    if(self.options.isNeedLineChart)
                    {
                        loopLineChart();
                    }
                }
            }
            //折线图循环
            var lineTimer = 0;
            function loopLineChart()
            {
                var lineChartLooped = window.requestAnimationFrame(loopLineChart);
                if(lineTimer<self.lineDataList.length-1)
                {
                    self.ctx.lineWidth = 2*self.axisBorderWidth/3;
                    if(lineTimer == 0)
                    {
                        drawCircle(self.ctx,self.lineDataList[lineTimer].x,self.lineDataList[lineTimer].y);
                    }
                    drawCircle(self.ctx,self.lineDataList[lineTimer+1].x,self.lineDataList[lineTimer+1].y);
                    self.ctx.beginPath();
                    self.ctx.moveTo(self.lineDataList[lineTimer].x,self.lineDataList[lineTimer].y);
                    self.ctx.lineTo(self.lineDataList[lineTimer+1].x,self.lineDataList[lineTimer+1].y);
                    self.ctx.strokeStyle = self.options.lineChartColor;
                    self.ctx.lineWidth = 2*self.axisBorderWidth/3;
                    self.ctx.stroke();
                    lineTimer++;
                }
                else
                {
                    window.cancelAnimationFrame(lineChartLooped);
                    lineChartLooped = null;
                    lineTimer = 0;
                }
            }
            //画柱形图
            function drawRectangle(context,x,y,width,height){
                context.beginPath();
                context.fillRect(x,y,width,height);
            }
            //画圆
            function drawCircle(context,x,y){
                context.beginPath();
                context.arc(x,y,self.axisBorderWidth/2,0,2*Math.PI,true);
                context.strokeStyle=self.options.lineChartColor;
                context.stroke();
                context.closePath();
            }
            if(self.options.isNeedAnimation)
            {
                if(self.options.isNeedColumnChart)
                {
                    loopColumnChart();
                }
                else
                {
                    if(self.options.isNeedLineChart) {
                        loopLineChart();
                    }
                }
            }
            else
            {
                if(self.options.isNeedColumnChart)
                {
                    for(var k=0;k<self.options.columnChartData.length;k++)
                    {
                        self.ctx.fillStyle =self.options.columnChartColor;
                        drawRectangle(self.ctx,self.lineDataList[k].x-self.reactAngleWidth/2,self.options.canvasHeight-((self.options.canvasHeight-2*self.options.paddingTop)*self.options.columnChartData[k].PT+self.options.paddingTop),self.reactAngleWidth,(self.options.canvasHeight-2*self.options.paddingTop)*self.options.columnChartData[k].PT);
                    }
                }
                if(self.options.isNeedLineChart) {
                    for (var l = 0; l < self.lineDataList.length - 1; l++) {
                        self.ctx.lineWidth = 4;
                        if (l == 0) {
                            drawCircle(self.ctx, self.lineDataList[l].x, self.lineDataList[l].y);
                        }
                        drawCircle(self.ctx, self.lineDataList[l + 1].x, self.lineDataList[l + 1].y);
                        self.ctx.beginPath();
                        self.ctx.moveTo(self.lineDataList[l].x, self.lineDataList[l].y);
                        self.ctx.lineTo(self.lineDataList[l + 1].x, self.lineDataList[l + 1].y);
                        self.ctx.strokeStyle = self.options.lineChartColor;
                        self.ctx.lineWidth = 2*self.axisBorderWidth/3;
                        self.ctx.stroke();
                    }
                }
            }
        }


        function transformAxis(data)
        {
            var newData=[];
            for(var i=0;i<data.length;i++){
                newData.push({
                    x:data[i].x,
                    y:self.options.canvasHeight-data[i].y
                })
            }
            return newData;
        }

        function drawLine(context,point,width){
            context.beginPath();
            context.moveTo(point[0].x,point[0].y);
            if(point.length>2)
            {
                for(var i=1;i<point.length;i++)
                {
                    context.lineTo(point[i].x,point[i].y);
                }
            }
            context.lineWidth = width;
            context.lineJoin='round';
            context.stroke();
            context.closePath();
        }

        //画y轴title
        function drawYText(context,x,y,str) {
            context.beginPath();
            context.font = '{fontSize} Microsoft Yahei'.replace("{fontSize}",self.fontSize+"px");
            context.fillStyle = 'white';
            context.textAlign = 'right';
            context.fillText(str,x,self.options.canvasHeight-y);
            context.closePath();
        }
        //画x轴title
        function drawXText(context,x,y,str) {
            context.beginPath();
            context.font = '{fontSize} Microsoft Yahei'.replace("{fontSize}",self.fontSize+"px");
            context.fillStyle = 'white';
            context.textAlign = 'center';
            context.fillText(str,x,self.options.canvasHeight-y);
            context.closePath();
        }
        function drawDottedLine(context,x1,y1,x2,y2,totalLength,length,lineWidth){
            y1 = self.options.canvasHeight-y1;
            y2 = self.options.canvasHeight-y2;
            var dashLen = length === undefined ? 5 : length;
            //计算有多少个线段
            context.beginPath();
            var num = Math.floor(totalLength/dashLen);
            context.lineWidth = lineWidth;
            for(var i = 0 ; i < num; i++)
            {
                context[i%2==0 ? 'moveTo' : 'lineTo'](x1+(x2-x1)/num*i,y1+(y2-y1)/num*i);
            }
            context.stroke();
        }
    };
    window.ChartDraws = ChartDraws;
 
}(window,document));