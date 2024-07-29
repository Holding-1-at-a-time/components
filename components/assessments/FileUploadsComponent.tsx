import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

/**
 * Renders a component for uploading images and videos.
 *
 * @return {JSX.Element} The rendered component.
 */
const FileUploads: React.FC = () => {
    const { register, watch } = useFormContext();
    const images = watch('images');
    const videos = watch('videos');

    return (
        <div className="grid gap-4 rotate-in">
            <Label className="font-semibold text-foreground">Upload Images/Videos</Label>
            <p className="text-sm text-muted-foreground">
                Capture the current condition of your vehicle using your smartphone camera.
            </p>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    className="text-foreground border-border hover:bg-muted"
                >
                    Upload Images
                </Button>
                <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    {...register('images')}
                    className="hidden"
                />
                <Button
                    variant="outline"
                    onClick={() => document.getElementById('video-upload')?.click()}
                    className="text-foreground border-border hover:bg-muted"
                >
                    Upload Videos
                </Button>
                <input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    multiple
                    {...register('videos')}
                    className="hidden"
                />
            </div>
            <div className="text-foreground">
                <p>Images: {images?.length || 0} uploaded</p>
                <p>Videos: {videos?.length || 0} uploaded</p>
            </div>
        </div>
    );
};

export default FileUploads;