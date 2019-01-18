import Swiper from '../../swiper';
import DaysSection from './daysSection';
import util from '../../../core/util';


export default class Days {
    constructor(props) {
        this.props = props || {};
        const {show,wrapper,datepicker} = this.props;
        this.root = document.createElement("DIV");
        this.monthInfo = this.getMonthArr(datepicker.currentMonth);
        this.root.className = 'snk-cd-days-wrapper';
        this.root.appendChild(datepicker._createWeekNames());
        const itemWrapper = document.createElement("DIV");
        itemWrapper.className = 'cd-days-bottom-wrapper';
        this.root.appendChild(itemWrapper);
        new Swiper({
            wrapper:itemWrapper,
            wrapperSize:datepicker.gridWidth,
            onItemCreate:(params) => {
                const sectionInstance = new DaysSection({
                    datepicker,
                    days:this,
                    wrapper:params.item.root,
                })
                params.item.daysSectionInstance = sectionInstance;
            },
            onPositionChange:(params) => {
                if(!this.swiper){
                    this.swiper = params.swiper;
                }
                if(params.direction === 'next') {
                    this.monthInfo = this.getMonthArr(util.getPreMonthFirstDay(datepicker.currentMonth));
                } else if(params.direction==='pre'){
                    this.monthInfo = this.getMonthArr(util.getNextMonthFirstDay(datepicker.currentMonth));
                }
                this.createLayout();
            }
        });
        if(!show) {
            this.root.style.display = 'none';
        }
      
        wrapper.appendChild(this.root);
    }

    createLayout = () => {
        const {datepicker} = this.props;
        for(let i =0;i<=2;i+=1){
            const item = this.swiper.itemInstanceArray[i];
            const itemDate = this.monthInfo[i];
            item.daysSectionInstance.bindDate({
                date:itemDate
            });
        }
    }
    reset = (date,noSetLabel) => {
        const {datepicker} = this.props;
        this.monthInfo = this.getMonthArr(date||datepicker.currentMonth,noSetLabel);
        this.createLayout();
    }
    setDisplay = (isShow) => {
        if(isShow) {
            this.reset();
        }
        this.root.style.display = isShow?'block':'none';
    }
    getMonthArr = (curMonth,noSetLabel)=> {
        const {datepicker} = this.props;
        datepicker.setCurrentMonth(curMonth,noSetLabel);
        return [ util.getPreMonthFirstDay(curMonth) ,curMonth,util.getNextMonthFirstDay(curMonth) ];
    }
}