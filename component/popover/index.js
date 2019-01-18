import './index.less';

export default class Popover {
    constructor(props) {
        this.root = document.createElement("DIV");
        this.bk = document.createElement("DIV");
        this.root.className = 'snk-comment-pop-root '+(props.className || '');
        this.root.style.visibility = 'hidden';
        this.bk.className = 'snk-comment-pop-bk';
        this.bk.style.visibility = 'hidden';
        this.root.appendChild(props.content);
        document.body.appendChild(this.root);
        document.body.appendChild(this.bk);
        if(props.onBKClick){
            this.bk.addEventListener('click',(e)=>{
                e.preventDefault();
                e.stopImmediatePropagation();
                props.onBKClick();
            });
        }
    }

    show = (params) => {
        if(!params) {
            console.error('popver show方法缺少参数');
            return;
        }
        if(!params.target) {
            console.error('popver show方法缺少target参数');
            return;
        }
        const targetRect = params.target.getBoundingClientRect();
       
        const popWidth = this.root.offsetWidth;
        const popHeight = this.root.offsetHeight;
        if(targetRect.bottom + popHeight> window.innerHeight) {
            const _top = targetRect.top - popHeight;
            if(_top>=0) {
                this.root.style.bottom = `${window.innerHeight - targetRect.top}px`;
                this.root.style.top = 'auto';
            }else {
                this.root.style.top = `0px`;
                this.root.style.bottom = 'auto';
            }
        } else {
            this.root.style.top = `${targetRect.bottom}px`;
        }
        if(targetRect.left + popWidth + 30 > window.innerWidth) {
            this.root.style.left = `${window.innerWidth - popWidth - 20}px`;
        } else {
            this.root.style.left = `${targetRect.left}px`;
        }
        this.root.style.visibility = 'visible';
        this.bk.style.visibility = 'visible';
        if(params.cb) {
            params.cb();
        }
    }

    hide = () => {
        this.root.style.visibility = 'hidden';
        this.bk.style.visibility = 'hidden';
    }

    remove = () => {
        document.body.removeChild(this.root);
        document.body.removeChild(this.bk);
    }
}