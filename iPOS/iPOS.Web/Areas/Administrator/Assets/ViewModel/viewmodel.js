app.vm = (function (vm) {
    //"use strict";
    var modelTransactions = new app.Transactions();

    var modelAddTransaction = new app.createTransaction();
    var modelAddCustomer = new app.createCustomer();

    var Transaction = new app.Transaction();
    var Customer = new app.Customer();
    var AppraisedItem = new app.AppraisedItem();
    var PawnedItem = new app.PawnedItem();

    var AppraisedItemTypeId = ko.observable();
    var AppraisedItemCategoryId = ko.observable();

    var PawnedItemScheduleOfPayment = ko.observable();
    var PawnedItemScheme = ko.observable();
    var PawnedItemTermsId = ko.observable();

    var ServerDate = ko.observable();

    // #region CONTROLS                
    var isListShowed = ko.observable(true);
    var isCreateModeShow = ko.observable(false);
    var isCreateModeShowAppraisal = ko.observable(false);
    var isCreateModeShowPawning = ko.observable(false);
    var isCreateModeShowApproval = ko.observable(false);

    var spinnerList = ko.observable(false);
    var listBody = ko.observable(true);
    var spinnerAmortizationLedger = ko.observable(false);
    var AmortizationLedgerBody = ko.observable(true);

    var title = ko.observable("");

    var customer = ko.observableArray();
    var itemType = ko.observableArray();
    var itemCategory = ko.observableArray();
    var terms = ko.observableArray();
    var employee = ko.observableArray();

    var module = ko.observable("List");
    var action = ko.observable("");

    // #endregion

    // #region BEHAVIORS
    // initializers
    function activate() {
        hideSidebar();
        loadTransactionList();
        getServerDate();
    }

    function loadTransactionList() {
        if (PageTitle === "New Transactions") {
            var transaction = "GetTransactions"
        }
        if (PageTitle === "Appraisal") {
            var transaction = "GetTransactionsAppraisal"
        }
        if (PageTitle === "Approval") {
            var transaction = "GetTransactionsApproval"
        }
        if (PageTitle === "Change In Terms") {
            var transaction = "GetTransactionsChangeInTerms"
        }
        if (PageTitle === "") {
            var transaction = "GetTransactions"
        }
   
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
                url: RootUrl + "/Administrator/Transactions/"+ transaction,
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
                    //For appraisal
                    if (row.Status == "For appraisal" && PageTitle == "New Transactions") {
                        return '<td>' +
                        '<span class="label label-outline-primary">' + row.Status + '</span>' +
                        '<td>';
                    }
                    else if (row.Status == "For pawning" && PageTitle == "New Transactions") {
                        return '<td>' +
                        '<button type="button" class="btn btn-xs btn-outline-danger" onclick="app.vm.addPawnItem(' + row.TransactionId + ')">For pawning</button>' +
                        '<td>';
                    }
                    else if (row.Status == "For approval" && PageTitle == "New Transactions") {
                        return '<td>' +
                        '<button type="button" class="btn btn-xs btn-outline-success" onclick="app.vm.editPawnItem(' + row.TransactionId + ')">For approval</button>' +
                        '<td>';
                    }
                    else if (row.Status == "Pending" && PageTitle == "New Transactions") {
                        return '<td>' +
                        '<span class="label label-outline-success">' + row.Status + '</span>' +
                        '<td>';
                    }
                        //For appraisal

                        //For pawning
                    else if (row.Status == "For appraisal" && PageTitle == "Appraisal") {
                        return '<td>' +
                        '<button type="button" class="btn btn-xs btn-outline-primary" onclick="app.vm.addAppraisedItem(' + row.TransactionId + ')">For appraisal</button>' +
                        '<td>';
                    }
                    else if (row.Status == "For pawning" && PageTitle == "Appraisal") {
                        return '<td>' +
                        '<button type="button" class="btn btn-xs btn-outline-warning" onclick="app.vm.editAppraisedItem(' + row.TransactionId + ')">For pawning</button>' +
                        '<td>';
                    }
                    else if (row.Status == "For approval" && PageTitle == "Appraisal") {
                        return '<td>' +
                        '<span class="label label-outline-success">' + row.Status + '</span>' +
                        '<td>';
                    }
                    else if (row.Status == "Pending" && PageTitle == "Appraisal") {
                        return '<td>' +
                        '<span class="label label-outline-success">' + row.Status + '</span>' +
                        '<td>';
                    }
                        //For pawning
                    //approveTransaction
                        //For approval
                    else if (row.Status == "For appraisal" && PageTitle == "Approval") {
                        return '<td>' +
                        '<span class="label label-outline-primary">' + row.Status + '</span>' +
                        '<td>';
                    }
                    else if (row.Status == "For pawning" && PageTitle == "Approval") {
                        return '<td>' +
                        '<span class="label label-outline-danger">' + row.Status + '</span>' +
                        '<td>';
                    }
                    else if (row.Status == "For approval" && PageTitle == "Approval") {
                        return '<td>' +
                        '<button type="button" class="btn btn-xs btn-outline-success" onclick="app.vm.approveTransaction(' + row.TransactionId + ')">For approval</button>' +
                        '<td>';
                    }
                    else if (row.Status == "Pending" && PageTitle == "Approval") {
                        return '<td>' +
                        '<span class="label label-outline-success">' + row.Status + '</span>' +
                        '<td>';
                    }
                        //For approval
                    else {
                        return '<td>' +
                        '<span class="label label-outline-info">' + row.Status + '</span>' +
                        '<td>';
                    }
                }
            }
            ],
            order: [[4, "desc"]]
        });
    }

    /* Actions - START */

    function addTransaction() {
        title("Pawning");
        module("addTransaction");
        action("Add");
        
        $.wait(function () {
            listBody(false);
            spinnerList(true);
        }, 0.1);

        $.wait(function () {         
            clearControls();
            clearControlsCustomer();
        
            getTransactionNo();
            getCustomer();
            getItemType();

        }, 0.2);

        $.wait(function () {
            isListShowed(false);
            listBody(true);
            spinnerList(false);
            isCreateModeShow(true);
        }, 0.3);
    }

    function addAppraisedItem(TransactionId) {
        title("Appraise Item");
        module("addAppraisedItem");
        action("Add");

        cardToggles();

        $.wait(function () {
            listBody(false);
            spinnerList(true);
        }, 0.1);

        $.wait(function () {
            clearControls();
            clearControlsCustomer();
            clearControlsAppraisedItem();

            getCustomer();
            getItemType();

            loadTransaction(TransactionId);
        }, 0.2);
    }

    function addPawnItem(TransactionId) {
        title("Pawn Item");
        module("addPawnItem");
        action("Add");

        cardTogglesForPawning();

        $.wait(function () {
            listBody(false);
            spinnerList(true);
        }, 0.1);

        $.wait(function () {
            clearControls();
            clearControlsCustomer();
            clearControlsAppraisedItem();
            clearControlsPawnedItem();

            getCustomer();
            getItemType();
            getTerms();

            loadTransaction(TransactionId);
        }, 0.2);
    }

    function editTransaction(TransactionId) { }
    function editAppraisedItem(TransactionId) {
        title("Appraise Item");
        module("editAppraisedItem");
        action("Edit");

        cardToggles();

        $.wait(function () {
            listBody(false);
            spinnerList(true);
        }, 0.1);

        $.wait(function () {
            clearControls();
            clearControlsCustomer();
            clearControlsAppraisedItem();

            getCustomer();
            getItemType();

            loadTransaction(TransactionId);
        }, 0.2);
    }
    function editPawnItem(TransactionId) {
        title("Pawn Item");
        module("editPawnItem");
        action("Edit");

        cardTogglesForPawning();

        $.wait(function () {
            listBody(false);
            spinnerList(true);
        }, 0.1);

        $.wait(function () {
            clearControls();
            clearControlsCustomer();
            clearControlsAppraisedItem();
            clearControlsPawnedItem();

            getCustomer();
            getItemType();
            getTerms();

            loadTransaction(TransactionId);
        }, 0.2);
    }

    function viewTransaction(TransactionId) { }
    function viewAppraisedItem(TransactionId) { }
    function viewPawnItem(TransactionId) { }

    function approveTransaction(TransactionId) {
        title("Approve Transaction");
        module("approveTransaction");
        action("Edit");

        cardTogglesForPawning();

        $.wait(function () {
            listBody(false);
            spinnerList(true);
        }, 0.1);

        $.wait(function () {
            clearControls()
            clearControlsCustomer()
            clearControlsAppraisedItem()
            clearControlsPawnedItem()

            getEmployee();
            getCustomer();
            getItemType();
            getTerms();

            loadTransaction(TransactionId);
        }, 0.2);
    }

    /* Actions - END */

    /* Clear Controls - START */

    function clearControls() {
        modelAddTransaction.TransactionId("");
        modelAddTransaction.TransactionNo("");
        modelAddTransaction.TransactionDate(ServerDate());
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

    function clearControlsAppraisedItem() {
        AppraisedItem.AppraiseId("");
        AppraisedItem.AppraiseDate(ServerDate());
        AppraisedItem.AppraiseNo("");
        AppraisedItem.ItemTypeId("");
        AppraisedItem.ItemCategoryId("");
        AppraisedItem.ItemName("");
        AppraisedItem.ItemFeature("");
        AppraisedItem.SerialNo("");
        AppraisedItem.ItemCondition("");
        AppraisedItem.Brand("");
        AppraisedItem.Karat("");
        AppraisedItem.Weight("");
        AppraisedItem.AppraisedValue(0);
        AppraisedItem.Remarks("");
        AppraisedItem.CustomerFirstName("");
        AppraisedItem.CustomerLastName("");
        AppraisedItem.IsPawned("");
    }

    function clearControlsPawnedItem() {
        PawnedItem.PawnedItemId("");
        PawnedItem.PawnedItemNo("");
        PawnedItem.PawnedDate(ServerDate());
        PawnedItem.TransactionNo("");
        PawnedItem.PawnedItemContractNo("");
        PawnedItem.LoanableAmount(0);
        PawnedItem.InterestRate(0);
        PawnedItem.InterestAmount(0);
        PawnedItem.InitialPayment(0);
        PawnedItem.ServiceCharge(0);
        PawnedItem.Others(0);
        PawnedItem.IsInterestDeducted("");
        PawnedItem.NetCashOut(0);
        PawnedItem.TermsId("");
        PawnedItem.NoOfPayments("");
        PawnedItem.DueDateStart(ServerDate());
        PawnedItem.DueDateEnd(ServerDate());
        PawnedItem.Status("");
        PawnedItem.IsReleased("");
        PawnedItem.ScheduleOfPayment("");
        PawnedItem.Scheme("");
    }

    /* Clear Controls - END */

    /* Card Toggles - START */
    function cardToggles() {
        $('#card1').trigger('click');
        $('#card2').trigger('click');
        $('#card3').trigger('click');
    }

    function cardTogglesForPawning() {
        $('#card1').trigger('click');
        $('#card2').trigger('click');
        $('#card3').trigger('click');
        $('#card4').trigger('click');
    }
    /* Card Toggles - END */

    function NewTransactionPawning() {

    }

    function AppraiseItem(TransactionId) {

    }

    function PawnItem(TransactionId) {
        mode("PawnItem");
        cardTogglesForPawning();
        clearControlsCustomer();
        clearControls();

        setTimeout(function () {
            isListShowed(false);
            isCreateModeShowAppraisal(false);
            isCreateModeShowPawning(true)

            title("Pawning");

            getItemType();
            getTerms();
            loadTransaction(TransactionId);

        }, 300);
    }
    
    function backToList() {     
        isListShowed(true);
        isCreateModeShow(false);
        isCreateModeShowAppraisal(false);
        isCreateModeShowPawning(false);
        isCreateModeShowApproval(false);

        clearControlsCustomer();
        clearControls();
        $('#Amortization tbody > tr').empty();
        
        if (title() == "Pawn Item" || module() == "addPawnedItem" || module() == "editPawnedItem" || module() == "viewPawnedItem") {
            cardTogglesForPawning();
        }
        if (title() == "Appraise Item" || module() == "addAppraisedItem" || module() == "editAppraisedItem" || module() == "viewAppraisedItem") {
            cardToggles();
        }
        if (title() == "Approve Transaction" || module() == "" || module() == "" || module() == "") {
            cardTogglesForPawning();
        }
    }

    function backToListForAppraisal() {
        mode("ListView");
        cardToggles();
        isListShowed(true);
        isCreateModeShow(false);
        isCreateModeShowAppraisal(false);
        isCreateModeShowPawning(false)

        clearControlsCustomer();
        clearControls();
    }

    function backToListForPawning() {
        mode("ListView");
        cardTogglesForPawning();
        isListShowed(true);
        isCreateModeShow(false);
        isCreateModeShowAppraisal(false);
        isCreateModeShowPawning(false)

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

        if (modelAddTransaction.ItemName() === "" || modelAddTransaction.ItemName() === undefined) {
            toastr.error("Enter item name.");
            modelAddTransaction.ItemName("");
            document.getElementById("ItemName").focus();
            return false;
        }

        modelAddTransaction.ItemTypeId($('#ItemTypeId').val());

        modelAddTransaction.ItemCategoryId($('#ItemCategoryId').val());

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
                    update();

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

    function getEmployee() {
        $.getJSON(RootUrl + "/Administrator/Base/GetEmployee", function (result) {
            employee.removeAll();
            employee(result);
        });
    }

    function getCustomerById() {
        var CustomerId = $('#CustomerId').val();
        
        modelAddTransaction.first_name("");
        modelAddTransaction.last_name("");
        modelAddTransaction.middle_name("");
        modelAddTransaction.st_address("");
        modelAddTransaction.city_address("");
        modelAddTransaction.mobile_no("");

        if (action() == "Add" && (CustomerId != "" && CustomerId != undefined)) {          
            $.getJSON(RootUrl + "/Administrator/Base/GetCustomerById?CustomerId=" + CustomerId, function (result) {
                modelAddTransaction.first_name(result.first_name);
                modelAddTransaction.last_name(result.last_name);
                modelAddTransaction.middle_name(result.middle_name);
                modelAddTransaction.st_address(result.st_address);
                modelAddTransaction.city_address(result.city_address);
                modelAddTransaction.mobile_no(result.mobile_no);
            });
        }
    }

    function loadTransaction(TransactionId) {
        // Start        
        if ((module() == "addAppraisedItem" || module() == "editAppraisedItem" || module() == "viewAppraisedItem") && (action() == "Add" || action() == "Edit" || action() == "View")) {
            $.when(loadTransactionDetails(TransactionId)).then(
                         function (status) {

                             $.when(loadCustomerDetails(Transaction.CustomerId())).then(
                                 function (status) {

                                     $.when(loadAppraisedItemDetails(Transaction.TransactionNo())).then(
                                       function (status) {

                                           var a = AppraisedItemTypeId();
                                           var b = AppraisedItemCategoryId();
                                           $('#ItemTypeId option[value="' + AppraisedItemTypeId() + '"]').attr("selected", "selected");
                                           $('#ItemCategoryId option[value="' + AppraisedItemCategoryId() + '"]').attr("selected", "selected");

                                           $.wait(function () {
                                               listBody(true);
                                               spinnerList(false);
                                               isListShowed(false);
                                               isCreateModeShowAppraisal(true);
                                           }, .5);
                                       }
                                     );
                                 }
                               );
                         }
                       );
        }

        if ((module() == "addPawnItem" || module() == "editPawnItem" || module() == "viewPawnItem") && (action() == "Edit" || action() == "View")) {
            $.when(loadTransactionDetails(TransactionId)).then(
              function (status) {

                  $.when(loadCustomerDetails(Transaction.CustomerId())).then(
                      function (status) {

                          $.when(loadAppraisedItemDetails(Transaction.TransactionNo())).then(
                            function (status) {

                                var a = AppraisedItemTypeId();
                                var b = AppraisedItemCategoryId();
                                $('#ItemTypeId option[value="' + AppraisedItemTypeId() + '"]').attr("selected", "selected");

                                $.when(loadPawnedItemDetails(Transaction.TransactionNo())).then(
                                    function (status) {
                                        $('#ItemCategoryId option[value="' + AppraisedItemCategoryId() + '"]').attr("selected", "selected");

                                        $('#TermsId option[value="' + PawnedItemTermsId() + '"]').attr("selected", "selected");
                                        $('#ScheduleOfPayment option[value="' + PawnedItemScheduleOfPayment() + '"]').attr("selected", "selected");
                                        $('#Scheme option[value="' + PawnedItemScheme() + '"]').attr("selected", "selected");

                                        $.wait(function () {
                                            generateAmortization();
                                        }, 0.5);
                                        $.wait(function () {
                                            listBody(true);
                                            spinnerList(false);
                                            isListShowed(false);
                                            isCreateModeShowPawning(true);
                                        }, .6);
                                    }
                                  );
                            }
                          );
                      }
                    );
              }
            );
        }
        else if ((module() == "addPawnItem" || module() == "editPawnItem" || module() == "viewPawnItem") && (action() == "Add")) {
            $.when(loadTransactionDetails(TransactionId)).then(
                         function (status) {

                             $.when(loadCustomerDetails(Transaction.CustomerId())).then(
                                 function (status) {

                                     $.when(loadAppraisedItemDetails(Transaction.TransactionNo())).then(
                                       function (status) {

                                           var a = AppraisedItemTypeId();
                                           var b = AppraisedItemCategoryId();
                                           $('#ItemTypeId option[value="' + AppraisedItemTypeId() + '"]').attr("selected", "selected");
                                           $('#ItemCategoryId option[value="' + AppraisedItemCategoryId() + '"]').attr("selected", "selected");

                                           $.wait(function () {
                                               listBody(true);
                                               spinnerList(false);
                                               isListShowed(false);
                                               isCreateModeShowPawning(true);
                                           }, .5);
                                       }
                                     );
                                 }
                               );
                         }
                       );
        }

        /* APPROVAL */
        if ((module() == "approveTransaction") && (action() == "Edit" || action() == "View")) {
            $.when(loadTransactionDetails(TransactionId)).then(
              function (status) {

                  $.when(loadCustomerDetails(Transaction.CustomerId())).then(
                      function (status) {

                          $.when(loadAppraisedItemDetails(Transaction.TransactionNo())).then(
                            function (status) {

                                var a = AppraisedItemTypeId();
                                var b = AppraisedItemCategoryId();
                                $('#ItemTypeId option[value="' + AppraisedItemTypeId() + '"]').attr("selected", "selected");

                                $.when(loadPawnedItemDetails(Transaction.TransactionNo())).then(
                                    function (status) {
                                        $('#ItemCategoryId option[value="' + AppraisedItemCategoryId() + '"]').attr("selected", "selected");

                                        $('#TermsId option[value="' + PawnedItemTermsId() + '"]').attr("selected", "selected");
                                        $('#ScheduleOfPayment option[value="' + PawnedItemScheduleOfPayment() + '"]').attr("selected", "selected");
                                        $('#Scheme option[value="' + PawnedItemScheme() + '"]').attr("selected", "selected");

                                        $.wait(function () {
                                            generateAmortization();
                                        }, 0.5);
                                        $.wait(function () {
                                            listBody(true);
                                            spinnerList(false);
                                            isListShowed(false);
                                            isCreateModeShowApproval(true);
                                        }, .6);
                                    }
                                  );
                            }
                          );
                      }
                    );           
              }
            );
        }
        /* APPROVAL */

        // End
    }
    /*Functions for transaction detail - START*/
    function loadTransactionDetails(arg) {
        var dfd = $.Deferred();

        $.getJSON(RootUrl + "/Administrator/Transactions/GetTransactionsById?TransactionId=" + arg, function (result) {
            Transaction.TransactionId(result.TransactionId);
            Transaction.TransactionNo(result.TransactionNo);
            Transaction.TransactionDate(result.TransactionDate);
            Transaction.TransactionType(result.TransactionType);
            Transaction.CustomerId(result.CustomerId);
            Transaction.Terminal(result.Terminal);
            Transaction.Status(result.Status);
        }).done(function() {      
            setTimeout(function () {
                dfd.resolve("done");
            }, 500);
        });

        return dfd.promise();
    }

    function loadCustomerDetails(arg) {
        var dfd = $.Deferred();

        $.getJSON(RootUrl + "/Administrator/Transactions/GetCustomerById?CustomerId=" + arg, function (result) {
            Customer.first_name(result.first_name);
            Customer.last_name(result.last_name);
            Customer.middle_name(result.middle_name);
            Customer.st_address(result.st_address);
            Customer.city_address(result.city_address);
            Customer.mobile_no(result.mobile_no);
        }).done(function () {
            setTimeout(function () {
                dfd.resolve("done");
            }, 500);
        });

        return dfd.promise();
    }

    function loadAppraisedItemDetails(arg) {
        var dfd = $.Deferred();

        $.getJSON(RootUrl + "/Administrator/Transactions/GetItemByTransactionNo?TransactionNo=" + arg, function (result) {
            AppraisedItem.AppraiseId(result.AppraiseId);
            AppraisedItem.AppraiseDate(result.AppraiseDate);
            AppraisedItem.AppraiseNo(result.AppraiseNo);
            AppraisedItem.ItemTypeId(result.ItemTypeId);
            AppraisedItem.ItemCategoryId(result.ItemCategoryId);
            AppraisedItem.ItemName(result.ItemName);
            AppraisedItem.ItemFeature(result.ItemFeature);
            AppraisedItem.SerialNo(result.SerialNo);
            AppraisedItem.ItemCondition(result.ItemCondition);
            AppraisedItem.Brand(result.Brand);
            AppraisedItem.Karat(result.Karat);
            AppraisedItem.Weight(result.Weight);
            AppraisedItem.AppraisedValue(result.AppraisedValue);
            AppraisedItem.Remarks(result.Remarks);
            AppraisedItem.CustomerFirstName(result.CustomerFirstName);
            AppraisedItem.CustomerLastName(result.CustomerLastName);
            AppraisedItem.IsPawned(result.IsPawned);

            getItemCategory(result.ItemTypeId);
            AppraisedItemTypeId(result.ItemTypeId);
            AppraisedItemCategoryId(result.ItemCategoryId)
        }).done(function () {
            setTimeout(function () {
                dfd.resolve("done");
            }, 500);
        });

        return dfd.promise();
    }

    function loadPawnedItemDetails(arg) {
        var dfd = $.Deferred();

        $.getJSON(RootUrl + "/Administrator/Transactions/GetPawnedItemByTransactionNo?TransactionNo=" + arg, function (result) {
            PawnedItem.PawnedItemId(result.PawnedItemId);
            PawnedItem.PawnedItemNo(result.PawnedItemNo);
            PawnedItem.PawnedDate(result.PawnedDate);
            PawnedItem.TransactionNo(result.TransactionNo);
            PawnedItem.PawnedItemContractNo(result.PawnedItemContractNo);
            PawnedItem.LoanableAmount(result.LoanableAmount);
            PawnedItem.InterestRate(result.InterestRate);
            PawnedItem.InterestAmount(result.InterestAmount);
            PawnedItem.InitialPayment(result.InitialPayment);
            PawnedItem.ServiceCharge(result.ServiceCharge);
            PawnedItem.Others(result.Others);
            PawnedItem.IsInterestDeducted(result.IsInterestDeducted);
            PawnedItem.NetCashOut(result.NetCashOut);
            PawnedItem.TermsId(result.TermsId);
            PawnedItem.NoOfPayments(result.NoOfPayments);
            PawnedItem.DueDateStart(result.DueDateStart);
            PawnedItem.DueDateEnd(result.DueDateEnd);
            PawnedItem.Status(result.Status);
            PawnedItem.IsReleased(result.IsReleased);
            PawnedItem.ScheduleOfPayment(result.ScheduleOfPayment);
            PawnedItem.Scheme(result.Scheme);

            PawnedItemScheduleOfPayment(result.ScheduleOfPayment);
            PawnedItemScheme(result.Scheme);
            PawnedItemTermsId(result.TermsId);
        }).done(function () {
            setTimeout(function () {
                dfd.resolve("done");
            }, 500);
        });

        return dfd.promise();
    }

    /*Functions for transaction detail - END*/


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

    function saveAppraisedItem() {
        /*VALIDATIONS -START*/
        AppraisedItem.AppraiseDate($('#AppraiseDate').val())
        AppraisedItem.PawnshopTransactionId(Transaction.TransactionNo);

        if (AppraisedItem.ItemCondition() === "" || AppraisedItem.ItemCondition() === undefined) {
            toastr.error("Enter item condition.");
            AppraisedItem.ItemCondition("");
            document.getElementById("ItemCondition").focus();
            return false;
        }
        if (AppraisedItem.AppraisedValue() === "" || AppraisedItem.AppraisedValue() === undefined || AppraisedItem.AppraisedValue() === 0) {
            toastr.error("Enter appraised value.");
            AppraisedItem.AppraisedValue("");
            document.getElementById("AppraisedValue").focus();
            return false;
        }
        /*VALIDATIONS -END*/
   
        loaderApp.showPleaseWait();
        var param = ko.toJS(AppraisedItem);
        var url = RootUrl + "/Administrator/Transactions/SaveAppraisal";
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
                    update();

                    loaderApp.hidePleaseWait();
                } else {
                    loaderApp.hidePleaseWait();

                    swal("Error", result.message, "error");

                    clearControls();
                }
            }
        });
    }

    function changeTermsOptions() {
        var Terms = $('#TermsId :selected').val();

        if (Terms == 0.25) {
            $('#ScheduleOfPayment')
                .find('option')
                .remove()
                .end()
                .append('<option value="Weekly">Weekly</option>')
                .val('Weekly')
                .append('<option value="Daily">Daily</option>')
                .val('Weekly')
            ;
        }
        if (Terms == 0.5) {
            $('#ScheduleOfPayment')
                .find('option')
                .remove()
                .end()
                .append('<option value="Semi-Monthly">Semi-Monthly</option>')
                .val('Semi-Monthly')
                .append('<option value="Weekly">Weekly</option>')
                .val('Semi-Monthly')
                .append('<option value="Daily">Daily</option>')
                .val('Semi-Monthly')
            ;
        }
        if (Terms >= 1.0) {
            $('#ScheduleOfPayment')
                .find('option')
                .remove()
                .end()
                .append('<option value="Monthly">Monthly</option>')
                .val('Monthly')
                .append('<option value="Semi-Monthly">Semi-Monthly</option>')
                .val('Monthly')
                .append('<option value="Weekly">Weekly</option>')
                .val('Monthly')
                .append('<option value="Daily">Daily</option>')
                .val('Monthly')
            ;
        }
        changeScheduleOptions();
        changeDueDateStart();
        computeAmount();
    }

    function changeScheduleOptions() {
        var Terms = $('#TermsId :selected').val();
        var ScheduleOfPayment = $('#ScheduleOfPayment :selected').val();

        if (Terms == 0.25) {
            if (ScheduleOfPayment == "Weekly") {
                $('#NoOfPayments').val(1)
            }
            else {
                $('#NoOfPayments').val(7)
            }
        }
        if (Terms == 0.5) {
            if (ScheduleOfPayment == "Semi-Monthly") {
                $('#NoOfPayments').val(1)
            }
            else if (ScheduleOfPayment == "Weekly") {
                $('#NoOfPayments').val(2)
            }
            else {
                $('#NoOfPayments').val(15)
            }
        }
        if (Terms == 1.0) {
            if (ScheduleOfPayment == "Monthly") {
                $('#NoOfPayments').val(1)
            }
            else if (ScheduleOfPayment == "Semi-Monthly") {
                $('#NoOfPayments').val(2)
            }
            else if (ScheduleOfPayment == "Weekly") {
                $('#NoOfPayments').val(4)
            }
            else {
                $('#NoOfPayments').val(30)
            }
        }
        if (Terms > 1.0) {
            if (ScheduleOfPayment == "Monthly") {
                $('#NoOfPayments').val(Terms)
            }
            else if (ScheduleOfPayment == "Semi-Monthly") {
                $('#NoOfPayments').val(Terms * 2)
            }
            else if (ScheduleOfPayment == "Weekly") {
                $('#NoOfPayments').val(Terms * 4)
            }
            else {
                $('#NoOfPayments').val(Terms * 30)
            }
        }
        changeDueDateStart();
    }

    function changeDueDateStart() {
        var Terms = $('#TermsId :selected').val();
        var addDays = 30 * Terms

        if (Terms != "" && Terms != 0) {
            var startDate = $('#DueDateStart').datepicker('getDate', '+1d');
            startDate.setDate(startDate.getDate() + addDays);
            $('#DueDateEnd').datepicker('setDate', startDate);
        }
        generateAmortization();
    }

    function computeAmount() {
        var LoanableAmount = parseFloat($('#LoanableAmount').val());
        var Terms = parseFloat($('#TermsId :selected').val());
        var InterestRate = parseFloat($('#InterestRate').val());

        $('#InterestAmount').val(parseFloat((LoanableAmount * (InterestRate / 100)) * Terms).toFixed(2));

        computeNetCashout();
    }

    function computeNetCashout() {
        
        var LoanableAmount = parseFloat($('#LoanableAmount').val());
        var InitialPayment = parseFloat($('#InitialPayment').val());
        var ServiceCharge = parseFloat($('#InitialPayment').val());
        var Others = parseFloat($('#Others').val());
        var InterestAmount = parseFloat($('#InterestAmount').val());

        var IsInterestDeducted = $('#IsInterestDeducted :selected').text();
     
        if (IsInterestDeducted == "Yes") {
            $('#NetCashOut').val(parseFloat(LoanableAmount - (InitialPayment + ServiceCharge + Others + InterestAmount)).toFixed(2));
        }
        else {
            $('#NetCashOut').val(parseFloat(LoanableAmount - (InitialPayment + ServiceCharge + Others)).toFixed(2));
        }

        generateAmortization();
    }

    function getTerms() {
        $.getJSON(RootUrl + "/Administrator/Base/GetTerms", function (result) {
            terms.removeAll();
            terms(result);
        });
    }

    /* For Amortization - START */

    function generateAmortization() {      
        var NetCashOut = $('#NetCashOut').val();
        
        if (NetCashOut !== "" && NetCashOut !== "undefined" && NetCashOut !== 0 && NetCashOut !== "0.00" && NetCashOut !== "0" && NetCashOut !== "0.0") {
            spinnerAmortizationLedger(true);
            AmortizationLedgerBody(false);
            
            if (PawnedItemScheme() === "Straight") {
                generateAmortizationStraight();
            }
            else {
                generateAmortizationDiminishing();
            }
        }
    }

    function generateAmortizationStraight() {
        var StartDate = $('#DueDateStart').datepicker('getDate', '+1d');
        var Terms = $('#TermsId :selected').val();
        var NoOfPayment = parseFloat($('#NoOfPayments').val());
        Terms = (Terms * 30) / NoOfPayment

        var TotalPrincipal = parseFloat($('#LoanableAmount').val()).toFixed(2);
        var TotalInterest = parseFloat($('#InterestAmount').val()).toFixed(2);

        var PerTermPrincipal = parseFloat($('#LoanableAmount').val()) / NoOfPayment
        var PerTermInterest = parseFloat($('#InterestAmount').val()) / NoOfPayment

        var LastPaymentPrincipal = parseFloat(TotalPrincipal).toFixed(2);;
        var LastPaymentInterest = parseFloat(TotalInterest).toFixed(2);;

        var Balance = 0.00;
       
        var IsInterestDeducted = PawnedItem.IsInterestDeducted();
        if (IsInterestDeducted == "true") {
            Balance =  parseFloat(TotalPrincipal).toFixed(2);
            TotalInterest = 0.00;
            PerTermInterest = 0.00;
            LastPaymentInterest = 0.00;
        }
        else {
            Balance = parseFloat(TotalPrincipal) + parseFloat(TotalInterest);
        }
          
        $('#Amortization tbody > tr').empty();
        $('#Amortization').append('<tr><td>CO</td><td></td>' +
            '<td style="text-align: right">' + parseFloat(TotalPrincipal).toFixed(2) + '</td>' +
            '<td style="text-align: right">' + parseFloat(TotalInterest).toFixed(2) + '</td>' +
            '<td style="text-align: right"></td>' +
            '<td style="text-align: right">' + parseFloat(Balance).toFixed(2) + '</td>' +
            '<td style="text-align: right"></td>' +
            '</tr>');
       
        for (i = 0; i < NoOfPayment; i++) {
            StartDate.setDate(StartDate.getDate() + Terms);
            var d = StartDate.getDate();
            var m = StartDate.getMonth();
            m += 1;
            var y = StartDate.getFullYear();
                     
            if (i < NoOfPayment-1) {

                Balance = parseFloat(Balance) - (parseFloat(PerTermPrincipal.toFixed(2)) + parseFloat(PerTermInterest.toFixed(2)));
                LastPaymentPrincipal = parseFloat(LastPaymentPrincipal) - parseFloat(PerTermPrincipal.toFixed(2));
                LastPaymentInterest = parseFloat(LastPaymentInterest) - parseFloat(PerTermInterest.toFixed(2));

                $('#Amortization').append('<tr><td>' + (i + 1) + '</td><td>' + m + "/" + d + "/" + y + '</td>' +
                    '<td style="text-align: right">' + PerTermPrincipal.toFixed(2) + '</td>' +
                    '<td style="text-align: right">' + PerTermInterest.toFixed(2) + '</td>' +
                    '<td style="text-align: right">' + parseFloat(parseFloat(PerTermPrincipal) + parseFloat(PerTermInterest)).toFixed(2) + '</td>' +
                    '<td style="text-align: right">' + Balance.toFixed(2) + '</td>' +
                    '<td style="text-align: right"></td>' +
                    '</tr>');
            }
            else if (i == NoOfPayment-1) {
                Balance = parseFloat(Balance) - (parseFloat(LastPaymentPrincipal) + parseFloat(LastPaymentInterest))

                $('#Amortization').append('<tr><td>' + (i + 1) + '</td><td>' + m + "/" + d + "/" + y + '</td>' +
                    '<td style="text-align: right">' + parseFloat(LastPaymentPrincipal).toFixed(2) + '</td>' +
                    '<td style="text-align: right">' + parseFloat(LastPaymentInterest).toFixed(2) + '</td>' +
                    '<td style="text-align: right">' + parseFloat(parseFloat(LastPaymentPrincipal) + parseFloat(LastPaymentInterest)).toFixed(2) + '</td>' +
                    '<td style="text-align: right">' + parseFloat(Balance).toFixed(2) + '</td>' +
                    '<td style="text-align: right"></td>' +
                    '</tr>');
            }

        }
        $.wait(function () {
            spinnerAmortizationLedger(false);
            AmortizationLedgerBody(true);
        }, .5);
    }

    function generateAmortizationDiminishing() {
        var StartDate = $('#DueDateStart').datepicker('getDate', '+1d');
        var Terms = $('#TermsId :selected').val();
        var NoOfPayment = parseFloat($('#NoOfPayments').val());
        Terms = (Terms * 30) / NoOfPayment
        var InterestNoOfPayment = parseFloat($('#NoOfPayments').val());

        var InterestRate = parseFloat($('#InterestRate').val()).toFixed(2) / 100;

        var TotalPrincipal = parseFloat($('#LoanableAmount').val()).toFixed(2);
        var TotalInterest = parseFloat($('#InterestAmount').val()).toFixed(2);

        var PerTermPrincipal = parseFloat($('#LoanableAmount').val()) / NoOfPayment
        var PerTermInterest = 0.00;

        var LastPaymentPrincipal = parseFloat(TotalPrincipal).toFixed(2);;
        var LastPaymentInterest = parseFloat(TotalInterest).toFixed(2);;

        var Balance = 0.00;
        var BalanceForInterest = 0.00;

        var IsInterestDeducted = PawnedItem.IsInterestDeducted();
        if (IsInterestDeducted == "true") {
            Balance = parseFloat(TotalPrincipal).toFixed(2);
            TotalInterest = 0.00;
            PerTermInterest = 0.00;
            LastPaymentInterest = 0.00;
        }
        else {
            Balance = parseFloat(TotalPrincipal) + parseFloat(TotalInterest);
            BalanceForInterest = parseFloat(TotalPrincipal);
        }

        $('#Amortization tbody > tr').empty();
        $('#Amortization').append('<tr><td>CO</td><td></td>' +
            '<td style="text-align: right">' + parseFloat(TotalPrincipal).toFixed(2) + '</td>' +
            '<td style="text-align: right"></td>' +
            '<td style="text-align: left"></td>' +
            '<td style="text-align: right">' + parseFloat(BalanceForInterest).toFixed(2) + '</td>' +
            '<td style="text-align: right"></td>' +
            '</tr>');

        for (i = 0; i < NoOfPayment; i++) {
            StartDate.setDate(StartDate.getDate() + Terms);
            var d = StartDate.getDate();
            var m = StartDate.getMonth();
            m += 1;
            var y = StartDate.getFullYear();

            if (i < NoOfPayment - 1) {
                if (InterestNoOfPayment == 3) {
                    PerTermInterest = parseFloat(BalanceForInterest) * parseFloat(InterestRate);
                }
                else {
                    PerTermInterest = parseFloat(BalanceForInterest) * parseFloat(InterestRate);
                }
                InterestNoOfPayment = InterestNoOfPayment - 1;

                Balance = parseFloat(Balance) - (parseFloat(PerTermPrincipal.toFixed(2)) + parseFloat(PerTermInterest.toFixed(2)));
                BalanceForInterest = parseFloat(BalanceForInterest) - (parseFloat(PerTermPrincipal.toFixed(2)));

                LastPaymentPrincipal = parseFloat(BalanceForInterest);
                LastPaymentInterest = 0.00;

                $('#Amortization').append('<tr><td>' + (i + 1) + '</td><td>' + m + "/" + d + "/" + y + '</td>' +
                    '<td style="text-align: right">' + PerTermPrincipal.toFixed(2) + '</td>' +
                    '<td style="text-align: right">' + PerTermInterest.toFixed(2) + '</td>' +
                    '<td style="text-align: right">' + parseFloat(parseFloat(PerTermPrincipal) + parseFloat(PerTermInterest)).toFixed(2) + '</td>' +
                    '<td style="text-align: right">' + BalanceForInterest.toFixed(2) + '</td>' +
                    '<td style="text-align: right"></td>' +
                    '</tr>');
            }
            else if (i == NoOfPayment - 1) {
                
                LastPaymentInterest = parseFloat(BalanceForInterest).toFixed() * parseFloat(InterestRate);
                BalanceForInterest = parseFloat(BalanceForInterest) - (parseFloat(LastPaymentPrincipal))

                $('#Amortization').append('<tr><td>' + (i + 1) + '</td><td>' + m + "/" + d + "/" + y + '</td>' +
                    '<td style="text-align: right">' + parseFloat(LastPaymentPrincipal).toFixed(2) + '</td>' +
                    '<td style="text-align: right">' + parseFloat(LastPaymentInterest).toFixed(2) + '</td>' +
                    '<td style="text-align: right">' + parseFloat(parseFloat(LastPaymentPrincipal) + parseFloat(LastPaymentInterest)).toFixed(2) + '</td>' +
                    '<td style="text-align: right">' + parseFloat(BalanceForInterest).toFixed(2) + '</td>' +
                    '<td style="text-align: right"></td>' +
                    '</tr>');
            }

        }
        $.wait(function () {
            spinnerAmortizationLedger(false);
            AmortizationLedgerBody(true);
        }, .5);
    }

    /* For Amortization - END */

    function savePawnedItem() {
        /*VALIDATIONS -START*/
        if (PawnedItem.PawnedDate() === "" || PawnedItem.PawnedDate() === undefined || PawnedItem.PawnedDate() === 0) {
            toastr.error("Enter date.");
            PawnedItem.PawnedDate("");
            document.getElementById("PawnedDate").focus();
            return false;
        }
        if (PawnedItem.LoanableAmount() === "" || PawnedItem.LoanableAmount() === undefined || PawnedItem.LoanableAmount() === 0) {
            toastr.error("Enter loan amount");
            PawnedItem.LoanableAmount("");
            document.getElementById("LoanableAmount").focus();
            return false;
        }
        if (PawnedItem.InterestRate() === "" || PawnedItem.InterestRate() === undefined || PawnedItem.InterestRate() === 0) {
            toastr.error("Enter interest rate");
            PawnedItem.InterestRate("");
            document.getElementById("InterestRate").focus();
            return false;
        }
        if (PawnedItem.InterestAmount() === "" || PawnedItem.InterestAmount() === undefined || PawnedItem.InterestAmount() === 0) {
            toastr.error("Compute interest");
            PawnedItem.InterestAmount("");
            document.getElementById("LoanableAmount").focus();
            return false;
        }         
        if (PawnedItem.NetCashOut() === "" || PawnedItem.NetCashOut() === undefined || PawnedItem.NetCashOut() === 0) {
            toastr.error("Compute net cash out");
            PawnedItem.NetCashOut("");
            document.getElementById("LoanableAmount").focus();
            return false;
        }
        /*VALIDATIONS -END*/

        PawnedItem.PawnedDate($('#PawnedDate').val());
        PawnedItem.DueDateStart($('#DueDateStart').val());
        PawnedItem.DueDateEnd($('#DueDateEnd').val());
        PawnedItem.TransactionNo(Transaction.TransactionNo);
        PawnedItem.NoOfPayments($('#NoOfPayments').val())
        PawnedItem.InterestAmount($('#InterestAmount').val())

        loaderApp.showPleaseWait();
        var param = ko.toJS(PawnedItem);
        var url = RootUrl + "/Administrator/Transactions/SavePawning";
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
                    update();

                    loaderApp.hidePleaseWait();
                } else {
                    loaderApp.hidePleaseWait();

                    swal("Error", result.message, "error");

                    clearControls();
                }
            }
        });
    }

    function saveAmortization() {
        var param = ko.toJS(PawnedItem);
        var url = RootUrl + "/Administrator/Transactions/SavePawning";
        $.ajax({
            type: 'POST',
            url: url,
            data: ko.utils.stringifyJson(param),
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result.success) {
                    swal("Success", result.message, "success");

                    loadTransactionList();
                    backToListForPawning();

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
            ServerDate(result);
        });
    }

    function getTransactionNo() {
        $.getJSON(RootUrl + "/Administrator/Base/GetTransactionNo", function (result) {
            modelAddTransaction.TransactionNo(result);
        });
    }

    var newTransactionCounter = ko.observableArray();
    var hasNewTransaction = ko.observableArray(false);

    var itemToBeAppraisedCounter = ko.observableArray();
    var hasItemToBeAppraised = ko.observableArray(false);

    var itemToBePawnedCounter = ko.observableArray();
    var hasItemToBePawned = ko.observableArray(false);

    var itemToBeApprovedCounter = ko.observableArray();
    var hasItemToBeApproved = ko.observableArray(false);

    var itemToBeReleasedCounter = ko.observableArray();
    var hasItemToBeReleased = ko.observableArray(false);

    function update() {
        $.getJSON(RootUrl + "/Administrator/Base/GetNewTransactionsCounter", function (result) {

            newTransactionCounter(result[0].NewTransaction);
            if (result[0].NewTransaction > 0) {
                hasNewTransaction(true);
            }
            else {
                hasNewTransaction(false);
            }

            itemToBeAppraisedCounter(result[0].ForAppraisal);
            if (result[0].ForAppraisal > 0) {
                hasItemToBeAppraised(true);
            }
            else {
                hasItemToBeAppraised(false);
            }

            itemToBePawnedCounter(result[0].ForPawning);
            if (result[0].ForPawning > 0) {
                hasItemToBePawned(true);
            }
            else {
                hasItemToBePawned(false);
            }

            itemToBeApprovedCounter(result[0].ForApproval);
            if (result[0].ForApproval > 0) {
                hasItemToBeApproved(true);
            }
            else {
                hasItemToBeApproved(false);
            }

            itemToBeReleasedCounter(result[0].ForRelease);
            if (result[0].ForRelease > 0) {
                hasItemToBeReleased(true);
            }
            else {
                hasItemToBeReleased(false);
            }
        });
    }

    $.wait = function (callback, seconds) {
        return window.setTimeout(callback, seconds * 1000);
    }
    function wait (callback, seconds) {
        return window.setTimeout(callback, seconds * 1000);
    }

    function hideSidebar() {
        $('#hide-sidebar').trigger('click');
    };

    // #endregion

    var vm = {
        module: module,
        action: action,
        activate: activate,
        wait: wait,

        modelTransactions: modelTransactions,

        newTransactionCounter: newTransactionCounter,
        hasNewTransaction: hasNewTransaction,

        itemToBeAppraisedCounter: itemToBeAppraisedCounter,
        hasItemToBeAppraised: hasItemToBeAppraised,

        itemToBePawnedCounter: itemToBePawnedCounter,
        hasItemToBePawned: hasItemToBePawned,

        itemToBeApprovedCounter: itemToBeApprovedCounter,
        hasItemToBeApproved: hasItemToBeApproved,

        itemToBeReleasedCounter: itemToBeReleasedCounter,
        hasItemToBeReleased: hasItemToBeReleased,

        isListShowed: isListShowed,
        isCreateModeShow: isCreateModeShow,
        isCreateModeShowAppraisal: isCreateModeShowAppraisal,
        isCreateModeShowPawning: isCreateModeShowPawning,
        isCreateModeShowApproval: isCreateModeShowApproval,

        spinnerList: spinnerList,
        listBody: listBody,
        spinnerAmortizationLedger: spinnerAmortizationLedger,
        AmortizationLedgerBody: AmortizationLedgerBody,

        update: update,

        addTransaction: addTransaction,
        addAppraisedItem: addAppraisedItem,
        addPawnItem: addPawnItem,

        editTransaction: editTransaction,
        editAppraisedItem: editAppraisedItem,
        editPawnItem: editPawnItem,

        viewTransaction: viewTransaction,
        viewAppraisedItem: viewAppraisedItem,
        viewPawnItem: viewPawnItem,

        approveTransaction : approveTransaction,

        backToList: backToList,

        title: title,

        employee: employee,
        createCustomer: createCustomer,
        customer: customer,
        terms: terms,
        modelAddCustomer: modelAddCustomer,

        modelTransactions: modelTransactions,
        modelAddTransaction: modelAddTransaction,

        getCustomerById: getCustomerById,

        getItemType: getItemType,
        getItemCategory: getItemCategory,
        changeTermsOptions: changeTermsOptions,
        changeScheduleOptions: changeScheduleOptions,
        changeDueDateStart: changeDueDateStart,
        computeAmount: computeAmount,
        computeNetCashout: computeNetCashout,

        itemType: itemType,
        itemCategory: itemCategory,

        saveTransactionPawn: saveTransactionPawn,
        saveCustomer: saveCustomer,
        saveAppraisedItem, saveAppraisedItem,
        savePawnedItem: savePawnedItem,

        Transaction: Transaction,
        Customer: Customer,
        AppraisedItem: AppraisedItem,
        PawnedItem: PawnedItem
    };

    return vm;

})();


$(function () {
    "use strict";

    app.vm.activate();
    $.wait = function (callback, seconds) {
        return window.setTimeout(callback, seconds * 1000);
    }

    if (NewTransaction != "" && ForAppraisal != "" && ForPawning != "" && ForApproval != "" && ForRelease != "") {
        app.vm.newTransactionCounter(NewTransaction);
        app.vm.hasNewTransaction(true);

        app.vm.itemToBeAppraisedCounter(ForAppraisal)
        app.vm.hasItemToBeAppraised(true)

        app.vm.itemToBePawnedCounter(ForPawning)
        app.vm.hasItemToBePawned(true)

        app.vm.itemToBeApprovedCounter(ForApproval)
        app.vm.hasItemToBeApproved(true)

        app.vm.itemToBeReleasedCounter(ForRelease)
        app.vm.hasItemToBeReleased(true)

        $.wait(function () { app.vm.update() }, 30);
    }
    else {
        app.vm.update();
    }

    ko.applyBindings(app.vm);
});

//$('#dropDownId').val();
//$('#dropDownId :selected').text();

//$(".numbers").each(function () {
//    $(this).formatNumber({ format: "#,###.00", locale: "us" });
//});