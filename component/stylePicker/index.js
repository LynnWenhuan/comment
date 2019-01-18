import './index.less';
import './font/iconfont.css';

const colorArr = ['black','red','yellow','green','blue'];

export default class StylePicker {
    constructor(props){
        this.props = props || {  };
        const { isSupportTouch, fontSize, className, colorSelect } = this.props;
        this.root = document.createElement("DIV");
        this.root.className = `snk-comment-color-root-${isSupportTouch?'mobile':'pc'} ${className||''}`;
        const fontSizeBiggerBtn = document.createElement("SPAN");
        fontSizeBiggerBtn.className = 'snk-style-icon snkstylepickerfont icon-font_size_up';
        this.fontSize = this.convertFontSize(fontSize);
        fontSizeBiggerBtn.addEventListener('click',()=>{
            this.fontSize = this.convertFontSize(this.fontSize+1);
            if(this.props.onFontSizeChange) {
                this.props.onFontSizeChange(this.fontSize);
            }
        });
        this.root.appendChild(fontSizeBiggerBtn);
        const fontSizeSmallerBtn = document.createElement("SPAN");
        fontSizeSmallerBtn.className = 'snk-style-icon snkstylepickerfont icon-fontsizedown';
        fontSizeSmallerBtn.style.marginRight = '8px';
        fontSizeSmallerBtn.style.top = '-2px';

        fontSizeSmallerBtn.addEventListener('click',()=>{
            this.fontSize = this.convertFontSize(this.fontSize-1);
            if(this.props.onFontSizeChange) {
                this.props.onFontSizeChange(this.fontSize);
            }
        });
        this.root.appendChild(fontSizeSmallerBtn);
        const color = this.props.color || 'black';
        if(colorArr.indexOf(color) < 0) {
            color = 'black';
        }
        this.curSelectedItem = null;
        this.itemDict = {};
        for(let i = 0, j = colorArr.length; i < j; i += 1) {
            const item = document.createElement("SPAN");
            const itemColor = colorArr[i];
            this.itemDict[itemColor] = item;
            if(itemColor ===color) {
                this.curSelectedItem = item;
                item.className = 'snk-comment-color-item snk-comment-color-item-selected';
            } else {
                item.className = 'snk-comment-color-item';
            }
            item.className =itemColor ===color? 'snk-comment-color-item snk-comment-color-item-selected' :'snk-comment-color-item';
            item.style.backgroundColor = colorArr[i];
            item.addEventListener('click', () => {
                if(this.props.onColorChange) {
                    if(this.curSelectedItem) {
                        this.curSelectedItem.className = 'snk-comment-color-item';
                    }
                    this.curSelectedItem = item;
                    this.curSelectedItem.className = 'snk-comment-color-item snk-comment-color-item-selected';
                    this.props.onColorChange(itemColor);
                }
            });
            colorSelect ? this.root.appendChild(item) : '';
        }
    }

    setFontSize = (fontSize)=>{
        this.fontSize = this.convertFontSize(fontSize);
    }

    setFontColor = (fontColor) => {
        if(this.curSelectedItem) {
            this.curSelectedItem.className = 'snk-comment-color-item';
        }
        let color = fontColor || 'black';
        let itemInstance= this.itemDict[color] || this.itemDict['black'];
        this.curSelectedItem = itemInstance;
        this.curSelectedItem.className = 'snk-comment-color-item snk-comment-color-item-selected';
    }

    convertFontSize = (fontSize) => {
        let re = fontSize || 20;
        if(isNaN(fontSize)) {
            fontSize = 20;
        }
        re = parseInt(re);
        if(re< 12) {
            return 12;
        }
        if(re>80) {
            return 80;
        }
        return re;
    }
}