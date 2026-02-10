var addModal = new bootstrap.Modal('#AddModal', { backdrop : 'static' });
var editModal = new bootstrap.Modal('#EditModal', { backdrop : 'static' });

$("#ddSelectCS").change(function () {
    var csid = $("#ddSelectCS").val();
    if(csid !== '-1') {
        $.ajax({
            method: "POST",
            url: "/api/allcsports",
            data: { csid : csid }
        }).done(function (resp) {
            if (resp.code === 0) {
                var rows = resp.data;
                if(Array.isArray(rows) && rows.length > 0) {
                    var html = "";
                    for(var i = 0; i < rows.length; i++) {
                        var row = rows[i];
                        html += "<tr>";
                        html += ("<td>" + (i+1) + "</td><td>" + row.chargingport_name + "</td><td>" + row.chargetype_name + "</td><td>" + row.chargingport_status + "</td>");
                        html += ("<td style='width: 200px;'><button onclick='onEdit(" + row.vehicle_id + ");' class='btn btn-warning btn-sm w-100 p-0'>Edit</button><br/><button onclick='onDelete(" + row.vehicle_id + ");' class='btn btn-danger btn-sm w-100 p-0'>Delete</button><br/></td>");
                        html += "</tr>";
                    }
    
                    $("#tblCSPorts tbody").html(html);
                }
                else $("#tblCSPorts tbody").html("<tr><td class='text-center' colspan='5'><h4>No Data!</h4></td></tr>")
            }
            else {
                ShowErrorBox('Error!', resp.message);
                $("#tblCSPorts tbody").html("<tr><td class='text-center' colspan='5'><h4>No Data!</h4></td></tr>")
            }
        });    
    }
});

function FillCStations() {
    var csid = $("#csid").html();
    $.ajax({
        method: "POST",
        url: "/api/allcs"
    }).done(function (resp) {
        if (resp.code === 0) {
            var rows = resp.data;
            if(Array.isArray(rows) && rows.length > 0) {
                var html = "<option value='-1'>--Select Charging Station--</option>";
                for(var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    html += ("<option value='" + row.chargingstation_id + "'>" + row.chargingstation_name + "</option>");
                }

                $("#ddSelectCS").html(html);
                if(csid !== '') {
                    $("#ddSelectCS").val(csid);
                    $("#ddSelectCS").change();
                }
            }
        }
        else {
            ShowErrorBox('Error!', resp.message);
        }
    });
}

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

                $("#ddAPChargeType").html(html);
            }
        }
        else {
            //ShowErrorBox('Error!', resp.message);
        }
    });
}

$("#btnTriggerAddPort").click(function() {
    var csid = $("#ddSelectCS").val();
    console.log(csid);
    if(csid !== '-1') {
        $("#hdnAPCSID").val(csid);
        addModal.show();
    }
    else {
        console.log('Ohoiii');
        ShowErrorBox('Select Charging Station', 'You need to select a charging station to add port.');
    }
});

function onEdit(vid) {
    $.ajax({
        method: "POST",
        url: "/api/cport",
        data: { cpid : vid }
    }).done(function (resp) {
        if (resp.code === 0) {
            var row = resp.data;
            $("#hdnEditCPID").val(row.chargingport_id);
            $("#tbEditName").val(row.chargingport_name);
            $("#ddEditChargeType").val(row.chargetype_id);
            $("#ddEditStatus").val(row.chargingport_status);

            editModal.show();
        }
    });
}

function onDelete(vid) {
    $.ajax({
        method: "POST",
        url: "/api/cport",
        data: { cpid : vid }
    }).done(function (resp) {
        if (resp.code === 0) {
            var row = resp.data;
            $("#hdnDelCPID").val(row.chargingport_id);
            $("#DeleteModal .modal-body p").html("Are you sure you want to delete <b>'" + row.chargingport_name + "'</b>?");
            delModal.show();
        }
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

    FillCStations();
    FillCTypes();
});

function ValidateAdd() {
    var ret = true;

    var name = $("#tbAPName").val();
    var ctid = $("#ddAPChargeType").val();

    if(name === '') {
        $("#tbAPName").addClass('is-invalid');
        ret = false;
    }

    if(ctid === '-1') {
        $("#ddAPChargeType").addClass('is-invalid');
        ret = false;
    }

    return ret;
} 

function ValidateEdit() {
    var ret = true;

    var name = $("#tbEditName").val();
    var ctid = $("#ddEditChargeType").val();
    var status = $("#ddEditStatus").val();

    if(name === '') {
        $("#tbAPName").addClass('is-invalid');
        ret = false;
    }

    if(ctid === '-1') {
        $("#ddAPChargeType").addClass('is-invalid');
        ret = false;
    }

    if(status === '-1') {
        $("#ddEditStatus").addClass('is-invalid');
        ret = false;
    }

    return ret;
}