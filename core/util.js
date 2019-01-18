let translateKeys;

const Re = {
  convertStrToDate(str) {
    if (!str) {
      return new Date();
    }
    const strarr = str.split(' ');
    const yearmonthday = strarr[0];
    const hourminsecond = strarr[1] || '';
    const hourminsecondarr = hourminsecond.split(':');
    let yearmonthdayarr = yearmonthday.split('-');
    if (yearmonthdayarr.length !== 3) {
      yearmonthdayarr = yearmonthday.split('/');
    }
    if (yearmonthdayarr.length !== 3) {
      return new Date();
    }
    if (!hourminsecond) {
      return new Date(
        yearmonthdayarr[0], parseInt(yearmonthdayarr[1], 10) - 1, yearmonthdayarr[2]
      );
    }
    return new Date(
      yearmonthdayarr[0],
      parseInt(yearmonthdayarr[1], 10) - 1,
      yearmonthdayarr[2], hourminsecondarr[0] || 0,
      hourminsecondarr[1] || 0, hourminsecondarr[2] || 0
    );
  },
  getPreMonth(date) {
    const dateInfo = this.getDateInfo(date);
    const nextMonth = new Date(dateInfo.year, dateInfo.month - 1, 0);
    return nextMonth;
  },
  getPreMonthFirstDay(date) {
    return this.getCurMonthFirstDay(this.getPreMonth(date));
  },
  getNextMonthFirstDay(date) {
    return this.getCurMonthFirstDay(this.getNextMonth(date));
  },
  getCurMonthFirstDay(date1) {
    const date = this.convertToDate(date1);
    const dateInfo = this.getDateInfo(date);
    return new Date(dateInfo.year, dateInfo.month - 1, 1);
  },
  getPreYear(date) {
    const dateInfo = this.getDateInfo(date);
    const preYear = new Date(dateInfo.year - 1, dateInfo.month - 1, 1);
    return preYear;
  },
  setDateToYear(date, year) {
    const dateInfo = this.getDateInfo(date);
    const preYear = new Date(year, dateInfo.month - 1, 1);
    return preYear;
  },
  setMonthToDate(date, month1) {
    const month = parseInt(month1, 10);
    const dateInfo = this.getDateInfo(date);
    return new Date(dateInfo.year, month - 1, 1);
  },
  getNextYear(date) {
    const dateInfo = this.getDateInfo(date);
    const nextYear = new Date(dateInfo.year + 1, dateInfo.month - 1, 1);
    return nextYear;
  },
  getNextMonth(date) {
    const dateInfo = this.getDateInfo(date);
    const nextMonth = new Date(dateInfo.year, dateInfo.month + 1, 0);
    return nextMonth;
  },
  getMonthFirstDayWhicDayInWeek(date1) {
    const date = this.convertToDate(date1);
    const d = new Date(date.getFullYear(), date.getMonth(), 1);
    return d.getDay();
  },
  getDateWhichDayInWeek(date1) {
    const date = this.convertToDate(date1);
    return date.getDay();
  },
  timestampToDate(timestamp) {
    let time = timestamp;
    if (!timestamp) return new Date();

    // 特殊处理php时间戳
    if (timestamp.length === 10) {
      time = timestamp * 1000;
    }
    return new Date(parseInt(time, 10));
  },
  ConvertDateToStr(date1, formart) {
    const date = this.convertToDate(date1);
    const info = this.getDateInfo(date);
    info.month = info.month < 10 ? `0${info.month}` : info.month;
    info.day = info.day < 10 ? `0${info.day}` : info.day;
    info.min = info.min < 10 ? `0${info.min}` : info.min;
    info.second = info.second < 10 ? `0${info.second}` : info.second;
    info.hour = info.hour < 10 ? `0${info.hour}` : info.hour;
    if (formart === 'yyyy-MM-dd') {
      return `${info.year}-${info.month}-${info.day}`;
    } else if (formart === 'yyyy-MM') {
      return `${info.year}-${info.month}`;
    } else if (formart === 'yyyy-MM-dd hh:mm:ss') {
      return `${info.year}-${info.month}-${info.day} ${info.hour}:${info.min}:${info.second}`;
    } else if (formart === 'MM-dd hh:mm') {
      return `${info.month}-${info.day} ${info.hour}:${info.min}`;
    } else if (formart === 'hh:mm') {
      return `${info.hour}:${info.min}`;
    } else if (formart === 'MM-dd week') {
      return `${info.month}-${info.day} ${info.week}`;
    } else if (formart === 'yyyy-MM-dd weekFullStr') {
      return `${info.year}-${info.month}-${info.day} ${info.weekFullStr}`;
    } else if (formart === 'yyyy-MM-dd week') {
      return `${info.year}-${info.month}-${info.day} ${info.week}`;
    } else if (formart === 'yyyy-MM-dd hh:mm') {
      return `${info.year}-${info.month}-${info.day} ${info.hour}:${info.min}`;
    } else if (formart === 'yyyy年MM月dd日') {
      return `${info.year}年${info.month}月${info.day}日`;
    } else if (formart === 'all') {
      return {
        'yyyy-MM-dd': `${info.year}-${info.month}-${info.day}`,
        yyyy年MM月dd日: `${info.year}年${info.month}月${info.day}日`,
      };
    }

    return `${info.year}-${info.month}-${info.day}`;
  },
  getMonthDayCount(date1) {
    const date = this.convertToDate(date1);
    const newDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return newDate.getDate();
  },
  convertToDate(date) {
    try {
      if (date instanceof Date) {
        return date;
        // eslint-disable-next-line
      } else if (!isNaN(date)) {
        return this.timestampToDate(date);
      } else if (typeof (date) === 'string') {
        return this.convertStrToDate(date);
      }
    } catch (e) {
      return new Date();
    }

    return new Date();
  },
  _processtime(num) {
    return (num < 10 ? (`0${num}`) : num);
  },
  weekArr: ['日', '一', '二', '三', '四', '五', '六'],
  getDateInfo(date1) {
    const date = this.convertToDate(date1);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const min = date.getMinutes();
    const second = date.getSeconds();
    const week = date.getDay();
    const timestamp = date.getTime();

    return {
      year: date.getFullYear(),
      month,
      weekStr: this.weekArr[week],
      week: this.weekArr[week],
      weekFullStr: `星期${this.weekArr[week]}`,
      monthStr: this._processtime(month),
      day,
      dayStr: this._processtime(day),
      hour,
      hourStr: this._processtime(hour),
      min,
      minStr: this._processtime(min),
      second,
      secondStr: this._processtime(second),
      timestamp,
    };
  },
  getTransitionKeys() {
    if (translateKeys) {
      return translateKeys;
    }
    const testStyle = document.createElement('DIV').style;
    const me = {};
    if ('-webkit-transform' in testStyle) {
      me.transitionend = 'webkitTransitionEnd';
      me.transform = 'WebkitTransform';
      me.cssTransform = '-webkit-transform';
      me.transition = 'WebkitTransition';
    } else if ('-ms-transform' in testStyle) {
      me.transitionend = 'msTransitionEnd';
      me.transform = 'msTransform';
      me.cssTransform = '-ms-transform';
      me.transition = 'msTransition';
    } else {
      me.transitionend = 'transitionend';
      me.transform = 'transform';
      me.cssTransform = 'transform';
      me.transition = 'transition';
    }
    translateKeys = me;
    return me;
  },
  throttle(func, wait, options1) {
    let context = null;
    let args = null;
    let result = null;
    let timeout = null;
    let previous = 0;
    let options = options1;
    if (!options) options = {};
    const later = () => {
      previous = options.leading === false ? 0 : new Date().valueOf();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) {
        context = null;
        args = null;
      }
    };
    return () => {
      const now = new Date().valueOf();
      if (!previous && options.leading === false) previous = now;
      const remaining = wait - (now - previous);
      context = this;
      // eslint-disable-next-line
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        if (!timeout) {
          context = null;
          args = null;
        }
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  },
};

export default Re;
