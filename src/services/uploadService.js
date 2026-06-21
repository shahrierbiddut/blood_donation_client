const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
const IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload";

const toBase64DataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });

const uploadService = {
  uploadAvatar: async (file) => {
    if (!IMGBB_API_KEY) {
      return toBase64DataUrl(file);
    }

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${IMGBB_UPLOAD_URL}?key=${IMGBB_API_KEY}`, {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (!response.ok || !data?.success) {
      return toBase64DataUrl(file);
    }

    return data.data.url;
  }
};

export default uploadService;
