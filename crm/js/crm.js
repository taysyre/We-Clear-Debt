const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseKey = "YOUR_ANON_KEY";

const supabase = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

await supabase
    .from('clients')
    .insert([
        {
            full_name: 'John Smith',
            phone: '0821234567',
            debt_amount: 120000
        }
    ]);


    const { data } = await supabase
    .from('clients')
    .select('*');