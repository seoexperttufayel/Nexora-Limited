/**
 * Image compression and resizing utility for web apps.
 * Converts heavy camera/smartphone images (2MB-15MB) into lightweight Data URLs (30KB-90KB)
 * preventing Firestore 1MB limits and LocalStorage quota exceptions.
 */
export async function compressImage(
  file: File | Blob | string,
  maxWidth: number = 800,
  maxHeight: number = 800,
  quality: number = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If string data URL already passed
    if (typeof file === 'string') {
      const img = new Image();
      img.onload = () => {
        const { width, height } = calculateDimensions(img.width, img.height, maxWidth, maxHeight);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(file);
      img.src = file;
      return;
    }

    // If not an image file, return fallback
    if (file instanceof File && !file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const { width, height } = calculateDimensions(img.width, img.height, maxWidth, maxHeight);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Draw image smoothly on canvas preserving exact aspect ratio
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Export as compressed JPEG
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };

      img.onerror = () => {
        resolve(e.target?.result as string);
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

function calculateDimensions(
  origWidth: number, 
  origHeight: number, 
  maxWidth: number, 
  maxHeight: number
): { width: number; height: number } {
  let width = origWidth;
  let height = origHeight;

  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  return { width, height };
}

/**
 * Smart Center Crop to 1:1 Square aspect ratio
 * Used for avatars and profile pictures to ensure 0% distortion.
 */
export async function cropSquareImage(
  imageSource: File | Blob | string,
  targetSize: number = 400,
  quality: number = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const processImage = (src: string) => {
      const img = new Image();
      img.onload = () => {
        const minDim = Math.min(img.width, img.height);
        const startX = (img.width - minDim) / 2;
        const startY = (img.height - minDim) / 2;

        const canvas = document.createElement('canvas');
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(src);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(
          img,
          startX,
          startY,
          minDim,
          minDim,
          0,
          0,
          targetSize,
          targetSize
        );

        resolve(canvas.toDataURL('image/jpeg', quality));
      };

      img.onerror = (err) => reject(err);
      img.src = src;
    };

    if (typeof imageSource === 'string') {
      processImage(imageSource);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          processImage(e.target.result as string);
        } else {
          reject(new Error('Failed to read image file'));
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(imageSource);
    }
  });
}
