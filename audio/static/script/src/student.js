AudioXBlock.StudentView = function () {
    this.constructor.apply(this, arguments);
};

AudioXBlock.StudentView.prototype = {
    constructor: function (server, runtime, element) {
        this.runtime = runtime;
        this.server = server;
        this.element = $(element);

        this.state = null;

        this.template = Handlebars.compile(
            this.element.find('#xblock-audio-template').html()
        );
    },

    _updateState: function () {
        var self = this;
        var deferred = $.Deferred();

        this.server.get_state()
            .done(function (state) {
                self.state = state;
                deferred.resolve(state);
            })
            .fail(function (err) {
                deferred.reject(err);
            });

        return deferred.promise();
    },

    play: function () {
        this.server.play()
            .done(function (url) {
                new Howl({
                    urls: [url],
                    autoplay: true
                });
            });
    },

    render: function () {
        var self = this;

        this._updateState()
            .done(function () {
                self.element.find('.content').html(
                    self.template(self.state)
                );

                if (self.state.options.autoplay) {
                    self.play();
                }
            });
    }
};
