async function handleImageUpload(image, uploadPreset = "instagram_clone") {
  const data = new FormData();
  data.append("file", image);
  data.append("upload_preset", uploadPreset);
  data.append("cloud_name", process.env.REACT_APP_CLOUD_NAME);
  const response = await fetch(process.env.REACT_APP_CLOUDINARY, {
    method: "POST",
    accept: "application/json",
    body: data,
  });

  const jsonResponse = await response.json();
  return jsonResponse.url;
}

export default handleImageUpload;
