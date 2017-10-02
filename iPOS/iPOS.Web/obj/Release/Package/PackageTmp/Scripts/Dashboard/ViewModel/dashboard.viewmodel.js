function ViewModel() {
    var self = this;
    self.newTransactionCounter = ko.observableArray();
    self.hasNewTransaction = ko.observableArray(false);
    self.update = function () {
        $.getJSON(RootUrl + "/Administrator/Base/GetNewTransactionsCounter", function (result) {
            self.newTransactionCounter(result);
            if (result > 0) {
                self.hasNewTransaction(true);
            }
            else {
                self.hasNewTransaction(false);
            }
        });
    }
}

var exampleViewModel = new ViewModel();
window.setInterval(exampleViewModel.update, 1000);
ko.applyBindings(exampleViewModel);