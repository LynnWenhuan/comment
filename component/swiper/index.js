import util from '../../core/util';
import Item from './item';
import './index.less';


const transformDict = util.getTransitionKeys();
const isMobile = "ontouchend" in document ? true : false;
const eventMaps = {
    start:isMobile?'touchstart':'mousedown',
    move:isMobile?'touchmove':'mousemove',
    end:isMobile?'touchend':'mouseup',
    cancel:isMobile?'touchcancel':'mouseleave',
};

export default class Swiper {
    constructor(props) {
        this.props = props || {};
        if(!this.props.wrapper){
            console.error('Swiper构造函数缺少wrapper参数');
            return;
        }
        this.root = document.createElement("DIV");
        this.root.className=("cd-swiper-root");
        this.itemInstanceArray = [];
        for(let i = 0; i<=2;i+=1){
            const itemInstance = new Item({
                swiper:this,
            });
            if(this.props.wrapperSize) {
                this.wrapperSize = this.props.wrapperSize;
                itemInstance.setStyle({
                    [transformDict.transform]:`translateX(${(i-1)*this.props.wrapperSize}px)`
                });
            }else {
                itemInstance.setStyle({
                    [transformDict.transform]:`translateX(${(i-1)*100}%)`
                });
            }
            this.itemInstanceArray.push(itemInstance);
            this.root.appendChild(itemInstance.root);
        }
        this.onPositionChange({
            isInit:true,
        });
        this.props.wrapper.appendChild(this.root);
        this.bindEvents();
    }
    _getPointByTouch = (e) => {
        if(isMobile) {
            const touches = e.touches[0];
            return {
                x:touches.pageX,
                y:touches.pageY,
            };
        }
        return {
            x:e.pageX,
            y:e.pageY
        }
    }
    bindEvents = ()=>{
        let start ={};
        this.touchDiff = 0;
        this.isMouseDown = false;
        this.isInTransition = false;
        this.root.addEventListener(eventMaps.start,(e)=>{
            if(!isMobile) {
                e.preventDefault();
                e.stopPropagation();
            }
            this.touchDiff = 0;
            if(this.isInTransition){
                return;
            }
            this.isMouseDown = true;
            if(!this.wrapperSize) {
                this.wrapperSize = this.root.offsetWidth;
            }
            start = this._getPointByTouch(e);
        });
        this.root.addEventListener(eventMaps.move,(e)=>{
            e.preventDefault();
            e.stopPropagation();
            if(this.isInTransition){
                return;
            }
            if(!this.isMouseDown){
                return;
            }
            const curPoint = this._getPointByTouch(e);
            this.touchDiff = curPoint.x - start.x;
            this.setPosition(this.touchDiff,false);
        });
        this.root.addEventListener(eventMaps.end,()=>{
           this.touchEnd();
        });
        this.root.addEventListener(eventMaps.cancel,()=>{
            this.touchEnd();
         });
    }

    touchEnd = () => {
        if(this.isInTransition){
            return;
        }
        if(!this.isMouseDown){
            return;
        }
        this.isMouseDown = false;
        if(this.touchDiff > 0){
            // goto next
            if(this.touchDiff < 70) {
                this.reset(true);
            } else {
                this.goNext();
            }
        }
        if(this.touchDiff < 0) {
            // goto pre
            if(Math.abs(this.touchDiff) < 70) {
                this.reset(true);
            } else {
                this.goPre();
            }
        }
    }

    goNext = () => {
        if(this.isInTransition){
            return;
        }
        this.setPosition(this.wrapperSize,true);
        this.isInTransition = true;
        setTimeout(()=>{
            this.isInTransition = false;
            this.isMouseDown = false;
            this.itemInstanceArray.unshift(this.itemInstanceArray.pop());
            this.reset(false);
            this.onPositionChange({
                isInit:false,
                direction:'next',
            });
        },300);
    }

 
    onPositionChange = (params)=>{
        if(this.props.onPositionChange) {
            this.props.onPositionChange({
                ...params,
                swiper:this,
            });
        }
    }
    goPre = () => {
        if(this.isInTransition){
            return;
        }
        this.setPosition(0-this.wrapperSize,true);
        this.isInTransition = true;
        setTimeout(()=>{
            this.isInTransition = false;
            this.itemInstanceArray.push(this.itemInstanceArray.shift());
            this.reset(false);
            this.isMouseDown = false;
            this.onPositionChange({
                isInit:false,
                direction:'pre',
            });
        },300);
    }

    reset = (isAnimate) => {
        this.setPosition(0,isAnimate);
    }

    setPosition = (offset,isAnimate) => {
        if(!this.wrapperSize) {
            this.wrapperSize = this.root.offsetWidth;
        }
        for(let i = 0;i<=2;i+=1){
            const item = this.itemInstanceArray[i];
            item.setStyle({
                [transformDict.transition]: isAnimate?'transform 0.3s ease':'',
                [transformDict.transform]:`translateX(${(i-1)*this.wrapperSize + offset}px)`,
            });
        }
    }
}