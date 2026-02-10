var ctModal = new bootstrap.Modal('#EditModal', { backdrop: 'static' });
var delModal = new bootstrap.Modal('#DeleteModal', { backdrop: 'static' });

function ValidateAdd() {
    var ret = true;

    var name = $("#tbName").val();
    var desc = $("#tbDesc").val();

    if(name === '') {
        $("#tbName").addClass('is-invalid');
        ret = false;
    }

    return ret;
}

function ValidateEdit() {
    var ret = true;

    var name = $("#tbEditName").val();
    var desc = $("#tbEditDesc").val();

    if(name === '') {
        $("#tbEditName").addClass('is-invalid');
        ret = false;
    }

    return ret;
}

function onEdit(ctid) {
    $.ajax({
        method: "POST",
        url: "/api/getctype",
        data: { ctid : ctid }
    }).done(function (resp) {
        if(resp.code === 0) {
            var ct = resp.data;
            $("#hdnEditCTID").val(ct.chargetype_id);
            $("#tbEditName").val(ct.chargetype_name);
            $("#tbEditDesc").val(ct.chargetype_desc);
            ctModal.show();
        }
        else {
            ShowErrorBox('Error!', resp.message);
        }
    });
}

function onDelete(ctid) {
    $.ajax({
        method: "POST",
        url: "/api/getctype",
        data: { ctid : ctid }
    }).done(function (resp) {
        if(resp.code === 0) {
            var ct = resp.data;
            $("#hdnDeleteCTID").val(ct.chargetype_id);
            $("#DeleteModal .modal-body p").html('Are you sure you want to delete charger type <b>' + ct.chargetype_name + '</b>? <br/><b>Note:</b> This action is irreversible.');
            delModal.show();
        }
        else {
            ShowErrorBox('Error!', resp.message);
        }
    });
}

function fillCTList() {
    var ctlistj = $("#ctlist").html();
    if(ctlistj.length > 0) {
        var ctlist = JSON.parse(ctlistj);
        if(Array.isArray(ctlist) && ctlist.length > 0) {
            var html = "";
            for(var i = 0; i < ctlist.length; i++) {
                html += "<tr>";
                html += ("<td>" + (i + 1) + "</td>");
                html += ("<td><b>" + (ctlist[i].chargetype_name) + "</b></td>");
                html += ("<td>" + (ctlist[i].chargetype_desc) + "</td>");
                html += ("<td><button type='button' onclick='onEdit(" + ctlist[i].chargetype_id + ");' class='btn btn-success btn-sm mb-1'>Edit</button><br/><button type='button' onclick='onDelete(" + ctlist[i].chargetype_id + ");' class='btn btn-danger btn-sm mb-1'>Delete</button></td>");
                html += "</tr>";
            }

            $("#tblCTList tbody").html(html);
        }
        else {
            $("#tblCTList tbody").html("<tr><td colspan='4' class='text-center'><h4>No Charger types added yet!</h4></td></tr>");
        }
    }
    else {
        $("#tblCTList tbody").html("<tr><td colspan='4' class='text-center'><h4>No Charger types added yet!</h4></td></tr>");
    }    
}

$(document).ready(function() {
    var resp_json = $("#resp").html();
    if(resp_json.length > 0) {
        var resp = JSON.parse(resp_json);

        if (resp.code === 0) {
            if (resp.message !== 'get') {
                ShowInfoBox('Success!', resp.message);
            }
        }
        else {
            ShowErrorBox('Error!', resp.message);
        }
    }

    fillCTList();
});
