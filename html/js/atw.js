var viewModel = ko.mapping.fromJS({'destinations': []});
viewModel.travel = function(dest) {
    $.get('/travel', {'destination': dest.name()},
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
