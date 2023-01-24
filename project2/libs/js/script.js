(async function(){

    function phpRequest(request = "null", sendData = {}){


        return new Promise(function(resolve, reject){
    
            $.ajax({
                url: `./libs/php/${request}.php`,
                type: 'POST',
                dataType: 'json',
                data: sendData
            })
            .done(function(result) {
                resolve(result);
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
    
                let rejectObject = {
                    errorCode: jqXHR['status'],
                    errorMessage: jqXHR['statusText'],
                    er: textStatus,
                    er2: errorThrown
                }
    
                reject(rejectObject);
                
            });
        })
    }

    function errorajx(jqXHR, exception) {

        let msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            console.log(msg);
    };

    async function getAllEmployee(){
        let res = await phpRequest("getAll");
        console.log(res);
    }

    getAllEmployee();

})();

$(document).ready(function () {

    $(".profile-section").scroll(function(){ 
        if ($(this).scrollTop() > 100) { 
            $('#scroll').fadeIn(); 
        } else { 
            $('#scroll').fadeOut(); 
        } 
    }); 


    $('#scroll').click(function(){ 
        $(".profile-section").animate({ scrollTop: 0 }, 600); 
        return false; 
    });

});