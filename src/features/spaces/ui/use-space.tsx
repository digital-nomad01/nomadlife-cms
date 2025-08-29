import { useState } from 'react'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { spaceSchema, type SpaceInput } from '../../spaces/domain/space-schema'

export interface SpaceRow {
  id?: string
  name: string
  space_type: 'coworking_space' | 'coworking_cafe' | 'coliving_space'
  short_description: string
  content?: string | null

  location: string
  address?: string | null
  latitude?: number | null
  longitude?: number | null

  amenities?: string[] | null
  options?: string[] | null

  opening_time?: string | null
  closing_time?: string | null
  capacity?: number | null
  price_from?: number | null
  allow_booking?: boolean | null

  wifi_speed_mbps?: number | null
  weather_condition?: string | null

  contact_email?: string | null
  contact_phone?: string | null
  website?: string | null
  instagram?: string | null
  facebook?: string | null
  whatsapp?: string | null

  status: 'draft' | 'published' | 'archived'
  tags?: string[] | null
  image?: string | null

  created_at?: string
  updated_at?: string
}

interface UseSpaceReturn {
  isLoading: boolean
  error: string | null
  success: boolean
  handleSubmit: (data: z.infer<typeof spaceSchema>) => Promise<void>
  createSpace: (input: z.infer<typeof spaceSchema>) => Promise<SpaceRow | null>
  listSpaces: () => Promise<SpaceRow[] | null>
  getSpace: (id: string) => Promise<SpaceRow | null>
  updateSpace: (id: string, updates: Partial<SpaceRow>) => Promise<SpaceRow | null>
  deleteSpace: (id: string) => Promise<boolean>
  uploadImage: (file?: File | string) => Promise<string | undefined>
  getImageUrl: (path: string) => string | null
}

export function useSpace(): UseSpaceReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const deleteImage = async (path: string) => {
    if (!path) return
    const { error } = await supabase.storage
      .from('spaces')
      .remove([path])
    if (error) console.warn('Failed to delete image:', error.message)
  }

  const uploadImage = async (file?: File | string) => {
    if (!file || typeof file === 'string') return file

    const fileExt = file.name.split('.').pop()
    const shortId = Date.now().toString(36) + Math.random().toString(36).substring(2, 5)
    const fileName = `${shortId}.${fileExt}`

    const { data, error: supabaseError } = await supabase.storage
      .from('spaces')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: true,
        cacheControl: '3600',
      })
    if (supabaseError) throw new Error(supabaseError.message)
    return data?.path ?? null
  }

  const createSpace = async (input: SpaceInput) => {
    try {
      setIsLoading(true)
      setError(null)

      const imagePath = await uploadImage(input.image as File | undefined)

      const { data, error: supabaseError } = await supabase
        .from('spaces')
        .insert([
          {
            name: input.name,
            space_type: input.space_type,
            short_description: input.short_description,
            content: input.content ?? null,

            location: input.location,
            address: input.address ?? null,
            latitude: (input.latitude as number | null) ?? null,
            longitude: (input.longitude as number | null) ?? null,

            amenities: input.amenities ?? [],
            options: input.options ?? [],

            opening_time: input.opening_time ?? null,
            closing_time: input.closing_time ?? null,
            capacity: input.capacity ?? null,
            price_from: input.price_from ?? null,
            allow_booking: input.allow_booking ?? true,

            wifi_speed_mbps: input.wifi_speed_mbps ?? null,
            weather_condition: input.weather_condition ?? null,

            contact_email: input.contact_email ?? null,
            contact_phone: input.contact_phone ?? null,
            website: input.website ?? null,
            instagram: input.instagram ?? null,
            facebook: input.facebook ?? null,
            whatsapp: input.whatsapp ?? null,

            status: input.status,
            tags: input.tags ?? [],
            image: imagePath,
          },
        ])
        .select()
        .single()

      if (supabaseError) throw new Error(supabaseError.message)
      setSuccess(true)
      return data as unknown as SpaceRow
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create space'
      setError(message)
      console.error(message, err)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const getImageUrl = (path: string) => {
    if (!path) return null
    const { data } = supabase.storage.from('spaces').getPublicUrl(path)
    return data.publicUrl
  }

  const listSpaces = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const { data, error: supabaseError } = await supabase
        .from('spaces')
        .select('*')
        .order('name', { ascending: true })
      if (supabaseError) throw new Error(supabaseError.message)
      return data as unknown as SpaceRow[]
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch spaces'
      setError(message)
      console.error(message, err)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const getSpace = async (id: string) => {
    try {
      setIsLoading(true)
      const { data, error: supabaseError } = await supabase
        .from('spaces')
        .select('*')
        .eq('id', id)
        .single()
      if (supabaseError) throw new Error(supabaseError.message)
      return data as unknown as SpaceRow
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch space'
      setError(message)
      console.error(message, err)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const updateSpace = async (id: string, updates: Partial<SpaceRow>) => {
    try {
      setIsLoading(true)
      const { data, error: supabaseError } = await supabase
        .from('spaces')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (supabaseError) throw new Error(supabaseError.message)
      setSuccess(true)
      return data as unknown as SpaceRow
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update space'
      setError(message)
      console.error(message, err)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const deleteSpace = async (id: string) => {
    try {
      setIsLoading(true)
      const space = await getSpace(id)
      const { error: supabaseError } = await supabase
        .from('spaces')
        .delete()
        .eq('id', id)

      if (supabaseError) throw new Error(supabaseError.message)

      if (space?.image) {
        await deleteImage(space.image)
      }
      setSuccess(true)
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete space'
      setError(message)
      console.error(message, err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (data: z.infer<typeof spaceSchema>) => {
    setSuccess(false)
    await createSpace(data)
  }

  return {
    isLoading,
    error,
    success,
    handleSubmit,
    createSpace,
    listSpaces,
    getSpace,
    updateSpace,
    deleteSpace,
    uploadImage,
    getImageUrl,
  }
}


