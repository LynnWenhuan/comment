import util from '../../../core/util';

export default class YearItem {
    constructor(props){
        this.props = props || {};
        const { datepicker,year,wrapper } = this.props;
        this.year = year;
        this.root = document.createElement("DIV");
        if(datepicker.currentMonthInfo.year === year) {
            this.select();
        }else {
            this.unSelect();
        }
        const itemHeight = `${datepicker.dayItemWidth*6/4}px`;
        // this.root.style.height = itemHeight;
        // this.root.style.lineHeight = itemHeight;
        this.innerSpan = document.createElement("SPAN");
        this.innerSpan.innerHTML = year;
        this.innerSpan.className = 'cd-year-span';
        this.root.appendChild(this.innerSpan);
        if(!datepicker.isMobile) {
            let startX;
            this.innerSpan.addEventListener("mousedown", (e) => {
                startX = e.pageX;
            });
            this.innerSpan.addEventListener('mouseup', (e) => {
                if(Math.abs(e.pageX - startX)< 3){
                    this.itemClick();
                }
            });
        }else{
             this.innerSpan.addEventListener('click', (e) => {
                this.itemClick();
            });
        }
        wrapper.appendChild(this.root);
    }

    itemClick = () => {
        const { datepicker,year} = this.props;
        datepicker.yearSelected({
            item: this,
            year,
        });
    }
    select = () => {
        this.root.className = `cd-year-item cd-year-item-selected`;
    }

    unSelect = () => {
        this.root.className = `cd-year-item`;
    }
}