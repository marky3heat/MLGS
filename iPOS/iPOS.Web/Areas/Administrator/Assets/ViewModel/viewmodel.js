﻿app.vm = (function (vm) {
    //"use strict";
    var modelTransactions = new app.Transactions();

    var modelAddTransaction = new app.createTransaction();
    var modelAddCustomer = new app.createCustomer();

    // #region CONTROLS                
    var isListShowed = ko.observable(true);
    var isCreateModeShow = ko.observable(false);
    var title = ko.observable("");

    var customer = ko.observableArray();
    var itemType = ko.observableArray();
    var itemCategory = ko.observableArray();

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

    function clearControls() {
        modelAddTransaction.TransactionId("");
        modelAddTransaction.TransactionNo("");
        modelAddTransaction.TransactionDate("");
        modelAddTransaction.TransactionType("");
        modelAddTransaction.CustomerId("");
        modelAddTransaction.Terminal("");
        modelAddTransaction.Status("");
        modelAddTransaction.ReviewedBy("");
        modelAddTransaction.ApprovedBy("");
        modelAddTransaction.CreatedBy("");
        modelAddTransaction.CreatedAt("");

        modelAddTransaction.first_name("");
        modelAddTransaction.last_name("");
        modelAddTransaction.middle_name("");
        modelAddTransaction.st_address("");
        modelAddTransaction.city_address("");
        modelAddTransaction.mobile_no("");

        modelAddTransaction.ItemName("");
        modelAddTransaction.ItemTypeId("");
        modelAddTransaction.ItemCategoryId("");
        modelAddTransaction.Remarks("");
    }

    function clearControlsCustomer() {
        modelAddCustomer.first_name("");
        modelAddCustomer.last_name("");
        modelAddCustomer.middle_name("");
        modelAddCustomer.st_address("");
        modelAddCustomer.mobile_no("");
        modelAddCustomer.city_address("");
        modelAddCustomer.zip_code("");
    }

    function NewTransactionPawning() {
        isListShowed(false);
        isCreateModeShow(true);
        title("Pawning");

        clearControlsCustomer();
        clearControls();

        getServerDate();
        getTransactionNo();
        getCustomer();
        getItemType();
    }
    
    function backToList() {
        isListShowed(true);
        isCreateModeShow(false);

        clearControlsCustomer();
        clearControls();
    }

    function saveTransactionPawn() {

        /*VALIDATIONS -START*/
        if (modelAddTransaction.TransactionNo() === "" || modelAddTransaction.TransactionNo() === undefined) {
            toastr.error("Transaction no is required.");
            modelAddTransaction.TransactionNo("");
            document.getElementById("TransactionNo").focus();
            return false;
        }

        if (modelAddTransaction.TransactionDate() === "" || modelAddTransaction.TransactionDate() === undefined) {
            toastr.error("Transaction date is required.");
            modelAddTransaction.TransactionDate("");
            document.getElementById("TransactionDate").focus();
            return false;
        }

        if (modelAddTransaction.CustomerId() === "" || modelAddTransaction.CustomerId() === undefined) {
            toastr.error("Select a customer.");
            modelAddTransaction.CustomerId("");
            document.getElementById("CustomerId").focus();
            return false;
        }

        /*VALIDATIONS -END*/
        loaderApp.showPleaseWait();
        var param = ko.toJS(modelAddTransaction);
        var url = RootUrl + "/Administrator/Transactions/SaveTransactionPawning";
        $.ajax({
            type: 'POST',
            url: url,
            data: ko.utils.stringifyJson(param),
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result.success) {
                    swal("Success", result.message, "success");
                    loadTransactionList();
                    backToList();

                    loaderApp.hidePleaseWait();
                } else {
                    loaderApp.hidePleaseWait();

                    swal("Error", result.message, "error");

                    clearControls();
                    backToList();
                }
            }
        });
    }

    function createCustomer() {
        $('#modalCreateNewCustomer').appendTo("body").modal('show');
    };

    function closeModal() {
        $('#modalCreateNewCustomer').modal('toggle');
    };

    function getCustomer() {
        $.getJSON(RootUrl + "/Administrator/Base/GetCustomer", function (result) {
            customer.removeAll();
            customer(result);
        });
    }
    function getCustomerById() {
        var CustomerId = $('#CustomerId').val();
        $.getJSON(RootUrl + "/Administrator/Base/GetCustomerById?CustomerId=" + CustomerId, function (result) {
            modelAddTransaction.first_name(result.first_name);
            modelAddTransaction.last_name(result.last_name);
            modelAddTransaction.middle_name(result.middle_name);
            modelAddTransaction.st_address(result.st_address);
            modelAddTransaction.city_address(result.city_address);
            modelAddTransaction.mobile_no(result.mobile_no);
        });
    }
    function saveCustomer() {
        /*VALIDATIONS -START*/
        if (modelAddCustomer.first_name() === "" || modelAddCustomer.first_name() === undefined) {
            toastr.error("Enter first name.");
            modelAddCustomer.first_name("");
            document.getElementById("first_name").focus();
            return false;
        }
        if (modelAddCustomer.last_name().trim() === "" || modelAddCustomer.last_name() === undefined) {
            toastr.error("Enter last name.");
            modelAddCustomer.last_name("");
            document.getElementById("last_name").focus();
            return false;
        }
        if (modelAddCustomer.middle_name().trim() === "" || modelAddCustomer.middle_name() === undefined) {
            toastr.error("Enter middle name.");
            modelAddCustomer.middle_name("");
            document.getElementById("middle_name").focus();
            return false;
        }
        if (modelAddCustomer.st_address().trim() === "" || modelAddCustomer.st_address() === undefined) {
            toastr.error("Enter street address.");
            modelAddCustomer.st_address("");
            document.getElementById("st_address").focus();
            return false;
        }
        if (modelAddCustomer.mobile_no().trim() === "" || modelAddCustomer.mobile_no() === undefined) {
            toastr.error("Enter mobile no.");
            modelAddCustomer.mobile_no("");
            document.getElementById("mobile_no").focus();
            return false;
        }
        if (modelAddCustomer.city_address().trim() === "" || modelAddCustomer.city_address() === undefined) {
            toastr.error("Enter city address.");
            modelAddCustomer.city_address("");
            document.getElementById("city_address").focus();
            return false;
        }
        if (modelAddCustomer.zip_code().trim() === "" || modelAddCustomer.zip_code() === undefined) {
            toastr.error("Enter zip code.");
            modelAddCustomer.zip_code("");
            document.getElementById("zip_code").focus();
            return false;
        }

        /*VALIDATIONS -END*/
        loaderApp.showPleaseWait();
        var param = ko.toJS(modelAddCustomer);
        var url = RootUrl + "/Administrator/Base/SaveCustomer";
        $.ajax({
            type: 'POST',
            url: url,
            data: ko.utils.stringifyJson(param),
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result.success) {
                    swal("Success", result.message, "success");
                    closeModal();
                    getCustomer();

                    loaderApp.hidePleaseWait();
                } else {
                    loaderApp.hidePleaseWait();

                    swal("Error", result.message, "error");

                    clearControls();
                }
            }
        });
    }

    function getItemType() {
        $.getJSON(RootUrl + "/Administrator/Base/GetItemType", function (result) {
            itemType.removeAll();
            itemType(result);
        });
    }
    function getItemCategory(arg) {
        var itemTypeId = $('#ItemTypeId').val();
        if (arg !== "") {
            itemTypeId = arg;
        } else {
            itemTypeId = $('#ItemTypeId').val();
        }

        if (itemTypeId !== "") {
            $.getJSON(RootUrl + "/Administrator/Base/GetItemCategory?ItemTypeId=" + itemTypeId, function (result) {
                itemCategory.removeAll();
                itemCategory(result);
            });
        }
    }

    function getServerDate() {
        $.getJSON(RootUrl + "/Administrator/Base/GetServerDate", function (result) {
            modelAddTransaction.TransactionDate(result);
        });
    }

    function getTransactionNo() {
        $.getJSON(RootUrl + "/Administrator/Base/GetTransactionNo", function (result) {
            modelAddTransaction.TransactionNo(result);
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
        title: title,

        createCustomer: createCustomer,
        customer: customer,
        modelAddCustomer: modelAddCustomer,

        modelTransactions: modelTransactions,
        modelAddTransaction: modelAddTransaction,

        getCustomerById: getCustomerById,

        getItemType: getItemType,
        getItemCategory: getItemCategory,

        itemType: itemType,
        itemCategory: itemCategory,

        saveTransactionPawn: saveTransactionPawn,
        saveCustomer: saveCustomer
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