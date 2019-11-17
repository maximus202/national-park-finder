$(document).ready(function () {
    const apiKey = '7dQLNs1OC7hf5n2he6izKncTQTBMxaYBb9KcrCdw';

    function generateSearch(statesString) {
        console.log(`generateSearch() with ${statesString} ran`);
        let maxResults = $('input[type="text"]').val();
        const url = `https://developer.nps.gov/api/v1/parks?stateCode=${statesString}&limit=${maxResults}&api_key=${apiKey}`;
        fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(response.statusText);
            })
            .then(responseJson => displayParks(responseJson))
            .catch(err => {
                $('.js-error-message').text(`Something has occurred: ${err.message}`);
            })
    };

    function createStatesString(statesSelected) {
        let statesString = `${statesSelected[0]}`;
        for (let i = 1; i < statesSelected.length; i++) {
            statesString += `%2C%20${statesSelected[i]}`;
        };
        console.log(statesString);
        generateSearch(statesString);
    }

    function searchForParks() {
        //The user must be able to search for parks in one or more states and must be able to set the max number
        //of results with default: 10
        console.log('searchForParks() ran');
        $('form').on('submit', event => {
            console.log('form subission heard.');
            event.preventDefault();
            let statesSelected = [];
            for (let i = 0; i < $('input[type="checkbox"]:checked').length; i++) {
                statesSelected.push($('input[type="checkbox"]:checked')[i].defaultValue);
                console.log(statesSelected);
                createStatesString(statesSelected);
            };
        });
    };

    function generateResults(responseJson) {
        for (let i = 0; i < responseJson.data.length; i++) {
            $('#results').append(`
        <h2>
            ${responseJson.data[i].fullName}
        </h2>
        <ul>
            <li>
                ${responseJson.data[i].description}
            </li>
            <li>
                <a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a>
            </li>
        </ul>`
            )
        };
    }

    function displayParks(responseJson) {
        //The parks in the given state must be displayed on the page. Include at least: Full name, Description, Website URL
        console.log(`displayParks() with ${responseJson.data[0].description} ran`);
        $('#results').empty();
        $('#results').append(generateResults(responseJson));
    };

    function clearResults() {
        //The user must be able to make multiple searches and see only the results for the current search.
        console.log('clearResults() ran');
    };

    searchForParks();
    clearResults();
});