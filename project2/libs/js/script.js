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

    /***************************************************************************/

    async function getAllEmployee(order, orderBy){
        order = order.toUpperCase();
        let res = await phpRequest("getAll", {order: order, orderBy: orderBy});
        return res;
    }

    function tableBuilder(inputData, orderBy){
        let char = '', mainTemplate, headerTemplate, template, result ='', bodyTemplate = '';
        inputData.forEach(function(currentVal, index, array){

            if(currentVal[orderBy].charAt(0).toUpperCase() !== char){
                if(index !== 0){
                    mainTemplate = `
                        ${headerTemplate}
                        <div class="container">
                            <div class="row">
                                <div class="col-12">
                                    <div class="result_header_wrapper">
                                        <div class="header_name">Name</div>
                                        <div class="header_surname">Surname</div>
                                        <div class="header_email">E-mail</div>
                                        <div class="header_department">Department</div>
                                        <div class="header_location">Location</div>
                                    </div>
                                    ${bodyTemplate}
                                </div>
                            </div>
                        </div>
                    `;
                    result = result.concat(mainTemplate);
                    bodyTemplate = '';
                }

                headerTemplate = `<div class="result_header">${currentVal[orderBy].charAt(0).toUpperCase()}</div>`;
                char = currentVal[orderBy].charAt(0).toUpperCase();
            }



            template = `
                    <div class="result_row_wrapper">
                        <div class="result_name">${currentVal.firstName}</div>
                        <div class="result_surname">${currentVal.lastName}</div>
                        <div class="result_email">${currentVal.email}</div>
                        <div class="result_department">${currentVal.department}</div>
                        <div class="result_location">${currentVal.location}</div>
                    </div>
            `;

            bodyTemplate = bodyTemplate.concat(template);

            if(index === array.length-1){
                mainTemplate = `
                    ${headerTemplate}
                    <div class="container">
                        <div class="row">
                            <div class="col-12">
                                ${bodyTemplate}
                            </div>
                        </div>
                    </div>
                `;
                result = result.concat(mainTemplate);
            }
        });

        $('.main_wrapper').append(result);
    }

    async function allEmployeeTableBuilder(order, orderBy){
        let allEmployeeResult = await getAllEmployee(order, orderBy);
        tableBuilder(allEmployeeResult, orderBy);
    }

    /*****************************************************************************/

    
    allEmployeeTableBuilder('asc', 'location');

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