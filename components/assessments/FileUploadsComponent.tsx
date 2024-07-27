// Handles image and video uploads.

import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface FileUploadsProps {
    images: File[];
    videos: File[];
    onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onVideoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploads: React.FC<FileUploadsProps> = ({ images, videos, onImageUpload, onVideoUpload }) => {
    return (
        <div className="grid gap-4">
            <Label className="font-semibold text-white">Upload Images/Videos</Label>
            <p className="text-sm text-gray-200">
                Capture the current condition of your vehicle using your smartphone camera.
            </p>
            <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => {
                    const element = document.getElementById('image-upload');
                    if (element) {
                        element.click();
                    }
                }} className="text-white border-white">
                    Upload Images
                </Button>
                <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onImageUpload}
                    className="hidden"
                />
                <Button size="sm" variant="outline" onClick={() => {
                    const videoUpload = document.getElementById('video-upload');
                    if (videoUpload) {
                        videoUpload.click();
                    }
                }} className="text-white border-white">
                    Upload Videos
                </Button>
                <input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={onVideoUpload}
                    className="hidden"
                />
            </div>
            <div className="text-white">
                <p>Images: {images.length} uploaded</p>
                <p>Videos: {videos.length} uploaded</p>
            </div>
        </div>
    );
};

export default FileUploads;
