var sellocModal = new bootstrap.Modal('#LocPickerModal', { backdrop: 'static' });

function FillVehicles() {
    $.ajax({
        method: "POST",
        url: "/api/alluservehicles"
    }).done(function (resp) {
        if (resp.code === 0) {
            if (Array.isArray(resp.data) === true && resp.data.length > 0) {
                var html = "<option value='-1'>--Select Vehicle--</option>";
                for (var i = 0; i < resp.data.length; i++) {
                    var row = resp.data[i];
                    html += "<option value='" + row.vehicle_id + "'>" + row.company + " " + row.model + "</option>";
                }

                $("#ddVehicles").html(html);
            }
        }
    });
}


function FillUserName() {
    $.ajax({
        method: "POST",
        url: "/api/getusername"
    }).done(function (resp) {
        if (resp.code === 0) {
            var row = resp.data;
            $("#lblUserName").html("&nbsp;<b>" + row + "</b>");
        }
    });
}

$("#btnTriggerLocationSelect").click(function() {
    sellocModal.show();
});

$("#btnSearch").click(function() {
    var veh = $("#ddVehicles").val();
    var loc = $("#tbLoc").val();

    $.ajax({
        method: "POST",
        url: "/api/search",
        data : { vid : veh, loc : loc }
    }).done(function (resp) {
        if (resp.code === 0) {
            var rows = resp.data;
            if(Array.isArray(rows) && rows.length > 0) {
                var html = "";
                for(var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    html += "<tr>";
                    html += ("<td>" + (i+1) + "</td><td>" + row.chargingstation_name + "</td><td>" + row.chargingstation_lat + ", " + row.chargingstation_lng + "</td><td>" + Math.round(row.distance) + "</td><td>" + row.chargingstation_status + "</td>");
                    html += "</tr>";
                }

                $("#tblSearchRes tbody").html(html);
            }
            else {
                $("#tblSearchRes tbody").html("<tr><td class='text-center' colspan='5'><h4>No Data!</h4></td></tr>");
            }
        }
        else {
            ShowErrorBox('Error', resp.message);
            $("#tblSearchRes tbody").html("<tr><td class='text-center' colspan='5'><h4>No Data!</h4></td></tr>");
        }
    });
});

var map, Marker1;

function initMap1() {
    map = new mappls.Map('map', {
        center: [9.5805097, 76.537262],
        zoomControl: true,
        location: true
    });
    Marker1 = new mappls.Marker({
        map: map,
        position: {
            "lat": 9.5805097,
            "lng": 76.537262
        },
        fitbounds: true,
        icon_url: 'https://apis.mapmyindia.com/map_v3/1.png'
    });

    map.on('click', function (event) {
        $("#tbLoc").val(JSON.stringify(event.lngLat));
    });
}

$(document).ready(function () {
    var resp_json = $("#resp").html();
    if (resp_json.length > 0) {
        var resp = JSON.parse(resp_json);

        if (resp.code === 0) {
            if (resp.message !== 'get' && resp.message !== 'ok') {
                ShowInfoBox('Success!', resp.message);
            }
        }
        else {
            ShowErrorBox('Error!', resp.message);
        }
    }

    FillUserName();
    FillVehicles();
});