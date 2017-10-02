app.pawnedItemModel =
    function (pawneditemid,
        pawneditemno,
        pawneddate,
        appraiseid,
        customerid,
        pawneditemcontractno,
        loanableamount,
        interestrate,
        interestamount,
        initialpayment,
        servicecharge,
        others,
        isinterestdeducted,
        netcashout,
        termsid,
        scheduleofpayment,
        noofpayments,
        duedatestart,
        duedateend,
        isreleased,
        reviewedby,
        approvedby,
        createdby,
        createdat,
        itemname,
        firstname,
        lastname
        ) {
        "use strict";

        var self = this;

        // #region MODEL TO BE MAP
        self.PawnedItemId = ko.observable(pawneditemid);
        self.PawnedItemNo = ko.observable(pawneditemno);
        self.PawnedDate = ko.observable(pawneddate);
        self.AppraiseId = ko.observable(appraiseid);
        self.CustomerId = ko.observable(customerid);
        self.PawnedItemContractNo = ko.observable(pawneditemcontractno);
        self.LoanableAmount = ko.observable(loanableamount);
        self.InterestRate = ko.observable(interestrate);
        self.InterestAmount = ko.observable(interestamount);
        self.InitialPayment = ko.observable(initialpayment);
        self.ServiceCharge = ko.observable(servicecharge);
        self.Others = ko.observable(others);
        self.IsInterestDeducted = ko.observable(isinterestdeducted);
        self.NetCashOut = ko.observable(netcashout);
        self.TermsId = ko.observable(termsid);
        self.ScheduleOfPayment = ko.observable(scheduleofpayment);
        self.NoOfPayments = ko.observable(noofpayments);
        self.DueDateStart = ko.observable(duedatestart);
        self.DueDateEnd = ko.observable(duedateend);
        self.IsReleased = ko.observable(isreleased);
        self.ReviewedBy = ko.observable(reviewedby);
        self.ApprovedBy = ko.observable(approvedby);
        self.CreatedBy = ko.observable(createdby);
        self.CreatedAt = ko.observable(createdat);

        self.ItemName = ko.observable(approvedby);
        self.FirstName = ko.observable(createdby);
        self.LastName = ko.observable(createdat);
        // #endregion
    };
app.appraisedItemModel =
    function () {
        "use strict";

        var self = this;

        // #region MODEL TO BE MAP
        self.AppraiseId = ko.observable();
        self.AppraiseDate = ko.observable();
        self.AppraiseNo = ko.observable();
        self.ItemTypeId = ko.observable();
        self.ItemCategoryId = ko.observable();
        self.ItemName = ko.observable();
        self.Weight = ko.observable();
        self.AppraisedValue = ko.observable();
        self.Remarks = ko.observable();
        self.CustomerFirstName = ko.observable();
        self.CustomerLastName = ko.observable();
        self.IsPawned = ko.observable();
        self.CreatedBy = ko.observable();
        self.CreatedAt = ko.observable();

        self.ItemCategoryName = ko.observable();
        self.ItemTypeName = ko.observable();
        // #endregion
    };
app.customerModel = function () {
    "use strict";

    var self = this;

    // #region MODEL TO BE MAP
    self.Id = ko.observable();
    self.FirstName = ko.observable();
    self.LastName = ko.observable();
    self.MiddleName = ko.observable();
    self.MiddleInitial = ko.observable();
    self.Address = ko.observable();
    self.ContactNo = ko.observable();
    // #endregion
};

app.createCustomerModel = function () {
    "use strict";

    var self = this;

    // #region MODEL TO BE MAP
    self.Id = ko.observable();
    self.FirstName = ko.observable();
    self.LastName = ko.observable();
    self.MiddleName = ko.observable();
    self.MiddleInitial = ko.observable();
    self.Address = ko.observable();
    self.ContactNo = ko.observable();
    // #endregion
};

app.addPawnedItemModel = function () {
    "use strict";

    var self = this;

    // #region MODEL TO CREATE/UPDATE
    self.PawnedItemId = ko.observable();
    self.PawnedItemNo = ko.observable();
    self.PawnedDate = ko.observable();
    self.AppraiseId = ko.observable();
    self.CustomerId = ko.observable();
    self.PawnedItemContractNo = ko.observable();
    self.LoanableAmount = ko.observable();
    self.InterestRate = ko.observable();
    self.InterestAmount = ko.observable();
    self.InitialPayment = ko.observable();
    self.ServiceCharge = ko.observable();
    self.Others = ko.observable();
    self.IsInterestDeducted = ko.observable();
    self.NetCashOut = ko.observable();
    self.TermsId = ko.observable();
    self.ScheduleOfPayment = ko.observable();
    self.NoOfPayments = ko.observable();
    self.DueDateStart = ko.observable();
    self.DueDateEnd = ko.observable();
    self.IsReleased = ko.observable();
    self.ReviewedBy = ko.observable();
    self.ApprovedBy = ko.observable();
    self.CreatedBy = ko.observable();
    self.CreatedAt = ko.observable();
    // #endregion     

    return self;
};