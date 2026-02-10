var loginModal = new bootstrap.Modal('#LoginModal', { backdrop : 'static' });

function ValidateSignup() {
    var ret = true;

    var fname = $("#tbFullName").val();
    var email = $("#tbEmail").val();
    var pwd = $("#tbPasswd").val();
    var pwd1 = $("#tbPasswd1").val();
    var mob = $("#tbMobile").val();
    var addr = $("#tbAddress").val();
    var city = $("#tbCity").val();
    var dob = $("#tbDob").val();

    if(fname === '') {
        $("#tbFullName").addClass('is-invalid');
        ret = false;
    }

    if(email === '') {
        $("#tbEmail").addClass('is-invalid');
        ret = false;
    }

    if(pwd === '') {
        $("#tbPasswd").addClass('is-invalid');
        ret = false;
    }

    if(pwd !== pwd1 || pwd1 === '') {
        $("#tbPasswd").addClass('is-invalid');
        $("#tbPasswd1").addClass('is-invalid');
        ret = false;
    }

    if(mob === '') {
        $("#tbMobile").addClass('is-invalid');
        ret = false;
    }

    if(addr === '') {
        $("#tbAddress").addClass('is-invalid');
        ret = false;
    }

    if(city === '') {
        $("#tbCity").addClass('is-invalid');
        ret = false;
    }

    if(dob === '') {
        $("#tbDob").addClass('is-invalid');
        ret = false;
    }

    return ret;
}

$(document).ready(function() {
    var resp_json = $("#resp").html();
    if(resp_json.length > 0) {
        var resp = JSON.parse(resp_json);

        if (resp.code === 0) {
            if(resp.message === 'ok')
                loginModal.show();
        }
        else {
            ShowErrorBox('Error!', resp.message);
        }
    }
});