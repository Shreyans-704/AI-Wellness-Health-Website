import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gfzfalbtebsvsfnwmoqj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmemZhbGJ0ZWJzdnNmbndtb3FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MTE2NzksImV4cCI6MjA3MTA4NzY3OX0.84u5OjKQjvy8nnt1rYrOjYq41Z5OqPkM-6cbSqMgLfY'

export const supabase = createClient(supabaseUrl, supabaseKey)