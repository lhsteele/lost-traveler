import { FunctionComponent, useEffect, useState } from "react";
import MapCard from "../MapCard/MapCard";
import { supabase } from "../supabaseClient";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./CarouselComponent.css";

export type FileType = {
  name: string;
  url: string;
};

const CarouselComponent: FunctionComponent = () => {
  const [mapFiles, setMapFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      const { data, error } = await supabase.storage
        .from("maps")
        .list("uploads");
      if (error) {
        console.error("Error fetching files:", error.message);
        setLoading(false);
      } else {
        const filesWithUrls = await Promise.all(
          data.map(async (file) => {
            const { data: urlData } = await supabase.storage
              .from("maps")
              .getPublicUrl(`uploads/${file.name}`);

            return { name: file.name, url: urlData?.publicUrl || "" };
          })
        );

        setMapFiles(filesWithUrls);
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  // const getDownloadURL = async (fileName: string) => {
  //   const { data, error } = await supabase.storage
  //     .from("maps")
  //     .createSignedUrl(`uploads/${fileName}`, 60);
  //   if (error) {
  //     console.error("Error getting URL:", error.message);
  //     return;
  //   }
  //   window.open(data.signedUrl, "_blank");
  // };

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
