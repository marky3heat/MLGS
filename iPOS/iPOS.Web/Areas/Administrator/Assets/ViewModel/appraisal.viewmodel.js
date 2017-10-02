app.vm = (function () {
    //"use strict";
    var appraisedItem = new app.addAppraisedItemModel();

    // #region CONTROLS                
    var isListShowed = ko.observable(true);
    var isManageAppraisedItemShowed = ko.observable(false);
    var isViewAppraisedItemShowed = ko.observable(false);
    var isSaveButtonShowed = ko.observable(true);

    var saveButtonCaption = ko.observable("");

    var itemType = ko.observableArray();
    var itemCategory = ko.observableArray();

    var brand = ko.observableArray();
    var karat = ko.observableArray();

    var serverDate = ko.observableArray();
    var appraisalNo = ko.observableArray();

    var isLoadData = "false";
    var recordCountItemList = ko.observable();
    var isViewLoadMoreData = ko.observable(false);

    var allItems = ko.observableArray([]);
    var items = ko.pureComputed(function () {
        return allItems();
    });

    // #endregion

    // #region BEHAVIORS
    // initializers
    function activate() {
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
                        return '<div class="dropdown">' +
                            '<button class="btn btn-primary btn-xs dropdown-toggle" data-toggle="dropdown" type="button">' +
                              'More '
                            + '<span class="caret"></span>' +
                            '</button>' +
                            '<ul class="dropdown-menu dropdown-menu-right">' +
                              '<li><a href="#">View</a></li>' +
                              '<li><a href="#" onclick="app.vm.addItem(' + row.TransactionNo + ');">Appraise item</a></li>' +
                              '<li><a href="#">Go to pawning</a></li>' +
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

    function clearControls() {
        appraisedItem.AppraiseId("");
        appraisedItem.AppraiseDate("");
        appraisedItem.AppraiseNo("");

        appraisedItem.ItemTypeId("");
        appraisedItem.ItemCategoryId("");

        appraisedItem.ItemName("");
        appraisedItem.Weight("");
        appraisedItem.AppraisedValue("");
        appraisedItem.Remarks("");
        appraisedItem.CustomerFirstName("");
        appraisedItem.CustomerLastName("");
        appraisedItem.IsPawned("");

        appraisedItem.CreatedBy("");
        appraisedItem.CreatedAt("");
    }

    function addItem(arg) {
        saveButtonCaption(" Save");
        clearControls();

        getServerDate();
        getItemType();

        setTimeout(function () {
            GetAppraisedItemById(arg);
        }, 300);
   
        isListShowed(false);
        isManageAppraisedItemShowed(true);

        isSaveButtonShowed(true);
    }
    function viewItem(arg) {
        loaderApp.showPleaseWait();

        isListShowed(false);
        isManageAppraisedItemShowed(true);

        saveButtonCaption("");
        clearControls();

        appraisedItem.AppraiseId(arg.AppraiseId());
        appraisedItem.AppraiseDate(moment(arg.AppraiseDate()).format('L'));

        appraisedItem.AppraiseNo(arg.AppraiseNo());
        appraisedItem.ItemTypeId(arg.ItemTypeId());

        getItemCategory(arg.ItemTypeId());
        setTimeout(function () {
            appraisedItem.ItemCategoryId(arg.ItemCategoryId());
        }, 300);

        appraisedItem.ItemName(arg.ItemName());
        appraisedItem.Weight(arg.Weight());
        appraisedItem.AppraisedValue(arg.AppraisedValue());
        appraisedItem.Remarks(arg.Remarks());
        appraisedItem.CustomerFirstName(arg.CustomerFirstName());
        appraisedItem.CustomerLastName(arg.CustomerLastName());
        appraisedItem.IsPawned(arg.IsPawned());

        appraisedItem.CreatedBy(arg.CreatedBy());
        appraisedItem.CreatedAt(arg.CreatedAt());

        isSaveButtonShowed(false);

        loaderApp.hidePleaseWait();
    }

    function backToList() {
        isListShowed(true);
        isManageAppraisedItemShowed(false);
    }

    function saveItem() {
        /*VALIDATIONS -START*/
        if (appraisedItem.AppraiseDate().trim() === "") {
            toastr.error("Date is required.");
            appraisedItem.AppraiseDate("");
            document.getElementById("AppraiseDate").focus();
            return false;
        }
        if (appraisedItem.ItemTypeId() === "" || appraisedItem.ItemTypeId() === undefined) {
            toastr.error("Item type is required.");
            appraisedItem.ItemTypeId("");
            document.getElementById("ItemTypeId").focus();
            return false;
        }
        if (appraisedItem.ItemCategoryId() === "" || appraisedItem.ItemCategoryId() === undefined) {
            toastr.error("Item category is required.");
            appraisedItem.ItemCategoryId("");
            document.getElementById("ItemCategoryId").focus();
            return false;
        }
        if (appraisedItem.ItemName().trim() === "") {
            toastr.error("Item name is required.");
            appraisedItem.ItemName("");
            document.getElementById("ItemName").focus();
            return false;
        }
        if (appraisedItem.Weight().trim() === "") {
            toastr.error("Weight is required.");
            appraisedItem.Weight("");
            document.getElementById("Weight").focus();
            return false;
        }
        if (appraisedItem.AppraisedValue() === "" || appraisedItem.AppraisedValue() === undefined) {
            toastr.error("Value is required.");
            appraisedItem.AppraisedValue("");
            document.getElementById("AppraisedValue").focus();
            return false;
        }
        if (appraisedItem.CustomerFirstName().trim() === "") {
            toastr.error("First name is required.");
            appraisedItem.CustomerFirstName("");
            document.getElementById("CustomerFirstName").focus();
            return false;
        }
        if (appraisedItem.CustomerLastName().trim() === "") {
            toastr.error("Last name is required.");
            appraisedItem.CustomerLastName("");
            document.getElementById("CustomerLastName").focus();
            return false;
        }
        /*VALIDATIONS -END*/
        
        loaderApp.showPleaseWait();
        var param = ko.toJS(appraisedItem);
        var url = RootUrl + "Administrator/Appraisal/SaveAppraisedItem";
        $.ajax({
            type: 'POST',
            url: url,
            data: ko.utils.stringifyJson(param),
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result.success) {
                    swal("Success", result.message, "success");

                    //to refresh infinitescroll                    
                    setInitialDate();
                    loadTransactionList();
                    //--------

                    isListShowed(true);
                    isManageAppraisedItemShowed(false);

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
        $.getJSON(RootUrl + "/Administrator/Appraisal/GetItemType", function (result) {
            itemType.removeAll();
            itemType(result);
        });
    }

    function getItemCategory(arg) {
        $("#Brand").prop("disabled", true);
        $("#Karat").prop("disabled", true);

        var itemTypeId = "";
        if (arg !== "") {
            itemTypeId = arg;
        } else {
            itemTypeId = appraisedItem.ItemTypeId();
        }

        if (itemTypeId !== "") {
            $.getJSON(RootUrl + "/Administrator/Appraisal/GetItemCategory?ItemTypeId=" + itemTypeId, function (result) {
                itemCategory.removeAll();
                itemCategory(result);
            });
        }

        if (itemTypeId == "1") {
            brand.removeAll();
            GetKarat();
            $("#Brand").prop("disabled", true);
            $("#Karat").prop("disabled", false);
        }
        else {

            karat.removeAll();
            GetBrand();
            $("#Brand").prop("disabled", false);
            $("#Karat").prop("disabled", true);
        }
    }

    function GetBrand() {
        $.getJSON(RootUrl + "/Administrator/Base/GetBrand", function (result) {
            brand.removeAll();
            brand(result);
        });
    }

    function GetKarat() {
        $.getJSON(RootUrl + "/Administrator/Base/GetKarat", function (result) {
            karat.removeAll();
            karat(result);
        });
    }

    function getServerDate() {
        $.getJSON(RootUrl + "/Administrator/Appraisal/GetServerDate", function (result) {
            appraisedItem.AppraiseDate(result);
        });
    }

    function GetAppraiseNo() {
        $.getJSON(RootUrl + "/Administrator/Appraisal/GetAppraiseNo", function (result) {
            appraisedItem.AppraiseNo(result);
        });
    }

    function GetAppraisedItemById(arg) {
        $.getJSON(RootUrl + "/Administrator/Appraisal/GetAppraisedItemById?TransactionNo=" + arg, function (result) {
            appraisedItem.AppraiseId(result[0].AppraiseId);
            appraisedItem.AppraiseDate(result[0].AppraiseDate);
            appraisedItem.AppraiseNo(result[0].AppraiseNo);
            appraisedItem.ItemTypeId(result[0].ItemTypeId);
 
            appraisedItem.ItemName(result[0].ItemName);

            appraisedItem.Weight(result[0].Weight);
            appraisedItem.AppraisedValue(result[0].AppraisedValue);
            appraisedItem.Remarks(result[0].Remarks);
            appraisedItem.CustomerFirstName(result[0].CustomerFirstName);
            appraisedItem.CustomerLastName(result[0].CustomerLastName);
            appraisedItem.IsPawned(result[0].IsPawned);
            appraisedItem.CreatedBy(result[0].CreatedBy);
            appraisedItem.CreatedAt(result[0].CreatedAt);
            appraisedItem.PawnshopTransactionId(result[0].PawnshopTransactionId);

            getItemCategory(result[0].ItemTypeId);
            setTimeout(function () {
                appraisedItem.ItemCategoryId(result[0].ItemCategoryId);
                appraisedItem.Brand(result[0].Brand);
                appraisedItem.Karat(result[0].Karat);
            }, 300);
        });
    }

    function setInitialDate() {
        //$('.daterange-single').daterangepicker({
        //    singleDatePicker: true
        //});
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

    // #endregion

    var vm = {
        items: items,

        isListShowed: isListShowed,
        isManageAppraisedItemShowed: isManageAppraisedItemShowed,

        itemType: itemType,
        itemCategory: itemCategory,

        brand: brand,
        karat: karat,

        isSaveButtonShowed: isSaveButtonShowed,

        backToList: backToList,

        saveButtonCaption: saveButtonCaption,
        recordCountItemList: recordCountItemList,
        isLoadData: isLoadData,

        appraisedItem: appraisedItem,

        addItem: addItem,
        saveItem: saveItem,
        viewItem: viewItem,
        activate: activate,

        getItemCategory: getItemCategory,
        getItemType: getItemType,

        newTransactionCounter: newTransactionCounter,
        hasNewTransaction: hasNewTransaction,
        update: update
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