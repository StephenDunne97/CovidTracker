var requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

function populateCountryList() { // Fxn to get list of countries
    fetch("https://api.covid19api.com/countries", requestOptions)
    .then(response => response.json())
    .then(countries => extractCountryData(countries)) // Countries are returned from API as an array of JSON objects
    .catch(error => console.log('error', error));
}

function initPopGlobal() {
    console.log("init");
    // Get global summary cases
    fetch(`https://api.covid19api.com/summary`, requestOptions)
    .then(response => response.json())
    .then(summaryData => popGlobal(summaryData)) // Countries are returned from API as an array of JSON objects
    .catch(error => console.log('error', error));
}

function popGlobal(summaryData){
    var summary = summaryData.Global;
    const countryDataDiv = document.querySelector('#country-data-div');
    countryDataDiv.innerHTML ="";
    const countryDataElement = document.createElement(`p`); // Create a line item element
    countryDataElement.classList.add("p-data"); // Apply class for styling
    countryDataElement.innerText = `Global cases: ${summary.TotalConfirmed}`; // Set text to country name
    countryDataDiv.append(countryDataElement);
    
}

function extractCountryData(countries){ // Fxn to parse country array 
    const countryDiv = document.querySelector('#country-list');
    countries.sort(function(a,b){ // Sorts in alphabetical order
        var x = a.Country < b.Country? -1:1; 
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
    // Get confirmed cases
    fetch(`https://api.covid19api.com/total/country/${slug}/status/confirmed`, requestOptions)
    .then(response => response.json())
    .then(countryData => formatCountryData(countryData)) // Countries are returned from API as an array of JSON objects
    .catch(error => console.log('error', error));

    // Get recovered cases 
    /*
    fetch(`https://api.covid19api.com/total/country/${slug}/status/recovered`, requestOptions)
    .then(response => response.json())
    .then(countryData => formatCountryData(countryData)) // Countries are returned from API as an array of JSON objects
    .catch(error => console.log('error', error));

    // Get death cases 
    fetch(`https://api.covid19api.com/total/country/${slug}/status/deaths`, requestOptions)
    .then(response => response.json())
    .then(countryData => formatCountryData(countryData)) // Countries are returned from API as an array of JSON objects
    .catch(error => console.log('error', error));
    */
}

function formatCountryData(countryData){
    console.log("Ye boi");
    var lastItem = countryData.slice(countryData.length - 1);
    console.log(lastItem);
    const countryDataDiv = document.querySelector('#country-data-div');
    countryDataDiv.innerHTML ="";
    if (lastItem.length != 0){
        lastItem.forEach(entry => {
            const countryDataElement = document.createElement(`p`); // Create a line item element
            countryDataElement.classList.add("p-data"); // Apply class for styling
            countryDataElement.innerText = `Confirmed cases: ${entry.Cases}`; // Set text to country name
            countryDataDiv.append(countryDataElement);
        });    
    }
    else{
        const countryDataElement = document.createElement(`p`); // Create a line item element
        countryDataElement.classList.add("p"); // Apply class for styling
        countryDataDiv.append("No data available for this country.");
    }
}