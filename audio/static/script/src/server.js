AudioXBlock.Server = function () {
    this.constructor.apply(this, arguments);
};

AudioXBlock.Server.prototype = {
    constructor: function (runtime, element) {
        this.runtime = runtime;
        this.element = element;
    },

    url: function (handler) {
        return this.runtime.handlerUrl(this.element, handler);
    },

    request: function (url, data) {
        return $.ajax({
            type: 'POST',
            url: this.url(url),
            data: JSON.stringify(data || {})
        });
    },

    get_state: function () {
        var deferred = $.Deferred();

        this.request('get_state')
            .done(function (data) {
                if (data.success) {
                    deferred.resolve(data.state);
                }
                else {
                    deferred.reject([data.msg]);
                }
            }).fail(function () {
                deferred.reject(['Unable to retrieve the sound url']);
            });

        return deferred.promise();
    },

    play: function () {
        var deferred = $.Deferred();

        this.request('play')
            .done(function (data) {
                if (data.success) {
                    deferred.resolve(data.url);
                }
                else {
                    deferred.reject([data.msg]);
                }
            }).fail(function () {
                deferred.reject(['Unable to retrieve the sound url']);
            });

        return deferred.promise();
    },

    edit: function (data) {
        var deferred = $.Deferred();

        this.request('edit', data)
            .done(function (data) {
                if (data.success) {
                    deferred.resolve(data);
                }
                else {
                    deferred.reject([data.msg]);
                }
            }).fail(function () {
                deferred.reject(['This problem could not be saved.']);
            });

        return deferred.promise();
    }
};
