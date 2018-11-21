$(function () {


    // Replace <Face API base URI> with your valid Face API base URI.
    const uriBase = '<Face API base URI>';
    // Replace <Subscription Key> with your valid subscription key.
    const subscriptionKey = '<Subscription Key>';



    var detect_url = `${uriBase}/detect?returnFaceId=true&returnFaceLandmarks=false`;
    var identify_url = `${uriBase}/identify`;
    const personname = 'Liviu D'
    const groupid = 'ee908a56-e4a1-44b3-8101-c339fa27a904'
    
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

        $('#previewImage').html('<img src="data:image/png;base64,' + contents + '" />');
        
        $('#myCanvas').prop('width', $('#previewImage').width());
        $('#myCanvas').prop('height', $('#previewImage').height());
        var ctx = $('#myCanvas')[0].getContext("2d");
        ctx.clearRect(0, 0,  $('#myCanvas').width(), $('#myCanvas').height());
        
        $('#analyze_button').prop('disabled', false);

    });

    // Handle clicks of the Analyze button
    $("#analyze_button").click(function () {

        // Detect faces
        $.ajax({
            type: "POST",
            url: detect_url,
            data: imageBytes,
            processData: false,
            headers: {
                "Ocp-Apim-Subscription-Key": subscriptionKey,
                "Content-Type": "application/octet-stream"
            }
        }).done(function (data) {

            var ctx = $('#myCanvas')[0].getContext("2d");
            var cv_height = $('#myCanvas').height();
            var cv_width = $('#myCanvas').width();

            var faces = data;
            var faceids = faces.map(f => f.faceId);

            $.ajax({
                type: "POST",
                url: identify_url,
                processData: false,
                headers: {
                    "Ocp-Apim-Subscription-Key": subscriptionKey,
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({
                    "personGroupId": groupid,
                    "faceIds": faceids,
                    "maxNumOfCandidatesReturned": 1,
                    "confidenceThreshold": 0.5
                })
            }).done(function (data2) {
                facesIdentified = data2;
                for (const face of faces) {

                    faceinfo = _.find(facesIdentified, function(f) {return f.faceId === face.faceId});

                    if (!faceinfo || faceinfo.candidates.length == 0)
                        drawBoundingBox(ctx, face.faceRectangle, null);
                    else {                        
                        label = `${personname} (${(faceinfo.candidates[0].confidence * 100).toFixed(0)}%)`;
                        drawBoundingBox(ctx, face.faceRectangle, label);
                    }
                
                }
            }).fail(function (xhr, status, err) {
                for (const face of faces) {
                    drawBoundingBox(ctx, face.faceRectangle, null);
                }
            });

            $('#analyze_button').prop('disabled', true);
        }).fail(function (xhr, status, err) {
            alert(err);
        });
    });
    

    function drawBoundingBox(ctx, bbox, label) {
        ctx.beginPath();
        ctx.lineWidth="3";
        ctx.strokeStyle="yellow";
        if (label) 
            ctx.rect(bbox.left, bbox.top, bbox.width, bbox.height);
        else
            ctx.fillRect(bbox.left, bbox.top, bbox.width, bbox.height);
        ctx.stroke(); 

        if (label) {
            ctx.beginPath();
            ctx.lineWidth="1";
            ctx.font = "10px Courier";
            ctx.strokeText(label, bbox.left + 3, bbox.top + 10); 
        }
    }

});
