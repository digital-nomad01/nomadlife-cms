"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Upload, GripVertical, Edit2 } from "lucide-react";
import { useSpaceImages, type SpaceImageRow } from "./use-space-images";

interface ImageGalleryProps {
  spaceId: string;
}

const ImageGallery = ({ spaceId }: ImageGalleryProps) => {
  const { getSpaceImages, uploadSpaceImage, deleteSpaceImage, updateSpaceImage, reorderImages, isLoading } = useSpaceImages();
  const [images, setImages] = useState<SpaceImageRow[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const [editingAlt, setEditingAlt] = useState<{ id: string; alt: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadImages();
  }, [spaceId]);

  const loadImages = async () => {
    const data = await getSpaceImages(spaceId);
    setImages(data);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setUploadingFiles(files);
      uploadMultipleImages(files);
    }
  };

  const uploadMultipleImages = async (files: File[]) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const position = images.length + i + 1;
      await uploadSpaceImage(spaceId, file, file.name, position);
    }
    setUploadingFiles([]);
    await loadImages();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      const success = await deleteSpaceImage(imageId);
      if (success) {
        await loadImages();
      }
    }
  };

  const handleUpdateAlt = async (imageId: string, alt: string) => {
    await updateSpaceImage(imageId, { alt });
    setEditingAlt(null);
    await loadImages();
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));
    
    if (dragIndex === dropIndex) return;

    const newImages = [...images];
    const [draggedImage] = newImages.splice(dragIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);
    
    setImages(newImages);
    
    // Update positions in database
    const imageIds = newImages.map(img => img.id!);
    await reorderImages(spaceId, imageIds);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Image Gallery</h3>
        <Button 
          onClick={() => fileInputRef.current?.click()} 
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Images
        </Button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Uploading files preview */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Uploading {uploadingFiles.length} image(s)...</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {uploadingFiles.map((file, index) => (
              <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-white text-sm font-medium">Uploading...</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Images grid */}
      {images.length === 0 && uploadingFiles.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No images uploaded yet</p>
          <Button 
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
          >
            Upload Your First Images
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-move border border-gray-200 hover:border-gray-300 transition-colors"
            >
              {/* Position indicator */}
              <Badge 
                variant="secondary" 
                className="absolute top-2 left-2 z-10 text-xs bg-white/90"
              >
                {index + 1}
              </Badge>

              {/* Drag handle */}
              <GripVertical className="absolute top-2 right-2 z-10 w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-sm" />

              {/* Image */}
              <img
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/spaces/${image.path}`}
                alt={image.alt || `Space image ${index + 1}`}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="w-full h-full bg-gray-200 flex items-center justify-center"><p class="text-sm text-red-500">Image not found</p></div>';
                  }
                }}
              />

              {/* Overlay with controls */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-end">
                <div className="w-full p-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setEditingAlt({ id: image.id!, alt: image.alt || '' })}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteImage(image.id!)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Alt text */}
              {image.alt && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-1 truncate">
                  {image.alt}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit alt text modal */}
      {editingAlt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 shadow-xl">
            <h4 className="font-semibold mb-4">Edit Image Description</h4>
            <Input
              value={editingAlt.alt}
              onChange={(e) => setEditingAlt({ ...editingAlt, alt: e.target.value })}
              placeholder="Enter image description..."
              className="mb-4"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setEditingAlt(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleUpdateAlt(editingAlt.id, editingAlt.alt)}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;