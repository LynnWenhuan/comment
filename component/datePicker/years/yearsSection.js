import util from '../../../core/util';
import YearItem from './yearItem';


export default class DaysSection {
    constructor(props) {
        this.props = props || {};
        const {wrapper, year} = this.props;
        this.root = document.createElement("DIV");
        this.root.className = 'snk-cd-years-section';
        this.date = null;
        wrapper.appendChild(this.root);
    }

    bindDate = (params)=> {
        const {datepicker} = this.props;
        this.root.innerHTML = '';
        this.itemArr = [];
        for(let i = params.year;i<params.year+12;i+=1){
            this.itemArr.push(new YearItem({
                wrapper:this.root,
                year:i,
                datepicker,
            }));
        }
    }
   
}