app.vm = (function () {
    //"use strict";

    var customerstatus = new app.updateCustomerModel();
    var customer = new app.createCustomerModel();

    // #region CONTROLS                
    var isCustomerListShowed = ko.observable(true);
    var isManageCustomerShowed = ko.observable(false);
    var isPasswordShowed = ko.observable(true);

    var buttonCaption = ko.observable("");

    var isLoadData = "false";
    var recordCountCustomerList = ko.observable();
    var isViewLoadMoreData = ko.observable(false);

    var roles = ko.observableArray();
    var customerroles = ko.observableArray();

    var allCustomers = ko.observableArray([]);
    var customers = ko.pureComputed(function () {
        return allCustomers();
    });
    // #endregion

    // #region BEHAVIORS
    // initializers
    function activate() {
        setInfiteScrollGetCustomerList();
    }

    function setInfiteScrollGetCustomerList() {
        isLoadData = "true";
        inifiniteScroll.init({
            url: RootUrl + "/Administrator/Customer/GetCustomerList?pageSize=100",
            callback: inifiteScrollCallBackGetCustomerList,
            searchObject: $("#search-item"),
            page: -1
        });
        inifiniteScroll.getData();
    }

    function clearControls() {
        customer.Id("");
        customer.FirstName("");
        customer.LastName("");
        customer.MiddleName("");
        customer.MiddleInitial("");
        customer.Address("");
        customer.ContactNo("");
    }

    function addCustomer() {
        buttonCaption(" Create Customer Profile");
        clearControls();
        isPasswordShowed(true);
        isCustomerListShowed(false);
        isManageCustomerShowed(true);
    }

    function editCustomer(arg) {
        loaderApp.showPleaseWait();
        buttonCaption(" Update Customer Profile");
        clearControls();
        isPasswordShowed(false);
        customer.Id(arg.Id());
        customer.FirstName(arg.FirstName());
        customer.LastName(arg.LastName());
        customer.MiddleName(arg.MiddleName());
        customer.MiddleInitial(arg.MiddleInitial());
        customer.Address(arg.Address());
        customer.ContactNo(arg.ContactNo());
        isCustomerListShowed(false);
        isManageCustomerShowed(true);
        loaderApp.hidePleaseWait();
    }

    function backToCustomerList() {
        isCustomerListShowed(true);
        isManageCustomerShowed(false);
    }

    function saveCustomer() {
        /*VALIDATIONS -START*/
        if (customer.FirstName().trim() === "") {
            toastr.error("FirstName is required.");
            customer.FirstName("");
            document.getElementById("FirstName").focus();
            return false;
        }
        if (customer.LastName().trim() === "") {
            toastr.error("LastName is required.");
            customer.LastName("");
            document.getElementById("LastName").focus();
            return false;
        }
        if (customer.MiddleName().trim() === "") {
            toastr.error("MiddleName is required.");
            customer.MiddleName("");
            document.getElementById("MiddleName").focus();
            return false;
        }
        if (customer.Address().trim() === "") {
            toastr.error("Address is required.");
            customer.Address("");
            document.getElementById("Address").focus();
            return false;
        }
        if (customer.ContactNo().trim() === "") {
            toastr.error("ContactNo is required.");
            customer.ContactNo("");
            document.getElementById("ContactNo").focus();
            return false;
        }
        /*VALIDATIONS -END*/

        loaderApp.showPleaseWait();
        var param = ko.toJS(customer);
        var url = RootUrl + "/Administrator/Customer/SaveCustomer";
        $.ajax({
            type: 'POST',
            url: url,
            data: ko.utils.stringifyJson(param),
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result.success) {
                    swal("Success", result.message, "success");

                    //to refresh infinitescroll                    
                    setInfiteScrollGetCustomerList();
                    isLoadData = "true";
                    //--------

                    isCustomerListShowed(true);
                    isManageCustomerShowed(false);

                    loaderApp.hidePleaseWait();
                } else {
                    swal("Error", result.message, "error");
                }
            }
        });
    }

    // get data
    function inifiteScrollCallBackGetCustomerList(result) {
        if (isLoadData === "true") {
            recordCountCustomerList(result.recordCount);
        }
        isLoadData = "false";

        allCustomers.removeAll();
        inifiniteScroll.resetDefaults();

        var noMoreData = result.noMoreData;
        var data = result.data;
        var temp = allCustomers();
        data.forEach(function (o) {
            var customerModel = new app.customerModel(
                o.Id,
                o.FirstName,
                o.LastName,
                o.MiddleName,
                o.MiddleInitial,
                o.Address,
                o.ContactNo);
            temp.push(customerModel);
        });
        isViewLoadMoreData(noMoreData);
        allCustomers.valueHasMutated();

        return allCustomers();
    }

    // #endregion
    var vm = {
        customer: customer,
        isCustomerListShowed: isCustomerListShowed,
        isManageCustomerShowed: isManageCustomerShowed,
        buttonCaption: buttonCaption,
        addCustomer: addCustomer,
        editCustomer: editCustomer,
        backToCustomerList: backToCustomerList,
        customers: customers,
        recordCountCustomerList: recordCountCustomerList,
        saveCustomer: saveCustomer,
        isLoadData: isLoadData,
        activate: activate
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

    ko.applyBindings(app.vm);
});