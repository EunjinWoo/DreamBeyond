require("dotenv").config({ path: ".env.local" });
const { put } = require("@vercel/blob");
const fs = require("fs");
const path = require("path");

async function uploadLargeFiles() {
  const files = [path.join(__dirname, "../../assets/dream-beyond-object.glb")];

  for (const filePath of files) {
    const fileName = path.basename(filePath);
    const fileStream = fs.createReadStream(filePath);

    try {
      const blob = await put(fileName, fileStream, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      console.log(`✅ Uploaded: ${fileName}`);
      console.log(`🔗 Blob URL: ${blob.url}`);
    } catch (error) {
      console.error(`❌ Failed to upload ${fileName}:`, error);
    }
  }
}

uploadLargeFiles();
