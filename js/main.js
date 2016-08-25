var res, score;
        //--------------criminal record----------
        var record = JSON.parse(data);
        var record_count = record.length;

        function nominati(event, index){
            var v = $("#address" + index).val();
            if(v.length <= 6);
            else{
                var str = v.split(" ");
                var address = str[0];
                for(var i = 1; i < str.length; i++){
                    address += "+" + str[i];
                }
                var url = "https://nominatim.openstreetmap.org/search?q=" + address + "&countrycodes=au&accept-language=au&format=json&addressdetails=1";

                $.ajax({url: url, success: function(result){
                    // console.log(result[0].display_name);
                    // var suggestOption = "<option value='" + result[0].display_name + "'>" + result[0].display_name + "</option>";
                    // $('#suggest_ul').append(suggestOption);
                    res = result;
                    var contents="";
                    if(result.length == 0){
                        contents = "<li>No available matched data</li>";
                    }else{
                        $("#suggest_ul" + index).show(0);
                        for(var i=0; i<result.length; i++){
                            var dpname = result[i].display_name;
                            contents=contents+"<li id='suggest_li_"+i+"'><a href='#' onclick='liClick("+ i +"," + index + ");'>"+dpname+"</a></li>";
                            // contents=contents+"<li class='suggest_li"+(i+1)+"'>"+dpname+"</li>";

                        }

                        $("#suggest_ul" + index).html(contents);

                    }
                }});

                // $.get(url, function(data, status){
                //     alert(data);
                // });
            }
        }

        // function ulClick(){
        //     var ul = document.getElementById("suggest_ul");
        //     var lis = ul.getElementsByTagName("li");
        //     console.log(res);
        //     for(var i = 0; i < lis.length; i++){
        //         lis[i].onclick = function(){
        //             // alert(i);
        //         }
        //     }
        // }

        var markers = []; 
        // = new L.marker();
        function liClick(obj, index){
            var lon = res[obj].lon;
            var lat = res[obj].lat;
            // index = 0 , property
            if(index == 0){
                var county = res[obj].address.county;
                score = getCriminalRate(county);
                console.log(score);
            }
            // remove marker before add it to map
            if(markers[index]!=null){
                map.removeLayer(markers[index]);
            }

            markers[index] = new L.marker();
            markers[index].setLatLng([lat, lon]);
            markers[index].addTo(map);
            $("#suggest_ul" + index).hide("fast");
            $("#address" + index).attr("lon", lon);
            $("#address" + index).attr("lat", lat);
            map.setView([lat, lon]);

        }

        // calculate the criminal rate
        function getCriminalRate(county){
            if (county == null)
                return 0;
            else
            {
                for (var i = 0; i < record_count; i++)
                {
                    if (county.toLowerCase().includes(record[i].county.toLowerCase()))
                        return -record[i].rate;
                }
            }
        }

        // submit and generate report
        function submit(){
            if($("#address0").val() == ""){
                swal("Must enter the property address!!");
                return;
            }
            else{
                var flag = true;
                for(var i = 1; i <= 3; i++){
                    flag = flag && ($("#address"+i).val() == "");
                }
                if(flag)
                    swal("At least enter one point of interest!");
                else{
                    // pop up the score of property and add the marker of property on the map
                    markers[0].bindPopup("Score of this property:<br><b><span style='color: red;'>" + score +"</span></b>").openPopup();

                    // draw route
                    var color=['red', 'blue', 'green'];
                    for(var i = 1; i < markers.length; i++){
                        var dir = MQ.routing.directions();
                        dir.route({
                            locations:[
                                {latLng: {lat: markers[0].getLatLng().lat, lng: markers[0].getLatLng().lng}},
                                {latLng:{lat: markers[i].getLatLng().lat, lng: markers[i].getLatLng().lng}}]
                        });
                        map.addLayer(MQ.routing.routeLayer({
                            directions: dir,
                            fitBounds: true,
                            ribbonOptions:{
                                ribbonDisplay: {color: color[i-1]}
                            }
                        }));
                        map.removeLayer(markers[i]);
                    }

                    // calculate time
                    var address0 = [markers[0].getLatLng().lat, markers[0].getLatLng().lng];
                    var address1 = [markers[1].getLatLng().lat, markers[1].getLatLng().lng];
                    var address2 = [markers[2].getLatLng().lat, markers[2].getLatLng().lng];
                    var address3 = [markers[3].getLatLng().lat, markers[3].getLatLng().lng];

                    var performSomeAction = function (ttScore) {
                        console.log("......." + ttScore);
                        var html = "<p style='color: yellow; margin-left: 5px'>Result Report<br><br>";
                        html += ($("#address0").val() + "<br><br>Dangerous Fact: ");
                        html += ( (-score) + "<br>");
                        html += ('<span style="color:green">15</span><input type="range" min="15" max="75" value="'+ (-score) + '" disabled/><span style="color:red">75</span><br><br>');
                        html += ("Transportation Evaluation: " + ttScore + "<br>");
                        html += ('<span style="color:green">1</span><input type="range" min="1" max="100" value="' + ttScore + '" disabled/><span style="color:red">100</span><br><br></p>');
                        $("#report").html(html);
                    }
                        
                    calcTime(address0, address1, address2, address3, performSomeAction);

                    // //print report
                    // var html = "<p style='color: yellow; margin-left: 5px'>Result Report<br>";
                    // html += ($("#address0").val() + "<br>Dangerous Fact(15 - 75): ");
                    // html += ( (-score) + "<br>Transportation Evaluation(1 - 100): " + ttScore + "</p>");
                    // $("#report").html(html);

                }
            }
        }
