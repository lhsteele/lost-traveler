import { FunctionComponent } from "react";
import "./MapCard.css";
import { FileType } from "../Carousel/CarouselComponent";
import PDFDownload from "../PDFDownload/PDFDownload";

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
      <PDFDownload fileUrl={mapFile.pdfUrl} fileName={mapFile.name} />
    </div>
  );
};

export default MapCard;
