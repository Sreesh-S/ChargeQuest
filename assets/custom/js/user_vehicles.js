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
                    html += ("<td>" + (i + 1) + "</td>");
                    html += ("<td>" + row.company + "</td>");
                    html += ("<td>" + row.model + "</td>");
                    html += ("<td>" + row.vehicle_colour + "</td>");
                    html += ("<td>" + row.battery_capacity + " kWh</td>");
                    html += ("<td>" + row.vehicle_range + " km</td>");
                    html += ("<td>" + row.chargetype_name + "</td>");
                    html += ("<td><button onclick='onDelete(" + row.vehicle_id + ");' class='btn btn-danger btn-sm px-3 py-1'>Delete</button></td>");
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
    initPresets();
});

const evPresets = [
    // TATA MOTORS
    { name: "Tata Nexon EV (Long Range)", company: "Tata", model: "Nexon EV LR", capacity: 40.5, range: 465, ctid: 1 },
    { name: "Tata Nexon EV (Medium Range)", company: "Tata", model: "Nexon EV MR", capacity: 30, range: 325, ctid: 1 },
    { name: "Tata Punch EV (Long Range)", company: "Tata", model: "Punch EV LR", capacity: 35, range: 421, ctid: 1 },
    { name: "Tata Punch EV (Medium Range)", company: "Tata", model: "Punch EV MR", capacity: 25, range: 315, ctid: 1 },
    { name: "Tata Curvv EV (55 kWh)", company: "Tata", model: "Curvv EV 55", capacity: 55, range: 585, ctid: 1 },
    { name: "Tata Curvv EV (45 kWh)", company: "Tata", model: "Curvv EV 45", capacity: 45, range: 502, ctid: 1 },
    { name: "Tata Tiago EV (Long Range)", company: "Tata", model: "Tiago EV LR", capacity: 24, range: 315, ctid: 1 },
    { name: "Tata Tiago EV (Medium Range)", company: "Tata", model: "Tiago EV MR", capacity: 19.2, range: 250, ctid: 1 },
    { name: "Tata Tigor EV", company: "Tata", model: "Tigor EV", capacity: 26, range: 306, ctid: 1 },
    { name: "Tata Harrier EV", company: "Tata", model: "Harrier EV", capacity: 60, range: 500, ctid: 1 },

    // MAHINDRA
    { name: "Mahindra XUV400 EV (EL Pro)", company: "Mahindra", model: "XUV400 EL", capacity: 39.4, range: 456, ctid: 1 },
    { name: "Mahindra XUV400 EV (EC Pro)", company: "Mahindra", model: "XUV400 EC", capacity: 34.5, range: 375, ctid: 1 },
    { name: "Mahindra XUV 3XO EV", company: "Mahindra", model: "XUV 3XO EV", capacity: 35, range: 400, ctid: 1 },
    { name: "Mahindra BE.05", company: "Mahindra", model: "BE.05", capacity: 79, range: 450, ctid: 1 },

    // MG MOTOR INDIA
    { name: "MG Windsor EV", company: "MG", model: "Windsor EV", capacity: 38, range: 331, ctid: 1 },
    { name: "MG ZS EV (Exclusive)", company: "MG", model: "ZS EV", capacity: 50.3, range: 461, ctid: 1 },
    { name: "MG Comet EV", company: "MG", model: "Comet EV", capacity: 17.3, range: 230, ctid: 1 },

    // HYUNDAI
    { name: "Hyundai Ioniq 5 (DC Fast)", company: "Hyundai", model: "Ioniq 5", capacity: 72.6, range: 631, ctid: 1 },
    { name: "Hyundai Creta EV", company: "Hyundai", model: "Creta EV", capacity: 45, range: 450, ctid: 1 },
    { name: "Hyundai Kona Electric", company: "Hyundai", model: "Kona Electric", capacity: 39.2, range: 452, ctid: 1 },

    // BYD (BUILD YOUR DREAMS)
    { name: "BYD Seal (Performance AWD)", company: "BYD", model: "Seal AWD", capacity: 82.5, range: 580, ctid: 1 },
    { name: "BYD Seal (Premium RWD)", company: "BYD", model: "Seal Premium", capacity: 82.5, range: 650, ctid: 1 },
    { name: "BYD Atto 3 (Superior)", company: "BYD", model: "Atto 3", capacity: 60.48, range: 521, ctid: 1 },
    { name: "BYD e6 (MPV)", company: "BYD", model: "e6 MPV", capacity: 71.7, range: 520, ctid: 1 },

    // KIA
    { name: "Kia EV6 (GT-Line)", company: "Kia", model: "EV6 GT", capacity: 77.4, range: 708, ctid: 1 },
    { name: "Kia EV9", company: "Kia", model: "EV9", capacity: 99.8, range: 561, ctid: 1 },

    // CITROEN
    { name: "Citroen eC3", company: "Citroen", model: "eC3", capacity: 29.2, range: 320, ctid: 1 },

    // VOLVO
    { name: "Volvo XC40 Recharge", company: "Volvo", model: "XC40 Recharge", capacity: 78, range: 418, ctid: 1 },
    { name: "Volvo C40 Recharge", company: "Volvo", model: "C40 Recharge", capacity: 78, range: 530, ctid: 1 },

    // LUXURY / PREMIUM BRANDS
    { name: "BMW i4 eDrive40", company: "BMW", model: "i4 eDrive40", capacity: 80.7, range: 590, ctid: 1 },
    { name: "BMW iX1 xDrive30", company: "BMW", model: "iX1", capacity: 66.4, range: 440, ctid: 1 },
    { name: "BMW iX xDrive50", company: "BMW", model: "iX 50", capacity: 111.5, range: 611, ctid: 1 },
    { name: "Mercedes-Benz EQA 250+", company: "Mercedes", model: "EQA 250", capacity: 70.5, range: 560, ctid: 1 },
    { name: "Mercedes-Benz EQB 350 4MATIC", company: "Mercedes", model: "EQB 350", capacity: 66.5, range: 423, ctid: 1 },
    { name: "Mercedes-Benz EQE 500 SUV", company: "Mercedes", model: "EQE 500", capacity: 90.6, range: 550, ctid: 1 },
    { name: "Mercedes-Benz EQS 580 4MATIC", company: "Mercedes", model: "EQS 580", capacity: 107.8, range: 857, ctid: 1 },
    { name: "Audi Q8 e-tron 55", company: "Audi", model: "Q8 e-tron", capacity: 114, range: 600, ctid: 1 },
    { name: "Audi e-tron GT", company: "Audi", model: "e-tron GT", capacity: 93.4, range: 500, ctid: 1 },
    { name: "Porsche Taycan 4S", company: "Porsche", model: "Taycan 4S", capacity: 93.4, range: 484, ctid: 1 },
    { name: "Porsche Macan EV", company: "Porsche", model: "Macan EV", capacity: 100, range: 613, ctid: 1 },
    { name: "Rolls-Royce Spectre", company: "Rolls-Royce", model: "Spectre", capacity: 102, range: 530, ctid: 1 }
];

function initPresets() {
    let html = "<option value='-1'>-- Choose a Preset EV --</option>";
    evPresets.forEach((p, idx) => {
        html += `<option value="${idx}">${p.name}</option>`;
    });
    $("#ddPresetVehicles").html(html);

    $("#ddPresetVehicles").change(function () {
        const idx = parseInt($(this).val());
        if (idx >= 0 && idx < evPresets.length) {
            const preset = evPresets[idx];
            $("#tbComp").val(preset.company);
            $("#tbModel").val(preset.model);
            $("#tbCapacity").val(preset.capacity);
            $("#tbRange").val(preset.range);
            $("#ddChargeType").val(preset.ctid);
        } else {
            $("#tbComp").val("");
            $("#tbModel").val("");
            $("#tbCapacity").val("");
            $("#tbRange").val("");
            $("#ddChargeType").val("-1");
        }
    });
}