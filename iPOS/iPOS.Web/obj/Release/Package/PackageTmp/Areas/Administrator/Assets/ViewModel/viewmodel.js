app.vm = (function (vm) {
    //"use strict";
    var modelTransactions = new app.Transactions();

    // #region CONTROLS                
    var isListShowed = ko.observable(true);
    var isCreateModeShow = ko.observable(false);
    var title = ko.observable("");

    // #endregion

    // #region BEHAVIORS
    // initializers
    function activate() {
        hideSidebar();
        loadTransactionList();
    }

    function loadTransactionList() {
        $("#transactionTable").dataTable().fnDestroy();
        var $datatables = $('#transactionTable');
        $datatables.DataTable({
            dom: "<'row'<'col-sm-6'i><'col-sm-6'f>>" + "<'table-responsive'tr>" + "<'row'<'col-sm-6'l><'col-sm-6'p>>",
            language: {
                paginate: {
                    previous: '&laquo;',
                    next: '&raquo;'
                },
                search: "_INPUT_",
                searchPlaceholder: "Search…"
            },
            ajax: {
                url: RootUrl + "/Administrator/Transactions/GetTransactions",
                type: "GET",
                datatype: "json"
            },
            columns: [
            { data: "TransactionNo", "className": "text-left" },
            {
                data: "TransactionDate",
                className: "text-left",
                render: function (data, type, row) {
                    var pattern = /Date\(([^)]+)\)/;
                    var results = pattern.exec(row.TransactionDate);
                    var dt = new Date(parseFloat(results[1]));
                    return (dt.getMonth() + 1) + "/" + dt.getDate() + "/" + dt.getFullYear();
                }
            },
            { data: "TransactionType", "className": "text-left" },
            {
                className: "text-left",
                render: function (data, type, row) {
                    return row.first_name + " " + row.last_name
                }
            },
            {
                data: "Status",
                className: "text-center",
                render: function (data, type, row) {
                    if (row.Status == "For appraisal") {
                        return '<td>' +
                        '<span class="label label-outline-info">' + row.Status + '</span>'
                        '<td>';
                    }
                    else if (row.Status == "For pawning") {
                        return '<td>' +
                        '<span class="label label-outline-warning">' + row.Status + '</span>'
                        '<td>';
                    }
                    else if (row.Status == "Completed") {
                        return '<td>' +
                        '<span class="label label-outline-success">' + row.Status + '</span>'
                        '<td>';
                    }
                    else {
                        return '<td>' +
                        '<span class="label label-outline-primary">' + row.Status + '</span>'
                        '<td>';
                    }
                }
            },
            {
                className: "text-center",
                render: function () {
                    return '<div class="dropdown">' +
                        '<button class="btn btn-primary btn-xs dropdown-toggle" data-toggle="dropdown" type="button">' +
                          'More '
                        + '<span class="caret"></span>' +
                        '</button>' +
                        '<ul class="dropdown-menu dropdown-menu-right">' +
                          '<li><a href="#">View</a></li>' +
                          '<li><a href="' + RootUrl + '/administrator/appraisal">Go to appraisal</a></li>' +
                          '<li role="separator" class="divider"></li>' +
                          '<li><a href="#">Cancel transaction</a></li>' +
                        '</ul>' +
                      '</div>';
                }
            }
            ],
            order: [[4, "desc"]]
        });
    }

    function NewTransactionPawning() {
        isListShowed(false);
        isCreateModeShow(true);
        title("Pawning");
    }
    
    function backToList() {
        isListShowed(true);
        isCreateModeShow(false);
    }


    function getServerDate() {
        $.getJSON(RootUrl + "/Administrator/Base/GetServerDate", function (result) {
            model.TransactionDate(result);
        });
    }

    function getTransactionNo() {
        $.getJSON(RootUrl + "/Administrator/PawnshopTransactions/GetTransactionNo", function (result) {
            model.TransactionNo(result);
        });
    }

    var newTransactionCounter = ko.observableArray();
    var hasNewTransaction = ko.observableArray(false);
    function update() {
        $.getJSON(RootUrl + "/Administrator/Base/GetNewTransactionsCounter", function (result) {
            newTransactionCounter(result);
            if (result > 0) {
                hasNewTransaction(true);
            }
            else {
                hasNewTransaction(false);
            }
        });
    }

    function hideSidebar() {
        $('#hide-sidebar').trigger('click');
    };

    // #endregion

    var vm = {
        activate: activate,
        modelTransactions: modelTransactions,

        newTransactionCounter: newTransactionCounter,
        hasNewTransaction: hasNewTransaction,

        isListShowed: isListShowed,
        isCreateModeShow: isCreateModeShow,

        update: update,

        NewTransactionPawning: NewTransactionPawning,
        backToList: backToList,
        title: title
    };

    return vm;

})();


$(function () {
    "use strict";

    app.vm.activate();

    setInterval(function () {
        app.vm.update();
    }, 1000);

    ko.applyBindings(app.vm);
});