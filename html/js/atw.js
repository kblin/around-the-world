var viewModel = ko.mapping.fromJS({'destinations': []});
viewModel.travel = function(dest, ev, force) {
    var send = {'destination': dest.name()};
    if (force) {
        send.force = true;
    }
    $.get('/travel', send,
          function(data, textStatus) {
            updateModel();
          }, 'json');
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

function updateModel() {
    $.getJSON('/model', function(data) {
        ko.mapping.fromJS(data, viewModel);
    });
}
