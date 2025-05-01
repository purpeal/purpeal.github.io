import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://isdgdqkrijlkeqwkwhvo.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzZGdkcWtyaWpsa2Vxd2t3aHZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MDYwMDQsImV4cCI6MjA2MDM4MjAwNH0.SecJNiTYnXc6U-lo3yOCXtEECV_F4tTgDrqOr8XTX9U"
);

const ownerInput = document.getElementById("owner");
const checkButton = document.getElementById("check");
let selectedOwner = 0;
let hasOwner = false;

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

ownerInput.addEventListener("input", () => {
  if (ownerInput.value.trim() !== "") {
    checkButton.style.display = "inline";
  } else {
    checkButton.style.display = "none";
  }
});

document.getElementById("check").addEventListener("click", async () => {
  const searchData = await fetchData(
    "People",
    "Name",
    document.forms["vehicle-form"]["owner"].value
  );
  const results = document.getElementById("owner-results");
  const form = document.getElementById("people-form");
  form.style.display = "";
  results.style.display = "";
  results.innerHTML = "";
  if (searchData.length == 0) {
    document.getElementById("new-owner").style.display = "flex";
  } else {
    results.style.display = "flex";

    for (let i = 0; i < searchData.length; i++) {
      const resultsDiv = document.createElement("div");
      const resultsText = document.createElement("pre");
      const selectButton = document.createElement("button");
      selectButton.textContent = "Select owner";
      selectButton.setAttribute("class", "select-button");
      selectButton.setAttribute("type", "button");

      let entryText = "";

      for (const key in searchData[i]) {
        entryText += `${key}: ${searchData[i][key]}\n`;
        if (key == "PersonID") {
          selectButton.setAttribute("id", searchData[i][key]);
          selectButton.addEventListener("click", () => {
            selectedOwner = searchData[i][key];
            hasOwner = true;
            console.log(hasOwner);
          });
        }
      }

      resultsText.textContent = entryText;
      resultsDiv.appendChild(resultsText);
      resultsDiv.appendChild(selectButton);
      results.appendChild(resultsDiv);
    }
  }
});

document.getElementById("new-owner").addEventListener("click", () => {
  document.getElementById("people-form").style.display = "inline";
  document.getElementById("new-owner").style.display = "none";
});

document.getElementById("add-owner").addEventListener("click", async () => {
  const name = document.forms["people-form"]["name"].value;
  const address = document.forms["people-form"]["address"].value;
  const dob = document.forms["people-form"]["dob"].value;
  const license = document.forms["people-form"]["license"].value;
  const expire = document.forms["people-form"]["expire"].value;
  const message = document.querySelector("#message-owner");
  const { data, error: selectError } = await supabase.from("People").select();

  const duplicate = data.find(
    (person) =>
      person.Name === name &&
      person.Address === address &&
      person.DOB === dob &&
      person.LicenseNumber === license &&
      person.ExpiryDate === expire
  );
  if (
    name == "" ||
    address == "" ||
    dob == "" ||
    license == "" ||
    expire == ""
  ) {
    message.textContent = "Error";
    return;
  }

  if (duplicate) {
    message.textContent = "Error";
    return;
  }

  const { error: insertError } = await supabase.from("People").insert({
    PersonID: data.length + 1,
    Name: name,
    Address: address,
    DOB: dob,
    LicenseNumber: license,
    ExpiryDate: expire,
  });
  if (insertError) {
    message.textContent = "Error";
    console.log(insertError);
  }
});
