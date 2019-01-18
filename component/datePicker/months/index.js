import util from '../../../core/util';
import MonthItem from './monthItem';

var MonthArr = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"];
export default class Months {
    constructor(props) {
        this.props = props || {};
        const {show,wrapper} = this.props;
        this.root = document.createElement("DIV");
        this.root.className = 'snk-cd-days-wrapper';
        if(!show) {
            this.root.style.display = 'none';
        }
        this.createLayout();
        wrapper.appendChild(this.root);
       
    }

    createLayout = () => {
        const {datepicker} = this.props;
        this.root.innerHTML = '';
        this.monthItemArr = [];
        for(let i = 0,j=MonthArr.length;i<j;i+=1){
            this.monthItemArr.push(new MonthItem({
                wrapper:this.root,
                month:MonthArr[i],
                index:i,
                datepicker,
            }));
        }
    }
    setMonth = (month) => {
        for(let i = 0,j=this.monthItemArr.length;i<j;i+=1) {
            if(this.monthItemArr[i].index === month -1){
                this.monthItemArr[i].select();
            }else {
                this.monthItemArr[i].unSelect();
            }
        }
    }
    setDisplay = (isShow) => {
        if(isShow) {
            this.createLayout();
        }
        this.root.style.display = isShow?'block':'none';
    }

}