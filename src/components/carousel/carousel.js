import React, {Component} from "react";
import cx from "classnames";
import Slider from "react-slick";
import styles from "./carousel.module.scss";
import {NavLink} from "react-router-dom";
import {FaChevronLeft, FaChevronRight} from "react-icons/fa";

export default class Carousel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showDots: false
        };
    }

    render() {
        const {medias, onClickNext, onClickItem, onScreenItems} = this.props;

        const settings = {
            dots: true,
            infinite: true,
            speed: 1000,
            slidesToShow: onScreenItems,
            slidesToScroll: onScreenItems,
            nextArrow: <NextArrow onMouseEnter={() => this.setState({showDots: true})} onMouseLeave={() => this.setState({showDots: false})}/>,
            prevArrow: <PrevArrow onMouseEnter={() => this.setState({showDots: true})} onMouseLeave={() => this.setState({showDots: false})}/>,
            appendDots: (dots) => <AppendDots dots={dots} showDots={this.state.showDots}/>,
            customPaging: () => <CustomPaging/>,
            afterChange: this.props.onClickNext
        };

        return (
            <div className={styles.carouselContainer}>
                <Slider {...settings}>
                    {medias.map((media, index) => {
                        return <div className={styles.slideContainer} key={index}>
                            {media ? <Card media={media}/> : <EmptyCard/>}
                        </div>
                    })}
                </Slider>
            </div>
        );
    }
}

const Card = ({media}) => {
    return <div className={styles.cardContainer}>
        {
            !media.isVerified ?
                <div className={styles.ribbon}/>
                : null
        }
        <div className={styles.backImage} style={{backgroundImage: `url(${media.image})`}}/>
        <div className={styles.title}>{media.name}</div>
    </div>
};

const EmptyCard = () => {
    return <div className={styles.cardContainer}>
        <div className={styles.hoveredInfo}>
            <div className={styles.backImage}/>
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

const PrevArrow = ({onClick, className, onMouseEnter, onMouseLeave}) => {
    let classnames = cx(className, styles.arrowContainer, {[styles.slickDisabled]: className.indexOf('slick-disabled') > -1});
    return <div className={classnames} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
                onClick={onClick}><FaChevronLeft className={styles.icon}/></div>

};

const NextArrow = ({onClick, className, onMouseEnter, onMouseLeave}) => {
    let classnames = cx(className, styles.arrowContainer, {[styles.slickDisabled]: className.indexOf('slick-disabled') > -1});
    return <div className={classnames} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
                onClick={onClick}><FaChevronRight className={styles.icon}/></div>

};