AudioXBlock.StudentView = function () {
    this.constructor.apply(this, arguments);
};

AudioXBlock.StudentView.prototype = {
    constructor: function (server, runtime, element) {
        this.runtime = runtime;
        this.server = server;
        this.element = $(element);
    },

    render: function () {
    }
};
