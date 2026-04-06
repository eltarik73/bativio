const MAX_SIZE = 5 * 1024 * 1024; // 5 Mo
const MAX_WIDTH = 1600;
const QUALITY = 0.8;

export function validateImageSize(file: File): string | null {
  if (file.size > MAX_SIZE) {
    return `L'image d\u00e9passe 5 Mo (${(file.size / 1024 / 1024).toFixed(1)} Mo). Veuillez choisir une image plus l\u00e9g\u00e8re.`;
  }
  return null;
}

export async function compressImage(file: File): Promise<File> {
  // Skip if already small enough or not an image
  if (file.size < 500 * 1024 || !file.type.startsWith("image/")) return file;

  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;

      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(file); return; }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            resolve(file); // Keep original if compression didn't help
            return;
          }
          resolve(new File([blob], file.name, { type: "image/jpeg", lastModified: Date.now() }));
        },
        "image/jpeg",
        QUALITY,
      );
    };

    img.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

export async function processImageFiles(files: FileList | File[]): Promise<File[]> {
  const result: File[] = [];
  for (const file of Array.from(files)) {
    const err = validateImageSize(file);
    if (err) {
      alert(err);
      continue;
    }
    const compressed = await compressImage(file);
    result.push(compressed);
  }
  return result;
}
