var viewModel = ko.mapping.fromJS({'destinations': []});
viewModel.travel = function(dest, ev, force) {
    var send = {'destination': dest.name()};
    if (force || ev.shiftKey) {
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
    if (!viewModel.started()) {
        return;
    }
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

function updateModel() {
    $.getJSON('/model', function(data) {
        ko.mapping.fromJS(data, viewModel);
    });
}
