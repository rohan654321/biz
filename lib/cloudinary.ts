// lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
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
  version: number
  version_id: string
  signature: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
  tags: string[]
  bytes: number
  type: string
  etag: string
  placeholder: boolean
  url: string
  secure_url: string
  folder: string
  original_filename: string
}

export async function uploadToCloudinary(
  file: File,
  folder = "speakers"
): Promise<CloudinaryUploadResult> {
  try {
    // Convert File to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
          transformation: [
            { width: 500, height: 500, crop: 'limit', quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error)
            reject(new Error(`Cloudinary upload failed: ${error.message}`))
          } else if (result) {
            resolve(result as unknown as CloudinaryUploadResult)
          } else {
            reject(new Error('Cloudinary returned no result'))
          }
        }
      )
      
      uploadStream.end(buffer)
    })
  } catch (error) {
    console.error('Error preparing file for upload:', error)
    throw new Error(`Failed to process file: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function deleteFromCloudinary(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error)
    throw error
  }
}