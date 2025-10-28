import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
      
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${redirectPath}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${redirectPath}`)
      } else {
        return NextResponse.redirect(`${origin}${redirectPath}`)
      }
    }
  }
  
  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
