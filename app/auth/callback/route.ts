import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function getBaseUrl(request: Request): string {
  const { origin } = new URL(request.url)
  const forwardedHost = request.headers.get('x-forwarded-host')
  const isLocalEnv = process.env.NODE_ENV === 'development'
  
  if (isLocalEnv) {
    return origin
  }
  
  // In production, prefer forwarded host or use environment variable
  if (forwardedHost) {
    return `https://${forwardedHost}`
  } else if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  } else if (origin.includes('localhost')) {
    // Fallback: if origin is localhost in production, use a default
    return 'https://your-domain.vercel.app' // Replace with your actual domain
  }
  
  return origin
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Get the current user's profile to check their role
      const { data: { user } } = await supabase.auth.getUser()
      
      let redirectPath = '/booking' // default redirect
      
      if (user) {
        // Check if profile exists
        let { data: profile } = await supabase
          .from('profiles')
          .select('role, full_name')
          .eq('id', user.id)
          .single()
        
        // If profile doesn't exist (shouldn't happen with trigger, but just in case), create it
        if (!profile) {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
              role: 'user'
            })
            .select('role, full_name')
            .single()
          
          if (!createError) {
            profile = newProfile
          }
        }
        
        // Redirect based on role
        if (profile?.role === 'admin') {
          redirectPath = '/admin'
        } else {
          redirectPath = '/booking'
        }
      }
      
      const baseUrl = getBaseUrl(request)
      return NextResponse.redirect(`${baseUrl}${redirectPath}`)
    }
  }
  
  // return the user to an error page with instructions
  const baseUrl = getBaseUrl(request)
  return NextResponse.redirect(`${baseUrl}/auth/auth-code-error`)
}
