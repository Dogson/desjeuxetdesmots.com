import React, {Component} from "react";
import cx from "classnames";
import Slider from "react-slick";
import styles from "./carousel.module.scss";
import {FaChevronLeft, FaChevronRight} from "react-icons/fa";
import Dotdotdot from "react-dotdotdot";

export default class Carousel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showDots: false,
            showPreviousArrow: false,
        };

        this.references = [];
        this.props.medias.forEach(() => {
            this.references.push(React.createRef())
        });

        this._handleAfterChange = this._handleAfterChange.bind(this);
    }

    _handleAfterChange(index) {
        this.setState({showPreviousArrow: index && index > 0});
        return this.props.onClickNext();
    }

    render() {
        const {medias, activeItem, onClickItem, onScreenItems, smallerCards} = this.props;
        const _this = this;

        const settings = {
            dots: true,
            infinite: medias.length > onScreenItems,
            speed: 1000,
            draggable: false,
            easing: 'ease-out',
            slidesToShow: onScreenItems,
            slidesToScroll: onScreenItems,
            nextArrow: <NextArrow onMouseEnter={() => this.setState({showDots: true})}
                                  onMouseLeave={() => this.setState({showDots: false})}/>,
            prevArrow: <PrevArrow onMouseEnter={() => this.setState({showDots: true})}
                                  onMouseLeave={() => this.setState({showDots: false})}
                                  hidden={!this.state.showPreviousArrow}/>,
            appendDots: (dots) => <AppendDots dots={dots} showDots={this.state.showDots}/>,
            customPaging: () => <CustomPaging/>,
            afterChange: this._handleAfterChange
        };

        return (
            <div className={styles.carouselContainer}>
                <Slider {...settings}>
                    {medias.map((episode, index) => {
                        return <div className={styles.slideContainer} key={index} ref={_this.references[index]}>
                            {episode ? <Card isActive={activeItem && episode._id === activeItem._id} media={episode}
                                           onClick={() => onClickItem(episode, _this.references[index])}
                                           smaller={smallerCards}/> :
                                <EmptyCard smaller={smallerCards}/>}
                        </div>
                    })}
                </Slider>
            </div>
        );
    }
}

const Card = ({media, onClick, isActive, smaller}) => {
    return <div className={cx(styles.cardContainer, {[styles.active]: isActive})} onClick={onClick}
                style={smaller ? {height: '190px'} : {}}>
        {
            !media.isVerified ?
                <div className={styles.ribbon}/>
                : null
        }
        <div className={styles.backImage} style={smaller ? {
            height: '130px',
            backgroundImage: `url(${media.image})`
        } : {backgroundImage: `url(${media.image})`}}/>
        <div className={styles.title}><Dotdotdot clamp={3}>{media.name}</Dotdotdot></div>
    </div>
};

const EmptyCard = ({smaller}) => {
    return <div className={styles.cardContainer} style={smaller ? {height: '190px'}: {}}>
        <div className={styles.hoveredInfo}>
            <div className={styles.backImage} style={smaller ? {height: '130px'}: {}}/>
        </div>
    </div>
};

const AppendDots = ({dots, showDots}) => {
    return <ul className={cx(styles.dotsContainer, {[styles.hidden]: !showDots})}>
        {dots}
    </ul>
};

const CustomPaging = () => {
    return <div className={styles.customPagingContainer}/>;
};

const PrevArrow = ({onClick, className, onMouseEnter, onMouseLeave, hidden}) => {
    let classnames = cx(className, styles.arrowContainer, {[styles.slickDisabled]: className.indexOf('slick-disabled') > -1});
    if (hidden) {
        return null;
    }
    return <div className={classnames} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
                onClick={onClick}><FaChevronLeft className={styles.icon}/></div>

};

const NextArrow = ({onClick, className, onMouseEnter, onMouseLeave}) => {
    let classnames = cx(className, styles.arrowContainer, {[styles.slickDisabled]: className.indexOf('slick-disabled') > -1});
    return <div className={classnames} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
                onClick={onClick}><FaChevronRight className={styles.icon}/></div>

};