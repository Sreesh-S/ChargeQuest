var chstatusModal = new bootstrap.Modal('#ChangeStatusModal', { backdrop : 'static' });
var userdelModal = new bootstrap.Modal('#DeleteUserModal', { backdrop : 'static' });

function formatStatus(status) {
    if(status === 'active') return "<span class='badge bg-success'>Active</span>";
    else if(status === 'inactive') return "<span class='badge bg-secondary'>Inactive</span>";
    else if(status === 'suspended') return "<span class='badge bg-danger'>Suspended</span>";
}

function ValidateChangeStatus() {
    var ret = true;

    var uid = $("#hdnCSUserID").val();
    var status = $("#ddCSStatus").val();

    if(uid === '') {
        ret = false;
    }

    if(status === '-1') {
        $("#ddCSStatus").addClass('is-invalid');
        ret = false;
    }

    return ret;
}

function onChangeStatus(uid) {
    $.ajax({
        method: "POST",
        url: "/api/getuser",
        data: { userid : uid }
    }).done(function (resp) {
        if(resp.code === 0) {
            var user = resp.data;
            $("#hdnCSUserID").val(user.user_id);
            $("#tbCSFullName").val(user.user_name);
            $("#ddCSStatus").val(user.user_status);
            chstatusModal.show();
        }
        else {
            ShowErrorBox('Error!', resp.message);
        }
    });
}

function onDeleteUser(uid) {
    $.ajax({
        method: "POST",
        url: "/api/getuser",
        data: { userid : uid }
    }).done(function (resp) {
        if(resp.code === 0) {
            var user = resp.data;
            $("#hdnDelUserID").val(user.user_id);
            $("#DeleteUserModal .modal-body p").html('Are you sure you want to delete <b>' + user.user_name + '</b>?<br/><b>NOTE:</b> This action is irreversible.');
            userdelModal.show();
        }
        else {
            ShowErrorBox('Error!', resp.message);
        }
    });
}

function fillUserList() {
    var userj = $("#users").html();
    if(userj.length > 0) {
        var users = JSON.parse(userj);
        if(Array.isArray(users) && users.length > 0) {
            var html = "";
            for(var i = 0; i < users.length; i++) {
                html += "<tr>";
                html += ("<td>" + (i + 1) + "</td>");
                html += ("<td>" + users[i].user_name + "</td>");
                html += ("<td>" + users[i].user_email + "</td>");
                html += ("<td>" + users[i].user_mobile + "</td>");
                html += ("<td>" + users[i].user_address + "</td>");
                html += ("<td>" + users[i].user_city + "</td>");
                html += ("<td>" + formatStatus(users[i].user_status) + "</td>");
                html += ("<td><button onclick='onChangeStatus(" + users[i].user_id + ");' class='btn btn-warning btn-sm mb-1'>Change Status</button><br/><button onclick='onDeleteUser(" + users[i].user_id + ");' class='btn btn-danger btn-sm mb-1'>Delete</button></td>");
                html += "</tr>";
                //console.log(formatStatus(users[i].user_status));
            }

            $("#tblUserList tbody").html(html);
        }
        else {
            $("#tblUserList tbody").html("<tr><td colspan='8' class='text-center'><h4>No Users!</h4></td></tr>");
        }
    }
    else {
        $("#tblUserList tbody").html("<tr><td colspan='8' class='text-center'><h4>No Users!</h4></td></tr>");
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

    fillUserList();
});