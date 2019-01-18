import util from '../../../core/util';
import DayItem from './dayItem';

export default class DaysSection {
    constructor(props) {
        this.props = props || {};
        const {wrapper} = this.props;
        this.root = document.createElement("DIV");
        this.root.className = 'snk-cd-days-section';
        this.date = null;
        this.SumDay = 6 * 7;
        wrapper.appendChild(this.root);
       
    }

    bindDate = (params)=> {
        const {date} = params;
        this.date = date;
        const {datepicker,days} = this.props;
        this.itemArr = [];
        this.root.innerHTML = '';
        const daysArr = this.getDaysArr();
        for(let i = 0,j=daysArr.length;i<j;i+=1){
            const dayInfo = daysArr[i];
            this.itemArr.push(new DayItem({
              datepicker,
              wrapper:this.root,
              dayInfo,
              days,
          }));
        }
    }
    getDaysArr = () => {
        var Re = [];
        var monthDayCount = util.getMonthDayCount(this.date);
        var monthInfo = util.getDateInfo(this.date);
        var firstDayWhichDayInWeek = util.getMonthFirstDayWhicDayInWeek(this.date);
        var nextMonthCount = this.SumDay - firstDayWhichDayInWeek - monthDayCount;
        if (firstDayWhichDayInWeek > 0) {
          var preMonth = util.getPreMonth(this.date);
          var preMonthLastDay = util.getMonthDayCount(preMonth);
          var preMonthInfo = util.getDateInfo(preMonth);
          for (var i = 0; i < firstDayWhichDayInWeek; i++) {
            var day = (preMonthLastDay - firstDayWhichDayInWeek + i + 1);
            var date = new Date(preMonthInfo.year,preMonthInfo.month-1,day);
            Re.push({
              date:date,
              dateStr :util.ConvertDateToStr(date),
              year: preMonthInfo.year,
              month: preMonthInfo.month,
              day: day,
              mark: "premonth"
            });
          }
        }
        for (var i = 1; i <= monthDayCount; i++) {
          var date = new Date(monthInfo.year,monthInfo.month-1,i);
          Re.push({
            date:date,
            dateStr :util.ConvertDateToStr(date),
            year: monthInfo.year,
            month: monthInfo.month,
            day: i,
            mark: "curmonth"
          });
        }
        if (nextMonthCount > 0) {
          var nextMonth = util.getNextMonth(this.date);
          var nextMonthInfo = util.getDateInfo(nextMonth);
          for (var i = 1; i <= nextMonthCount; i++) {
            var date = new Date(nextMonthInfo.year,nextMonthInfo.month-1,i);
            Re.push({
              date:date,
              dateStr :util.ConvertDateToStr(date),
              year: nextMonthInfo.year,
              month: nextMonthInfo.month,
              day: i,
              mark: "nextmonth"
            });
          }
        }
        return Re;
    }
}