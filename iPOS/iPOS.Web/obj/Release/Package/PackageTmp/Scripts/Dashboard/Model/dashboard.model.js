app.transactionModel =
    function (transactionid,
                transactionno,
                transactiondate,
                transactiontype,
                customerid,
                terminal,
                status,
                reviewedby,
                approvedby,
                createdby,
                createdat
        ) {
        "use strict";

        var self = this;

        // #region MODEL TO BE MAP
        self.TransactionId = ko.observable(transactionid);
        self.TransactionNo = ko.observable(transactionno);
        self.TransactionDate = ko.observable(transactiondate);
        self.TransactionType = ko.observable(transactiontype);
        self.CustomerId = ko.observable(customerid);
        self.Terminal = ko.observable(terminal);
        self.Status = ko.observable(status);
        self.ReviewedBy = ko.observable(reviewedby);
        self.ApprovedBy = ko.observable(approvedby);
        self.CreatedBy = ko.observable(createdby);
        self.CreatedAt = ko.observable(createdat);
        // #endregion
    };

app.addModel = function () {
    "use strict";

    var self = this;

    // #region MODEL TO CREATE/UPDATE
    self.Id = ko.observable();

    // #endregion     

    return self;
};