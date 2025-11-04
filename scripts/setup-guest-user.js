const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load .env.local manually
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local')
  const envContent = fs.readFileSync(envPath, 'utf-8')
  const env = {}

  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=#]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim()
      env[key] = value
    }
  })

  return env
}

async function setupGuestUser() {
  const env = loadEnv()
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials in .env.local')
    console.error('   Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  console.log('🔵 Setting up guest user...')

  try {
    // Create guest user with admin API
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'guest@sddumps.internal',
      email_confirm: true,
      user_metadata: {
        full_name: 'Guest User',
        role: 'guest'
      }
    })

    if (authError) {
      // Check if user already exists
      if (authError.message.includes('already registered')) {
        console.log('⚠️  Guest user already exists, fetching existing user...')

        // List users and find the guest user
        const { data: users, error: listError } = await supabase.auth.admin.listUsers()

        if (listError) {
          throw listError
        }

        const guestUser = users.users.find(u => u.email === 'guest@sddumps.internal')

        if (guestUser) {
          console.log('✅ Found existing guest user')
          console.log('\n📋 Add this to your .env.local file:')
          console.log(`NEXT_PUBLIC_GUEST_USER_ID=${guestUser.id}`)

          // Check if profile exists
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', guestUser.id)
            .single()

          if (!profile) {
            console.log('\n🔵 Creating profile for guest user...')
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: guestUser.id,
                full_name: 'Guest User',
                email: 'guest@sddumps.internal',
                role: 'customer'
              })

            if (profileError) {
              console.error('⚠️  Could not create profile:', profileError.message)
            } else {
              console.log('✅ Guest user profile created')
            }
          } else {
            console.log('✅ Guest user profile already exists')
          }

          process.exit(0)
        }
      }
      throw authError
    }

    const userId = authData.user.id
    console.log('✅ Guest user created successfully')
    console.log(`   User ID: ${userId}`)

    // Create profile for guest user
    console.log('🔵 Creating profile for guest user...')
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        full_name: 'Guest User',
        email: 'guest@sddumps.internal',
        role: 'customer'
      })

    if (profileError) {
      console.error('⚠️  Could not create profile:', profileError.message)
    } else {
      console.log('✅ Guest user profile created')
    }

    console.log('\n📋 Add this to your .env.local file:')
    console.log(`NEXT_PUBLIC_GUEST_USER_ID=${userId}`)
    console.log('\n✅ Setup complete! Restart your dev server after updating .env.local')

  } catch (error) {
    console.error('❌ Error setting up guest user:', error.message)
    process.exit(1)
  }
}

setupGuestUser()
