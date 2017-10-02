app.vm = (function (vm) {
    //"use strict";
    var model = new app.createModeModel();
    var customerModel = new app.createCustomerModel();

    // #region CONTROLS                
    var isListShowed = ko.observable(true);
    var transactions = ko.observable(false);
    var createCustomer = ko.observable(false);

    var isCreateModeShowedPawning = ko.observable(false);
    var isCreateModeShowedSale = ko.observable(false);
    var isCreateModeShowedLayaway = ko.observable(false);

    var isSaveButtonShowed = ko.observable(false);
    var saveButtonCaption = ko.observable("");

    var itemType = ko.observableArray();
    var itemCategory = ko.observableArray();
    var customer = ko.observableArray();

    // #endregion

    // #region BEHAVIORS
    // initializers
    function activate() {
        hideSidebar();
        setInitialDate();
        loadTransactionList();
    }

    function loadTransactionList() {
        $("#transactionTable").dataTable().fnDestroy();
        var $datatablesFixedheader = $('#transactionTable');
        if ($datatablesFixedheader.length) {
            $datatablesFixedheader = $datatablesFixedheader.DataTable({
                deferRender: true,
                scrollY: 370,
                scrollCollapse: true,
                scroller: true,
                responsive: true,
                dom: "<'row'<'col-sm-6'i><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-6'l><'col-sm-6'p>>",
                language: {
                    paginate: {
                        previous: '&laquo;',
                        next: '&raquo;'
                    },
                    search: "_INPUT_",
                    searchPlaceholder: "Search…"
                },
                ajax: {
                    url: RootUrl + "/Administrator/PawnshopTransactions/GetTransactions",
                    type: "GET",
                    datatype: "json"
                },
                columns: [
                { data: "TransactionNo", "className": "text-left" },
                {
                    data: "TransactionDate",
                    className: "text-left",
                    render: function(data, type, row) {
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
            ]
            });

            $(window).on('resize', function (evt) {
                setTimeout(function () {
                    $datatablesFixedheader.columns.adjust().responsive.recalc();
                }, 150);
            });
        }
    }

    function selectTransaction() {
        isListShowed(false);
        transactions(true);
        createCustomer(false);

        isCreateModeShowedPawning(false);
    }

    function newCustomer() {
        clearControlsCustomer();
        isListShowed(false);
        transactions(false);
        createCustomer(true);

        isCreateModeShowedPawning(false);
    }

    function clearControls() {
        model.TransactionId("");
        model.TransactionNo("");
        model.TransactionDate("");
        model.TransactionType("");
        model.CustomerId("");
        model.Terminal("");
        model.Status("");
        model.ReviewedBy("");
        model.ApprovedBy("");
        model.CreatedBy("");
        model.CreatedAt("");

        model.first_name("");
        model.last_name("");
        model.st_address("");
        model.mobile_no("");

        model.ItemName("");
        model.ItemTypeId("");
        model.ItemCategoryId("");
        model.Remarks("");

        customerModel.first_name("");
        customerModel.last_name("");
        customerModel.middle_name("");
        customerModel.st_address("");
        customerModel.mobile_no("");
        customerModel.city_address("");
        customerModel.zip_code("");
    }

    function clearControlsCustomer() {
        customerModel.first_name("");
        customerModel.last_name("");
        customerModel.middle_name("");
        customerModel.st_address("");
        customerModel.mobile_no("");
        customerModel.city_address("");
        customerModel.zip_code("");      
    }

    function showCreateModePawning() {
        getServerDate();
        getTransactionNo();
        getItemType();
        getCustomer();

        isListShowed(false);
        transactions(false);
        createCustomer(false);
        isCreateModeShowedPawning(true);

        isSaveButtonShowed(true);
        saveButtonCaption("Save");
    }

    function showCreateModeSale() {
        getServerDate();
        getTransactionNo();
        getItemType();
        getCustomer();

        isListShowed(false);
        transactions(false);
        createCustomer(false);
        isCreateModeShowedPawning(false);

        isSaveButtonShowed(true);
        saveButtonCaption("Save");
        window.location.replace(RootUrl + "/Home/Error404");
    }

    function showCreateModeLayaway() {
        getServerDate();
        getTransactionNo();
        getItemType();
        getCustomer();

        isListShowed(false);
        transactions(false);
        isCreateModeShowedPawning(false);

        isSaveButtonShowed(true);
        saveButtonCaption("Save");
        window.location.replace(RootUrl + "/Home/Error404");
    }


    function viewItem(arg) {
        loaderApp.showPleaseWait();

        loaderApp.hidePleaseWait();
    }

    function backToList() {
        loadTransactionList();
        isListShowed(true);
        transactions(false);
        createCustomer(false);

        isCreateModeShowedPawning(false);

        isSaveButtonShowed(false);
    }

    function backToNewTransactionPawning() {
        isListShowed(false);
        transactions(false);
        createCustomer(false);
        isCreateModeShowedPawning(true);

        isSaveButtonShowed(true);
        saveButtonCaption("Save");
        clearControlsCustomer();
    }

    function saveTransactionPawn() {

        /*VALIDATIONS -START*/
        if (model.TransactionNo() === "" || model.TransactionNo() === undefined) {
            toastr.error("Transaction no is required.");
            model.TransactionNo("");
            document.getElementById("TransactionNo").focus();
            return false;
        }

        if (model.TransactionDate() === "" || model.TransactionDate() === undefined) {
            toastr.error("Transaction date is required.");
            model.TransactionDate("");
            document.getElementById("TransactionDate").focus();
            return false;
        }

        if (model.CustomerId() === "" || model.CustomerId() === undefined) {
            toastr.error("Select a customer.");
            model.CustomerId("");
            document.getElementById("CustomerId").focus();
            return false;
        }

        /*VALIDATIONS -END*/
        loaderApp.showPleaseWait();
        var param = ko.toJS(model);
        var url = RootUrl + "/Administrator/PawnshopTransactions/SaveTransactionPawning";
        $.ajax({
            type: 'POST',
            url: url,
            data: ko.utils.stringifyJson(param),
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result.success) {
                    swal("Success", result.message, "success");

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

    function getCustomer() {
        $.getJSON(RootUrl + "/Administrator/Base/GetCustomer", function (result) {
            customer.removeAll();
            customer(result);
        });
    }
    function saveCustomer() {
        /*VALIDATIONS -START*/
        if (customerModel.first_name() === "" || customerModel.first_name() === undefined) {
            toastr.error("Enter first name.");
            customerModel.first_name("");
            document.getElementById("first_name").focus();
            return false;
        }
        if (customerModel.last_name().trim() === "" || customerModel.last_name() === undefined) {
            toastr.error("Enter last name.");
            customerModel.last_name("");
            document.getElementById("last_name").focus();
            return false;
        }
        if (customerModel.middle_name().trim() === "" || customerModel.middle_name() === undefined) {
            toastr.error("Enter middle name.");
            customerModel.middle_name("");
            document.getElementById("middle_name").focus();
            return false;
        }
        if (customerModel.st_address().trim() === "" || customerModel.st_address() === undefined) {
            toastr.error("Enter street address.");
            customerModel.st_address("");
            document.getElementById("st_address").focus();
            return false;
        }
        if (customerModel.mobile_no().trim() === "" || customerModel.mobile_no() === undefined) {
            toastr.error("Enter mobile no.");
            customerModel.mobile_no("");
            document.getElementById("mobile_no").focus();
            return false;
        }
        if (customerModel.city_address().trim() === "" || customerModel.city_address() === undefined) {
            toastr.error("Enter city address.");
            customerModel.city_address("");
            document.getElementById("city_address").focus();
            return false;
        }
        if (customerModel.zip_code().trim() === "" || customerModel.zip_code() === undefined) {
            toastr.error("Enter zip code.");
            customerModel.zip_code("");
            document.getElementById("zip_code").focus();
            return false;
        }

        /*VALIDATIONS -END*/
        loaderApp.showPleaseWait();
        var param = ko.toJS(customerModel);
        var url = RootUrl + "/Administrator/Base/SaveCustomer";
        $.ajax({
            type: 'POST',
            url: url,
            data: ko.utils.stringifyJson(param),
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result.success) {
                    swal("Success", result.message, "success");
                    getCustomer();
                    backToNewTransactionPawning();

                    loaderApp.hidePleaseWait();
                } else {
                    loaderApp.hidePleaseWait();

                    swal("Error", result.message, "error");

                    clearControls();
                }
            }
        });
    }

    function getCustomerById() {
        var CustomerId = $('#CustomerId').val();
        $.getJSON(RootUrl + "/Administrator/Pawning/GetCustomerById?CustomerId=" + CustomerId, function (result) {
            //customerModel.autonum(result.autonum);
            model.first_name(result.first_name);
            model.last_name(result.last_name);
            //model.middle_name(result.middle_name);
            model.st_address(result.st_address);
            model.mobile_no(result.mobile_no);
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

    function setInitialDate() {
        //$('.daterange-single').daterangepicker({
        //    singleDatePicker: true
        //});
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

        isListShowed: isListShowed,

        transactions: transactions,
        selectTransaction: selectTransaction,

        createCustomer: createCustomer,
        newCustomer: newCustomer,

        isCreateModeShowedPawning: isCreateModeShowedPawning,
        isCreateModeShowedSale: isCreateModeShowedSale,
        isCreateModeShowedLayaway: isCreateModeShowedLayaway,

        showCreateModePawning: showCreateModePawning,
        showCreateModeSale: showCreateModeSale,
        showCreateModeLayaway: showCreateModeLayaway,

        backToList: backToList,
        backToNewTransactionPawning: backToNewTransactionPawning,
        saveButtonCaption: saveButtonCaption,
        isSaveButtonShowed: isSaveButtonShowed,
        saveTransactionPawn: saveTransactionPawn,

        model: model,
        customerModel: customerModel,

        getItemType: getItemType,
        getItemCategory: getItemCategory,

        itemType: itemType,
        itemCategory: itemCategory,

        customer: customer,
        saveCustomer: saveCustomer,
        getCustomerById: getCustomerById,

        newTransactionCounter: newTransactionCounter,
        hasNewTransaction: hasNewTransaction,
        update: update
    };

    var self = this;

    self.isSubmiting = ko.observable(false);

    self.clickFunc = function () {
        if (!self.isSubmiting()) {
            self.isSubmiting(true);
        }
    }

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