/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { type AttractionInput } from '../domain/attraction-schema'

export interface AttractionRow {
  id?: string
  space_id: string
  name: string
  description?: string | null
  distance_km: number
  category?: string | null
  latitude?: number | null
  longitude?: number | null
  website?: string | null
  created_at?: string
}

interface UseAttractionReturn {
  isLoading: boolean
  error: string | null
  createAttraction: (spaceId: string, input: AttractionInput) => Promise<AttractionRow | null>
  updateAttraction: (id: string, input: Partial<AttractionRow>) => Promise<AttractionRow | null>
  deleteAttraction: (id: string) => Promise<boolean>
  getAttractions: (spaceId: string) => Promise<AttractionRow[]>
}

export function useAttraction(): UseAttractionReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const createAttraction = async (spaceId: string, input: AttractionInput): Promise<AttractionRow | null> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('space_attractions')
        .insert({
          space_id: spaceId,
          name: input.name,
          description: input.description || null,
          distance_km: input.distance_km,
          category: input.category || null,
          latitude: input.latitude || null,
          longitude: input.longitude || null,
          website: input.website || null,
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

  const updateAttraction = async (id: string, input: Partial<AttractionRow>): Promise<AttractionRow | null> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('space_attractions')
        .update(input)
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

  const deleteAttraction = async (id: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase
        .from('space_attractions')
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

  const getAttractions = async (spaceId: string): Promise<AttractionRow[]> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('space_attractions')
        .select('*')
        .eq('space_id', spaceId)
        .order('distance_km', { ascending: true })

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

  return {
    isLoading,
    error,
    createAttraction,
    updateAttraction,
    deleteAttraction,
    getAttractions,
  }
}