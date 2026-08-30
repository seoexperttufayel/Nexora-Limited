import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Check, RotateCw, ZoomIn, ZoomOut, Move, 
  Sparkles, Image as ImageIcon, Camera, RefreshCw, Eye
} from 'lucide-react';
import { Language } from '../types';

interface Props {
  isOpen: boolean;
  imageSrc: string;
  lang: Language;
  title?: string;
  onClose: () => void;
  onCropComplete: (croppedDataUrl: string) => void;
}

export const ImageCropModal: React.FC<Props> = ({
  isOpen,
  imageSrc,
  lang,
  title,
  onClose,
  onCropComplete
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset adjustments whenever a new image is loaded
  useEffect(() => {
    if (isOpen && imageSrc) {
      setZoom(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
      setIsDragging(false);
    }
  }, [isOpen, imageSrc]);

  // Generate live mini-preview
  useEffect(() => {
    if (!isOpen || !imageSrc) return;

    const timer = setTimeout(() => {
      generateCroppedOutput(160, 0.75).then((dataUrl) => {
        if (dataUrl) setPreviewUrl(dataUrl);
      }).catch(() => {});
    }, 80);

    return () => clearTimeout(timer);
  }, [isOpen, imageSrc, zoom, rotation, position]);

  if (!isOpen || !imageSrc) return null;

  // Mouse & Touch Pan Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  // Generate 1:1 Square Output Canvas
  const generateCroppedOutput = async (targetSize: number = 480, quality: number = 0.88): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const cropBoxSize = 280; // Viewport crop frame size in px

        const canvas = document.createElement('canvas');
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Clear background
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, targetSize, targetSize);

        // Canvas center
        ctx.save();
        ctx.translate(targetSize / 2, targetSize / 2);

        // Apply scale factor between on-screen crop box and export targetSize
        const scaleFactor = targetSize / cropBoxSize;

        // Apply translation and rotation
        ctx.translate(position.x * scaleFactor, position.y * scaleFactor);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(zoom, zoom);

        // Find scale that fits base image to crop box on screen
        const baseScale = Math.max(cropBoxSize / img.width, cropBoxSize / img.height);
        const drawWidth = img.width * baseScale * scaleFactor;
        const drawHeight = img.height * baseScale * scaleFactor;

        ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
        ctx.restore();

        resolve(canvas.toDataURL('image/jpeg', quality));
      };

      img.onerror = (err) => reject(err);
      img.src = imageSrc;
    });
  };

  const handleConfirmCrop = async () => {
    setIsProcessing(true);
    try {
      const finalCropped = await generateCroppedOutput(480, 0.88);
      onCropComplete(finalCropped);
      onClose();
    } catch (err) {
      console.error('Crop processing failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl space-y-5 my-auto text-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                {title || (lang === 'bn' ? 'প্রোফাইল ছবি ক্রপ ও এডজাস্ট করুন' : 'Crop & Adjust Profile Photo')}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400">
                {lang === 'bn' ? 'ছবিটি ড্র্যাগ করে পজিশন করুন এবং জুম করে সুন্দর হেডশট তৈরি করুন' : 'Drag to position, zoom, and rotate for a professional headshot'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Viewport and Crop Area */}
        <div className="flex flex-col sm:flex-row items-center gap-5 justify-center">
          
          {/* Main Interactive Crop Container */}
          <div className="relative flex flex-col items-center">
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={`w-[280px] h-[280px] rounded-2xl bg-slate-950 border-2 border-slate-800 relative overflow-hidden flex items-center justify-center select-none ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
            >
              {/* Image Transform Layer */}
              <div
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${zoom})`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                }}
                className="w-full h-full flex items-center justify-center pointer-events-none"
              >
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Crop Target"
                  className="max-w-none max-h-none pointer-events-none select-none object-cover"
                  style={{
                    minWidth: '100%',
                    minHeight: '100%'
                  }}
                  draggable={false}
                />
              </div>

              {/* Viewfinder Circle Mask Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-[240px] h-[240px] rounded-full border-2 border-emerald-400/80 shadow-[0_0_0_9999px_rgba(15,23,42,0.65)] relative">
                  {/* Grid Lines inside crop circle */}
                  <div className="absolute inset-0 flex flex-col justify-evenly opacity-25">
                    <div className="w-full h-px bg-emerald-300" />
                    <div className="w-full h-px bg-emerald-300" />
                  </div>
                  <div className="absolute inset-0 flex justify-evenly opacity-25">
                    <div className="h-full w-px bg-emerald-300" />
                    <div className="h-full w-px bg-emerald-300" />
                  </div>
                </div>
              </div>

              {/* Pan Hint Overlay Badge */}
              <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-slate-900/80 backdrop-blur-sm text-[10px] text-slate-400 font-medium flex items-center gap-1 pointer-events-none border border-slate-700/50">
                <Move className="w-3 h-3 text-emerald-400" />
                <span>{lang === 'bn' ? 'ড্র্যাগ করে পজিশন করুন' : 'Drag to reposition'}</span>
              </div>
            </div>
          </div>

          {/* Live Preview Column */}
          <div className="flex sm:flex-col items-center justify-center gap-3 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80">
            <div className="text-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                {lang === 'bn' ? 'সার্কুলার প্রিভিউ' : 'Circle Preview'}
              </span>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-emerald-500/50 overflow-hidden shadow-lg mx-auto bg-slate-900 flex items-center justify-center">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-slate-500">...</span>
                )}
              </div>
            </div>

            <div className="text-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                {lang === 'bn' ? 'কার্ড প্রিভিউ' : 'Square Card'}
              </span>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl border border-slate-700 overflow-hidden shadow mx-auto bg-slate-900 flex items-center justify-center">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] text-slate-500">...</span>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Controls Toolbar: Zoom, Rotate, Reset */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          
          {/* Zoom Slider */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.max(1, +(prev - 0.15).toFixed(2)))}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <div className="flex-1 flex items-center space-x-2">
              <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                {lang === 'bn' ? 'জুম' : 'Zoom'}:
              </span>
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <span className="text-xs font-mono text-emerald-400 min-w-[36px] text-right">
                {zoom.toFixed(1)}x
              </span>
            </div>

            <button
              type="button"
              onClick={() => setZoom((prev) => Math.min(3, +(prev + 0.15).toFixed(2)))}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Action buttons: Rotate & Reset */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-xs">
            <button
              type="button"
              onClick={handleRotate}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1.5 font-medium"
            >
              <RotateCw className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'bn' ? '৯০° ঘোরান' : 'Rotate 90°'}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1.5 font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>{lang === 'bn' ? 'রিসেট' : 'Reset'}</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            {lang === 'bn' ? 'বাতিল' : 'Cancel'}
          </button>
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleConfirmCrop}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
          >
            <Check className="w-4 h-4" />
            <span>
              {isProcessing 
                ? (lang === 'bn' ? 'প্রসেসিং হচ্ছে...' : 'Processing...') 
                : (lang === 'bn' ? 'ছবি ক্রপ ও সেভ করুন' : 'Crop & Save Photo')}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
