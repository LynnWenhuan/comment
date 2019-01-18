import Popover from '../../component/popover';
import DrawLayout from '../../component/drawLayout';
import StylePicker from '../../component/stylePicker';
import Base from './base';

export default class TextItem extends Base {
  constructor(props) {
    super(props);
    const {
      wrapper, isSupportTouch,
    } = this.props;
    this.placeHolderDom = document.createElement('DIV');
    this.placeHolderDom.style.display = 'none';
    wrapper.appendChild(this.placeHolderDom);
    let PopoverClass = Popover;
    if (isSupportTouch) {
      PopoverClass = DrawLayout;
    }
    this.popInstance = new PopoverClass({
      onBKClick: () => {
        if (this.value === '') {
          this.remove();
        }
        this.popInstance.hide();
      },
      content: this._createContent(),
      className: 'snk-comment-text-pop',
      direction: 'top',
    });
  }

  setTextAreaStyle = () => {
    this.textAreaDom.style.color = this.fontColor;
    this.textAreaDom.style.fontSize = `${this.fontSize}px`;
  }


  _createContent = () => {
    const { isSupportTouch, comment } = this.props;
    const content = document.createElement('DIV');
    content.className = `snk-comment-text-content-${isSupportTouch ? 'mobile' : 'pc'}`;
    this.textAreaDom = document.createElement('TEXTAREA');
    this.textAreaDom.setAttribute('placeholder', '请输入文字');
    this.setTextAreaStyle();
    const buttonBar = document.createElement('DIV');
    buttonBar.className = 'snk-comment-text-btnbar';
    const cancelBtn = document.createElement('BUTTON');
    cancelBtn.innerHTML = '取消';
    cancelBtn.className = 'cd-date-mobile-cancel';
    cancelBtn.addEventListener('click', () => {
      if (this.value === '') {
        this.remove();
      }
      this.popInstance.hide();
    });
    buttonBar.appendChild(cancelBtn);
    const deleteBtn = document.createElement('BUTTON');
    deleteBtn.innerHTML = '删除';
    deleteBtn.className = 'cd-date-mobile-delete';
    deleteBtn.addEventListener('click', () => {
      this.popInstance.hide();
      this.remove();
    });
    buttonBar.appendChild(deleteBtn);
    const okBtn = document.createElement('BUTTON');
    okBtn.innerHTML = '确定';
    okBtn.className = 'cd-date-mobile-ok';
    okBtn.addEventListener('click', () => {
      this.fontColor = this.selectedFontColor;
      this.fontSize = this.selectedFontSize;
      const value = this.textAreaDom.value.replace(/^\s+|\s+$/gm, '');
      if (value === '') {
        this.remove();
      } else {
        this.value = value;
        this._convertToImage();
      }
      this.popInstance.hide();
    });
    this.stylePickerInstance = new StylePicker({
      color: this.fontColor,
      fontSize: this.fontSize,
      colorSelect: comment.props.colorSelect,
      isSupportTouch,
      onColorChange: (color) => {
        this.selectedFontColor = color;
        this.textAreaDom.style.color = this.selectedFontColor;
        if (!isSupportTouch) {
          this.textAreaDom.focus();
        }
      },
      onFontSizeChange: (fontSize) => {
        this.selectedFontSize = fontSize;
        this.textAreaDom.style.fontSize = `${this.selectedFontSize}px`;
      },
    });
    buttonBar.appendChild(okBtn);
    content.appendChild(this.textAreaDom);
    content.appendChild(this.stylePickerInstance.root);
    content.appendChild(buttonBar);
    return content;
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
      this.placeHolderDom.className = 'snk-comment-item-ph';
      this.placeHolderDom.innerHTML = '请输入文字';
      this.placeHolderDom.style.left = `${position.left}px`;
      this.placeHolderDom.style.top = `${position.top}px`;
      this.placeHolderDom.style.display = 'block';
      target = this.placeHolderDom;
    } else {
      target = this.img;
    }
    this.stylePickerInstance.setFontColor(this.fontColor);
    this.stylePickerInstance.setFontSize(this.fontSize);
    this.setTextAreaStyle();
    this.popInstance.show({
      target,
      value: this.value,
      cb: () => {
        this.textAreaDom.value = this.value;
        this.textAreaDom.focus();
      },
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
    this.popInstance.remove();
    if (this.img) {
      wrapper.removeChild(this.img);
    }
    delete comment.items[this.id];
  }
}
