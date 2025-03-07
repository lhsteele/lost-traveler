import { FunctionComponent } from "react";
import "./MapCard.css";
import { FileType } from "../Carousel/CarouselComponent";

type MapCardProps = {
  mapFile: FileType;
};

const MapCard: FunctionComponent<MapCardProps> = ({ mapFile }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = mapFile.pdfUrl;
    link.download = mapFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="map-card">
      <h2>{mapFile.name}</h2>
      <div className="thumbnail-container">
        {mapFile.name.endsWith(".pdf") ? (
          <object
            className="thumbnail-iframe"
            data={`${mapFile.pdfUrl}#toolbar=0`}
            type="application/pdf"
          />
        ) : (
          <img
            src={mapFile.thumbnailUrl}
            alt={mapFile.name}
            width="100"
            height="100"
          />
        )}
      </div>

      <br />
      {mapFile.name}
      <button onClick={handleDownload}>Download</button>
    </div>
  );
};

export default MapCard;
