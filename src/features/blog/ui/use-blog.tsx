import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { blogSchema } from '../domain/blog-schema'
import { z } from 'zod'

// Define the blog post structure
interface BlogPost {
  id?: string
  title: string
  content: string
  excerpt?: string
  slug: string
  author_id?: string
  published_at?: string
  created_at?: string
  updated_at?: string
  tags?: string[]
  featured_image?: string
  status: 'draft' | 'published' | 'archived'
}

interface UseBlogReturn {
  isLoading: boolean
  error: string | null
  success: boolean
  handleSubmit: (data: z.infer<typeof blogSchema>) => Promise<void>
  createBlogPost: (blogData: z.infer<typeof blogSchema>) => Promise<BlogPost | null>
}

export function useBlog(): UseBlogReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const supabase = createClient()

  const uploadImage = async (file: File) => {
    const { data, error: supabaseError } = await supabase
      .storage
      .from('blogs')
      .upload(file.name, file, {
        contentType: file.type,
        upsert: true,
        cacheControl: '3600',
      })

    if (supabaseError) {
      throw new Error(supabaseError.message)
    }

    return data
  }


  const createBlogPost = async (blog: z.infer<typeof blogSchema>) => {
    try {
      setIsLoading(true)
      setError(null)

      const imageUrl = blog.image ? await uploadImage(blog.image) : null;
      const { data, error: supabaseError } = await supabase
        .from('blog')
        .insert([{
          name: blog.name,
          content: blog.content,
          slug: blog.slug,
          tags: blog.tags,
          status: blog.status,
          image: imageUrl?.path
        }])
        .select()
        .single()

      if (supabaseError) {
        throw new Error(supabaseError.message)
      }

      setSuccess(true)
      return data as BlogPost
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create blog post'
      setError(errorMessage)
      console.error('Error creating blog post:', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }

//   const getBlogPosts = async (): Promise<BlogPost[] | null> => {
//     try {
//       setIsLoading(true)
//       setError(null)

//       const { data, error: supabaseError } = await supabase
//         .from('blog_posts')
//         .select('*')
//         .order('created_at', { ascending: false })

//       if (supabaseError) {
//         throw new Error(supabaseError.message)
//       }

//       return data as BlogPost[]
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Failed to fetch blog posts'
//       setError(errorMessage)
//       console.error('Error fetching blog posts:', err)
//       return null
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
//     try {
//       setIsLoading(true)
//       setError(null)

//       const { data, error: supabaseError } = await supabase
//         .from('blog_posts')
//         .select('*')
//         .eq('slug', slug)
//         .single()

//       if (supabaseError) {
//         throw new Error(supabaseError.message)
//       }

//       return data as BlogPost
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Failed to fetch blog post'
//       setError(errorMessage)
//       console.error('Error fetching blog post by slug:', err)
//       return null
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const updateBlogPost = async (id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> => {
//     try {
//       setIsLoading(true)
//       setError(null)

//       const updateData = { ...updates }
      
//       // Set published_at when status changes to published
//       if (updates.status === 'published' && !updates.published_at) {
//         updateData.published_at = new Date().toISOString()
//       }

//       const { data, error: supabaseError } = await supabase
//         .from('blog_posts')
//         .update(updateData)
//         .eq('id', id)
//         .select()
//         .single()

//       if (supabaseError) {
//         throw new Error(supabaseError.message)
//       }

//       setSuccess(true)
//       return data as BlogPost
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Failed to update blog post'
//       setError(errorMessage)
//       console.error('Error updating blog post:', err)
//       return null
//     } finally {
//       setIsLoading(false)
//     }
//   }


//   const deleteBlogPost = async (id: string): Promise<boolean> => {
//     try {
//       setIsLoading(true)
//       setError(null)

//       const { error: supabaseError } = await supabase
//         .from('blog_posts')
//         .delete()
//         .eq('id', id)

//       if (supabaseError) {
//         throw new Error(supabaseError.message)
//       }

//       setSuccess(true)
//       return true
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Failed to delete blog post'
//       setError(errorMessage)
//       console.error('Error deleting blog post:', err)
//       return false
//     } finally {
//       setIsLoading(false)
//     }
//   }

  const handleSubmit = async (data: z.infer<typeof blogSchema>) => {
    console.log('Blog form data is submitted>>>', data)
    
    // Reset success state before new submission
    setSuccess(false)
    
    const result = await createBlogPost(data)
    
    if (result) {
      console.log('Blog post created successfully:', result)
    }
  }

  return {
    isLoading,
    error,
    success,
    handleSubmit,
    createBlogPost,
  }
}