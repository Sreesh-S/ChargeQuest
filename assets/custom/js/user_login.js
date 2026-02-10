function ValidateLogin() {
    var ret = true;

    var login = $("#tbLogin").val();
    var passwd = $("#tbPasswd").val();

    if(login === '') {
        $("#tbLogin").addClass('is-invalid');
        ret = false;
    }

    if(passwd === '') {
        $("#tbPasswd").addClass('is-invalid');
        ret = false;
    }

    return ret;
}

