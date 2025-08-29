/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { type OfferInput } from '../domain/offer-schema'

export interface OfferRow {
  id?: string
  space_id: string
  name: string
  description?: string | null
  price: number
  currency: string
  capacity?: number | null
  available: boolean
  created_at?: string
  updated_at?: string
}

interface UseOfferReturn {
  isLoading: boolean
  error: string | null
  createOffer: (spaceId: string, input: OfferInput) => Promise<OfferRow | null>
  updateOffer: (id: string, input: Partial<OfferRow>) => Promise<OfferRow | null>
  deleteOffer: (id: string) => Promise<boolean>
  getOffers: (spaceId: string) => Promise<OfferRow[]>
}

export function useOffer(): UseOfferReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const createOffer = async (spaceId: string, input: OfferInput): Promise<OfferRow | null> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('space_offers')
        .insert({
          space_id: spaceId,
          name: input.name,
          description: input.description || null,
          price: input.price,
          currency: input.currency,
          capacity: input.capacity || null,
          available: input.available,
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

  const updateOffer = async (id: string, input: Partial<OfferRow>): Promise<OfferRow | null> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('space_offers')
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

  const deleteOffer = async (id: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase
        .from('space_offers')
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

  const getOffers = async (spaceId: string): Promise<OfferRow[]> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('space_offers')
        .select('*')
        .eq('space_id', spaceId)
        .order('created_at', { ascending: false })

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
    createOffer,
    updateOffer,
    deleteOffer,
    getOffers,
  }
}
