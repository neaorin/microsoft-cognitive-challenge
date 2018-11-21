$(function () {

    // Replace <Custom Vision Prediction URI> with your valid Prediction URI for Custom Vision.
    const predictionUri = '<Custom Vision Prediction URI>';
    // Replace <Prediction Key> with your valid prediction key.
    const predictionKey = '<Prediction Key>';


    
    var fs = require('fs');
    var _ = require('underscore');

    // Store the value of a selected image for display
    var imageBytes;

    // Handle clicks of the Browse (...) button
    $("#select_button").click(function () {

        $('#analysisResults').html('');
        $('#analyze_button').prop('disabled', true);

        const electron = require('electron');
        const dialog = require('electron').dialog;

        var va = electron.remote.dialog.showOpenDialog();

        var contents = fs.readFileSync(va[0], "base64");
        imageBytes = fs.readFileSync(va[0]);

        $('#previewImage').html('<img width="240" src="data:image/png;base64,' + contents + '" />');
        
        $('#myCanvas').prop('width', $('#previewImage').width());
        $('#myCanvas').prop('height', $('#previewImage').height());
        var ctx = $('#myCanvas')[0].getContext("2d");
        ctx.clearRect(0, 0,  $('#myCanvas').width(), $('#myCanvas').height());

        $('#analyze_button').prop('disabled', false);

    });

    // Handle clicks of the Analyze button
    $("#analyze_button").click(function () {

        $.ajax({
            type: "POST",
            url: predictionUri,
            data: imageBytes,
            processData: false,
            headers: {
                "Prediction-Key": predictionKey,
                "Content-Type": "multipart/form-data"
            }
        }).done(function (data) {

            var ctx = $('#myCanvas')[0].getContext("2d");
            var cv_height = $('#myCanvas').height();
            var cv_width = $('#myCanvas').width();

            var predictions = data.predictions;
            var sortedPredictions = _.sortBy(predictions, 'probability').reverse();
            var filteredPredictions = _.filter(sortedPredictions, function(p) { return p.probability >= 0.2; });

            filteredPredictions.forEach(prediction => {

                bbox = {
                    top: cv_height * prediction.boundingBox.top,
                    left: cv_width * prediction.boundingBox.left,
                    width: cv_width * prediction.boundingBox.width,
                    height: cv_height * prediction.boundingBox.height
                }
                label = `${prediction.tagName} (${(prediction.probability * 100).toFixed(0)}%)`;

                drawBoundingBox(ctx, bbox, label);
            });

        }).fail(function (xhr, status, err) {
            alert(err);
        });

        $('#analyze_button').prop('disabled', true);
    });

    function drawBoundingBox(ctx, bbox, label) {
        ctx.beginPath();
        ctx.lineWidth="3";
        ctx.strokeStyle="yellow";
        ctx.rect(bbox.left, bbox.top, bbox.width, bbox.height);
        ctx.stroke(); 

        ctx.beginPath();
        ctx.lineWidth="1";
        ctx.font = "10px Courier";
        ctx.strokeText(label, bbox.left + 3, bbox.top + 10); 
    }

});


