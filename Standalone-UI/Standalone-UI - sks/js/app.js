$(document).ready(function () {


    var mBaseUrl = "http://localhost:9001"
    var today = new Date();
    var yesterday = new Date(new Date().setDate(new Date().getDate() - 30));

    var startDate = localStorage['startDate'] || yesterday.toLocaleDateString("de-De");
    var endDate = localStorage['endDate'] || today.toLocaleDateString("de-De");


    flatpickr("#datepickr", {
        mode: "range",
        dateFormat: "d.m.Y",
        defaultDate: [startDate, endDate]
    });

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    function formatStringToDate(date) {
        return date.split(".").reverse().join("-");
    }

    $.fn.dataTable.ext.errMode = 'none';

    $('#registerTools').DataTable({
        language: {
            url: '/js/datatables/i18n/de-DE.json',
        },
        searching: false,
        lengthChange: false,
        pageLength: 4,
        ajax: {
            url: "/api/v2/asanet/devices",
            dataSrc: ''
        },
        columns: [
            {data: 'name'},
            {data: 'manufactor'},
            {data: 'version'},
            {data: "os"}
        ]
    });

    $('#orderList').DataTable({
        language: {
            url: '/js/datatables/i18n/de-DE.json',
        },
        lengthChange: false,
        pageLength: 20,
        order: [[0, 'desc']],
        ajax: {
            url: mBaseUrl+ "/api/v2/db/order/list",
            dataSrc: '',
            data: {
                "from": formatStringToDate(startDate),
                "until": formatStringToDate(endDate),
                "sortBy": "DESC"
            }
        },
        columnDefs: [
            {
                targets: 0,
                visible: false,
                data: "id",
            },
            {
                targets: 1,
                data: "orderNo",
            },
            {
                targets: 2,
                data: "dealerNo"
            },
            {
                targets: 3,
                data: "orderDate"
            },
            {
                targets: 4,
                data: "licencePlate"
            },
            {
                targets: 5,
                data: "createdAt"
            }
        ],
    });

    /**
     * DATA-TABLE: PDF-REPORTS
     */
    var table = $('#PdfReportList').DataTable({
        language: {
            url: '/js/datatables/i18n/de-DE.json',
        },
        "searching": true,
        "lengthChange": false,
        "pageLength": 20,
        "autoWidth": false,
        order: [[0, 'desc']],
        ajax: {
            url: "/api/v2/db/pdf-report/list",
            dataSrc: '',
            data: {
                "from": formatStringToDate(startDate),
                "until": formatStringToDate(endDate),
                "sortBy": "DESC"
            }
        },
        columnDefs: [
            {
                targets: 0,
                visible: false,
                data: "id",
            },
            {
                targets: 1,
                data: null,
                defaultContent: '<button class="btn btn-primary" type="button"><i class="fas fa-download"></i></button>',
                width: "30px",
                orderable: false,
            },
            {
                targets: 2,
                data: "filename"
            },
            {
                targets: 3,
                data: "orderNo"
            },
            {
                targets: 4,
                data: "licencePlate"
            },
            {
                targets: 5,
                data: "createdAt"
            }
        ],
    });
    $('#PdfReportList tbody').on('click', 'button', function () {
        var baseurl = window.location.origin + window.location.pathname;
        var data = table.row($(this).parents('tr')).data();
        var id = data["id"];
        var link = baseurl + "api/v2/db/pdf-report/report?id=" + id;
        window.location.href = link;
    });


    function sendRestRequest2(linkId, apiUrl) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", apiUrl, true);

        xhr.onload = function () {

            var buttonClass = "btn-danger"
            var iClass = "fa-exclamation-triangle"

            if (xhr.status === 200) {
                buttonClass = "btn-success"
                iClass = "fa-check-circle"
            }

            var link = document.getElementById(linkId);
            link.classList.replace("btn-info", buttonClass);
            var icon = document.getElementById(linkId).querySelector("i");
            icon.classList.replace("fa-info-circle", iClass);
        };

        xhr.onerror = function () {
            console.log("Fehler bei der REST-Anfrage");
        };

        xhr.send();
    }


    var elementExists = document.getElementById("tagesDiagramm");
    if (elementExists != null) {

        console.log( "baseurl ", mBaseUrl);
        fetch(mBaseUrl +'/api/v2/db/order/statistic?from=' + formatStringToDate(startDate) + '&until=' + formatStringToDate(endDate))
            .then(response => response.json())
            .then(data => {
                console.log("reading resonse " + data);
                const labels = [];
                const dataPoints = [];
                const currentDate = new Date(formatStringToDate(startDate));
                while (currentDate <= new Date(formatStringToDate(endDate))) {

                    const currentDateISO = currentDate.toISOString().split('T')[0];
                    labels.push(currentDateISO);
                    dataPoints.push(data.dates[currentDateISO] || 0);
                    currentDate.setDate(currentDate.getDate() + 1);
                }

                // Diagramm erstellen
                createChart(labels, dataPoints);
            })
            .catch(error => {
                console.error('Fehler beim Abrufen der Daten:', error);
            });


        function createChart(labels, dataPoints) {
            const canvas = document.getElementById("tagesDiagramm");

            const chart = new Chart(canvas, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Aufträge am Tag',
                            data: dataPoints,
                            fill: false,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                ticks: {
                                    min: 0,
                                    stepSize: 1,
                                }
                            },
                            x: {
                                gridLines: {
                                    display: false,
                                },
                            },
                        },
                    }
                })
            ;
        }

    }


    document.getElementById("saveDateButton").addEventListener("click", function () {
        // Datum aus dem Datepicker-Feld auslesen
        var selectedDate = document.getElementById("datepickr").value;

        // Die Werte in lokalen JavaScript-Variablen speichern
        var dateParts = selectedDate.split(" to ");

        if (dateParts.length != 2) {
            console.log("Cannot set Date. Pls Check string:" + selectedDate);
        } else {
            console.log("Set Starting Date to %s and endDate to %s", dateParts[0], dateParts[1]);
            localStorage.setItem("startDate", dateParts[0]);
            localStorage.setItem("endDate", dateParts[1]);

            // Seite neu laden
            location.reload();
        }

    });
});


function sendRestRequest(linkId, apiUrl) {
    fetch(apiUrl)
        .then(response => {
            var buttonClass = "btn-danger";
            var iClass = "fa-exclamation-triangle";

            if (response.ok) {
                buttonClass = "btn-success";
                iClass = "fa-check-circle";
            }

            var link = document.getElementById(linkId);
            link.classList.replace("btn-info", buttonClass);
            var icon = document.getElementById(linkId).querySelector("i");
            icon.classList.replace("fa-info-circle", iClass);
        })
        .catch(error => {
            console.log("Fehler bei der REST-Anfrage");
        });
}