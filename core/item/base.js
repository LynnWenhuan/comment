export default class Base {
  constructor(props) {
    this.props = props || {};
    this.disabled = false;
    const {
      type, value, comment, position, src,
    } = this.props;
    this.type = type;
    this.value = value || '';
    const itemId = new Date().valueOf() +
      Math.floor(position.left) + Math.floor(Math.random() * 10000);
    this.id = Math.floor(itemId);
    if (comment.items[this.id]) {
      this.id += Math.floor(Math.random() * 10000);
    }
    this.selectedFontSize = props.fontSize || 20;
    this.fontSize = props.fontSize || 20;
    this.selectedFontColor = props.fontColor || 'black';
    this.fontColor = props.fontColor || 'black';
    comment.items[this.id] = this;
    if (src) {
      this.src = src;
      this.showImage(src);
    }
  }


  setDisabled = (disabled) => {
    this.disabled = disabled;
  }

  bindEvents = () => {
    const { isSupportTouch, comment } = this.props;
    if (isSupportTouch) {
      this.img.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (comment.disabled) {
          return;
        }
        if (this.disabled) {
          return;
        }
        this.showEdit();
      });
    } else {
      this.img.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
      });
      let start = {
        x: 0,
        y: 0,
      };
      let diff = {
        x: 0,
        y: 0,
      };
      this.img.addEventListener('mousedown', (e) => {
        start = {
          x: e.pageX,
          y: e.pageY,
        };
        diff = {
          x: 0,
          y: 0,
        };
      });
      this.img.addEventListener('mousemove', (e) => {
        diff = {
          x: e.pageX - start.x,
          y: e.pageY - start.y,
        };
      });
      this.img.addEventListener('mouseup', () => {
        if (comment.disabled) {
          return;
        }
        if (this.disabled) {
          return;
        }
        if (Math.abs(diff.x) < 3 && Math.abs(diff.y) < 3) {
          this.showEdit();
        }
      });
    }
  }

  showImage = (src) => {
    const {
      position, wrapper, comment, data,
    } = this.props;
    this.img = new window.Image();
    this.img.src = src;
    this.img.className = 'snk-comment-item-img';
    this.img.style.left = `${position.left}px`;
    this.img.style.top = `${position.top}px`;
    if (data && data.width && data.height) {
      this.img.style.width = `${data.width}px`;
      this.img.style.height = `${data.height}px`;
    }
    this.bindEvents();
    wrapper.appendChild(this.img);
    comment.onImageCreate({
      itemInstance: this,
      img: this.img,
      id: this.id,
      data,
    });
  }
  _convertToImage = () => {
    const { wrapper, comment, data } = this.props;
    if (!this.canvasDom) {
      this.canvasDom = document.createElement('CANVAS');
      this.ctx = this.canvasDom.getContext('2d');
    }
    this.ctx.textBaseline = 'top';
    this.ctx.fillStyle = this.fontColor;
    this.ctx.font = `${this.fontSize}px SimHei`;
    const text = this.value;
    const textArr = text.split('\n');
    let textWidth = 0;
    let textHeight = 0;
    for (let i = 0, j = textArr.length; i < j; i += 1) {
      const lineText = textArr[i];
      const lineWidth = this.ctx.measureText(lineText).width;
      if (lineWidth > textWidth) {
        textWidth = lineWidth;
      }
      textHeight += this.fontSize + 3;
    }
    this.canvasDom.width = (textWidth + 10) * 2;
    this.canvasDom.style.width = `${textWidth + 10}px`;
    this.canvasDom.height = (textHeight + 4) * 2;
    this.canvasDom.style.height = `${textHeight + 4}px`;
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.mozImageSmoothingEnabled = true;
    this.ctx.webkitImageSmoothingEnabled = true;
    this.ctx.msImageSmoothingEnabled = true;
    this.ctx.imageSmoothingEnabled = true;

    this.ctx.clearRect(0, 0, this.canvasDom.width, this.canvasDom.height);
    this.ctx.textBaseline = 'top';
    this.ctx.fillStyle = this.fontColor;
    this.ctx.font = `${this.fontSize * 2}px SimHei`;

    for (let i = 0, j = textArr.length; i < j; i += 1) {
      const lineText = textArr[i];
      this.ctx.beginPath();
      this.ctx.fillText(lineText, 2, (i * this.fontSize * 2) + (i * 6) + 2);
      this.ctx.closePath();
    }
    let left = 0;
    let top = 0;

    if (this.img) {
      left = this.img.offsetLeft;
      top = this.img.offsetTop;
      wrapper.removeChild(this.img);
    }
    this.img = new window.Image();

    this.img.style.visibility = 'hidden';
    wrapper.appendChild(this.img);

    this.img.className = 'snk-comment-item-img';
    this.bindEvents();
    if (this.placeHolderDom && this.placeHolderDom.style.display !== 'none') {
      this.img.style.top = `${this.placeHolderDom.offsetTop}px`;
      this.img.style.left = `${this.placeHolderDom.offsetLeft}px`;
    } else {
      this.img.style.top = `${top}px`;
      this.img.style.left = `${left}px`;
    }
    this.img.onload = () => {
      if (this.placeHolderDom) {
        this.placeHolderDom.style.display = 'none';
      }
      this.img.style.width = `${this.img.width / 4}px`;
      this.img.style.height = `${this.img.height}px`;
      this.img.style.visibility = 'visible';
      comment.onImageCreate({
        itemInstance: this,
        img: this.img,
        data,
        id: this.id,
      });
    };
    const tempImg = new window.Image();
    tempImg.onload = () => {
      this.canvasDom.width = tempImg.width * 2;
      this.canvasDom.height = tempImg.height * 2;
      this.ctx.clearRect(0, 0, this.canvasDom.width, this.canvasDom.height);
      this.ctx.drawImage(tempImg, 0, 0, this.canvasDom.width, this.canvasDom.height);
      this.img.src = this.canvasDom.toDataURL();
      this.src = this.img.src;
    };
    tempImg.src = this.canvasDom.toDataURL();
  }
}
