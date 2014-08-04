AudioXBlock.StudentView = function () {
    this.constructor.apply(this, arguments);
};

AudioXBlock.StudentView.prototype = {
    constructor: function (server, runtime, element) {
        this.runtime = runtime;
        this.server = server;
        this.element = $(element);

        this.state = null;

        this.templates = {
            main: Handlebars.compile(
                this.element.find('#xblock-audio-main').html()
            ),
            player: Handlebars.compile(
                this.element.find('#xblock-audio-player').html()
            )
        }
    },

    _initializeEvents: function () {
        if (this.state.options.showControls) {
            this.element.find('.control.play').click(_.bind(this.play, this));
            this.element.find('.control.pause').click(_.bind(this.pause, this));
            this.element.find('.control.stop').click(_.bind(this.stop, this));
        }
    },

    _updateState: function () {
        var self = this;
        var deferred = $.Deferred();

        this.server.getState()
            .done(function (state) {
                self.state = state;
                deferred.resolve(state);
            })
            .fail(function (err) {
                deferred.reject(err);
            });

        return deferred.promise();
    },

    _createSound: function (url) {
        if (this.sound) {
            delete this.sound;
        }

        console.log(url);

        this.sound = new Howl({
            urls: [url],
            onend: _.bind(this.stop, this)
        });

        return this.sound;
    },

    _serializeData: function () {
        return _.extend(this.state, {
            playing: this.playerState === 'playing',
            onlyOnePlay: this.state.maxPlays === 1,
            lastPlay: this.state.plays === this.state.maxPlays
        });
    },

    _refreshView: function () {
        var content = this.element.find('.xblock-audio-content');

        var data = this._serializeData();

        content.html(this.templates.main(data));
        if (this.state.options.showControls) {
            content.prepend(this.templates.player(data));
        }

        this._initializeEvents();

        if (this.state.options.autoplay && !this.autoplayed) {
            this.autoplayed = true;
            this.play();
        }
    },

    play: function () {
        var self = this;
        var deferred = $.Deferred();

        if (this.sound && this.playerState === 'paused') {
            this.unpause();
            deferred.resolve();
        }
        else if (this.playerState === 'playing') {
            deferred.reject(['Sound is already playing']);
        }
        else {
            this.server.play()
                .done(function (url) {
                    console.log('play done', arguments);
                    self._createSound(url);
                    self.sound.play();
                    self.playerState = 'playing';
                    deferred.resolve();
                    self.render();
                });
        }

        return deferred.promise();
    },

    pause: function () {
        if (this.state.options.showControls) {
            if (this.sound && this.playerState === 'playing') {
                this.sound.pause();
                this.playerState = 'paused';
                this.render();
            }
        }
    },

    unpause: function () {
        if (this.state.options.showControls) {
            if (this.sound && this.playerState === 'paused') {
                this.sound.play();
                this.playerState = 'playing';
                this.render();
            }
        }
    },

    stop: function () {
        if (this.sound) {
            this.sound.stop();
            delete this.playerState;
            delete this.sound;
            this.render();
        }
    },

    render: function () {
        this._updateState().done(_.bind(this._refreshView, this));
    }
};
