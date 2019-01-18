export default class SwiperItem {
    constructor(props){
        this.props = props || {};
        const {swiper} = this.props;
        this.root = document.createElement("DIV");
        this.root.className = 'cd-swiper-item';
        if(swiper.props.onItemCreate){
            swiper.props.onItemCreate({
                item:this,
                swiper,
            });
        }
    }

    setStyle = (styles) => {
        for(const key in styles){
            this.root.style[key] = styles[key];
        }
    }
}