import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

DATABASE_URL = "https://isdgdqkrijlkeqwkwhvo.supabase.co";
anonkey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzZGdkcWtyaWpsa2Vxd2t3aHZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MDYwMDQsImV4cCI6MjA2MDM4MjAwNH0.SecJNiTYnXc6U-lo3yOCXtEECV_F4tTgDrqOr8XTX9U";
const supabase = createClient(DATABASE_URL, anonkey);

async function fetchData() {
  const { data, error } = await supabase.from("People").select();
  console.log("Fetched data", data);
}
document.querySelector("#submit").addEventListener("click", fetchData);
