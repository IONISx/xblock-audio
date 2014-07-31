AudioXBlock.StudentView = function () {
    this.constructor.apply(this, arguments);
};

AudioXBlock.StudentView.prototype = {
    constructor: function (server, runtime, element) {
        this.runtime = runtime;
        this.server = server;
        this.element = $(element);

        this.state = null;
    },

    _updateState: function () {
        var self = this;
        var deferred = $.Deferred();

        return this.server.get_state()
            .done(function (state) {
                self.state = state;
                console.log(state);
                deferred.resolve(state);
            })
            .fail(function (err) {
                deferred.reject(err);
            })

        return deferred.promise();
    },

    play: function () {
        var self = this;

        this.server.play()
            .done(function (url) {
                var sound = new Howl({
                    urls: [url],
                    autoplay: true
                });
            })
            .fail(function () {
                console.log('cannot play');
            });
    },

    render: function () {
        var self = this;

        this._updateState()
            .done(function () {
                if (self.state.options.autoplay) {
                    self.play();
                }
            });
    }
};
