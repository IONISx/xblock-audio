AudioXBlock.StudioView = function () {
    this.constructor.apply(this, arguments);
};

AudioXBlock.StudioView.prototype = {
    constructor: function (server, runtime, element) {
        this.runtime = runtime;
        this.server = server;
        this.element = $(element);
    },

    save: function () {
        var settings = this.element.find('#settings-tab');
        var metadata = settings.data('metadata');

        this.element.find('.metadata_entry').each(function () {
            var input = $(this).find('.setting-input');
            metadata[input.data('field-name')].value = input.val();
        });

        this.runtime.notify('save', {
            state: 'start'
        });

        var that = this;
        this.server.edit({
            metadata: metadata,
        }).done(function() {
            that.runtime.notify('save', {
                state: 'end'
            });

            settings.data('metadata', metadata);
        }).fail(function (msg) {
            that.showError(msg);
        });
    },

    cancel: function () {
        this.runtime.notify('cancel', {});
    },

    showError: function (msg) {
        this.runtime.notify('error', {
            msg: msg
        });
    },

    setupEvents: function () {
        var that = this;

        this.element.on('click', '.save-button', function () {
            that.save();
        });
        this.element.on('click', '.cancel-button', function () {
            that.cancel();
        });
    },

    render: function () {
        this.setupEvents();
    }
};
