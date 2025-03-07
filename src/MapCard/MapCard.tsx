import { FunctionComponent } from "react";
import "./MapCard.css";
import { FileType } from "../Carousel/CarouselComponent";

type MapCardProps = {
  mapFile: FileType;
};

const MapCard: FunctionComponent<MapCardProps> = ({ mapFile }) => {
  return (
    <div className="map-card">
      <h2>{mapFile.name}</h2>
      <div className="thumbnail-container">
        {mapFile.name.endsWith(".pdf") ? (
          <object
            className="thumbnail-iframe"
            data={`${mapFile.url}#toolbar=0`}
            type="application/pdf"
          />
        ) : (
          <img src={mapFile.url} alt={mapFile.name} width="100" height="100" />
        )}
      </div>

      <br />
      {mapFile.name}
      <a href={mapFile.url} target="_blank" rel="noopener noreferrer">
        <button>Download</button>
      </a>
    </div>
  );
};

export default MapCard;
