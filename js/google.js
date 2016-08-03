var address0 = [-37.88,145.12];
var address1 = [-37.78,145.02];
var address2 = [-37.99,145.22];
var address3 = [-37.88,145.30];
var addressList = [];
// console.log(addressList);

function getTimeScore(timeMins) {
    switch (true) {
        case (timeMins <= 10):
            return 10;
            break;
        case (timeMins > 10 && timeMins <= 20):
            return 9;
            break;
        case (timeMins > 20 && timeMins <= 30):
            return 8;
            break;
        case (timeMins > 30 && timeMins <= 40):
            return 7;
            break;
        case (timeMins > 40 && timeMins <= 50):
            return 6;
            break;
        case (timeMins > 50 && timeMins <= 60):
            return 5;
            break;
        case (timeMins > 60):
            return 4;
            break;
        default:
            return 0;
            break;
    }
}

function getTimeTotalScore(minsList) {
    var timeScore1 = getTimeScore(minsList[0]) * 6;
    // console.log(minsList[0]);
    // console.log(timeScore1);
    var timeScore2 = getTimeScore(minsList[1]) * 3;
    // console.log(minsList[1]);
    // console.log(timeScore2);
    var timeScore3 = getTimeScore(minsList[2]) * 1;
    // console.log(minsList[2]);
    // console.log(timeScore3);
    return (timeScore1 + timeScore2 + timeScore3);
}

var timeIndex = 1;
var planObjList = [];
var planObj = {};
var minsList = [];

function calcTime(add0, add1, add2, add3, callback) {
    addressList = [add0, add1, add2, add3];
    var addr0lat = addressList[0][0];
    var addr0lon = addressList[0][1];
    var addrXlat = addressList[timeIndex][0];
    var addrXlon = addressList[timeIndex][1];
    var addr0Str = addr0lat +","+ addr0lon;
    var addrXStr = addrXlat +","+ addrXlon;
    var directionsService = new google.maps.DirectionsService;
    directionsService.route({
        origin: addr0Str,
        destination: addrXStr,
        travelMode: 'TRANSIT'
    }, function(response, status) {
        if (status === 'OK') {
            //console.log(response);
            planObj = response;
            //console.log(planObj.routes[0].legs[0].duration.value);
            minsList.push(planObj.routes[0].legs[0].duration.value / 60);

            planObjList.push(planObj);
            calcNextTime(callback);
            if (planObjList.length == addressList.length - 1) {
                // console.log("OK");
                // console.log(minsList);
                var ttScore = getTimeTotalScore(minsList);
                //ttScore = getTimeTotalScore(minsList);
                console.log(ttScore);
                callback(ttScore);
            }

    } else {
            alert('Directions request failed due to ' + status);
        }
    });
}

function calcNextTime(callback){
    timeIndex++;
    if (timeIndex < addressList.length) {
        calcTime(addressList[0], addressList[1], addressList[2], addressList[3], callback);
    }
}
