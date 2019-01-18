import './index.less';
import Popover from '../popover';
import DrawLayout from '../drawLayout';
import Days from './days';
import Months from './months';
import Years from './years';
import util from '../../core/util';

const isMobile = "ontouchend" in document ? true : false;

export default class DatePicker {
    constructor(props){
        this.props = props || {};
        this.root = document.createElement("DIV");
        this.setValue(this.props.value,true);
        const valueInfo = util.getDateInfo(this.value);
        let PopClass;
        this.isMobile = isMobile;
        this.gridWidth = 0;
        if(isMobile){
            this.gridWidth = window.innerWidth;
            PopClass = DrawLayout;
        } else {
            this.gridWidth = 300;
            PopClass = Popover;
        }
        this.currentView = 'day';
        this.root.style.width = `${this.gridWidth}px`;
        this.dayItemWidth = this.gridWidth / 7;
        this.gridHeight = this.dayItemWidth * 6;
        if(isMobile) {
            this.gridHeight -= 40;
        }
        this.popInstance = new PopClass({
            content: this.createContent(),
            bkContent: this.getPreviewDom(),
            onBKClick:()=>{
                this.cancel();
            }
        });
        this.setCurrentMonth(`${valueInfo.year}-${valueInfo.month}-${1}`,true);
        this.setValue(this.props.value);
        this.onChange(true);
    }

    
    remove = () => {
        this.popInstance.remove();
    }

    getPreviewDom = () => {
        return this.props.preview;
    }
    createContent = ()=> {
        const gridWrapper = document.createElement("DIV");
        gridWrapper.className = 'cd-date-grid-wrapper';
        gridWrapper.style.width = this.gridWidth +'px';
        gridWrapper.style.height = this.gridHeight +'px';
        if(!isMobile){
            this.root.appendChild(this.getPreviewDom());
        }
        if(this.props.stylePicker) {
            this.root.appendChild(this.props.stylePicker);
        }
        this.root.appendChild(this._createOKCancelBar());
        this.root.appendChild(this._createSwitchWrapper());
        this.root.appendChild(gridWrapper);
        this.days = new Days({
            show:this.currentView === 'day',
            datepicker:this,
            wrapper:gridWrapper
        });
        this.months = new Months({
            show:this.currentView === 'month',
            datepicker:this,
            wrapper:gridWrapper
        })
        this.years = new Years({
            show:this.currentView === 'year',
            datepicker:this,
            wrapper:gridWrapper
        })
        return this.root;
    }

    cancel = () => {
        if(this.props.onCancel) {
            this.props.onCancel({
                date:util.getDateInfo(this.value),
                dateStr:util.ConvertDateToStr(this.value),
                datePicker:this,
            });
        }
        this.popInstance.hide();
    }

    _createOKCancelBar = () => {
        const bar = document.createElement("DIV");
        bar.className = 'cd-date-okcancel-bar';
        const okBtn = document.createElement("Button");
        bar.appendChild(okBtn);
        okBtn.innerHTML = '确认';
        okBtn.className = 'cd-date-mobile-ok';
        okBtn.addEventListener('click',()=>{
            if(this.props.onOK) {
                this.props.onOK({
                    date:util.getDateInfo(this.value),
                    dateStr:util.ConvertDateToStr(this.value),
                    datePicker:this,
                });
            }
            this.popInstance.hide();
        });
        
        const cancelBtn = document.createElement("Button");
        bar.appendChild(cancelBtn);
        cancelBtn.innerHTML = '取消';
        cancelBtn.className = 'cd-date-mobile-cancel';
        cancelBtn.addEventListener('click',()=>{
           this.cancel();
        });
        const deleteBtn = document.createElement("Button");
        bar.appendChild(deleteBtn);
        deleteBtn.innerHTML = '删除';
        deleteBtn.className = 'cd-date-mobile-delete';
        deleteBtn.addEventListener('click',()=>{
            if(this.props.onDelete) {
                this.props.onDelete({
                    date:util.getDateInfo(this.value),
                    dateStr:util.ConvertDateToStr(this.value),
                    datePicker:this,
                });
            }
            this.popInstance.hide();
        });
        return bar;
    }

    _createWeekNames = () => {
        const weeks = ['日','一','二','三','四','五','六'];
        this.weeksWrapper = document.createElement("DIV");
        this.weeksWrapper.className = 'cd-date-week-wrapper';
        for(let i = 0,j=weeks.length;i<j;i+=1) {
            const weekitem = document.createElement("SPAN");
            weekitem.innerHTML = weeks[i];
            this.weeksWrapper.appendChild(weekitem);
        }
        return this.weeksWrapper;
    }
    onChange = (isInit)=>{
        if(this.props.onChange) {
            this.props.onChange({
                isInit,
                date:util.getDateInfo(this.value),
                dateStr:util.ConvertDateToStr(this.value),
                datePicker:this,
            });
        }
    }
    daySelected = (params) => {
        this.setValue(params.date.dateStr);
        this.onChange(false);
        const swiperItems = this.days.swiper.itemInstanceArray;
        for(let i = 0,j =swiperItems.length; i <j;i+=1) {
            const section = swiperItems[i].daysSectionInstance;
            for(let n = 0, m = section.itemArr.length; n<m;n+=1) {
                if(section.itemArr[n].dateStr === params.date.dateStr) {
                    section.itemArr[n].select();
                }else {
                    section.itemArr[n].unSelect();
                }
            }
        }
    }

    monthSelected = (params) => {
        const curDate = util.getDateInfo(this.currentMonth);
        this.setCurrentMonth(util.convertStrToDate(`${curDate.year}-${params.month}-${1}`));
        this.showLabel();
        this.switchByViewType('day');
    }

    yearSelected = (params) => {
        const curDate = util.getDateInfo(this.currentMonth);
        this.setCurrentMonth(util.convertStrToDate(`${params.year}-${curDate.month}-${1}`));
        this.showLabel();
        this.switchByViewType('day');
    }

    showLabel = (value)=>{
        const DateInfo = util.getDateInfo( value || this.currentMonth);
        this.yearLabel.innerHTML = DateInfo.year;
        this.monthLabel.innerHTML = DateInfo.month;
    }

    setCurrentMonth = (currentMonth,nosetLabel) => {
        this.currentMonth = currentMonth;
        this.currentMonthInfo = util.getDateInfo(this.currentMonth);
        if(this.currentView==='month') {
            this.months && this.months.setMonth(this.currentMonthInfo.month);
        }
        if(this.currentView==='year') {
            this.years && this.years.setYear(this.currentMonthInfo.year);
        }
        if(!nosetLabel){
            this.showLabel();
        }
    }
    setValue = (value,nosetLabel) => {
        this.value = util.convertStrToDate(value);
        this.valueInfo = util.getDateInfo(this.value);
        this.valueStr = util.ConvertDateToStr(this.value);
        if(!nosetLabel){
            this.showLabel(this.value);
        }
    }
    _createSwitchWrapper = () => {
        const switchWrapper = document.createElement("DIV");
        switchWrapper.className = 'cd-date-switch';
        const leftYear = document.createElement("DIV");
        leftYear.className = 'dc-date-switch-item';
        const leftYearIcon = document.createElement("SPAN");
        leftYearIcon.className='cd-date-left-icon';
        leftYear.appendChild(leftYearIcon);
        leftYear.addEventListener('click',(e)=>{
            if(this.currentView === 'day') {
                if(this.isGoPreYear) {
                    return;
                }
                this.isGoPreYear = true;
                this.isGoPreYear = setTimeout(()=>{
                    this.isGoPreYear = false;
                },320);
                let date = util.getPreMonth(`${this.currentMonthInfo.year-1}-${this.currentMonthInfo.month}-1`);
                this.days.reset(date,true);
                this.days.swiper.goPre();
                
            }else {
                this.setCurrentMonth(util.getPreYear(this.currentMonth));
            }
        });

        this.yearLabel = document.createElement("DIV");
        this.yearLabel.className = 'dc-date-switch-year';
        this.yearLabel.addEventListener('click',()=>{
            this.switchByViewType('year');
        });
        const rightYear = document.createElement("DIV");
        rightYear.className = 'dc-date-switch-item';
        const rightYearIcon = document.createElement("SPAN");
        rightYearIcon.className='cd-date-right-icon';
        rightYear.appendChild(rightYearIcon);
        rightYear.addEventListener('click',(e)=>{
            if(this.currentView === 'day') {
                if(this.isGoNextYear){
                    return;
                }
                this.isGoNextYear = true;
                setTimeout(()=>{
                    this.isGoNextYear = false;
                },320);
                let date = util.getNextMonth(`${this.currentMonthInfo.year+1}-${this.currentMonthInfo.month}-1`);
                this.days.reset(date,true);
                this.days.swiper.goNext();
            }else {
                this.setCurrentMonth(util.getNextYear(this.currentMonth));
            }
        });

        const leftMonth = document.createElement("DIV");
        leftMonth.className = 'dc-date-switch-item';
        const leftMonthIcon = document.createElement("SPAN");
        leftMonthIcon.className='cd-date-left-icon';
        leftMonth.appendChild(leftMonthIcon);
        leftMonth.addEventListener('click',()=>{
            this.days.swiper.goNext();
        });
        this.monthLabel = document.createElement("DIV");
        this.monthLabel.className = 'dc-date-switch-month';
        this.monthLabel.addEventListener('click',()=>{
            this.switchByViewType('month');
        });
        const rightMonth = document.createElement("DIV");
        rightMonth.className = 'dc-date-switch-item';
        const rightMonthIcon = document.createElement("SPAN");
        rightMonthIcon.className='cd-date-right-icon';
        rightMonth.appendChild(rightMonthIcon);
        rightMonth.addEventListener('click',()=>{
            this.days.swiper.goPre();
        });

        switchWrapper.appendChild(leftYear);
        switchWrapper.appendChild(this.yearLabel);
        switchWrapper.appendChild(rightYear);

        switchWrapper.appendChild(leftMonth);
        switchWrapper.appendChild(this.monthLabel);
        switchWrapper.appendChild(rightMonth);
        return switchWrapper;
    }


    switchByViewType = (type) => {
        if(this.currentView!==type){
            this.currentView = type;
            this.days.setDisplay(this.currentView ==='day');
            this.months.setDisplay(this.currentView ==='month');
            this.years.setDisplay(this.currentView ==='year');
        }else {
            this.currentView = 'day';
            this.days.setDisplay(true);
            this.months.setDisplay(false);
            this.years.setDisplay(false);
        }
    }

    
    show = (params) => {
        this.setCurrentMonth(params.value,true);
        this.setValue(params.value);
        this.days.reset(params.value);
        this.popInstance.show(params);
    }
    hide = () => {

    }
}
