const supabaseUrl = "https://ogwfsagyvcckyihcjqdb.supabase.co/rest/v1/";
const supabaseKey = "sb_publishable_TCFQDnJNmZuAnw5pQSX-QA_-YbZ9M92";

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

    

   
   
   




const form = document.getElementById("clientForm");


form.addEventListener("submit", async (e)=>{

    e.preventDefault();


    const full_name = document.getElementById("full_name").value;

    const phone = document.getElementById("phone").value;

    const email = document.getElementById("email").value;

    const debt_amount = document.getElementById("debt_amount").value;



    const { data, error } = await supabaseClient
    .from("clients")
    .insert([
        {
            full_name: full_name,
            phone: phone,
            email: email,
            debt_amount: debt_amount
        }
    ]);



    if(error){

        console.log(error);

        alert("Error saving client");

    } else {

        alert("Client added successfully!");

        form.reset();

    }


});