app.customerModel = function (id, firstname, lastname, middlename, middleinitial, address, contactno) {
    "use strict";

    var self = this;

    // #region MODEL TO BE MAP
    self.Id = ko.observable(id);
    self.FirstName = ko.observable(firstname);
    self.LastName = ko.observable(lastname);
    self.MiddleName = ko.observable(middlename);
    self.MiddleInitial = ko.observable(middleinitial);
    self.Address = ko.observable(address);
    self.ContactNo = ko.observable(contactno);
    // #endregion
};
app.createCustomerModel = function () {
    "use strict";

    var self = this;

    // #region MODEL TO CREATE/UPDATE
    self.Id = ko.observable();
    self.FirstName = ko.observable();
    self.LastName = ko.observable();
    self.MiddleName = ko.observable();
    self.MiddleInitial = ko.observable();
    self.Address = ko.observable();
    self.ContactNo = ko.observable();
    // #endregion     

    return self;
};

app.updateCustomerModel = function () {
    "use strict";

    var self = this;

    // #region MODEL TO CREATE/UPDATE   
    self.Id = ko.observable();
    self.FirstName = ko.observable();
    self.LastName = ko.observable();
    self.MiddleName = ko.observable();
    self.MiddleInitial = ko.observable();
    self.Address = ko.observable();
    self.ContactNo = ko.observable();
    // #endregion     

    return self;
};