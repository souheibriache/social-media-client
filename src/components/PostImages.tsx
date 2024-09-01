import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

type PostImagesProps = {
  images: string[];
};

const PostImages = ({ images }: PostImagesProps) => {
  const { VITE_BACKEND_URL } = import.meta.env;
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = (index: number) => {
    if (imageContainerRef.current) {
      const container = imageContainerRef.current;
      const childWidth = container.children[index]?.clientWidth || 0;
      container.scrollTo({
        left: childWidth * index,
        behavior: "smooth",
      });
    }
    setCurrentIndex(index);
  };

  return (
    <div className="relative flex items-center">
      {images.length > 1 && (
        <>
          <button
            className="absolute left-0 z-10 bg-white p-1 rounded-full shadow-md disabled:opacity-50"
            onClick={() => scrollToIndex(currentIndex - 1)}
            disabled={currentIndex === 0}
          >
            <ChevronLeft />
          </button>
          <button
            className="absolute right-0 z-10 bg-white p-1 rounded-full shadow-md disabled:opacity-50"
            onClick={() => scrollToIndex(currentIndex + 1)}
            disabled={currentIndex === images.length - 1}
          >
            <ChevronRight />
          </button>
          <div className="absolute right-1 top-1 text-xs bg-slate-900 text-white px-1 py-0.5 rounded-full">
            {`${currentIndex + 1}/${images.length}`}
          </div>
        </>
      )}
      <div
        ref={imageContainerRef}
        className="flex flex-row w-full overflow-x-hidden"
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="relative w-full h-64 flex-shrink-0 overflow-hidden"
          >
            <img
              src={VITE_BACKEND_URL + image}
              alt={`Blurred background ${index}`}
              className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110"
            />
            <img
              src={VITE_BACKEND_URL + image}
              alt={`Image ${index}`}
              className="relative w-auto h-full mx-auto object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostImages;
