import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
})

export const Cloudinary = cloudinary

export interface CloudinaryUploadResult {
  asset_id: string
  public_id: string
  format: string
  version: number
  resource_type: string
  type: string
  created_at: string
  bytes: number
  width: number
  height: number
  secure_url: string
  url: string
  folder?: string
  original_filename?: string
}

export async function uploadToCloudinary(
  file: File,
  folder = "events/brochures"
): Promise<CloudinaryUploadResult> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const resourceType = file.type === 'application/pdf' ? 'raw' : 'image'

  return new Promise<CloudinaryUploadResult>((resolve, reject) => {
    const uploadStream = Cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        type: 'upload',
      },
      (error, result) => {
        if (error) reject(error)
        else if (result) resolve(result as unknown as CloudinaryUploadResult)
        else reject(new Error("Unknown Cloudinary response"))
      }
    )
    uploadStream.end(buffer)
  })
}

export async function deleteFromCloudinary(publicId: string) {
  try {
    const result = await Cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error)
    throw error
  }
}