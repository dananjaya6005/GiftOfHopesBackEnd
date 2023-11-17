const express = require("express");
const stripe = require("stripe")(
  "sk_test_51OCjmQEnnlTCDnlQHJqXqcrcsZhBAGQf1OTy2S0hg5LLLoVy1evnXTMUEmCZ6OGm4O3JRoA8WCPDSSRGpxZyuvsw00KqXboqUx"
);
const app = express();
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

app.use(cors());

const supabase = createClient(
  "https://pjqbnzerwqygskkretxd.supabase.co",

  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqcWJuemVyd3F5Z3Nra3JldHhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk2NzQzNzYsImV4cCI6MjAxNTI1MDM3Nn0.tCOsaglHK0BVL689wrFKvQIVat88jhKow-yMsURlJSE"
);

app.get("/afterpayment", async (req, res) => {
  const sessionId = req.query.checkout_session_id;

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const clientReferenceId = session.client_reference_id;
  const amount = session.amount_total;
  const custom_fields = session.custom_fields[0].numeric.value;
  const email = session.customer_details.email;
  const Fullname = session.customer_details.name;
  const timestamp = session.created;


  console.log(custom_fields);
  console.log(clientReferenceId);
  console.log(email);
  console.log(Fullname);
  console.log(amount);

  // Store the client reference ID and amount in supabase database
  // ...

  const { data, error } = await supabase
    .from("Payment_info")
    .insert([
      {
        donation_id: custom_fields,
        client: clientReferenceId,
        amount: amount,
        full_name: Fullname,
        email: email,
        timestamp: timestamp,
      },
    ])
    .select();

  console.log(data, error);

  // Send an HTML response
  res.send(`
     <html>
     <head>
       <title>Payment Success</title>
       <style>
         body {
           font-family: 'Arial', sans-serif;
           text-align: center;
           margin: 100px;
           background-color: #f0f0f0;
         }
         h2 {
           color: #008000; /* Green color */
         }
       </style>
     </head>
     <body>
       <h2>Payment information successfully stored.</h2>
       <br />
       <br />
        <a href="http://localhost:5173/">Go back to the homepage</a>

     </body>
   </html>
   `);
});

app.listen(3000, () => console.log("Node server listening on port server!"));
