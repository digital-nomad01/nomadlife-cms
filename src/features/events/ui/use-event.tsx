import { useState } from 'react'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { eventSchema, type EventInput } from '../../events/domain/event-schema'

export interface EventRow {
  id?: string
  title: string
  description: string
  content?: string | null
  start_date: string
  end_date?: string | null
  location: string
  venue?: string | null
  capacity?: number | null
  price?: number | null
  status: 'draft' | 'published' | 'archived'
  tags?: string[] | null
  image?: string | null
  is_online?: boolean | null
  created_at?: string
  updated_at?: string
}

interface UseEventReturn {
  isLoading: boolean
  error: string | null
  success: boolean
  handleSubmit: (data: z.infer<typeof eventSchema>) => Promise<void>
  createEvent: (input: z.infer<typeof eventSchema>) => Promise<EventRow | null>
  listEvents: () => Promise<EventRow[] | null>
  getEvent: (id: string) => Promise<EventRow | null>
  updateEvent: (id: string, updates: Partial<EventRow>) => Promise<EventRow | null>
  deleteEvent: (id: string) => Promise<boolean>
  uploadImage: (file?: File) => Promise<string | null>
  getImageUrl: (path: string) => string | null
}

export function useEvent(): UseEventReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const deleteImage = async (path: string) => {
    if (!path) return
    const { error } = await supabase.storage
      .from('events')
      .remove([path])
    if (error) console.warn('Failed to delete image:', error.message)
  }

  const uploadImage = async (file?: File) => {
    if (!file) return null

    const fileExt = file.name.split('.').pop()
    const shortId = Date.now().toString(36) + Math.random().toString(36).substring(2, 5)
    const fileName = `${shortId}.${fileExt}` // ~10-12 chars + extension
  
    
    const { data, error: supabaseError } = await supabase.storage
      .from('events')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: true,
        cacheControl: '3600',
      })
    if (supabaseError) throw new Error(supabaseError.message)
    return data?.path ?? null
  }

  const createEvent = async (input: EventInput) => {
    try {
      setIsLoading(true)
      setError(null)

      const imagePath = await uploadImage(input.image)

      const { data, error: supabaseError } = await supabase
        .from('events')
        .insert([
          {
            title: input.title,
            description: input.description,
            content: input.content ?? null,
            start_date: input.start_date.toISOString(),
            end_date: input.end_date ? input.end_date.toISOString() : null,
            location: input.location,
            venue: input.venue ?? null,
            capacity: input.capacity ?? null,
            price: input.price ?? null,
            status: input.status,
            tags: input.tags ?? [],
            image: imagePath,
            is_online: input.is_online ?? false,
          },
        ])
        .select()
        .single()

      if (supabaseError) throw new Error(supabaseError.message)
      setSuccess(true)
      return data as unknown as EventRow
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create event'
      setError(message)
      console.error(message, err)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const getImageUrl = (path: string) => {
    if (!path) return null
    const { data } = supabase.storage.from('events').getPublicUrl(path)
    return data.publicUrl
  }

  const listEvents = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const { data, error: supabaseError } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true })
      if (supabaseError) throw new Error(supabaseError.message)
      return data as unknown as EventRow[]
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch events'
      setError(message)
      console.error(message, err)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const getEvent = async (id: string) => {
    try {
      setIsLoading(true)
      const { data, error: supabaseError } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single()
      if (supabaseError) throw new Error(supabaseError.message)
      return data as unknown as EventRow
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch event'
      setError(message)
      console.error(message, err)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const updateEvent = async (id: string, updates: Partial<EventRow>) => {
    try {
      setIsLoading(true)
      const { data, error: supabaseError } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (supabaseError) throw new Error(supabaseError.message)
      setSuccess(true)
      return data as unknown as EventRow
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update event'
      setError(message)
      console.error(message, err)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const deleteEvent = async (id: string) => {
    try {
      setIsLoading(true)
      const event = await getEvent(id)
      const { error: supabaseError } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

      if (supabaseError) throw new Error(supabaseError.message)

      if (event?.image) {
        await deleteImage(event.image)
      }
      setSuccess(true)
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete event'
      setError(message)
      console.error(message, err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (data: z.infer<typeof eventSchema>) => {
    setSuccess(false)
    await createEvent(data)
  }

  return {
    isLoading,
    error,
    success,
    handleSubmit,
    createEvent,
    listEvents,
    getEvent,
    updateEvent,
    deleteEvent,
    uploadImage,
    getImageUrl,
  }
}


