import DatePicker from '../../component/datePicker';
import StylePicker from '../../component/stylePicker';
import Base from './base';

export default class DateItem extends Base {
  constructor(props) {
    super(props);
    const {
      comment, wrapper, isSupportTouch,
    } = this.props;
    this.stylePickerInstance = new StylePicker({
      color: this.fontColor,
      fontSize: this.fontSize,
      colorSelect: comment.props.colorSelect,
      isSupportTouch,
      onColorChange: (color) => {
        this.selectedFontColor = color;
        this.setPreviewStyle({
          color: this.selectedFontColor,
        });
      },
      onFontSizeChange: (fontSize) => {
        this.selectedFontSize = fontSize;
        this.setPreviewStyle({
          fontSize: this.selectedFontSize,
        });
      },
    });
    this.datePickerInstance = new DatePicker({
      stylePicker: this.stylePickerInstance.root,
      preview: this.getPreView(),
      onOK: (params) => {
        this.fontColor = this.selectedFontColor;
        this.fontSize = this.selectedFontSize;
        this.value = params.dateStr;
        this._convertToImage();
      },
      onDelete: () => {
        this.remove();
      },
      onCancel: () => {
        if (this.value === '') {
          this.remove();
        }
      },
      onChange: (params) => {
        this.previewDom.innerHTML = params.dateStr;
      },
    });
    this.placeHolderDom = document.createElement('DIV');
    this.placeHolderDom.className = 'snk-comment-item-ph';
    this.placeHolderDom.innerHTML = '请输入日期';
    this.placeHolderDom.style.display = 'none';
    wrapper.appendChild(this.placeHolderDom);
  }

    getPreView = () => {
      this.previewDom = document.createElement('DIV');
      this.previewDom.className = 'snk-comment-date-preview';
      this.previewDom.innerHTML = '-';
      this.setPreviewStyle({
        color: this.fontColor,
        fontSize: this.fontSize,
      });
      return this.previewDom;
    }

    setPreviewStyle = (styles) => {
      Object.keys(styles).forEach((key) => {
        this.previewDom.style[key] = key === 'fontSize' ? `${styles[key]}px` : styles[key];
      });
      // for (const key in styles) {
      //   this.previewDom.style[key] = key === 'fontSize' ? `${styles[key]}px` : styles[key];
      // }
    }

    doSomething = (something) => {
      if (!something) {
        console.log('数据复原');
      }
    }
    showEdit = () => {
      const { position } = this.props;
      let target = null;
      if (this.value === '') {
        this.placeHolderDom.style.left = `${position.left}px`;
        this.placeHolderDom.style.top = `${position.top}px`;
        this.placeHolderDom.style.display = 'block';
        target = this.placeHolderDom;
      } else {
        target = this.img;
      }
      this.setPreviewStyle({
        color: this.fontColor,
        fontSize: this.fontSize,
      });
      this.stylePickerInstance.setFontColor(this.fontColor);
      this.stylePickerInstance.setFontSize(this.fontSize);
      this.datePickerInstance.show({
        target,
        value: this.value,
      });
    }
    remove = () => {
      const { wrapper, comment } = this.props;
      comment.onImageDel({
        itemInstance: this,
        img: this.img,
        id: this.id,
      });
      wrapper.removeChild(this.placeHolderDom);
      this.datePickerInstance.remove();
      if (this.img) {
        wrapper.removeChild(this.img);
      }
      delete comment.items[this.id];
    }
}
