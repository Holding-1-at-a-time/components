import React from 'react';
import Image from 'next/image';
import { UploadedFile } from '@/types';

interface FileGalleryProps {
  images: UploadedFile[];
  videos: UploadedFile[];
}

export const FileGallery: React.FC<FileGalleryProps> = ({ images, videos }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Images</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {images.map((image) => (
          <div key={image.id} className="relative aspect-square">
            <Image
              src={image.url}
              alt="Vehicle image"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        ))}
      </div>
      <h3 className="text-lg font-semibold mb-2">Videos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.map((video) => (
          <video key={video.id} controls className="w-full rounded-lg">
            <source src={video.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ))}
      </div>
    </div>
  );
};