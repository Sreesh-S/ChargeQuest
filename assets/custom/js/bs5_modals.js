const errModal = new bootstrap.Modal('#ErrorBoxModal', { backdrop : 'static' });
const msgModal = new bootstrap.Modal('#MessageModal');

function ShowInfoBox(title, msg)
{
    document.querySelector("#MessageModal .modal-title").innerHTML = title;
    document.querySelector("#MessageModal .modal-body p").innerHTML = msg;
    msgModal.show();
}

function ShowErrorBox(title, msg)
{
    document.querySelector("#ErrorBoxModal .modal-title").innerHTML = title;
    document.querySelector("#ErrorBoxModal .modal-body p").innerHTML = msg;
    errModal.show();
}

$("#btnMsgModalClose").click(function(){
    console.log('Ohoii');
});

$("#ErrorBoxModal").click(function(){
    errModal.hide();
});