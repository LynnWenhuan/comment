import Swiper from '../../swiper';
import YearsSection from './yearsSection';
import util from '../../../core/util';


export default class Days {
    constructor(props) {
        this.props = props || {};
        const {show,wrapper,datepicker} = this.props;
        this.root = document.createElement("DIV");
        this.root.className = 'snk-cd-years-wrapper';
        this.yearsInfo = this.getYearArr(util.getDateInfo(datepicker.currentMonth).year - 4);
        new Swiper({
            wrapper:this.root,
            wrapperSize:datepicker.gridWidth,
            onItemCreate:(params) => {
                const sectionInstance = new YearsSection({
                    datepicker,
                    wrapper:params.item.root,
                })
                params.item.yearsSectionInstance = sectionInstance;
            },
            onPositionChange:(params) => {
                if(!this.swiper){
                    this.swiper = params.swiper;
                }
                if(params.direction === 'next') {
                    this.yearsInfo = this.getYearArr(this.yearsInfo[0]);
                } else if(params.direction==='pre'){
                    this.yearsInfo = this.getYearArr(this.yearsInfo[2]);
                }
                this.createLayout();
            }
        });
        if(!show) {
            this.root.style.display = 'none';
        }
        wrapper.appendChild(this.root);
    }

    setYear = (year) => {
        const items = this.swiper.itemInstanceArray[1].yearsSectionInstance.itemArr;
        const startItems =  this.swiper.itemInstanceArray[0].yearsSectionInstance.itemArr;
        const endItems =  this.swiper.itemInstanceArray[2].yearsSectionInstance.itemArr;
        if(startItems[0].year > year || endItems[endItems.length-1].year< year) {
            this.reset();
            return;
        }
        if(items[0].year > year) {
            this.swiper.goNext();
        } else if(items[items.length-1].year < year) {
            this.swiper.goPre();
        } else {
            for(let i = 0,j=items.length;i<j;i+=1) {
                if(items[i].year === year) {
                    items[i].select();
                }else{
                    items[i].unSelect();
                }
            }
        }
       
    }
    reset = () => {
        const {datepicker} = this.props;
        this.yearsInfo = this.getYearArr(util.getDateInfo(datepicker.currentMonth).year - 4);
        this.createLayout();
    }
    createLayout = () => {
        for(let i =0;i<=2;i+=1){
            const item = this.swiper.itemInstanceArray[i];
            const itemDate = this.yearsInfo[i];
            item.yearsSectionInstance.bindDate({
                year:itemDate,
            });
        }
    }
    setDisplay = (isShow) => {
        if(isShow){
            this.reset();
        }
        this.root.style.display = isShow?'block':'none';
    }

    getYearArr = (year) => {
        return [
            year - 12,
            year,
            year + 12,
        ];
    }
}