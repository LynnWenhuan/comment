import './index.less';

export default class DrawLayout {
    constructor(props) {
        this.root = document.createElement("DIV");
        this.direction = props.direction || 'bottom';
        this.bk = document.createElement("DIV");
        this.root.className = `snk-comment-drawlayout-root-${this.direction} snk-comment-drawlayout-root-${this.direction}-hide`;
        this.bk.className = 'snk-comment-drawlayout-bk snk-comment-drawlayout-bk-hide';
        this.root.appendChild(props.content);
        document.body.appendChild(this.root);
        document.body.appendChild(this.bk);
        if(props.bkContent) {
            this.bk.appendChild(props.bkContent);
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
        this.root.className = `snk-comment-drawlayout-root-${this.direction} snk-comment-drawlayout-root-${this.direction}-show`;
        this.bk.className = 'snk-comment-drawlayout-bk snk-comment-drawlayout-bk-show';
        if(params.cb) {
            params.cb();
        }
    }

    hide = () => {
        this.root.className = `snk-comment-drawlayout-root-${this.direction} snk-comment-drawlayout-root-${this.direction}-hide`;
        this.bk.className = 'snk-comment-drawlayout-bk snk-comment-drawlayout-bk-hide';
    }

    remove = () => {
        document.body.removeChild(this.root);
        document.body.removeChild(this.bk);
    }
}