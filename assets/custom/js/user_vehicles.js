var addModal = new bootstrap.Modal('#AddModal', { backdrop : 'static' });

function FillCTypes() {
    $.ajax({
        method: "POST",
        url: "/api/allctypes"
    }).done(function (resp) {
        if (resp.code === 0) {
            var rows = resp.data;
            if(Array.isArray(rows) && rows.length > 0) {
                var html = "<option value='-1'>--Select Type--</option>";
                for(var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    html += ("<option value='" + row.chargetype_id + "'>" + row.chargetype_name + "</option>");
                }

                $("#ddChargeType").html(html);
            }
        }
        else {
            //ShowErrorBox('Error!', resp.message);
        }
    });
}

function FillVehicles() {
    $.ajax({
        method: "POST",
        url: "/api/alluservehicles"
    }).done(function (resp) {
        if (resp.code === 0) {
            if (Array.isArray(resp.data) === true && resp.data.length > 0) {
                var html = "";
                for (var i = 0; i < resp.data.length; i++) {
                    var row = resp.data[i];
                    html += "<tr>";
                    html += ("<td>" + (i + 1) + "</td><td>" + row.company + "</td><td>" + row.model + "</td><td>" + row.chargetype_name + "</td>");
                    html += ("<td style='width: 200px;'><button onclick='onEdit(" + row.vehicle_id + ");' class='btn btn-warning btn-sm w-100 p-0'>Edit</button><br/><button onclick='onDelete(" + row.vehicle_id + ");' class='btn btn-danger btn-sm w-100 p-0'>Delete</button><br/></td>");
                    html += "</tr>";
                }

                $("#tblVehicles tbody").html(html);
            }
            else
                $("#tblVehicles tbody").html("<tr><td class='text-center' colspan='5'><h4>No Data!</h4></td></tr>");
        }
        else {
            ShowErrorBox('Error', resp.message);
            $("#tblVehicles tbody").html("<tr><td class='text-center' colspan='5'><h4>No Data!</h4></td></tr>");
        }
    });
}

$("#btnTriggerAddModal").click(function() {
    addModal.show();
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

    FillCTypes();
    FillVehicles();
});