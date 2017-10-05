app.Transactions = function (
    transactionid,
    transactionno,
    transactiondate,
    transactiontype,
    terminal,
    status,
    reviewedby,
    approvedby,
    createdby,
    createdat,
    firstname,
    lastname
    ) {
    "use strict";

    var self = this;

    self.TransactionId = ko.observable(transactionid);
    self.TransactionNo = ko.observable(transactionno);
    self.TransactionDate = ko.observable(transactiondate);
    self.TransactionType = ko.observable(transactiontype);
    self.Terminal = ko.observable(terminal);
    self.Status = ko.observable(status);
    self.ReviewedBy = ko.observable(reviewedby);
    self.ApprovedBy = ko.observable(approvedby);
    self.CreatedBy = ko.observable(createdby);
    self.CreatedAt = ko.observable(createdat);
 
    return self;
};

//app.Customers = function (autonum,
//    first_name,
//    last_name,
//    middle_name,
//    st_address,
//    city_address,
//    mobile_no,
//    zip_code
//    ) {
//    "use strict";

//    var self = this;

//    self.autonum = ko.observable(autonum);
//    self.first_name = ko.observable(first_name);
//    self.last_name = ko.observable(last_name);
//    self.middle_name = ko.observable(middle_name);
//    self.st_address = ko.observable(st_address);
//    self.city_address = ko.observable(city_address);
//    self.mobile_no = ko.observable(mobile_no);
//    self.zip_code = ko.observable(zip_code);

//    return self;
//};

app.createTransaction = function () {
    "use strict";

    var self = this;

    // #region MODEL TO CREATE/UPDATE
    self.TransactionId = ko.observable();
    self.TransactionNo = ko.observable();
    self.TransactionDate = ko.observable();
    self.TransactionType = ko.observable();
    self.CustomerId = ko.observable();
    self.Terminal = ko.observable();
    self.Status = ko.observable();
    self.ReviewedBy = ko.observable();
    self.ApprovedBy = ko.observable();
    self.CreatedBy = ko.observable();
    self.CreatedAt = ko.observable();

    self.first_name = ko.observable();
    self.last_name = ko.observable();
    self.middle_name = ko.observable();
    self.st_address = ko.observable();
    self.city_address = ko.observable();
    self.mobile_no = ko.observable();

    self.ItemName = ko.observable();
    self.ItemTypeId = ko.observable();
    self.ItemCategoryId = ko.observable();
    self.Remarks = ko.observable();

    // #endregion     

    return self;
};

app.createCustomer = function () {
    "use strict";

    var self = this;

    // #region MODEL TO BE MAP
    self.autonum = ko.observable();
    self.first_name = ko.observable();
    self.last_name = ko.observable();
    self.middle_name = ko.observable();
    self.st_address = ko.observable();
    self.city_address = ko.observable();
    self.mobile_no = ko.observable();
    self.zip_code = ko.observable();
    // #endregion
};

app.Transaction = function () {
    "use strict";

    var self = this;

    self.TransactionId = ko.observable();
    self.TransactionNo = ko.observable();
    self.TransactionDate = ko.observable();
    self.TransactionType = ko.observable();
    self.CustomerId = ko.observable();
    self.Terminal = ko.observable();
    self.Status = ko.observable();

};

app.Customer = function () {
    "use strict";

    var self = this;

    self.autonum = ko.observable();
    self.first_name = ko.observable();
    self.last_name = ko.observable();
    self.middle_name = ko.observable();
    self.st_address = ko.observable();
    self.city_address = ko.observable();
    self.mobile_no = ko.observable();
    self.zip_code = ko.observable();

};

app.AppraisedItem = function () {
    "use strict";

    var self = this;

    self.AppraiseId = ko.observable();
    self.AppraiseDate = ko.observable();
    self.AppraiseNo = ko.observable();
    self.ItemTypeId = ko.observable();
    self.ItemCategoryId = ko.observable();
    self.ItemName = ko.observable();
    self.ItemFeature = ko.observable();
    self.SerialNo = ko.observable();
    self.ItemCondition = ko.observable();
    self.Brand = ko.observable();
    self.Karat = ko.observable();
    self.Weight = ko.observable();
    self.AppraisedValue = ko.observable();
    self.Remarks = ko.observable();
    self.CustomerFirstName = ko.observable();
    self.CustomerLastName = ko.observable();
    self.IsPawned = ko.observable();
    self.PawnshopTransactionId = ko.observable();
};