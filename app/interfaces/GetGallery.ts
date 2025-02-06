export interface GalleryImage {
  id: number
  gallery_id: number
  image_url: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface Gallery {
  id: number
  title: string
  cover_image_url: string
  status: number
  created_at: string
  updated_at: string
  deleted_at: string | null
  gallery_images: GalleryImage[]
}

export interface IGetGallery {
  data: Gallery[]
}
