import util from '../../../core/util';

export default class MonthItem {
    constructor(props){
        this.props = props || {};
        const { datepicker,month,wrapper,index } = this.props;
        this.root = document.createElement("DIV");
        this.index = index;
        if(datepicker.currentMonthInfo.month -1 === this.index){
            this.select();
        }else {
            this.unSelect();
        }
        const itemHeight = `${datepicker.dayItemWidth*6/4}px`;
        this.innerSpan = document.createElement("SPAN");
        this.innerSpan.innerHTML = month;
        this.innerSpan.className = 'cd-month-span';
        this.root.appendChild(this.innerSpan);
        this.root.addEventListener('click',()=>{
            datepicker.monthSelected({
                item: this,
                month: index+1,
            });
        });
        wrapper.appendChild(this.root);
    }

    select = () => {
        this.root.className = 'cd-month-item cd-month-item-selected';
    }

    unSelect = () => {
        this.root.className = 'cd-month-item';
    }
}