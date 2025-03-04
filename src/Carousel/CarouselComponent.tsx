import { FunctionComponent } from "react";
import MapCard from "../MapCard/MapCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./CarouselComponent.css";

const CarouselComponent: FunctionComponent = () => {
  const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const maps = new Array(5).fill(0);
  return (
    <div className="carousel-container">
      <Slider {...sliderSettings}>
        {maps.map((_, idx) => (
          <MapCard key={idx} />
        ))}
      </Slider>
    </div>
  );
};

export default CarouselComponent;
