'use strict';
//test
$(document).ready(function () {
    var mySm = SM.getMirror('source',4);
    var smTest = SM.getMirror('test',2);
});

//code
function scaleMirror (sourceId,sizeInt) {
    var sm = this;
    this.sizeInt = sizeInt;
    this.sourceId = sourceId;
    this.init = function () {
        //原div
        var sourceEle = $('#'+this.sourceId).css('position','relative').css('z-index',1000);
        var src = sourceEle.attr('data-src');
        var sWidth = sourceEle.attr('data-width');
        var image = $('<img src='+src+'>');
        if(!!sWidth){
            sourceEle.css('width',sWidth);
            image.css('width',sourceEle.width());
        }
        sourceEle.prepend(image);
        $(window).bind('load',create);
        function create () {
            //镜像div
            var mirrorEle = $('<div class="mirror-div"></div>');
            mirrorEle.css({
                width : image.width(),
                height : image.height(),
                position : 'absolute',
                left : image.width(),
                top : 0,
                'background-repeat' : 'no-repeat',
                'background-size' : 100*sm.sizeInt+'% '+100*sm.sizeInt+'%',
                'background-image' : 'url('+src+')',
                display : 'none',
            });
            sourceEle.append(mirrorEle);
            //操作div
            var optionEle = $('<div></div>');
            optionEle.css({
                width : image.width()/sm.sizeInt,
                height : image.height()/sm.sizeInt,
                'background-color' : 'rgba(0,0,0,.5)',
                position : 'absolute',
                display : 'none',
                left : 0,
                top : 0,
            });
            sourceEle.append(optionEle);
            //鼠标移入
            var range = {
                left : image.offset().left,
                right : image.offset().left + image.width(),
                top : image.offset().top,
                bottom : image.offset().top + image.height(),
            };
            $(document).mousemove(function () {
                var x = event.pageX;
                var y = event.pageY;
                if(x < range.right && x > range.left && y < range.bottom && y > range.top){
                    var ox = x-range.left-optionEle.width()/2;
                    var oy = y-range.top-optionEle.height()/2;
                    optionEle.css('display','block').css('left',ox).css('top',oy);
                    mirrorEle.css('background-position',(-ox*sm.sizeInt)+'px '+(-oy*sm.sizeInt)+'px').css('display','block');
                } else {
                    optionEle.css('display','none');
                    mirrorEle.css('display','none');
                }
            });
        }
    }
    this.init();
}
var SM = {
    mirrors : [],
    getMirror : function (id,size) {
        if(!!id && !!$('#'+id)){
            if(this.mirrors[id])
                return this.mirrors[id]
            else {
                if(!!size && size > 1) this.mirrors[id] = new scaleMirror(id,size)
                else this.mirrors[id] = new scaleMirror(id,2)
            }
        } else {
            return null
        }
        return this.mirrors[id]
    }
}
