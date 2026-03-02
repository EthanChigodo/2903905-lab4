const input = document.getElementById("country-input");
const button = document.getElementById("search-btn");
const spinner = document.getElementById("loading-spinner");
const countryInfo = document.getElementById("country-info");
const bordersSection = document.getElementById("bordering-countries");
const errorMessage = document.getElementById("error-message");

async function searchCountry(countryName) {
  try {
    errorMessage.textContent = "";
    countryInfo.innerHTML = "";
    bordersSection.innerHTML = "";
    spinner.classList.remove("hidden");

    const response = await fetch(
      `https://restcountries.com/v3.1/name/${countryName}`
    );

    if (!response.ok) {
      throw new Error("Country not found");
    }

    const data = await response.json();
    const country = data[0];

    countryInfo.innerHTML = `
      <h2>${country.name.common}</h2>
      <p><strong>Capital:</strong> ${country.capital?.[0] || "N/A"}</p>
      <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
      <p><strong>Region:</strong> ${country.region}</p>
      <img src="${country.flags.svg}" alt="${country.name.common} flag" width="150">
    `;

    if (country.borders && country.borders.length > 0) {
      const borderResponse = await fetch(
        `https://restcountries.com/v3.1/alpha?codes=${country.borders.join(",")}`
      );

      const borderData = await borderResponse.json();

      borderData.forEach((border) => {
        bordersSection.innerHTML += `
          <div>
            <p>${border.name.common}</p>
            <img src="${border.flags.svg}" alt="${border.name.common} flag" width="60">
          </div>
        `;
      });
    }
  } catch (error) {
    errorMessage.textContent = "Please enter a valid country name.";
  } finally {
    spinner.classList.add("hidden");
  }
}

button.addEventListener("click", () => {
  searchCountry(input.value.trim());
});

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchCountry(input.value.trim());
  }
});