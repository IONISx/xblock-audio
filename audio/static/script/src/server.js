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

    edit: function (data) {
        var url = this.url('edit');
        var payload = JSON.stringify(data);

        return $.Deferred(function (defer) {
            $.ajax({
                type: 'POST',
                url: url,
                data: payload
            }).done(function (data) {
                if (data.success) {
                    defer.resolve();
                }
                else {
                    defer.rejectWith(this, [data.msg]);
                }
            }).fail(function () {
                defer.rejectWith(this, ['This problem could not be saved.']);
            });
        }).promise();
    }
};
