app.vm = (function () {
    //"use strict";
    var itemTypeModel = new app.ItemTypeModel();
    var itemCategoryModel = new app.ItemCategoryModel();
    var noGeneratorModel = new app.NoGeneratorModel();

    var modelBrand = new app.addModelBrand();
    var modelKarat = new app.addModelKarat();

    // #region CONTROLS   
    var isItemTypeShowedList = ko.observable(true);
    var isItemCategoryShowedList = ko.observable(true);
    var isNoGeneratorShowedList = ko.observable(true);

    var isShowedListBrand = ko.observable(true);
    var isShowedListKarat = ko.observable(true);
    
    var isItemTypeShowed = ko.observable(false);
    var isItemCategoryShowed = ko.observable(false);
    var isNoGeneratorShowed = ko.observable(false);

    var isShowedBrand = ko.observable(false);
    var isShowedKarat = ko.observable(false);

    var buttonSaveCaption = ko.observable("");

    var buttonSave = ko.observable(false);

    var itemTypeArray = ko.observableArray();

    var itemTypeList = ko.observableArray([]);
    var itemType = ko.pureComputed(function () {
        return itemTypeList();
    });

    var itemCategoryList = ko.observableArray([]);
    var itemCategory = ko.pureComputed(function () {
        return itemCategoryList();
    });

    var noGeneratorList = ko.observableArray([]);
    var noGenerator = ko.pureComputed(function () {
        return noGeneratorList();
    });

    // #endregion

    // #region BEHAVIORS
    // initializers
    function activate() {
        loadItemTypeList();
        loadItemCategoryList();
        loadNoGeneratorList();
        loadListBrand();
        loadListKarat();
    }

    //Get Data
    function loadItemTypeList() {
        $("#itemTypeTable").dataTable().fnDestroy();
        $('#itemTypeTable').DataTable({
            "ajax": {
                "url": RootUrl + "/Administrator/Reference/LoadItemTypeList",
                "type": "GET",
                "datatype": "json"
            },
            //"order": [[2, "desc"]],
            "columns": [
                { "data": "ItemTypeId", "className": "hide" },
                { "data": "ItemTypeName", "className": "text-left" },
                {
                    "render": function (data, type, row) {
                        return '<ul class="icons-list">' +
                            '<li class="dropdown">' +
                            '<a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="icon-menu7"></i></a>' +
                            '<ul class="dropdown-menu dropdown-menu-right">' +
                            '<li><a href="#"><i class="icon-file-stats"></i> View</a></li>' +
                            '</ul>' +
                            '</li>' +
                            '</ul>';
                    }
                },
                { "data": "ItemTypeId", "className": "hide" },
                { "data": "ItemTypeId", "className": "hide" },
                { "data": "ItemTypeId", "className": "hide" },
                { "data": "ItemTypeId", "className": "hide" }
            ]
        });
    }

    function loadItemCategoryList() {
        $("#itemCategoryTable").dataTable().fnDestroy();
        $('#itemCategoryTable').DataTable({
            "ajax": {
                "url": RootUrl + "/Administrator/Reference/LoadItemCategoryList",
                "type": "GET",
                "datatype": "json"
            },
            //"order": [[2, "desc"]],
            "columns": [
                { "data": "ItemCategoryId", "className": "hide" },
                { "data": "ItemTypeName", "className": "text-left" },
                { "data": "ItemCategoryName", "className": "text-left" },
                {
                    "render": function (data, type, row) {
                        return '<ul class="icons-list">' +
                            '<li class="dropdown">' +
                            '<a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="icon-menu7"></i></a>' +
                            '<ul class="dropdown-menu dropdown-menu-right">' +
                            '<li><a href="#"><i class="icon-file-stats"></i> View</a></li>' +
                            '</ul>' +
                            '</li>' +
                            '</ul>';
                    }
                },
                { "data": "ItemCategoryId", "className": "hide" },
                { "data": "ItemCategoryId", "className": "hide" },
                { "data": "ItemCategoryId", "className": "hide" }
            ]
        });
    }

    function loadListBrand() {
        $("#brandTable").dataTable().fnDestroy();
        $('#brandTable').DataTable({
            "ajax": {
                "url": RootUrl + "/Administrator/Reference/LoadListBrand",
                "type": "GET",
                "datatype": "json"
            },
            //"order": [[2, "desc"]],
            "columns": [
                { "data": "autonum", "className": "hide" },
                { "data": "brand_desc", "className": "text-left" },
                {
                    "render": function (data, type, row) {
                        return '<ul class="icons-list">' +
                            '<li class="dropdown">' +
                            '<a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="icon-menu7"></i></a>' +
                            '<ul class="dropdown-menu dropdown-menu-right">' +
                            '<li><a href="#"><i class="icon-file-stats"></i> View</a></li>' +
                            '</ul>' +
                            '</li>' +
                            '</ul>';
                    }
                },
                { "data": "autonum", "className": "hide" },
                { "data": "autonum", "className": "hide" },
                { "data": "autonum", "className": "hide" },
                { "data": "autonum", "className": "hide" }
            ]
        });
    }

    function loadListKarat() {
        $("#karatTable").dataTable().fnDestroy();
        $('#karatTable').DataTable({
            "ajax": {
                "url": RootUrl + "/Administrator/Reference/LoadListKarat",
                "type": "GET",
                "datatype": "json"
            },
            //"order": [[2, "desc"]],
            "columns": [
                { "data": "autonum", "className": "hide" },
                { "data": "karat_desc", "className": "text-left" },
                {
                    "render": function (data, type, row) {
                        return '<ul class="icons-list">' +
                            '<li class="dropdown">' +
                            '<a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="icon-menu7"></i></a>' +
                            '<ul class="dropdown-menu dropdown-menu-right">' +
                            '<li><a href="#"><i class="icon-file-stats"></i> View</a></li>' +
                            '</ul>' +
                            '</li>' +
                            '</ul>';
                    }
                },
                { "data": "autonum", "className": "hide" },
                { "data": "autonum", "className": "hide" },
                { "data": "autonum", "className": "hide" },
                { "data": "autonum", "className": "hide" }
            ]
        });
    }

    function loadNoGeneratorList() {
        $("#noGeneratorTable").dataTable().fnDestroy();
        $('#noGeneratorTable').DataTable({
            "ajax": {
                "url": RootUrl + "/Administrator/Reference/LoadNoGeneratorList",
                "type": "GET",
                "datatype": "json"
            },
            //"order": [[2, "desc"]],
            "columns": [
                { "data": "NoId", "className": "hide" },
                { "data": "NoDescription", "className": "text-left" },
                { "data": "No", "className": "text-center" },
                { "data": "NoId", "className": "hide" },
                { "data": "NoId", "className": "hide" },
                { "data": "NoId", "className": "hide" }
            ]
        });
    }

    function clearItemTypeControls() {
        itemTypeModel.ItemTypeId("");
        itemTypeModel.ItemTypeName("");
    }

    function clearItemCategoryControls() {
        itemCategoryModel.ItemCategoryId("");
        itemCategoryModel.ItemCategoryName("");
        itemCategoryModel.ItemTypeId("");
    }

    function addItemType() {
        buttonSaveCaption(" Save");
        clearItemTypeControls();

        isItemTypeShowedList(false);
        isItemTypeShowed(true);

        buttonSave(true);
    }

    function addItemCategory() {
        buttonSaveCaption(" Save");
        clearItemCategoryControls();

        getItemType();

        isItemCategoryShowedList(false);
        isItemCategoryShowed(true);

        buttonSave(true);
    }

    function addBrand() {
        buttonSaveCaption(" Save");
        //clearBrandControls();

        getItemType();

        isShowedListBrand(false);
        isShowedBrand(true);

        buttonSave(true);
    }

    function addKarat() {
        buttonSaveCaption(" Save");
        //clearKaratControls();

        getItemType();

        isShowedListKarat(false);
        isShowedKarat(true);

        buttonSave(true);
    }

    function viewItemType(arg) {
        loaderApp.showPleaseWait();
        buttonSaveItemTypeCaption("");
        clearItemTypeControls();

        item.AppraiseId(arg.AppraiseId());


        isItemTypeShowedList(false);
        isItemTypeShowed(true);

        buttonSaveItemType(false);

        loaderApp.hidePleaseWait();
    }

    function viewItemCategory(arg) {
        loaderApp.showPleaseWait();

        buttonSaveItemCategoryCaption("");
        clearItemCategoryControls();

        item.AppraiseId(arg.AppraiseId());

        isItemCategoryShowedList(false);
        isItemCategoryShowed(true);

        buttonSaveItemCategory(false);

        loaderApp.hidePleaseWait();
    }

    function backToList() {
        isItemTypeShowedList(true);
        isItemTypeShowed(false);

        isItemCategoryShowedList(true);
        isItemCategoryShowed(false);

        isShowedListBrand(true);
        isShowedBrand(false);

        isShowedListKarat(true);
        isShowedKarat(false);
    }

    function saveItemType() {
        loaderApp.showPleaseWait();
        var param = ko.toJS(itemTypeModel);
        var url = RootUrl + "/Administrator/Reference/SaveItemType";
        $.ajax({
            type: 'POST',
            url: url,
            data: ko.utils.stringifyJson(param),
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result.success) {

                    swal({ title: "Success!", text: result.message, type: "success" }, function () { reloadPage(); });

                    loaderApp.hidePleaseWait();
                } else {
                    loaderApp.hidePleaseWait();

                    swal("Error", result.message, "error");
                }
            }
        });
    }

    function saveItemCategory() {
        loaderApp.showPleaseWait();
        var param = ko.toJS(itemCategoryModel);
        var url = RootUrl + "/Administrator/Reference/SaveItemCategory";
        $.ajax({
            type: 'POST',
            url: url,
            data: ko.utils.stringifyJson(param),
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result.success) {

                    swal({ title: "Success!", text: result.message, type: "success" }, function () { reloadPage(); });

                    loaderApp.hidePleaseWait();
                } else {
                    loaderApp.hidePleaseWait();

                    swal("Error", result.message, "error");
                }
            }
        });
    }

    function saveBrand() {
        loaderApp.showPleaseWait();
        var param = ko.toJS(modelBrand);
        var url = RootUrl + "/Administrator/Reference/SaveBrand";
        $.ajax({
            type: 'POST',
            url: url,
            data: ko.utils.stringifyJson(param),
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result.success) {

                    swal({ title: "Success!", text: result.message, type: "success" }, function () { reloadPage(); });

                    loaderApp.hidePleaseWait();
                } else {
                    loaderApp.hidePleaseWait();

                    swal("Error", result.message, "error");
                }
            }
        });
    }

    function saveKarat() {
        loaderApp.showPleaseWait();
        var param = ko.toJS(modelKarat);
        var url = RootUrl + "/Administrator/Reference/SaveKarat";
        $.ajax({
            type: 'POST',
            url: url,
            data: ko.utils.stringifyJson(param),
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result.success) {

                    swal({ title: "Success!", text: result.message, type: "success" }, function () { reloadPage(); });

                    loaderApp.hidePleaseWait();
                } else {
                    loaderApp.hidePleaseWait();

                    swal("Error", result.message, "error");
                }
            }
        });
    }

    function getItemType() {
        $.getJSON(RootUrl + "/Administrator/Reference/GetItemType", function (result) {
            itemTypeArray.removeAll();
            itemTypeArray(result);
        });
    }

    function reloadPage() {
        window.location.reload();
    }

    // #endregion
    var vm = {
        activate: activate,

        isItemTypeShowedList: isItemTypeShowedList,
        isItemCategoryShowedList: isItemCategoryShowedList,
        isShowedListBrand: isShowedListBrand,
        isShowedListKarat: isShowedListKarat,

        isItemTypeShowed: isItemTypeShowed,
        isItemCategoryShowed: isItemCategoryShowed,
        isShowedBrand: isShowedBrand,
        isShowedKarat: isShowedKarat,

        addItemType: addItemType,
        addItemCategory: addItemCategory,
        addBrand: addBrand,
        addKarat: addKarat,

        viewItemType: viewItemType,
        viewItemCategory: viewItemCategory,

        backToList: backToList,

        saveItemType: saveItemType,
        saveItemCategory: saveItemCategory,
        saveBrand: saveBrand,
        saveKarat: saveKarat,

        getItemType: getItemType,

        buttonSaveCaption: buttonSaveCaption,

        itemTypeModel: itemTypeModel,
        itemCategoryModel: itemCategoryModel,
        noGeneratorModel: noGeneratorModel,
        modelBrand: modelBrand,
        modelKarat: modelKarat,

        itemTypeArray: itemTypeArray
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