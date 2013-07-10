var viewModel = ko.mapping.fromJS({'destinations': [], 'offset': 0});
viewModel.travel = function(dest, ev, force) {
    var send = {'destination': dest.name()};
    if (force || (ev && ev.shiftKey)) {
        send.force = true;
    }
    $('#' + dest.name() + '-button').button('loading');
    $.ajax({
        url: '/travel',
        data: send,
        success: function(data, textStatus) {
            updateModel();
          },
        dataType: 'json',
        error: function(jqXHR, textStatus, error) {
            console.log(error);
            $('#' + dest.name() + '-button').button('reset');
        }
    });
};
viewModel.clear = function() {
    $.get('/clear', function(data) {
            updateModel();
          }, 'json');
};
viewModel.started = ko.computed(function() {
    for(var i in viewModel.destinations()) {
        if (viewModel.destinations()[i].active()) {
            return true;
        }
    }
    return false;
});
viewModel.nextDest = function() {
    for(var i in viewModel.destinations()) {
        if (! viewModel.destinations()[i].active()) {
            return viewModel.destinations()[i];
        }
    }
    return;
};
viewModel.delay = function() {
    $.get('/delay', function(data) {
            viewModel.offset(data.offset);
        }, 'json');
};

function updateModel() {
    $.getJSON('/model', function(data) {
        ko.mapping.fromJS(data, viewModel);
    });
}
