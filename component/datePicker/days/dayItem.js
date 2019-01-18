import util from '../../../core/util';

export default class DayItem {
    constructor(props){
        this.props = props || {};
        const { datepicker,dayInfo,wrapper } = this.props;
        this.root = document.createElement("DIV");
        this.dateStr = dayInfo.dateStr;
        if(datepicker.valueStr === this.dateStr) {
            this.root.className = `cd-day-item ${dayInfo.mark} cd-day-item-selected`;
        }else {
            this.root.className = `cd-day-item ${dayInfo.mark}`;
        }
        this.root.setAttribute('title',this.dateStr);
        this.root.setAttribute('day',dayInfo.day);
        this.root.setAttribute('month',dayInfo.month);
        this.root.setAttribute('year',dayInfo.year);
      
        this.root.style.width = `${datepicker.dayItemWidth}px`;
        this.innerSpan = document.createElement("SPAN");
        this.innerSpan.innerHTML = dayInfo.day;
        this.innerSpan.className = 'cd-day-span';
        let spanWidth = `${datepicker.dayItemWidth*0.8}px`;
        let spanTop = `${datepicker.dayItemWidth*0.1}px`;
        if(datepicker.isMobile) {
            spanWidth = `${datepicker.dayItemWidth*0.7}px`;
        }
        this.innerSpan.style.width = spanWidth;
        this.innerSpan.style.height = spanWidth;
        this.innerSpan.style.lineHeight = spanWidth;
        this.root.appendChild(this.innerSpan);
        wrapper.appendChild(this.root);
        
        if(!datepicker.isMobile) {
            let startX;
            this.innerSpan.addEventListener("mousedown", (e) => {
                startX = e.pageX;
            });
            this.innerSpan.addEventListener('mouseup', (e) => {
                if(Math.abs(e.pageX - startX)< 3){
                    this.itemClick(e);
                }
            });
        }else{
             this.innerSpan.addEventListener('click', (e) => {
                this.itemClick(e);
            });
        }
       
       
    }

    itemClick = () => {
        const { datepicker,dayInfo,days} = this.props;
        if(dayInfo.mark === 'premonth') {
            days.swiper.goNext();
        } else if(dayInfo.mark ==='nextmonth') {
            days.swiper.goPre();
        }
        datepicker.daySelected({
            item:this,
            date:dayInfo,
        });
    }

    select = () => {
        const {dayInfo} = this.props;
        this.root.className = `cd-day-item ${dayInfo.mark} cd-day-item-selected`;
    }

    unSelect = () => {
        const {dayInfo} = this.props;
        this.root.className = `cd-day-item ${dayInfo.mark}`;
    }
}