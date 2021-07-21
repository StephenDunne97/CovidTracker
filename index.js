let requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

// Function to dynamically populate the countries list
async function populateCountryList() {
    let countriesURL = "https://api.covid19api.com/countries";
    fetch(countriesURL, requestOptions)
    .then(response => response.json())
    .then(countries => extractCountryData(countries)) // Countries are returned from API as an array of JSON objects
    .catch(error => console.log('Failed to populate countries list.', error));
}

// Dynamically populate the 'Countries' list
function extractCountryData(countries){
    const countryDiv = document.querySelector('#country-list');
    countries.sort(function(a,b){ // Sorts countries in alphabetical order
        let x = a.Country < b.Country? -1:1; 
        return x; 
    });
    countries.forEach(country => {
        const countryElement = document.createElement(`li`); // Create a line item element
        countryElement.classList.add("list-group-item"); // Apply class for styling
        countryElement.innerText = `${country.Country}`; // Set text to country name
        countryElement.id = `${country.Slug}`;
        countryDiv.append(countryElement);
    });
}

// Function to get global COVID-19 Stats
async function initPopGlobal() {
    let globalURL = `https://api.covid19api.com/summary`;
    // Get global summary cases
    fetch(globalURL, requestOptions)
    .then(response => response.json())
    .then(summaryData => popGlobal(summaryData)) // Countries are returned from API as an array of JSON objects
    .catch(error => console.log('Failed to populate global stats.', error));
}

// Function to populate Global Stats
function popGlobal(summaryData){
    let summary = summaryData.Global; // Global = Object retrieved from API call
    const countryDataDivHeader = document.querySelector('#country-data-header');
    const countryDataDiv = document.querySelector('#country-data-centre');
    const countryDataRecovered = document.querySelector('#country-data-breakdown-recovered');
    const countryDataDeaths = document.querySelector('#country-data-breakdown-deaths');
    const countryDataActive = document.querySelector('#country-data-breakdown-active');

    // Populate Header
    countryDataDivHeader.innerHTML ="";
    const countryHeaderElement = document.createElement(`p`); // Create a line item element
    countryHeaderElement.classList.add("p-data"); // Apply class for styling
    countryHeaderElement.innerText = `COVID-19 Cases Global Overview`; // Set text to country name
    countryDataDivHeader.append(countryHeaderElement);
    
    // Populate Centre
    countryDataDiv.innerHTML ="";
    const countryDataElement = document.createElement(`p`); // Create a line item element
    countryDataElement.classList.add("p-data"); // Apply class for styling
    countryDataElement.innerText = `Global cases: ${summary.TotalConfirmed}`; // Set text to country name
    countryDataDiv.append(countryDataElement);
    
    // Populate Recovered
    countryDataRecovered.innerHTML ="";
    const countryDataElementRecovered = document.createElement('p');
    countryDataElementRecovered.classList.add("p-sub-data"); // Apply class for styling
    countryDataElementRecovered.innerText = `Global recovered: ${summary.TotalRecovered}`; // Set text to country name
    countryDataRecovered.append(countryDataElementRecovered);

    // Populate Deaths
    countryDataDeaths.innerHTML ="";
    const countryDataElementDeaths = document.createElement('p');
    countryDataElementDeaths.classList.add("p-sub-data"); // Apply class for styling
    countryDataElementDeaths.innerText = `Global Deaths: ${summary.TotalDeaths}`; // Set text to country name
    countryDataDeaths.append(countryDataElementDeaths);

    // Populate Active
    let active = summary.TotalConfirmed - summary.TotalRecovered - summary.TotalDeaths;
    countryDataActive.innerHTML ="";
    const countryDataElementActive = document.createElement('p');
    countryDataElementActive.classList.add("p-sub-data"); // Apply class for styling
    countryDataElementActive.innerText = `Global Active: ${active}`; // Set text to country name
    countryDataActive.append(countryDataElementActive);
}

// Function that gets the name and slug of the clicked list-item
function getListItemSlug(){ 
    document.getElementById("country-list").addEventListener("click", function(e){
        if(e.target && e.target.nodeName == "LI"){
            let countrySlug = e.target.id;
            let countryName = e.target.innerText;
            populateDataButton(countrySlug, countryName);
        }
    });
}

// Alters appearance of button based on the country selected
function populateDataButton(countrySlug, countryName){
    const countryDataButton = document.querySelector('#get-country-data');
    countryDataButton.innerText = (`Get ${countryName} data`);
    countryDataButton.setAttribute("slug",countrySlug) // Slug is attribute used to change API call
}

function getCountryData(slug){
    let confirmedURL = `https://api.covid19api.com/total/country/${slug}/status/confirmed`;
    let recoveredURL = `https://api.covid19api.com/total/country/${slug}/status/recovered`;
    let deathsURL = `https://api.covid19api.com/total/country/${slug}/status/deaths`;

    // Get confirmed cases
    fetch(confirmedURL, requestOptions)
    .then(response => response.json())
    .then(countryData => formatCountryData(countryData, slug)) // Countries are returned from API as an array of JSON objects
    .catch(error => console.log('Failed to load confirmed cases.', error));
  
    // Get recovered cases 
    fetch(recoveredURL, requestOptions)
    .then(response => response.json())
    .then(recoveredData => populateBreakdownRecovered(recoveredData, slug)) // Countries are returned from API as an array of JSON objects
    .catch(error => console.log('Failed to load recovered cases.', error));

    // Get death cases 
    fetch(deathsURL, requestOptions)
    .then(response => response.json())
    .then(deathsData => populateBreakdownDeaths(deathsData)) // Countries are returned from API as an array of JSON objects
    .catch(error => console.log('Failed to load deaths.', error));
}

// Function to present the confirmed cases of a country 
function formatCountryData(countryData, slug){
    let lastItem = countryData.slice(countryData.length - 1); // Gets the 2nd last item to show yesterdays stats instead of todays
    const countryDataDivHeader = document.querySelector('#country-data-header');
    const countryDataDivCentre = document.querySelector('#country-data-centre');
    const countryDataDivFooter = document.querySelector('#country-data-footer');
    const countryDataActive = document.querySelector('#country-data-breakdown-active');
    countryDataDivHeader.innerHTML ="";
    countryDataDivCentre.innerHTML ="";
    countryDataDivFooter.innerHTML ="";
    countryDataActive.innerHTML ="";
    if (lastItem.length != 0){ // If there is data for this country 
        lastItem.forEach(entry => {
            // Populate Header
            const countryHeaderElement = document.createElement(`p`); // Create a paragraph element
            countryHeaderElement.classList.add("p-data"); // Apply class for styling
            countryHeaderElement.innerText = `COVID-19 case overview in ${slug}`; // Set text to country name
            countryDataDivHeader.append(countryHeaderElement); // Add element to div
            
            // Populate Centre 
            const countryDataElement = document.createElement(`p`); 
            countryDataElement.classList.add("p-data"); 
            countryDataElement.innerText = `Confirmed cases: ${entry.Cases}`; 
            countryDataDivCentre.append(countryDataElement);

            // Populate Footer
            let date = new Date();
            date.setDate(date.getDate() - 1);
            const countryFooterElement = document.createElement(`p`);
            countryFooterElement.classList.add("p-date");
            countryFooterElement.innerText = `Last update: ${date.toDateString().slice(0,10)}`;
            countryDataDivFooter.append(countryFooterElement);
        });    
    }
    else{ // If there is no data for this country 
        const countryDataElement = document.createElement(`p`); // Create a line item element
        countryDataElement.classList.add("p"); // Apply class for styling
        countryDataDivHeader.append("No data available for this country.");
    }
}

// Function to populate the Recovered Cases div
function populateBreakdownRecovered(recoveredData, slug){
    let lastItem = recoveredData.slice(recoveredData.length - 1);
    const countryDataDivBreakdown = document.querySelector('#country-data-breakdown-recovered');
    countryDataDivBreakdown.innerHTML ="";
    lastItem.forEach(entry => {
        // Populate
        const countryBreakdownElement = document.createElement(`p`); // Create a line item element
        countryBreakdownElement.classList.add("p-sub-data"); // Apply class for styling
        countryBreakdownElement.innerText = `Recovered cases: ${entry.Cases}`; // Set text to country name
        countryDataDivBreakdown.append(countryBreakdownElement);
    });
}

// Function to populate the Recorded Deaths div
function populateBreakdownDeaths(deathsData, slug){
    let lastItem = deathsData.slice(deathsData.length - 1);
    const countryDataDivBreakdown = document.querySelector('#country-data-breakdown-deaths');
    countryDataDivBreakdown.innerHTML ="";
    lastItem.forEach(entry => {
        // Populate
        const countryBreakdownElement = document.createElement(`p`); // Create a line item element
        countryBreakdownElement.classList.add("p-sub-data"); // Apply class for styling
        countryBreakdownElement.innerText = `Recorded Deaths: ${entry.Cases}`; // Set text to country name
        countryDataDivBreakdown.append(countryBreakdownElement);
    });
}