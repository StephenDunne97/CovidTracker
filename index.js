var requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

function popCountryList() { // Fxn to get list of countries
    fetch("https://api.covid19api.com/countries", requestOptions)
    .then(response => response.json())
    .then(countries => extractCountryData(countries)) // Countries are returned from API as an array of JSON objects
    .catch(error => console.log('error', error));
}

function extractCountryData(countries){ // Fxn to parse country array 
    const countryDiv = document.querySelector('#country-list');
    countries.forEach(country => {
        const countryElement = document.createElement(`li`); // Create a line item element
        countryElement.classList.add("list-group-item"); // Apply class for styling
        countryElement.innerText = `${country.Country}`; // Set text to country name
        countryElement.id = `${country.Slug}`;
        
        countryDiv.append(countryElement);
    });
}

function getListItemSlug(){ // Returns the name and slug of the list-item 
    document.getElementById("country-list").addEventListener("click", function(e){
        if(e.target && e.target.nodeName == "LI"){
            var countrySlug = e.target.id;
            var countryName = e.target.innerText;
            console.log("List item", countrySlug, "was clicked.");
            console.log(countryName);
            populateDataButton(countrySlug, countryName);
        }
    });
}

function populateDataButton(countrySlug, countryName){ // Changes button data 
    const countryDataButton = document.querySelector('#get-country-data');
    countryDataButton.innerText = (`Get ${countryName} data`);
    countryDataButton.setAttribute("slug",countrySlug) // Slug is attribute used to change API call
}

function getCountryData(slug){
    console.log("SLUG:", slug);
    fetch(`https://api.covid19api.com/live/country/${slug}/status/confirmed/date/2021-05-28T00:00:00Z`, requestOptions)
    .then(response => response.json())
    .then(countryData => formatCountryData(countryData)) // Countries are returned from API as an array of JSON objects
    .catch(error => console.log('error', error));
}

function formatCountryData(countryData){
    console.log("Ye boi");
    const countryDataDiv = document.querySelector('#country-data-div');
    countryDataDiv.innerHTML ="";

    countryData.forEach(entry => {
        const countryDataElement = document.createElement(`p`); // Create a line item element
        countryDataElement.classList.add("p"); // Apply class for styling
        countryDataElement.innerText = `${entry.Confirmed}`; // Set text to country name
        countryDataDiv.append("\n Confirmed cases:", countryDataElement);
    });
}