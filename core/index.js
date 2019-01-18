import './index.less';
import DateItem from './item/dateItem';
import TextItem from './item/textItem';
// import SelectItem from './item/selectItem';

// import util from './util';

// const transformInfo = util.getTransitionKeys();
const isSupportTouch = 'ontouchend' in document;
// const eventDict = {
//   start: isSupportTouch ? 'touchstart' : 'mousedown',
//   move: isSupportTouch ? 'touchmove' : 'mousemove',
//   end: isSupportTouch ? 'touchend' : 'mouseup',
//   cancel: isSupportTouch ? 'touchcancel' : 'mouseleave',
// };
let touchtime = 0;

class Comment {
  constructor(props) {
    this.props = props || {};
    this.items = {};
    this.disabled = props.disabled;
    this.setType(this.props.defaultType);
    if (!this.props.wrapper) {
      console.error('Comment构造参数缺少wrapper字段');
      return;
    }
    this.props.wrapper.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (new Date().getTime() - touchtime < 500) { // 双击事件
        touchtime = 0;
      } else {
        touchtime = new Date().getTime();
        return;
      }
      if (this.disabled) {
        return;
      }
      this.startEdit(e);
    });
  }

  setDisabled = (disabled) => {
    this.disabled = disabled;
  }

  startEdit = (e) => {
    let ItemClass = DateItem;
    if (this.itemType === 'text') {
      ItemClass = TextItem;
    }
    const itemInstance = new ItemClass({
      data: {},
      comment: this,
      type: this.itemType,
      wrapper: this.props.wrapper,
      isSupportTouch,
      position: {
        left: e.offsetX,
        top: e.offsetY,
      },
    });
    itemInstance.showEdit();
  }

  onImageCreate = (props) => {
    if (this.props.onImageCreate) {
      this.props.onImageCreate(props);
    }
  }

  onImageDel = (props) => {
    if (this.props.onImageDel) {
      this.props.onImageDel(props);
    }
  }

  setData = (data) => {
    for (let i = 0, j = data.length; i < j; i += 1) {
      const item = data[i];
      let ItemClass = DateItem;
      const type = Number.isNaN(Date.parse(item.value || '')) ? 'text' : 'date';
      if (type === 'text') {
        ItemClass = TextItem;
      }
      const itemInstance = new ItemClass({
        data: item,
        comment: this,
        type,
        wrapper: this.props.wrapper,
        fontSize: this.parseValueInt(item.fontSize),
        fontColor: item.fontColor,
        src: item.src || '',
        value: item.value || '',
        isSupportTouch,
        position: {
          left: this.parseValueInt(item.left),
          top: this.parseValueInt(item.top),
        },
      });
      itemInstance.doSomething(); // 并无实际用途
    }
  }

  getData = () => {
    const result = [];
    Object.keys(this.items).forEach((key) => {
      const item = this.items[key];
      result.push({
        fontSize: item.fontSize,
        src: item.src,
        value: item.value,
        position: {
          left: item.img.offsetLeft,
          top: item.img.offsetTop,
        },
        fontColor: item.fontColor,
      });
    });
    // for (let key in this.items) {
    //   const item = this.items[key];
    //   result.push({
    //     fontSize: item.fontSize,
    //     src: item.src,
    //     value: item.value,
    //     position: {
    //       left: item.img.offsetLeft,
    //       top: item.img.offsetTop,
    //     },
    //     fontColor: item.fontColor,
    //   });
    // }
    return result;
  }

  parseValueInt = (val) => {
    let _v = val || 0;
    if (Number.isNaN(val)) {
      _v = 0;
    }
    return parseInt(_v, 10);
  }

  setType = (type) => {
    // date || text
    let curT = type || 'date';
    if (['date', 'text'].indexOf(curT) < 0) {
      curT = 'date';
    }
    this.itemType = type;
  }
}
window.SNKComment = Comment;
export default Comment;
