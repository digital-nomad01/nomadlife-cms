import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface SpaceImageRow {
  id?: string
  space_id: string
  path: string
  alt?: string | null
  position?: number | null
  created_at?: string
  updated_at?: string
}

interface UseSpaceImagesReturn {
  isLoading: boolean
  error: string | null
  getSpaceImages: (spaceId: string) => Promise<SpaceImageRow[]>
  uploadSpaceImage: (spaceId: string, file: File, alt?: string, position?: number) => Promise<SpaceImageRow | null>
  updateSpaceImage: (id: string, updates: Partial<SpaceImageRow>) => Promise<SpaceImageRow | null>
  deleteSpaceImage: (id: string) => Promise<boolean>
  reorderImages: (spaceId: string, imageIds: string[]) => Promise<boolean>
  uploadImage: (file: File) => Promise<string | null> // For Supabase storage
}

export function useSpaceImages(): UseSpaceImagesReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('spaces')
        .upload(fileName, file)

      if (error) {
        setError(error.message)
        return null
      }

      return data.path
    } catch (err: any) {
      setError(err.message || 'Upload failed')
      return null
    }
  }

  const getSpaceImages = async (spaceId: string): Promise<SpaceImageRow[]> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('space_images')
        .select('*')
        .eq('space_id', spaceId)
        .order('position', { ascending: true })

      if (error) {
        setError(error.message)
        return []
      }

      return data || []
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const uploadSpaceImage = async (
    spaceId: string, 
    file: File, 
    alt?: string, 
    position?: number
  ): Promise<SpaceImageRow | null> => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Upload file to storage
      const imagePath = await uploadImage(file)
      if (!imagePath) return null

      // Save to database
      const { data, error } = await supabase
        .from('space_images')
        .insert({
          space_id: spaceId,
          path: imagePath,
          alt: alt || null,
          position: position || null,
        })
        .select()
        .single()

      if (error) {
        setError(error.message)
        return null
      }

      return data
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const updateSpaceImage = async (id: string, updates: Partial<SpaceImageRow>): Promise<SpaceImageRow | null> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('space_images')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        setError(error.message)
        return null
      }

      return data
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const deleteSpaceImage = async (id: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase
        .from('space_images')
        .delete()
        .eq('id', id)

      if (error) {
        setError(error.message)
        return false
      }

      return true
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const reorderImages = async (spaceId: string, imageIds: string[]): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Update positions based on array order
      const updates = imageIds.map((id, index) => 
        supabase
          .from('space_images')
          .update({ position: index + 1 })
          .eq('id', id)
      )

      const results = await Promise.all(updates)
      const hasError = results.some(result => result.error)

      if (hasError) {
        setError('Failed to reorder some images')
        return false
      }

      return true
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    getSpaceImages,
    uploadSpaceImage,
    updateSpaceImage,
    deleteSpaceImage,
    reorderImages,
    uploadImage,
  }
}


