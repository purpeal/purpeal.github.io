import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://isdgdqkrijlkeqwkwhvo.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzZGdkcWtyaWpsa2Vxd2t3aHZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MDYwMDQsImV4cCI6MjA2MDM4MjAwNH0.SecJNiTYnXc6U-lo3yOCXtEECV_F4tTgDrqOr8XTX9U"
);

async function fetchData(column, search) {
  const { data, error } = await supabase
    .from("People")
    .select()
    .ilike(column, "%" + search + "%");
  if (error) {
    console.log(error);
    return error;
  } else {
    console.log(data);
    return data;
  }
}

async function formLogic() {
  const name = document.forms["form"]["name"].value;
  const license = document.forms["form"]["license"].value;
  const main = document.querySelector("#message");
  const results = document.querySelector("#results");

  if (name == "" && license == "") {
    main.textContent = "Error";
  } else if (name != "" && license != "") {
    main.textContent = "Error";
  } else {
    if (document.forms["form"]["name"].value != "") {
      const searchData = await fetchData("Name", name);
      if (searchData.length == 0) {
        main.textContent = "No result found";
      } else {
        main.textContent = "Search successful";
        for (let i = 0; i < searchData.length; i++) {
          const resultsDiv = document.createElement("div");
          const resultsText = document.createElement("pre");
          let entryText = "";
          for (const key in searchData[i]) {
            entryText += `${key}: ${searchData[i][key]}\n`;
          }
          resultsText.textContent = entryText;
          resultsDiv.appendChild(resultsText);
          results.appendChild(resultsDiv);
        }
      }
    } else {
      const searchData = await fetchData("LicenseNumber", license);
      if (searchData.length == 0) {
        main.textContent = "No result found";
      } else {
        main.textContent = "Search successful";
        for (let i = 0; i < searchData.length; i++) {
          const resultsDiv = document.createElement("div");
          const resultsText = document.createElement("pre");
          let entryText = "";
          for (const key in searchData[i]) {
            entryText += `${key}: ${searchData[i][key]}\n`;
          }
          resultsText.textContent = entryText;
          resultsDiv.appendChild(resultsText);
          results.appendChild(resultsDiv);
        }
      }
    }
  }
}

document.getElementById("Submit").addEventListener("click", formLogic);
