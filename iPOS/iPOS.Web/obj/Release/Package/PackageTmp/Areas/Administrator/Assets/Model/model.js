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
    self.FirstName = ko.observable(firstname);
    self.LastName = ko.observable(lastname);
 
    return self;
};