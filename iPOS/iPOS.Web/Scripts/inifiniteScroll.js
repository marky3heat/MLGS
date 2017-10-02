/*
    [infinite-scroll-list] - attach this attribute to a list or tbody of a table that needs infinite scroll
    [listing-merchant-footer] - attach this attribute to a button to manually load more data and also act as a spinner
    options.url - the url for getting data from controller
*/

var inifiniteScroll = new function () {
    var page = -1;
    var originalPage = -1;
    var inCallback = false;
    var hasReachedEndOfInfiniteScroll = false;
    var url = '';

    var self;


    return {
        options: {
            url: "",
            callback: null,
            searchObject: null,
            dataType: null,
            //i set this as option so that the user can use it to load in the initially or in the second page..
            //1 if  you already have a preload like mvc first 10
            //-1 if you are doing the load in this tool
            page: -1
        },
        resetDefaults: function () {
            page = originalPage;
        },
        init: function (options) {
            self = this;
            self.options = options;
            originalPage = self.options.page;
            page = self.options.page;

            $(window).scroll(self.scrollHandler);

            $("[infinite-scroll-load-more]").click(function() {
                self.getData();
            });
        },

        showNoMoreRecords: function () {
            hasReachedEndOfInfiniteScroll = true;
        },

        scrollHandler: function () {
            if (!hasReachedEndOfInfiniteScroll && ($(window).scrollTop() === $(document).height() - $(window).height())) {
                self.getData();
            }
        },

        getData: function () {
            if (!inCallback) {
                $("[infinite-scroll-load-more]").removeClass("animate").addClass("animate");

                inCallback = true;
                $('#loading_div').show();
                page++;

                var searchValue = "";
                if (self.options.searchObject && self.options.searchObject.val().length > 0) {
                    searchValue = self.options.searchObject.val();
                }

                var getUrl = self.options.url;
                if (!/\/?/.test(getUrl)) {
                    getUrl = getUrl + '/?page=' + page + '&search=' + searchValue;
                }
                else {
                    getUrl = getUrl + '&page=' + page + '&search=' + searchValue;
                }

                $.get(getUrl, function (result) {

                    if (self.options.callback != null && result != '') {
                        self.options.callback(result);
                    }
                    else if (result != '') {
                        $("[infinite-scroll-list]").append(result);
                    }
                    else {
                        if (page > 1) page--;
                    }
                }, self.options.dataType)
                .fail(function (error) {
                    if (page > 1) page--;
                })
                .always(function () {
                    setTimeout(function () {
                        $("[infinite-scroll-load-more]").removeClass("animate");
                        inCallback = false;
                        $('#loading_div').hide();
                    }, 500);
                });
            }
        }
    };
}();