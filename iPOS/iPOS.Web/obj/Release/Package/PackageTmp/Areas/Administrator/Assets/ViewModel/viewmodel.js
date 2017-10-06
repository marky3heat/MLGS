app.vm = (function (vm) {
    //"use strict";
    var modelTransactions = new app.Transactions();

    var modelAddTransaction = new app.createTransaction();
    var modelAddCustomer = new app.createCustomer();

    var Transaction = new app.Transaction();
    var Customer = new app.Customer();
    var AppraisedItem = new app.AppraisedItem();
    var PawnedItem = new app.PawnedItem();

    // #region CONTROLS                
    var isListShowed = ko.observable(true);
    var isCreateModeShow = ko.observable(false);
    var isCreateModeShowAppraisal = ko.observable(false);
    var isCreateModeShowPawning = ko.observable(false);

    var title = ko.observable("");

    var customer = ko.observableArray();
    var itemType = ko.observableArray();
    var itemCategory = ko.observableArray();
    var terms = ko.observableArray();

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
                render: function (data, type, row) {
                    if (row.Status == "For appraisal" && PageTitle == "New Transactions") {
                        return '<a href="' + RootUrl + '/Administrator/Transactions/Appraisal" class="btn btn-xs btn-info" role="button">Go to Appraisal</a>';
                    }
                    else if (row.Status == "For appraisal" && PageTitle == "Appraisal") {
                        return '<button type="button" class="btn btn-xs btn-info" onclick="app.vm.AppraiseItem('+ row.TransactionId +')">Appraise</button>';
                    }
                    else if (row.Status == "For appraisal" && PageTitle == "Approval") {
                        return '<a href="' + RootUrl + '/Administrator/Transactions/Appraisal" class="btn btn-xs btn-info" role="button">Go to Appraisal</a>';
                    }
                    else if (row.Status == "For pawning" && PageTitle == "Appraisal") {
                        return '<a href="' + RootUrl + '/Administrator/Transactions/NewTransaction" class="btn btn-xs btn-warning" role="button">Go to Transactions</a>' +
                            '<button type="button" class="btn btn-xs btn-info" onclick="app.vm.AppraiseItem(' + row.TransactionId + ')">Reappraise</button>';
                    }
                    else if (row.Status == "For pawning" && PageTitle == "New Transactions") {
                        return '<button type="button" class="btn btn-xs btn-warning" onclick="app.vm.PawnItem(' + row.TransactionId + ')">Process</button>';
                    }
                    else if (row.Status == "For pawning" && PageTitle == "Approval") {
                        return '<a href="' + RootUrl + '/Administrator/Transactions/NewTransaction" class="btn btn-xs btn-warning" role="button">Go to Transactions</a>'
                    }
                    else if (row.Status == "For approval" && PageTitle == "New Transactions") {
                        return '<a href="' + RootUrl + '/Administrator/Transactions/Approval" class="btn btn-xs btn-primary" role="button">Go to Approval</a>' +
                            '<button type="button" class="btn btn-xs btn-warning" onclick="app.vm.PawnItem(' + row.TransactionId + ')">Reprocess</button>';
                    }
                    else if (row.Status == "For approval" && PageTitle == "Appraisal") {
                        return '<a href="' + RootUrl + '/Administrator/Transactions/Approval" class="btn btn-xs btn-primary" role="button">Go to Approval</a>'
                    }
                    else if (row.Status == "For approval" && PageTitle == "Approval") {
                        return '<button type="button" class="btn btn-xs btn-primary" onclick="">Process</button>';
                    }
                    else {

                    }
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

    function AppraiseItem(TransactionId) {
        cardToggles();
        clearControlsCustomer();
        clearControls();

        setTimeout(function () {
            isListShowed(false);
            isCreateModeShowAppraisal(true);

            title("Appraisal");

  
            getCustomer();
            getItemType();
            getTransactionDetails(TransactionId);

        }, 300);
    }

    function PawnItem(TransactionId) {
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
            getTransactionDetails(TransactionId);

        }, 300);
    }
    
    function backToList() {
        isListShowed(true);
        isCreateModeShow(false);
        isCreateModeShowAppraisal(false);
        isCreateModeShowPawning(false)

        clearControlsCustomer();
        clearControls();
    }

    function backToListForAppraisal() {
        cardToggles();
        isListShowed(true);
        isCreateModeShow(false);
        isCreateModeShowAppraisal(false);
        isCreateModeShowPawning(false)

        clearControlsCustomer();
        clearControls();
    }

    function backToListForPawning() {
        cardTogglesForPawning();
        isListShowed(true);
        isCreateModeShow(false);
        isCreateModeShowAppraisal(false);
        isCreateModeShowPawning(false)

        clearControlsCustomer();
        clearControls();
    }

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

    function getTransactionDetails(TransactionId) {
        var CustomerId = "";
        var TransactionNo = "";

        $.getJSON(RootUrl + "/Administrator/Transactions/GetTransactionsById?TransactionId=" + TransactionId, function (result) {
            Transaction.TransactionId(result.TransactionId);
            Transaction.TransactionNo(result.TransactionNo);
            Transaction.TransactionDate(result.TransactionDate);
            Transaction.TransactionType(result.TransactionType);
            Transaction.CustomerId(result.CustomerId);
            Transaction.Terminal(result.Terminal);
            Transaction.Status(result.Status);
            CustomerId = result.CustomerId;
            TransactionNo = result.TransactionNo;
        });
        setTimeout(function () {
            $.getJSON(RootUrl + "/Administrator/Transactions/GetCustomerById?CustomerId=" + CustomerId, function (result) {
                Customer.first_name(result.first_name);
                Customer.last_name(result.last_name);
                Customer.middle_name(result.middle_name);
                Customer.st_address(result.st_address);
                Customer.city_address(result.city_address);
                Customer.mobile_no(result.mobile_no);
            });
            $.getJSON(RootUrl + "/Administrator/Transactions/GetItemByTransactionNo?TransactionNo=" + TransactionNo, function (result) {
                AppraisedItem.AppraiseId(result.AppraiseId);
                AppraisedItem.AppraiseDate(result.AppraiseDate);
                AppraisedItem.AppraiseNo(result.AppraiseNo);
                AppraisedItem.ItemTypeId(result.ItemTypeId);

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

                setTimeout(function () {
                    AppraisedItem.ItemCategoryId(result.ItemCategoryId);
                }, 300);
            });
            $.getJSON(RootUrl + "/Administrator/Transactions/GetPawnedItemByTransactionNo?TransactionNo=" + TransactionNo, function (result) {
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

                setTimeout(function () {
                    PawnedItem.ScheduleOfPayment(result.ScheduleOfPayment);
                }, 300);

                setTimeout(function () {
                    generateAmortization(result.NoOfPayments);
                }, 500);
            });
        }, 300);   
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
                    backToListForAppraisal();

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
    }

    function getTerms() {
        $.getJSON(RootUrl + "/Administrator/Base/GetTerms", function (result) {
            terms.removeAll();
            terms(result);
        });
    }

    function generateAmortization(arg) {
        var Terms = $('#TermsId :selected').val();
        var NoOfPayment = arg;
        Terms = (Terms * 30) / NoOfPayment

        var Principal = parseFloat($('#LoanableAmount').val()).toFixed(2) / NoOfPayment
        var Interest = parseFloat($('#InterestAmount').val()).toFixed(2) / NoOfPayment

        var Balance =  parseFloat($('#LoanableAmount').val()) + parseFloat($('#InterestAmount').val())

        $('#Amortization tbody > tr').empty();

        $('#Amortization').append('<tr><td>CO</td><td></td>' +
            '<td style="text-align: right">' + parseFloat($('#LoanableAmount').val()).toFixed(2) + '</td>' +
            '<td style="text-align: right">' + parseFloat($('#InterestAmount').val()).toFixed(2) + '</td>' +
            '<td style="text-align: right">' + Balance.toFixed(2) + '</td>' +
            '<td style="text-align: right"></td>' +
            '<td style="text-align: right"></td>' +
            '<td style="text-align: left"></td>' +
            '</tr>');

        var startDate = $('#DueDateStart').datepicker('getDate', '+1d');

        for (i = 0; i < NoOfPayment; i++) {
            startDate.setDate(startDate.getDate() + Terms);
            var d = startDate.getDate();
            var m = startDate.getMonth();
            m += 1;
            var y = startDate.getFullYear();
            debugger
            Balance = parseFloat(Balance) - (parseFloat(Principal) + parseFloat(Interest))

            $('#Amortization').append('<tr><td>' + (i + 1) + '</td><td>' + m + "/" + d + "/" + y + '</td>' +
                '<td style="text-align: right">' + Principal.toFixed(2) + '</td>' +
                '<td style="text-align: right">' + Interest.toFixed(2) + '</td>' +
                '<td style="text-align: right">' + Balance.toFixed(2) + '</td>' +
                '<td style="text-align: right"></td>' +
                '<td style="text-align: right"></td>' +
                '<td style="text-align: left"></td>' +
                '</tr>');
        }
    }

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
        debugger;
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

    function hideSidebar() {
        $('#hide-sidebar').trigger('click');
    };

    // #endregion

    var vm = {
        activate: activate,
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

        update: update,

        NewTransactionPawning: NewTransactionPawning,
        AppraiseItem: AppraiseItem,
        PawnItem: PawnItem,
        backToList: backToList,
        backToListForAppraisal: backToListForAppraisal,
        backToListForPawning: backToListForPawning,
        title: title,

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

    setInterval(function () {
        app.vm.update();
    }, 1000);

    $(".numbers").each(function () {
        $(this).formatNumber({ format: "#,###.00", locale: "us" });
    });

    ko.applyBindings(app.vm);
});

//$('#dropDownId').val();
//$('#dropDownId :selected').text();