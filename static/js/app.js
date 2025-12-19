
function getBathValue() {
    var uiBathrooms = document.getElementsByName("uiBathrooms");
    for (var i = 0; i < uiBathrooms.length; i++) {
        if (uiBathrooms[i].checked) {
            return parseInt(uiBathrooms[i].value); // Better to use the actual value from HTML
        }
    }
    return -1; // Invalid Value
}

function getBHKValue() {
    var uiBHK = document.getElementsByName("uiBHK");
    for (var i = 0; i < uiBHK.length; i++) {
        if (uiBHK[i].checked) {
            return parseInt(uiBHK[i].value); // Better to use the actual value from HTML
        }
    }
    return -1; // Invalid Value
}

function onClickedEstimatePrice() {
    console.log("Estimate price button clicked");
    var sqft = document.getElementById("uiSqft");
    var bhk = getBHKValue();
    var bathrooms = getBathValue();
    var location = document.getElementById("uiLocations");
    var estPrice = document.getElementById("uiEstimatedPrice");

    // Ensure values are valid before sending request
    if (bhk === -1 || bathrooms === -1) {
        alert("Please select BHK and Bathrooms");
        return;
    }

    var url = "/predict_home_price"; 

   $.post(url, {
    total_sqft: parseFloat(sqft.value),
    bhk: bhk,      
    bath: bathrooms,
    location: location.value
}, function(data, status) {
        console.log("Prediction received:", data.estimated_price);
        estPrice.innerHTML = "<h2>" + data.estimated_price.toString() + " Lakh</h2>";
    }).fail(function() {
        alert("Error: Could not calculate price. Check if server is running.");
    });
}

function onPageLoad() {
    console.log("Document loaded, fetching locations...");
    
    var url = "/get_location_names"; 
    
    $.get(url, function(data, status) {
        console.log("Got response for get_location_names");
        if(data && data.locations) {
            var locations = data.locations;
            var uiLocations = document.getElementById("uiLocations");
            
            // Clear existing options
            $('#uiLocations').empty();
            $('#uiLocations').append(new Option("Choose a Location", "", true, true));

            // Populate locations
            locations.forEach(function(loc) {
                var opt = new Option(loc, loc);
                $('#uiLocations').append(opt);
            });
            console.log("Dropdown populated successfully.");
        }
    }).fail(function(error) {
        console.error("Error fetching locations:", error);
        alert("Could not load locations. Please ensure your Python server is running.");
    });
}

window.onload = onPageLoad;
