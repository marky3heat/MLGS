app.vm = (function () {
    //"use strict";
    var pawnedItemModel = new app.addPawnedItemModel();
    var appraisedItemModel = new app.appraisedItemModel();
    var customerModel = new app.customerModel();
    var ccustomerModel = new app.createCustomerModel();

    // #region CONTROLS                
    var isPawnedItemListShowed = ko.observable(true);
    var isManagePawnedItemShowed = ko.observable(false);

    var appraisedItem = ko.observableArray();
    var customer = ko.observableArray();

    var ItemCode = ko.observableArray();
    var ContractNo = ko.observableArray();

    // #endregion

    // #region BEHAVIORS
    // initializers
    function activate() {
        //setInfiteScrollGetItemList();
        loadList();
        setInitialDate();
    }

    function setInfiteScrollGetItemList() {
        isLoadData = "true";
        inifiniteScroll.init({
            url: RootUrl + "/Administrator//?pageSize=100",
            callback: inifiteScrollCallBackGetItemList,
            searchObject: $("#search-item"),
            page: -1
        });
        inifiniteScroll.getData();
    }

    //Get Data
    function inifiteScrollCallBackGetItemList(result) {
        if (isLoadData === "true") {
            recordCountItemList(result.recordCount);
        }
        isLoadData = "false";

        allItems.removeAll();
        inifiniteScroll.resetDefaults();

        var noMoreData = result.noMoreData;
        var data = result.data;
        var temp = allItems();
        data.forEach(function (o) {
            var appraisalModel = new app.pawnedItemModel(
                o.pawneditemid
            );
            temp.push(appraisalModel);
        });
        isViewLoadMoreData(noMoreData);
        allItems.valueHasMutated();

        return allItems();
    }

    function loadList() {
        $("#pawnedItemTable").dataTable().fnDestroy();
        $('#pawnedItemTable').DataTable({
            "ajax": {
                "url": RootUrl + "/Administrator/Pawning/GetPawnedItems",
                "type": "GET",
                "datatype": "json"
            },
            "order": [[2, "desc"]],
            "columns": [
                { "data": "PawnedItemId", "className": "hide" },
                { "data": "PawnedItemNo", "className": "text-left" },
                { "data": "PawnedItemContractNo", "className": "text-left" },
                { "data": "ItemName", "className": "text-left" },
                { "data": "NetCashOut", "className": "text-right" },
                { "data": "Status", "className": "text-right" },
                {
                    "data": "IsReleased",
                    "className": "text-left",
                    "render": function (data, type, row) {
                        if (row.IsReleased === 1) {
                            return "yes";
                        } else {
                            return "No";
                        }

                    }
                },
                {
                    "render": function () {
                        return '<ul class="icons-list text-center">' +
                            '<li class="dropdown">' +
                            '<a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="icon-menu7"></i></a>' +
                            '<ul class="dropdown-menu dropdown-menu-right">' +
                            '<li><a href="#"><i class="icon-file-stats"></i> View pawned item</a></li>' +
                            '<li><a href="#" ><i class="icon-file-stats"></i> Approve pawned item</a></li>' +
                            '<li><a href="#"><i class="icon-file-stats"></i> Print</a></li>' +
                            '</ul>' +
                            '</li>' +
                            '</ul>';
                    }
                }
            ]
        });
    }

    function clearControls() {

    }

    function addItem() {
        isPawnedItemListShowed(false);
        isManagePawnedItemShowed(true);

        getServerDate();
        getAppraisedItem();
        getCustomer();

        GetItemCode();
        GetContractNo();
    }

    function viewItem(arg) {
        loaderApp.showPleaseWait();

        loaderApp.hidePleaseWait();
    }

    function backToAppraisedItemList() {
        isPawnedItemListShowed(true);
        isManagePawnedItemShowed(false);
    }

    function saveItem() {
        /*VALIDATIONS -START*/
        //if (appraisedItem.AppraiseDate().trim() === "") {
        //    toastr.error("Date is required.");
        //    appraisedItem.AppraiseDate("");
        //    document.getElementById("AppraiseDate").focus();
        //    return false;
        //}

        /*VALIDATIONS -END*/

        loaderApp.showPleaseWait();
        var param = ko.toJS(appraisedItem);
        var url = RootUrl + "/Administrator//";
        $.ajax({
            type: 'POST',
            url: url,
            data: ko.utils.stringifyJson(param),
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result.success) {
                    swal("Success", result.message, "success");

                    loaderApp.hidePleaseWait();
                } else {
                    loaderApp.hidePleaseWait();

                    swal("Error", result.message, "error");

                    clearControls();
                }
            }
        });
    }

    function saveCustomer(firstname, lastname, middlename, address, contactno) {
        /*VALIDATIONS -START*/

        ccustomerModel.FirstName(firstname);
        ccustomerModel.LastName(lastname);
        ccustomerModel.MiddleName(middlename);
        ccustomerModel.Address(address);
        ccustomerModel.ContactNo(contactno);

        /*VALIDATIONS -END*/
        loaderApp.showPleaseWait();
        var param = ko.toJS(ccustomerModel);
        var url = RootUrl + "/Administrator/Pawning/SaveCustomer";
        $.ajax({
            type: 'POST',
            url: url,
            data: ko.utils.stringifyJson(param),
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result.success) {
                    swal("Success", result.message, "success");
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

    function getAppraisedItem() {
        $.getJSON(RootUrl + "/Administrator/Pawning/GetAppraisedItem", function (result) {
            appraisedItem.removeAll();
            appraisedItem(result);
        });
    }

    function getCustomer() {
        $.getJSON(RootUrl + "/Administrator/Pawning/GetCustomer", function (result) {
            customer.removeAll();
            customer(result);
        });
    }

    function getAppraisedItemById() {
        var AppraisedItemId = $('#AppraiseId').val();
        $.getJSON(RootUrl + "/Administrator/Pawning/GetAppraisedItemById?AppraisedItemId=" + AppraisedItemId, function (result, data) {
            appraisedItemModel.AppraiseId(result.data[0].AppraiseId);
            appraisedItemModel.ItemTypeName(result.data[0].ItemTypeName)
            appraisedItemModel.ItemCategoryName(result.data[0].ItemCategoryName)
            appraisedItemModel.Weight(result.data[0].Weight)
            appraisedItemModel.AppraisedValue(result.data[0].AppraisedValue)
            appraisedItemModel.Remarks(result.data[0].Remarks)
            appraisedItemModel.ItemName(result.data[0].ItemName)
        });
    }

    function getCustomerById() {
        var CustomerId = $('#CustomerId').val();
        $.getJSON(RootUrl + "/Administrator/Pawning/GetCustomerById?CustomerId=" + CustomerId, function (result) {
            customerModel.Id(result.Id);
            customerModel.FirstName(result.FirstName);
            customerModel.LastName(result.LastName);
            customerModel.MiddleName(result.MiddleName);
            customerModel.MiddleInitial(result.MiddleInitial);
            customerModel.Address(result.Address);
            customerModel.ContactNo(result.ContactNo);
        });
    }

    function GetContractNo() {
        $.getJSON(RootUrl + "/Administrator/Pawning/GetContractNo", function (result) {
            pawnedItemModel.PawnedItemContractNo(result);
        });
    }

    function GetItemCode() {
        $.getJSON(RootUrl + "/Administrator/Pawning/GetItemCode", function (result) {
            pawnedItemModel.PawnedItemNo(result);
        });
    }

    function getServerDate() {
        $.getJSON(RootUrl + "/Administrator/Appraisal/GetServerDate", function (result) {
            pawnedItemModel.PawnedDate(result);
            pawnedItemModel.DueDateStart(result);
            pawnedItemModel.DueDateEnd(result);
        });
    }

    function setInitialDate() {
        $('.daterange-single').daterangepicker({
            singleDatePicker: true
        });
    }

    // #endregion

    var vm = {
        activate: activate,
        addItem: addItem,
        saveItem: saveItem,
        viewItem: viewItem,

        isPawnedItemListShowed: isPawnedItemListShowed,
        isManagePawnedItemShowed: isManagePawnedItemShowed,
        backToAppraisedItemList: backToAppraisedItemList,

        appraisedItem: appraisedItem,
        customer: customer,

        pawnedItemModel: pawnedItemModel,
        appraisedItemModel: appraisedItemModel,
        customerModel: customerModel,
        ccustomerModel: ccustomerModel,

        getAppraisedItemById: getAppraisedItemById,
        getCustomerById: getCustomerById,

        saveCustomer: saveCustomer
    };

    return vm;

})();

$(function () {
    "use strict";

    app.vm.activate();

    // Success
    $(".control-success").uniform({
        radioClass: 'choice',
        wrapperClass: 'border-success-600 text-success-800'
    });

    //Switchery
    var switches = Array.prototype.slice.call(document.querySelectorAll('.switchery'));
    switches.forEach(function (html) {
        var switchery = new Switchery(html, { color: '#4CAF50' });
    });

    // Custom bootbox dialog with form
    $('#mlgs_test_form').on('click', function () {
        bootbox.dialog({
            title: "Create a new customer.",
            message: '<div class="row">  ' +
                '<div class="col-md-12">' +
                    '<form class="form-horizontal">' +
                        '<div class="form-group">' +
                            '<label class="col-md-4 control-label">First name</label>' +
                            '<div class="col-md-8">' +
                                '<input id="cFirstName" data-bind="textinput: ccustomerModel.FirstName" name="FirstName" type="text" placeholder="First name" class="form-control">' +
                            '</div>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label class="col-md-4 control-label">Last name</label>' +
                            '<div class="col-md-8">' +
                                '<input id="cLastName" data-bind="textinput: ccustomerModel.LastName" name="LastName" type="text" placeholder="Last name" class="form-control">' +
                            '</div>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label class="col-md-4 control-label">Middle name</label>' +
                            '<div class="col-md-8">' +
                                '<input id="cMiddleName" data-bind="textinput: ccustomerModel.MiddleName" name="MiddleName" type="text" placeholder="Middle name" class="form-control">' +
                            '</div>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label class="col-md-4 control-label">Address</label>' +
                            '<div class="col-md-8">' +
                                '<input id="cAddress" data-bind="textinput: ccustomerModel.Address" name="Address" type="text" placeholder="Address" class="form-control">' +
                            '</div>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label class="col-md-4 control-label">Contact no.</label>' +
                            '<div class="col-md-8">' +
                                '<input id="cContactNo" data-bind="textinput: ccustomerModel.ContactNo" name="ContactNo" type="text" placeholder="Contact no." class="form-control">' +
                            '</div>' +
                        '</div>' +
                    '</form>' +
                '</div>' +
                '</div>',
            buttons: {
                success: {
                    label: "Save",
                    className: "btn-success",
                    callback: function () {
                        if ($('#cFirstName').val() === "") {
                            toastr.error("First name is required.");
                            app.vm.customerModel.FirstName("");
                            document.getElementById("FirstName").focus();
                            return false;
                        }
                        var firstname = $('#cFirstName').val();
                        var lastname = $('#cFirstName').val();
                        var middlename = $('#cFirstName').val();
                        var address = $('#cFirstName').val();
                        var contactno = $('#cFirstName').val();

                        app.vm.saveCustomer(
                            firstname,
                            lastname,
                            middlename,
                            address,
                            contactno
                            );

                        //var name = $('#cFirstName').val();
                        //var answer = $("input[name='awesomeness']:checked").val()
                        //bootbox.alert("Hello " + name + ". You've chosen <b>" + answer + "</b>");
                    }
                },
                danger: {
                    label: "Cancel",
                    className: "btn-danger",
                    callback: function () {
                            
                    }
                }
            }
        }
        );
    });

    ko.applyBindings(app.vm);
});