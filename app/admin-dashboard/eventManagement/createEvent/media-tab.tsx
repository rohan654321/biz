"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Upload, X, Loader2 } from "lucide-react"
import Image from "next/image"
import type { EventFormData } from "./types"
import type { RefObject } from "react"

export interface MediaTabProps {
  formData: EventFormData
  isUploadingImages: boolean
  isUploadingBrochure: boolean
  isUploadingLayoutPlan: boolean
  fileInputRef: RefObject<HTMLInputElement | null>        // ✅ allow null
  brochureInputRef: RefObject<HTMLInputElement | null>    // ✅ allow null
  layoutPlanInputRef: RefObject<HTMLInputElement | null>  // ✅ allow null
  onFormChange: (updates: Partial<EventFormData>) => void
  onRemoveImage: (index: number) => void
}

export function MediaTab({
  formData,
  isUploadingImages,
  isUploadingBrochure,
  isUploadingLayoutPlan,
  fileInputRef,
  brochureInputRef,
  layoutPlanInputRef,
  onFormChange,
  onRemoveImage,
}: MediaTabProps) {
  return (
    <div className="space-y-6">
      <input type="file" ref={fileInputRef} accept="image/*" multiple className="hidden" disabled={isUploadingImages} />
      <input
        type="file"
        ref={brochureInputRef}
        accept=".pdf,.doc,.docx"
        className="hidden"
        disabled={isUploadingBrochure}
      />
      <input
        type="file"
        ref={layoutPlanInputRef}
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        disabled={isUploadingLayoutPlan}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Event Images
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center ${
              isUploadingImages ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-gray-400"
            } transition-colors`}
            onClick={() => !isUploadingImages && fileInputRef.current?.click()}
          >
            {isUploadingImages ? (
              <>
                <Loader2 className="w-12 h-12 mx-auto text-gray-400 mb-4 animate-spin" />
                <p className="text-gray-600 mb-2">Uploading images...</p>
              </>
            ) : (
              <>
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">Drag and drop images here, or click to browse</p>
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    fileInputRef.current?.click()
                  }}
                >
                  Choose Images
                </Button>
              </>
            )}
          </div>

          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Event image ${index + 1}`}
                    width={200}
                    height={150}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => onRemoveImage(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Event Brochure</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={formData.brochure ? formData.brochure.split("/").pop() || "Uploaded" : ""}
                placeholder={isUploadingBrochure ? "Uploading..." : "No file selected"}
                readOnly
              />
              <Button
                variant="outline"
                onClick={() => brochureInputRef.current?.click()}
                disabled={isUploadingBrochure}
              >
                {isUploadingBrochure ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              </Button>
            </div>
            {formData.brochure && <p className="text-xs text-green-600 mt-1">✓ Brochure uploaded successfully</p>}
          </div>

          <div>
            <Label>Layout Plan</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={formData.layoutPlan ? formData.layoutPlan.split("/").pop() || "Uploaded" : ""}
                placeholder={isUploadingLayoutPlan ? "Uploading..." : "No file selected"}
                readOnly
              />
              <Button
                variant="outline"
                onClick={() => layoutPlanInputRef.current?.click()}
                disabled={isUploadingLayoutPlan}
              >
                {isUploadingLayoutPlan ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              </Button>
            </div>
            {formData.layoutPlan && <p className="text-xs text-green-600 mt-1">✓ Layout plan uploaded successfully</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
