import { FunctionComponent, useEffect, useState } from "react";
import MapCard from "../MapCard/MapCard";
import { supabase } from "../supabaseClient";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./CarouselComponent.css";

export type FileType = {
  name: string;
  thumbnailUrl: string;
  pdfUrl: string;
};

const CarouselComponent: FunctionComponent = () => {
  const [mapFiles, setMapFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      const { data: thumbnailFiles, error: thumbnailError } =
        await supabase.storage.from("maps").list("thumbnails");

      if (thumbnailError) {
        throw new Error(thumbnailError.message);
      }

      const { data: pdfFiles, error: pdfError } = await supabase.storage
        .from("maps")
        .list("uploads");

      if (pdfError) {
        throw new Error(pdfError.message);
      }

      const filesWithUrls = await Promise.all(
        thumbnailFiles.map(async (thumbnailFile) => {
          const { data: thumbnailUrlData } = supabase.storage
            .from("maps")
            .getPublicUrl(`thumbnails/${thumbnailFile.name}`);

          const pdfFileName = thumbnailFile.name.replace(".png", ".pdf");
          const matchingPdfFile = pdfFiles.find(
            (pdfFile) => pdfFile.name === pdfFileName
          );

          const { data: pdfUrlData } = matchingPdfFile
            ? supabase.storage
                .from("maps")
                .getPublicUrl(`uploads/${matchingPdfFile.name}`)
            : { data: { publicUrl: "" } };

          return {
            name: pdfFileName,
            thumbnailUrl: thumbnailUrlData?.publicUrl || "",
            pdfUrl: (pdfUrlData && pdfUrlData?.publicUrl) || "",
          };
        })
      );

      setMapFiles(filesWithUrls);
      setLoading(false);
    };

    fetchFiles();
  }, []);

  const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="carousel-container">
      {loading ? (
        <div className="hourglass-container">
          <span className="material-symbols-outlined hourglass-icon">
            hourglass_empty
          </span>
        </div>
      ) : (
        <>
          {/* {mapFiles.map((file) => (
            <link key={file.url} rel="preload" href={file.url} as="image" />
          ))} */}
          <Slider {...sliderSettings}>
            {mapFiles.map((file, idx) => (
              <MapCard key={idx} mapFile={file} />
            ))}
          </Slider>
        </>
      )}
    </div>
  );
};

export default CarouselComponent;
