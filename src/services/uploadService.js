const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
const IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload";
const AVATAR_MAX_SIZE = 512;
const AVATAR_QUALITY = 0.82;

const toBase64DataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load image file"));
    image.src = src;
  });

const resizeAvatar = async (file) => {
  const source = await toBase64DataUrl(file);
  const image = await loadImage(source);
  const scale = Math.min(AVATAR_MAX_SIZE / image.width, AVATAR_MAX_SIZE / image.height, 1);
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    return source;
  }

  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", AVATAR_QUALITY);
};

const uploadService = {
  uploadAvatar: async (file) => {
    if (!IMGBB_API_KEY) {
      return resizeAvatar(file);
    }

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${IMGBB_UPLOAD_URL}?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        return resizeAvatar(file);
      }

      return data.data.url;
    } catch (error) {
      return resizeAvatar(file);
    }
  }
};

export default uploadService;
