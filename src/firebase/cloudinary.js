
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const IMAGE_PRESET = import.meta.env.VITE_CLOUDINARY_IMAGE_PRESET;
const PDF_PRESET = import.meta.env.VITE_CLOUDINARY_PDF_PRESET;

export const uploadToCloudinary = async (file, type = "image") => {
  if (!file) {
    throw new Error("Please select a file.");
  }

  const isPDF = type === "pdf";

  if (isPDF && file.type !== "application/pdf") {
    throw new Error("Please select a PDF file.");
  }

  if (!isPDF && !file.type.startsWith("image/")) {
    throw new Error("Please select an image file.");
  }

  const cloudName = CLOUD_NAME;
  const preset = isPDF ? PDF_PRESET : IMAGE_PRESET;

  if (!cloudName || !preset) {
    throw new Error("Cloudinary configuration is missing.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);
  formData.append("folder", isPDF ? "iniflow/pdfs" : "iniflow/images");

const resourceType = "image";

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Cloudinary upload failed.");
  }

  return {
    url: data.secure_url,
    publicId: data.public_id,
    format: data.format,
    originalName: file.name,
    resourceType: data.resource_type,
  };
};
