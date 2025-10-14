// Simple Supabase connection test
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lucmgpkmauxqaprdartd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1Y21ncGttYXV4cWFwcmRhcnRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxOTU5NzUsImV4cCI6MjA3NDc3MTk3NX0.n8lRQUu1PrtRy2bIArGuVJYYfuTTg4o2jBOmLnYMG8c';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test 1: Simple health check
    console.log('1. Testing basic connection...');
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
    } else {
      console.log('✅ Connection successful!');
      console.log('Data:', data);
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
  
  try {
    // Test 2: Check if tables exist
    console.log('\n2. Checking table structure...');
    const { data: tables, error: tableError } = await supabase
      .rpc('get_table_info', {});
    
    if (tableError) {
      console.log('Table info check failed (this is normal):', tableError.message);
    }
    
  } catch (err) {
    console.log('Table structure check failed (this is normal)');
  }
}

testConnection();
