// #region Viewing/Tables
app.modelPawnshopTransactions =
    function (
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

    // #region MODEL TO CREATE/UPDATE
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

    // #endregion     

    return self;
};

app.modelCustomer =
    function (
        autonum,
        id_code,
        trade_name,
        customer_class,
        last_name,
        first_name,
        middle_name,
        business_phone_no,
        mobile_no,
        fax_no,
        st_address,
        city_address,
        zip_code,
        vat,
        bir_reg_no,
        tax_id_no,
        credit_terms,
        credit_limit,
        balance,
        date_as_of,
        active,
        group_id,
        group_name,
        remarks,
        customer_image,
        date_entered,
        ul_code,
        created_by,
        date_created,
        update_by,
        date_update) {
    "use strict";

    var self = this;

    // #region MODEL TO BE MAP
    self.autonum = ko.observable(autonum);
    self.id_code = ko.observable(id_code);
    self.trade_name = ko.observable(trade_name);
    self.customer_class = ko.observable(customer_class);
    self.last_name = ko.observable(last_name);
    self.first_name = ko.observable(first_name);
    self.middle_name = ko.observable(middle_name);
    self.business_phone_no = ko.observable(business_phone_no);
    self.mobile_no = ko.observable(mobile_no);
    self.fax_no = ko.observable(fax_no);
    self.st_address = ko.observable(st_address);
    self.city_address = ko.observable(city_address);
    self.zip_code = ko.observable(zip_code);
    self.vat = ko.observable(vat);
    self.bir_reg_no = ko.observable(bir_reg_no);
    self.tax_id_no = ko.observable(tax_id_no);
    self.credit_terms = ko.observable(credit_terms);
    self.credit_limit = ko.observable(credit_limit);
    self.balance = ko.observable(balance);
    self.date_as_of = ko.observable(date_as_of);
    self.active = ko.observable(active);
    self.group_id = ko.observable(group_id);
    self.group_name = ko.observable(group_name);
    self.remarks = ko.observable(remarks);
    self.customer_image = ko.observable(customer_image);
    self.date_entered = ko.observable(date_entered);
    self.ul_code = ko.observable(ul_code);
    self.created_by = ko.observable(created_by);
    self.date_created = ko.observable(date_created);
    self.update_by = ko.observable(update_by);
    self.date_update = ko.observable(date_update);
    // #endregion
};
// $endregion

app.model =
    function (id
        ) {
        "use strict";

        var self = this;

        // #region MODEL TO BE MAP
        self.Id = ko.observable(id);

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