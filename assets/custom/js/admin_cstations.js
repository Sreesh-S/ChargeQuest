var csModal = new bootstrap.Modal('#ChangeStatusModal', { backdrop: 'static' });
var editModal = new bootstrap.Modal('#EditModal', { backdrop: 'static' });
var sellocModal = new bootstrap.Modal('#LocPickerModal', { backdrop: 'static' });

function formatStatus(status) {
    if (status === 'Active') return "<span class='badge bg-success'>Active</span>";
    else if (status === 'Inactive') return "<span class='badge bg-secondary'>Inactive</span>";
}

$("#tbLat").change(function () {
    var lat = $("#tbLat").val();
    var long = $("#tbLong").val();

    var locobj = { lat: lat, long: long };
    $("#hdnLoc").val(JSON.stringify(locobj));
});

$("#tbLong").change(function () {
    var lat = $("#tbLat").val();
    var long = $("#tbLong").val();

    var locobj = { lat: lat, long: long };
    $("#hdnLoc").val(JSON.stringify(locobj));
});

$("#tbCity").change(function () {
    var city = $("#tbCity").val();
    if (city !== '') {
        $.ajax({
            method: "POST",
            url: "/api/citylatlong",
            data: { csid: csid }
        }).done(function (resp) {

        });
    }
});

function onChangeStatus(csid) {
    $.ajax({
        method: "POST",
        url: "/api/getcstation",
        data: { csid: csid }
    }).done(function (resp) {
        if (resp.code === 0) {
            var cs = resp.data;
            $("#hdnCSCSID").val(cs.cs_id);
            $("#tbCSName").val(cs.cs_name);
            $("#ddCSStatus").val(cs.cs_status);
            csModal.show();
        }
        else {
            ShowErrorBox('Error!', resp.message);
        }
    });
}

function ValidateAdd() {
    var ret = true;

    var name = $("#tbName").val();
    var lat = $("#tbLat").val();
    var long = $("#tbLong").val();

    if (name === '') {
        $("#tbName").addClass('is-invalid');
        ret = false;
    }

    if (lat === '') {
        $("#tbLat").addClass('is-invalid');
        ret = false;
    }

    if (long === '') {
        $("#tbLong").addClass('is-invalid');
        ret = false;
    }

    return ret;
}

function ValidateEdit() {
    var ret = true;

    var name = $("#tbEditName").val();
    var lat = $("#tbEditLat").val();
    var long = $("#tbEditLong").val();

    if (name === '') {
        $("#tbEditName").addClass('is-invalid');
        ret = false;
    }

    if (lat === '') {
        $("#tbEditLat").addClass('is-invalid');
        ret = false;
    }

    if (long === '') {
        $("#tbEditLong").addClass('is-invalid');
        ret = false;
    }

    return ret;
}

function onEdit(csid) {
    $.ajax({
        method: "POST",
        url: "/api/getcstation",
        data: { csid: csid }
    }).done(function (resp) {
        if (resp.code === 0) {
            var row = resp.data;
            $("#hdnEditCSID").val(row.chargingstation_id);
            $("#tbEditName").val(row.chargingstation_name);
            $("#tbEditLat").val(row.chargingstation_lat);
            $("#tbEditLong").val(row.chargingstation_lng);

            editModal.show();
        }
        else {
            ShowErrorBox('Error!', resp.message);
        }
    });
}

function fillCSList() {
    var cslistj = $("#cslist").html();
    if (cslistj.length > 0) {
        var cslist = JSON.parse(cslistj);
        if (Array.isArray(cslist) && cslist.length > 0) {
            var html = "";
            for (var i = 0; i < cslist.length; i++) {
                var cslocj = cslist[i].cs_location;
                html += "<tr>";
                html += ("<td>" + (i + 1) + "</td>");
                html += ("<td><b>" + (cslist[i].chargingstation_name) + "</b></td>");
                html += ("<td>" + cslist[i].chargingstation_lat + ", " + cslist[i].chargingstation_lng + "</td>");
                html += ("<td>" + formatStatus(cslist[i].chargingstation_status) + "</td>");
                html += ("<td><button onclick='onEdit(" + cslist[i].chargingstation_id + ");' class='btn btn-success btn-sm mb-1 p-0'>Edit</button><br/><button onclick='onChangeStatus(" + cslist[i].cs_id + ");' class='btn btn-warning btn-sm mb-1 p-0'>Change Status</button><br/><a href='/admin/cports?csid=" + cslist[i].chargingstation_id + "' class='btn btn-danger btn-sm p-0'>Charge Ports</a></td>");
                html += "</tr>";
            }

            $("#tblCSList tbody").html(html);
        }
        else {
            $("#tblCSList tbody").html("<tr><td colspan='5' class='text-center'><h4>No Stations Yet!</h4></td></tr>");
        }
    }
    else {
        $("#tblCSList tbody").html("<tr><td colspan='5' class='text-center'><h4>No Stations Yet!</h4></td></tr>");
    }
}

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
        document.getElementById('hdnLocInfo').value = JSON.stringify(event.lngLat);
        //$("#tbLong").val(event.lngLat.lng);
        console.log('Location picked: ', JSON.stringify(event.lngLat));
        //alert(JSON.stringify(event.lngLat));
        $("#tbLat").val(event.lngLat.lat);
        $("#tbEditLat").val(event.lngLat.lat);
        $("#tbLong").val(event.lngLat.lng);
        $("#tbEditLong").val(event.lngLat.lng);
    });
}

$("#btnSelectLoc").click(function() {
    // var loc = $("#hdnLocInfo").val();
    // console.log($("#hdnLocInfo").val());
    // $("#tbLat").val(loc.lat);
    // $("#tbEditLat").val(loc.lat);
    // $("#tbLong").val(loc.lng);
    // $("#tbEditLong").val(loc.lng);
});

$("#btnTriggerSelectLoc").click(function() {
    sellocModal.show();
});

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

    fillCSList();
});