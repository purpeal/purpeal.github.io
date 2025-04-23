import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://isdgdqkrijlkeqwkwhvo.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzZGdkcWtyaWpsa2Vxd2t3aHZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MDYwMDQsImV4cCI6MjA2MDM4MjAwNH0.SecJNiTYnXc6U-lo3yOCXtEECV_F4tTgDrqOr8XTX9U"
);

async function fetchData(table, column, search) {
  const { data, error } = await supabase
    .from(table)
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

async function fetchDataSpecific(table, column, search) {
  const { data, error } = await supabase
    .from(table)
    .select()
    .eq(column, search);
  if (error) {
    console.log(error);
    return error;
  } else {
    console.log(data);
    return data;
  }
}

async function formLogic() {
  const license = document.forms["form"]["rego"].value;
  const main = document.querySelector("#message");
  const results = document.querySelector("#results");

  results.innerHTML = "";
  main.innerHTML = "";

  if (license == "") {
    main.textContent = "Error";
  } else {
    if (license != "") {
      const searchData = await fetchData("Vehicles", "VehicleID", license);

      if (searchData.length == 0) {
        main.textContent = "No result found";
      } else {
        main.textContent = "Search successful";
        for (let i = 0; i < searchData.length; i++) {
          const resultsDiv = document.createElement("div");
          const resultsText = document.createElement("pre");
          let entryText = "";
          for (const key in searchData[i]) {
            if (key == "OwnerID") {
              const peopleSearch = await fetchDataSpecific(
                "People",
                "PersonID",
                searchData[i][key]
              );
              entryText += `Name of Owner: ${peopleSearch[0]["Name"]}\n`;
              break;
            }
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

document.getElementById("submit").addEventListener("click", formLogic);
