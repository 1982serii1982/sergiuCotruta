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

function isset(data){
    if (typeof data !== 'undefined') {
        return true;
    }
    return false
}

function populateSelect(inputData, className = '', category){
    switch(category){
        case 'department':
            $(`.${className}`).empty();
            inputData.data.forEach(function(v, i, a){
                if(i == 0){
                    $(`.${className}`).append(`<option value="${v.name.toLowerCase()}" data-index="${i}" data-id="${v.id}" selected>${v.name}</option>`);
                    $(`.${className}`).attr('data-selected-value', `${v.name.toLowerCase()}`);
                    $(`.${className}`).attr('data-selected-id', `${v.id}`);
                }else{
                    $(`.${className}`).append(`<option value="${v.name.toLowerCase()}" data-index="${i}" data-id="${v.id}">${v.name}</option>`);
                }
            });
            break;

        case 'location':
            $(`.${className}`).empty();
            inputData.data.forEach(function(v, i, a){
                if(i == 0){
                    $(`.${className}`).append(`<option data-index="${i}" data-id="${v.id}" value="${v.name.toLowerCase()}" selected>${v.name}</option>`);
                    $(`.${className}`).attr('data-selected-value', `${v.name.toLowerCase()}`);
                    $(`.${className}`).attr('data-selected-id', `${v.id}`);
                }else{
                    $(`.${className}`).append(`<option data-index="${i}" data-id="${v.id}" value="${v.name.toLowerCase()}">${v.name}</option>`);
                }
            });

            break;
        case 'personnel':
            Object.keys(inputData.data[0]).forEach(function(v, i, a){
                switch(v){
                    case 'lastName':
                        $('.header_select').append(`<option value="${v}">Surname</option>`);
                        break;
                    case 'firstName':
                        $('.header_select').append(`<option value="${v}" selected>Name</option>`);
                        break;
                    case 'jobTitle':
                        $('.header_select').append(`<option value="${v}">Job title</option>`);
                        break;
                    case 'email':
                        $('.header_select').append(`<option value="${v}">E-mail</option>`);
                        break;
                    case 'department':
                        $('.header_select').append(`<option value="${v}">Department</option>`);
                        break;
                    case 'location':
                        $('.header_select').append(`<option value="${v}">Location</option>`);
                        break;
                    default:
                        console.log();
                }
                
            });

            break;
        default:
            console.log();
    }
    
}

function historyMessage(text, destination, color = 'red'){
    let timeStamp = new Date().toString("hh:mm:ss dS MMM yyyy");
    let string = `<span style="color: ${color}">${text}</span> --> <span style="color: blue;">${timeStamp}</span>`;
    $(`.${destination}`).append(`<p>${string}</p>`);
}

function capitalize(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function userTableBuilder(inputData){
    let mainTemplate, mainTemplateMobile,
        bodyTemplate = '', bodyTemplateMobile = '',
        template = '', templateMobile = '';



    inputData.data.forEach(function(currentVal, index, array){

        template = `
            <div class="result_row_wrapper">
                <div class="result_name">${currentVal.firstName}</div>
                <div class="result_surname">${currentVal.lastName}</div>
                <div class="result_jobTitle">${currentVal.jobTitle}</div>
                <div class="result_email">${currentVal.email}</div>
                <div class="result_department">${currentVal.department}</div>
                <div class="result_location">${currentVal.location}</div>
                <div class="result_action">
                    <button class="result_edit" data-value="${currentVal.id}" data-bs-toggle="modal" data-bs-target="#resultEditUserModal"><i class="fa-solid fa-pencil"></i></button>
                    <button class="result_delete" data-value="${currentVal.id}" data-bs-toggle="modal" data-bs-target="#resultDeleteUserModal"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </div>
        `;

        bodyTemplate = bodyTemplate.concat(template);

        templateMobile = `
            <div class="col-12 col-lg-6 col-xxl-4">
                <div class="result_box_wrapper">
                    <div class="result_name_mobile_wrapper">
                        <div class="header_name_mobile">Name</div>
                        <div class="result_name_mobile">${currentVal.firstName}</div>
                    </div>
                    <div class="result_surname_mobile_wrapper">
                        <div class="header_surname_mobile">Surname</div>
                        <div class="result_surname_mobile">${currentVal.lastName}</div>
                    </div>
                    <div class="result_jobtitle_mobile_wrapper">
                        <div class="header_jobtitle_mobile">Job title</div>
                        <div class="result_jobtitle_mobile">${currentVal.jobTitle}</div>
                    </div>
                    <div class="result_email_mobile_wrapper">
                        <div class="header_email_mobile">E-mail</div>
                        <div class="result_email_mobile">${currentVal.email}</div>
                    </div>
                    <div class="result_department_mobile_wrapper">
                        <div class="header_department_mobile">Department</div>
                        <div class="result_department_mobile">${currentVal.department}</div>
                    </div>
                    <div class="result_location_mobile_wrapper">
                        <div class="header_location_mobile">Location</div>
                        <div class="result_location_mobile">${currentVal.location}</div>
                    </div>
                    <div class="result_action_mobile">
                        <button class="result_edit_mobile" data-value="${currentVal.id}" data-bs-toggle="modal" data-bs-target="#resultEditUserModal"><i class="fa-solid fa-pencil"></i></button>
                        <button class="result_delete_mobile" data-value="${currentVal.id}" data-bs-toggle="modal" data-bs-target="#resultDeleteUserModal"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>
            </div>
        `;

        bodyTemplateMobile = bodyTemplateMobile.concat(templateMobile);

    });

    mainTemplate = `
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="result_total">${inputData.data.length} result(s) found</div>
                    <div class="result_header_wrapper">
                        <div class="header_name">Name</div>
                        <div class="header_surname">Surname</div>
                        <div class="header_jobtitle">Job title</div>
                        <div class="header_email">E-mail</div>
                        <div class="header_department">Department</div>
                        <div class="header_location">Location</div>
                        <div class="header_action">Action</div>
                    </div>
                    ${bodyTemplate}
                </div>
            </div>
        </div>
    `;

    mainTemplateMobile = `
        <div class="container-fluid">
            <div class="row">
                <div class="result_total">${inputData.data.length} result(s) found</div>
                ${bodyTemplateMobile}
            </div>
        </div>
    `;

    
    $('.main_user_wrapper').append(mainTemplate);

    
    $('.main_user_wrapper_mobile').append(mainTemplateMobile);
}

function departmentTableBuilder(inputData){
    let mainTemplate, mainTemplateMobile,
        bodyTemplate = '', bodyTemplateMobile = '',
        template = '', templateMobile = '';



    inputData.data.forEach(function(currentVal, index, array){

        template = `
            <div class="result_row_wrapper_department">
                <div class="result_department">${currentVal.departmentName}</div>
                <div class="result_location">${currentVal.locationName}</div>
                <div class="result_action">
                    <button class="result_edit_department" data-value="${currentVal.departmentID}" data-bs-toggle="modal" data-bs-target="#resultEditDepartmentModal"><i class="fa-solid fa-pencil"></i></button>
                    <button class="result_delete_department" data-value="${currentVal.departmentID}" data-name="${currentVal.departmentName}" data-bs-toggle="modal" data-bs-target="#resultDeleteDepartmentModal"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </div>
        `;

        bodyTemplate = bodyTemplate.concat(template);

        templateMobile = `
            <div class="col-12 col-lg-6 col-xxl-4">
                <div class="result_box_wrapper">
                    <div class="result_department_mobile_wrapper">
                        <div class="header_department_mobile">Department</div>
                        <div class="result_department_mobile">${currentVal.departmentName}</div>
                    </div>
                    <div class="result_location_mobile_wrapper">
                        <div class="header_location_mobile">Location</div>
                        <div class="result_location_mobile">${currentVal.locationName}</div>
                    </div>
                    <div class="result_action_mobile">
                        <button class="result_edit_department_mobile" data-value="${currentVal.departmentID}" data-bs-toggle="modal" data-bs-target="#resultEditDepartmentModal"><i class="fa-solid fa-pencil"></i></button>
                        <button class="result_delete_department_mobile" data-value="${currentVal.departmentID}" data-name="${currentVal.departmentName}" data-bs-toggle="modal" data-bs-target="#resultDeleteDepartmentModal"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>
            </div>
        `;

        bodyTemplateMobile = bodyTemplateMobile.concat(templateMobile);

    });

    mainTemplate = `
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="result_total">${inputData.data.length} result(s) found</div>
                    <div class="result_header_wrapper_department">
                        <div class="header_department">Department</div>
                        <div class="header_location">Location</div>
                        <div class="header_action">Action</div>
                    </div>
                    ${bodyTemplate}
                </div>
            </div>
        </div>
    `;

    mainTemplateMobile = `
        <div class="container-fluid">
            <div class="row">
                <div class="result_total">${inputData.data.length} result(s) found</div>
                ${bodyTemplateMobile}
            </div>
        </div>
    `;

    
    $('.main_departments_wrapper').append(mainTemplate);

    
    $('.main_departments_wrapper_mobile').append(mainTemplateMobile);
}

function locationTableBuilder(inputData, orderBy = 'name'){

    let mainTemplate, mainTemplateMobile,
        bodyTemplate = '', bodyTemplateMobile = '',
        template = '', templateMobile = '';



    inputData.data.forEach(function(currentVal, index, array){

        template = `
            <div class="result_row_wrapper_location">
                <div class="result_location">${currentVal.name}</div>
                <div class="result_action">
                    <button class="result_edit_location" data-lname="${currentVal.name}" data-value="${currentVal.id}" data-bs-toggle="modal" data-bs-target="#resultEditLocationModal"><i class="fa-solid fa-pencil"></i></button>
                    <button class="result_delete_location" data-lname="${currentVal.name}" data-value="${currentVal.id}" data-bs-toggle="modal" data-bs-target="#resultDeleteLocationModal"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </div>
        `;

        bodyTemplate = bodyTemplate.concat(template);

        templateMobile = `
            <div class="col-12 col-lg-6 col-xxl-4">
                <div class="result_box_wrapper">
                    <div class="result_location_mobile_wrapper">
                        <div class="header_location_mobile">Location</div>
                        <div class="result_location_mobile">${currentVal.name}</div>
                    </div>
                    <div class="result_action_mobile">
                        <button class="result_edit_location_mobile" data-lname="${currentVal.name}" data-value="${currentVal.id}" data-bs-toggle="modal" data-bs-target="#resultEditLocationModal"><i class="fa-solid fa-pencil"></i></button>
                        <button class="result_delete_location_mobile" data-lname="${currentVal.name}" data-value="${currentVal.id}" data-bs-toggle="modal" data-bs-target="#resultDeleteLocationModal"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>
            </div>
        `;

        bodyTemplateMobile = bodyTemplateMobile.concat(templateMobile);

    });

    mainTemplate = `
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="result_total">${inputData.data.length} result(s) found</div>
                    <div class="result_header_wrapper_location">
                        <div class="header_location">Location</div>
                        <div class="header_action">Action</div>
                    </div>
                    ${bodyTemplate}
                </div>
            </div>
        </div>
    `;

    mainTemplateMobile = `
        <div class="container-fluid">
            <div class="row">
                <div class="result_total">${inputData.data.length} result(s) found</div>
                ${bodyTemplateMobile}
            </div>
        </div>
    `;

    
    $('.main_locations_wrapper').append(mainTemplate);

    
    $('.main_locations_wrapper_mobile').append(mainTemplateMobile);
}
/***************************************************************************/


async function deleteUser(inputObj){
    let res = await phpRequest("deleteUser", inputObj);
    return res;
}

async function updateUser(inputObj){
    let res = await phpRequest("updateUser", inputObj);
    return res;
}

async function updateDepartment(inputObj){
    let res = await phpRequest("updateDepartment", inputObj);
    return res;
}

async function updateLocation(inputObj){
    let res = await phpRequest("updateLocation", inputObj);
    return res;
}

async function deleteLocation(inputObj){
    let res = await phpRequest("deleteLocation", inputObj);
    return res;
}

async function insertLocation(inputObj){
    let res = await phpRequest("insertLocation", inputObj);
    return res;
}

async function deleteDepartment(inputObj){
    let res = await phpRequest("deleteDepartment", inputObj);
    return res;
}

async function insertDepartment(inputObj){
    let res = await phpRequest("insertDepartment", inputObj);
    return res;
}

async function insertUser(inputObj){
    let res = await phpRequest("insertUser", inputObj);
    return res;
}

async function getDepartments(join = 0, order = 'asc', single = 0, departmentID = null){
    let res = await phpRequest("getAllDepartments", {join: join, order: order, single: single, departmentID: departmentID});
    return res;
}

async function getLocations(order = 'asc', single = 0, locationID = null){
    let res = await phpRequest("getAllLocation", {order: order, single: single, locationID: locationID});
    return res;
}

async function getCustomLocations(inputObj){
    let res = await phpRequest("getCustomLocation", inputObj);
    return res;
}

async function getSearch(order, orderBy, searchString){
    order = order.toUpperCase();
    let res = await phpRequest("getSearch", {order: order, orderBy: orderBy, searchString: searchString});
    return res;
}

async function getFilterSearch(inputObj){
    let res = await phpRequest("getFilterSearch", inputObj);
    return res;
}

async function defaultGetAllEmployee(order = 'asc', orderBy = 'firstName', single = 0, userID = null){
    order = order.toUpperCase();
    let res = await phpRequest("getAllEmployee", {order: order, orderBy: orderBy, single: single, userID: userID});
    return res;
}

/*****************************************************************************/

(async function(){

    $('.filter_button').addClass('hide');

    let allEmployeeResult = await defaultGetAllEmployee();
    let departments = await getDepartments();
    let locations = await getLocations();

    userTableBuilder(allEmployeeResult);


    populateSelect(departments, 'department_select_mobile', 'department');
    populateSelect(locations, 'location_select_mobile', 'location');

    populateSelect(allEmployeeResult, '', 'personnel');
    
    historyMessage(`Web application succesfully opened`,'history_wrapper', 'green');
})();

$(document).ready(function () {

    let myToastEl = document.querySelector('.toast');
    let myToast = new bootstrap.Toast(myToastEl, {autohide: true, delay: 2000});

    let userButton = document.querySelector('.pills_users');
    let userTab = new bootstrap.Tab(userButton);

    let departmentButton = document.querySelector('.pills_departments');
    let departmentTab = new bootstrap.Tab(departmentButton);

    let locationButton = document.querySelector('.pills_locations');
    let locationTab = new bootstrap.Tab(locationButton);

    

/****************************************************************************************************/
/************************************************* CHANGE BOX ***************************************/
/****************************************************************************************************/


    $('.header_select').on('change', async function(e){
        let result, dataObj = {};
        let selectedValue = $(this).children("option:selected").val();
        let ascendingButtonValue = $('.sort_box_button').attr('data-selected-value');
        $(this).attr('data-selected-value', selectedValue);

        switch($('.header_select').attr('data-source')){
            case 'main_search':
                result = await getSearch(ascendingButtonValue, selectedValue, $('.header_search').attr('data-searched-value'));
                $('.main_user_wrapper').empty();
                $('.main_user_wrapper_mobile').empty();
                userTableBuilder(result);
                userTab.show();
                break;
            case 'filter_search':

                dataObj['order'] = ascendingButtonValue;
                dataObj['orderBy'] = selectedValue;

                if($('#name_checkbox').is(":checked")){
                    if($('.name_input').attr('data-searched-value') !== ''){
                        dataObj['firstName'] = $('.name_input').attr('data-searched-value');
                    }
                }

                if($('#surname_checkbox').is(":checked")){
                    if($('.surname_input').attr('data-searched-value') !== ''){
                        dataObj['lastName'] = $('.surname_input').attr('data-searched-value');
                    }
                }

                if($('#email_checkbox').is(":checked")){
                    if($('.email_input').attr('data-searched-value') !== ''){
                        dataObj['email'] = $('.email_input').attr('data-searched-value');
                    }
                }

                if($('#department_checkbox').is(":checked")){
                    if($('#department_select').attr('data-selected-value') !== ''){
                        dataObj['department'] = $('#department_select').attr('data-selected-value');
                    }
                }

                if($('#location_checkbox').is(":checked")){
                    if($('#location_select').attr('data-selected-value') !== ''){
                        dataObj['location'] = $('#location_select').attr('data-selected-value');
                    }
                }

                
                result = await getFilterSearch(dataObj);
                $('.main_user_wrapper').empty();
                $('.main_user_wrapper_mobile').empty();
                userTableBuilder(result);
                userTab.show();
                break;
            case 'filter_search_mobile':

                dataObj['order'] = ascendingButtonValue;
                dataObj['orderBy'] = selectedValue;

                if($('#name_checkbox_mobile').is(":checked")){
                    if($('.name_input_mobile').attr('data-searched-value') !== ''){
                        dataObj['firstName'] = $('.name_input_mobile').attr('data-searched-value');
                    }
                }

                if($('#surname_checkbox_mobile').is(":checked")){
                    if($('.surname_input_mobile').attr('data-searched-value') !== ''){
                        dataObj['lastName'] = $('.surname_input_mobile').attr('data-searched-value');
                    }
                }

                if($('#email_checkbox_mobile').is(":checked")){
                    if($('.email_input_mobile').attr('data-searched-value') !== ''){
                        dataObj['email'] = $('.email_input_mobile').attr('data-searched-value');
                    }
                }

                if($('#department_checkbox_mobile').is(":checked")){
                    if($('#department_select_mobile').attr('data-selected-value') !== ''){
                        dataObj['department'] = $('#department_select_mobile').attr('data-selected-value');
                    }
                }

                if($('#location_checkbox_mobile').is(":checked")){
                    if($('#location_select_mobile').attr('data-selected-value') !== ''){
                        dataObj['location'] = $('#location_select_mobile').attr('data-selected-value');
                    }
                }

                
                result = await getFilterSearch(dataObj);
                $('.main_user_wrapper').empty();
                $('.main_user_wrapper_mobile').empty();
                userTableBuilder(result);
                userTab.show();
                break;
            case 'get_department_button':
                break;
            case 'get_location_button':
                break;
            default:
                result = await defaultGetAllEmployee(ascendingButtonValue, selectedValue);
                $('.main_user_wrapper').empty();
                $('.main_user_wrapper_mobile').empty();
                userTableBuilder(result);
                userTab.show();
        }
    });

/****************************************************************************************************/
/************************************************* SORT BOX *****************************************/
/****************************************************************************************************/


    $('.sort_box_button').on('click', async function(){

        let result;
        let dataObj = {};

        if($(this).children('i').hasClass("fa-arrow-up-a-z")){
            $(this).attr('data-selected-value', 'asc');
            $(this).children('i').removeClass("fa-arrow-up-a-z");
            $(this).children('i').addClass("fa-arrow-down-a-z");
        }else{
            $(this).attr('data-selected-value', 'desc');
            $(this).children('i').removeClass("fa-arrow-down-a-z");
            $(this).children('i').addClass("fa-arrow-up-a-z");
        }

        let selectedValue = $('.header_select').attr('data-selected-value');
        let ascendingButtonValue = $(this).attr('data-selected-value');

        switch($('.sort_box_button').attr('data-source')){
            case 'main_search':
                result = await getSearch(ascendingButtonValue, selectedValue, $('.header_search').attr('data-searched-value'));
                $('.main_user_wrapper').empty();
                $('.main_user_wrapper_mobile').empty();
                userTableBuilder(result);
                userTab.show();
                break;
            case 'filter_search':
            
                dataObj['order'] = ascendingButtonValue;
                dataObj['orderBy'] = selectedValue;

                if($('#name_checkbox').is(":checked")){
                    if($('.name_input').attr('data-searched-value') !== ''){
                        dataObj['firstName'] = $('.name_input').attr('data-searched-value');
                    }
                }

                if($('#surname_checkbox').is(":checked")){
                    if($('.surname_input').attr('data-searched-value') !== ''){
                        dataObj['lastName'] = $('.surname_input').attr('data-searched-value');
                    }
                }

                if($('#email_checkbox').is(":checked")){
                    if($('.email_input').attr('data-searched-value') !== ''){
                        dataObj['email'] = $('.email_input').attr('data-searched-value');
                    }
                }

                if($('#department_checkbox').is(":checked")){
                    if($('#department_select').attr('data-selected-value') !== ''){
                        dataObj['department'] = $('#department_select').attr('data-selected-value');
                    }
                }

                if($('#location_checkbox').is(":checked")){
                    if($('#location_select').attr('data-selected-value') !== ''){
                        dataObj['location'] = $('#location_select').attr('data-selected-value');
                    }
                }

                
                result = await getFilterSearch(dataObj);
                $('.main_user_wrapper').empty();
                $('.main_user_wrapper_mobile').empty();
                userTableBuilder(result);
                userTab.show();
                break;
            case 'filter_search_mobile':
            
                dataObj['order'] = ascendingButtonValue;
                dataObj['orderBy'] = selectedValue;

                if($('#name_checkbox_mobile').is(":checked")){
                    if($('.name_input_mobile').attr('data-searched-value') !== ''){
                        dataObj['firstName'] = $('.name_input_mobile').attr('data-searched-value');
                    }
                }

                if($('#surname_checkbox_mobile').is(":checked")){
                    if($('.surname_input_mobile').attr('data-searched-value') !== ''){
                        dataObj['lastName'] = $('.surname_input_mobile').attr('data-searched-value');
                    }
                }

                if($('#email_checkbox_mobile').is(":checked")){
                    if($('.email_input_mobile').attr('data-searched-value') !== ''){
                        dataObj['email'] = $('.email_input_mobile').attr('data-searched-value');
                    }
                }

                if($('#department_checkbox_mobile').is(":checked")){
                    if($('#department_select_mobile').attr('data-selected-value') !== ''){
                        dataObj['department'] = $('#department_select_mobile').attr('data-selected-value');
                    }
                }

                if($('#location_checkbox_mobile').is(":checked")){
                    if($('#location_select_mobile').attr('data-selected-value') !== ''){
                        dataObj['location'] = $('#location_select_mobile').attr('data-selected-value');
                    }
                }

                result = await getFilterSearch(dataObj);
                $('.main_user_wrapper').empty();
                $('.main_user_wrapper_mobile').empty();
                userTableBuilder(result);
                userTab.show();
                break;
            case 'get_department_button':
                result = await getDepartments(1, ascendingButtonValue);
                $('.main_departments_wrapper').empty();
                $('.main_departments_wrapper_mobile').empty();
                departmentTableBuilder(result);
                break;
            case 'get_location_button':
                result = await getLocations(ascendingButtonValue);
                $('.main_locations_wrapper').empty();
                $('.main_locations_wrapper_mobile').empty();
                locationTableBuilder(result);
                break;
            default:
                result = await defaultGetAllEmployee(ascendingButtonValue, selectedValue);
                $('.main_user_wrapper').empty();
                $('.main_user_wrapper_mobile').empty();
                userTableBuilder(result);
                userTab.show();
        }
        
    });

/****************************************************************************************************/
/************************************************* SEARCH BOX ***************************************/
/****************************************************************************************************/

    $('.header_search').on('keypress', function(e){
        if(e.key === 'Enter'){
            e.preventDefault();
            $('.search_box_button').trigger('click');
        }
    });

    $('.search_box_button').on('click', async function(e){
        let ascendingButtonValue = $('.sort_box_button').attr('data-selected-value');
        let selectedValue = $('.header_select').attr('data-selected-value');
        let searchString = $('.header_search').val();
        $('.header_search').attr('data-searched-value', searchString);

        $('.sort_box_button').attr('data-source', 'main_search');
        $('.header_select').attr('data-source', 'main_search');

        if(searchString === ''){
            return;
        }

        let result = await getSearch(ascendingButtonValue, selectedValue, searchString);

        $('.main_user_wrapper').empty();
        $('.main_user_wrapper_mobile').empty();
        userTableBuilder(result);
        userTab.show();
    });

    $('.refresh_button').on('click', async function(e){
        let ascendingButtonValue = $('.sort_box_button').attr('data-selected-value');
        let selectedValue = $('.header_select').attr('data-selected-value');
        let result = await defaultGetAllEmployee(ascendingButtonValue, selectedValue);
        $('.sort_box_button').attr('data-source', '');
        $('.header_select').attr('data-source', '');

        $('.header_search').attr('data-searched-value', '');
        $('.header_search').val('');
        $('.main_user_wrapper').empty();
        $('.main_user_wrapper_mobile').empty();
        userTableBuilder(result);
        userTab.show();
    });



/****************************************************************************************************/
/****************************************************************************************************/
/****************************************************************************************************/
/************************************************* FILTER BOX ***************************************/

    $('.filters_body_mobile :checkbox').on('change',function(){

        let i = 0;

        for(const key in $('.filters_body_mobile :checkbox')){
            if($('.filters_body_mobile :checkbox')[key].checked === true){
                i++;
            }
        }

        $('.filter_button').attr('data-after', i);

        if(i == 0){
            $('.apply_button_mobile').prop('disabled', true);
            $('.filter_button').addClass('hide');
        }else{
            $('.apply_button_mobile').prop('disabled', false);
            $('.filter_button').removeClass('hide');
        }

        if($(this)[0].checked === true){
            $(this).parents('.filters_item_mobile').find('.setdata_mobile').css('display', 'block');
            $(this).parents('.filters_item_mobile').find('input[type="text"]').prop('required',true);
            $(this).parents('.filters_item_mobile').find('input[type="email"]').prop('required',true);
        }else{
            $(this).parents('.filters_item_mobile').find('.setdata_mobile').css('display', 'none');
            $(this).parents('.filters_item_mobile').find('input[type="text"]').prop('required',false);
            $(this).parents('.filters_item_mobile').find('input[type="email"]').prop('required',false);
        }
    });

    $('.clear_button_mobile').on('click', function(){
        $.makeArray($('.filters_body_mobile :checkbox')).forEach(function(v, i, a){
            if(v.checked === true){
                $(v).trigger('click');
            }
        });
    });

    $('#filterButtonModal').on('show.bs.modal', async function(e){
        let departments = await getDepartments();
        let locations = await getLocations();

        populateSelect(departments, 'department_select_mobile', 'department');
        populateSelect(locations, 'location_select_mobile', 'location');
    });


    /*************************************** NAME ROW *****************************************/

    
    $('.name_input_mobile').on('keyup', async function(e){
        if(e.keyCode === 13){
            e.preventDefault();
            $(this).attr('data-searched-value', $(this).val());
            $('.apply_button_mobile').trigger('click');
            //$('#filterMobileModal .btn-close').trigger('click');
        }
    });

    $('.name_input_mobile').on('blur', function(e){
        $('.name_input_mobile').attr('data-searched-value', $('.name_input_mobile').val());
    });

    $('#name_checkbox_mobile').on('change', function(){
        $('.name_input_mobile').attr('data-searched-value', '');
        $('.name_input_mobile').val('');
    });

    $('.name_button_mobile').on('click', async function(e){
        $('.apply_button_mobile').trigger('click');
    });
    /*************************************** SURNAME ROW *****************************************/

    $('.surname_input_mobile').on('keypress', function(e){
        if(e.keyCode === 13){
            e.preventDefault();
            $(this).attr('data-searched-value', $(this).val());
            $('.apply_button_mobile').trigger('click');
        }
    });

    $('.surname_input_mobile').on('blur', function(e){
        $('.surname_input_mobile').attr('data-searched-value', $('.surname_input_mobile').val());
    });

    $('#surname_checkbox_mobile').on('change', function(){
        $('.surname_input_mobile').attr('data-searched-value', '');
        $('.surname_input_mobile').val('');
    });

    $('.surname_button_mobile').on('click', async function(e){
        $('.apply_button_mobile').trigger('click');
    });

    /*************************************** JOB TITLE ROW *****************************************/

    $('.jobtitle_input_mobile').on('keypress', function(e){
        if(e.keyCode === 13){
            e.preventDefault();
            $(this).attr('data-searched-value', $(this).val());
            $('.apply_button_mobile').trigger('click');
        }
    });

    $('.jobtitle_input_mobile').on('blur', function(e){
        $('.jobtitle_input_mobile').attr('data-searched-value', $('.jobtitle_input_mobile').val());
    });

    $('#jobtitle_checkbox_mobile').on('change', function(){
        $('.jobtitle_input_mobile').attr('data-searched-value', '');
        $('.jobtitle_input_mobile').val('');
    });

    $('.jobtitle_button_mobile').on('click', async function(e){
        $('.apply_button_mobile').trigger('click');
    });

    /*************************************** EMAIL ROW *****************************************/

    $('.email_input_mobile').on('keypress', function(e){
        if(e.keyCode === 13){
            e.preventDefault();
            $(this).attr('data-searched-value', $(this).val());
            $('.apply_button_mobile').trigger('click');
        }
    });

    $('.email_input_mobile').on('blur', function(e){
        $('.email_input_mobile').attr('data-searched-value', $('.email_input_mobile').val());
    });

    $('#email_checkbox_mobile').on('change', function(){
        $('.email_input_mobile').attr('data-searched-value', '');
        $('.email_input_mobile').val('');
    });

    $('.email_button_mobile').on('click', async function(e){
        $('.apply_button_mobile').trigger('click');
    });


    /*************************************** DEPARTMENT ROW *****************************************/

    $('#department_select_mobile').on('change', async function(e){
        let departmentValue = $(this).children("option:selected").val();
        $(this).attr('data-selected-value', departmentValue);

        $('.apply_button_mobile').trigger('click');
    });

    /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ LOCATION ROW @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

    $('#location_select_mobile').on('change', async function(e){
        let locationValue = $(this).children("option:selected").val();
        $(this).attr('data-selected-value', locationValue);

        $('.apply_button_mobile').trigger('click');
    });

    /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ APPLY BUTTON @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/


    $('#filterMobileModal').on('submit', async function(e){
        e.preventDefault();
        let dataObj = {};
        let ascendingButtonValue = $('.sort_box_button').attr('data-selected-value');
        let selectedValue = $('.header_select').attr('data-selected-value');

        $('.sort_box_button').attr('data-source', 'filter_search_mobile');
        $('.header_select').attr('data-source', 'filter_search_mobile');

        
        dataObj['order'] = ascendingButtonValue;
        dataObj['orderBy'] = selectedValue;


        if($('#name_checkbox_mobile').is(":checked")){
            if($('.name_input_mobile').attr('data-searched-value') !== ''){
                dataObj['firstName'] = $('.name_input_mobile').attr('data-searched-value');
            } 
        }

        if($('#surname_checkbox_mobile').is(":checked")){
            if($('.surname_input_mobile').attr('data-searched-value') !== ''){
                dataObj['lastName'] = $('.surname_input_mobile').attr('data-searched-value');
            }
        }

        if($('#jobtitle_checkbox_mobile').is(":checked")){
            if($('.jobtitle_input_mobile').attr('data-searched-value') !== ''){
                dataObj['jobTitle'] = $('.jobtitle_input_mobile').attr('data-searched-value');
            }
        }

        if($('#email_checkbox_mobile').is(":checked")){
            if($('.email_input_mobile').attr('data-searched-value') !== ''){
                dataObj['email'] = $('.email_input_mobile').attr('data-searched-value');
            }
        }

        if($('#department_checkbox_mobile').is(":checked")){
            if($('#department_select_mobile').attr('data-selected-value') !== ''){
                dataObj['department'] = $('#department_select_mobile').attr('data-selected-value');
            }
        }

        if($('#location_checkbox_mobile').is(":checked")){
            if($('#location_select_mobile').attr('data-selected-value') !== ''){
                dataObj['location'] = $('#location_select_mobile').attr('data-selected-value');
            }
        }

        
        let result = await getFilterSearch(dataObj);

        $('.main_user_wrapper').empty();
        $('.main_user_wrapper_mobile').empty();
        userTableBuilder(result);
        userTab.show();
    });
/*===================================================================================================*/
/*=================================== ACTIONS BOX ===================================================*/
/*===================================================================================================*/

/*--------------------------------------------------------------------------------------------------- */
/*---------------------------------------------- USERS GET USERS -------------------------------------*/
/*--------------------------------------------------------------------------------------------------- */

    $('.add_user_mobile').on('click', async function(){
        $('#add_user_name_input').attr('data-value', '');
        $('#add_user_name_input').val('');

        $('#add_user_surname_input').attr('data-value', '');
        $('#add_user_surname_input').val('');

        $('#add_user_jobtitle_input').attr('data-value', '');
        $('#add_user_jobtitle_input').val('');

        $('#add_user_email_input').attr('data-value', '');
        $('#add_user_email_input').val('');

        let departments = await getDepartments();
        populateSelect(departments, 'add_user_department_select', 'department');
    });

    $('.pills_users').on('click', async function(e){
        let ascendingButtonValue = $('.sort_box_button').attr('data-selected-value');
        let selectedValue = $('.header_select').attr('data-selected-value');
        let result = await defaultGetAllEmployee(ascendingButtonValue, selectedValue);

        $('.sort_box_button').attr('data-source', '');
        $('.header_select').attr('data-source', '');

        $('.header_search').attr('data-searched-value', '');
        $('.header_search').val('');

        $('.main_user_wrapper').empty();
        $('.main_user_wrapper_mobile').empty();
        userTableBuilder(result);
    });





    $('#add_user_name_input').on('blur', function(){
        $(this).attr('data-value', $(this).val());
    });

    $('#add_user_surname_input').on('blur', function(){
        $(this).attr('data-value', $(this).val());
    });

    $('#add_user_jobtitle_input').on('blur', function(){
        $(this).attr('data-value', $(this).val());
    });

    $('#add_user_email_input').on('blur', function(){
        $(this).attr('data-value', $(this).val());
    });



    $(document).on('change', '.add_user_department_select', async function(){
        $(this).attr('data-selected-value', $(this).val());
        $(this).attr('data-selected-id', $(this).find(":selected").attr('data-id'));
    });



    $('#addUserForm').on('submit', async function(e){
        e.preventDefault();
        let dataObj = {};

        dataObj['firstName'] = $('#add_user_name_input').attr('data-value');
        dataObj['lastName'] = $('#add_user_surname_input').attr('data-value');
        dataObj['jobTitle'] = $('#add_user_jobtitle_input').attr('data-value');
        dataObj['email'] = $('#add_user_email_input').attr('data-value');
        dataObj['departmentID'] = $('#add_user_department_select').attr('data-selected-id');

        let result = await insertUser(dataObj);

        $('.btn-close').trigger('click');

        if(result.status.code === '200'){
            $('.toast-body').html(`User ${dataObj['firstName']} ${dataObj['lastName']} succesfully created.`);
            $('.toast').css('background-color', '#279f13');
            historyMessage(`User ${dataObj['firstName']} ${dataObj['lastName']} succesfully created.`,'history_wrapper', 'green');
            myToast.show();
        }else{
            $('.toast-body').html(`User ${dataObj['firstName']} ${dataObj['lastName']} failed to create.`);
            $('.toast').css('background-color', 'ce1a1a');
            historyMessage(`User ${dataObj['firstName']} ${dataObj['lastName']} failed to create.`,'history_wrapper');
            myToast.show();
            return;
        }

        $('.pills_users').trigger('click');//show.bs.tab

        userTab.show();
    });

/*--------------------------------------------------------------------------------------------------- */
/*---------------------------------------------- DEPARTMENT ------------------------------------------*/
/*--------------------------------------------------------------------------------------------------- */

    $('.add_department_mobile').on('click', async function(){
        let add_new_location = await getLocations();
        populateSelect(add_new_location, 'add_new_location_select', 'location');
        $('.add_new_department_input').attr('data-value', '');
        $('.add_new_department_input').val('');
    });

    $('.pills_departments').on('click', async function(e){
        let ascendingButtonValue = $('.sort_box_button').attr('data-selected-value');
        $('.sort_box_button').attr('data-source', 'get_department_button');
        $('.header_select').attr('data-source', 'get_department_button');
        let result = await getDepartments(1, ascendingButtonValue);

        $('.main_departments_wrapper').empty();
        $('.main_departments_wrapper_mobile').empty();
        departmentTableBuilder(result);
    });

    $('.add_new_department_input').on('blur', function(){
        $(this).attr('data-value', $(this).val());
    });

    $(document).on('change', '.add_new_location_select', function(){
        $(this).attr('data-selected-value', $(this).val());
        $(this).attr('data-selected-id', $(this).find(':selected').attr('data-id'));
    });



    $('#addDepartmentForm').on('submit', async function(e){
        e.preventDefault();
        let dataObj = {};

        dataObj['departmentName'] = $('.add_new_department_input').attr('data-value');

        dataObj['locationID'] = $('.add_new_location_select').attr('data-selected-id');
        dataObj['locationName'] = $('.add_new_location_select').attr('data-selected-value');

        let result = await insertDepartment(dataObj);
        $('.btn-close').trigger('click');
        if(result.status.code === '302'){
            $('.toast-body').html(result.status.message);
            $('.toast').css('background-color', '#ce1a1a');
            historyMessage(`Failed to add new department, with message: "<span style="color: black">${result.status.message}</span>"`,'history_wrapper');
        }

        if(result.status.code === '200'){
            $('.toast-body').html(result.status.message);
            $('.toast').css('background-color', '#279f13');
            historyMessage(`Department added succesfull, with message: "<span style="color: black">${result.status.message}</span>"`,'history_wrapper', 'green');
        }
        
        myToast.show();

        $('.pills_departments').trigger('click');

        departmentTab.show();
    });

/*--------------------------------------------------------------------------------------------------- */
/*---------------------------------------------- LOCATION --------------------------------------------*/
/*--------------------------------------------------------------------------------------------------- */

    $('.add_location_mobile').on('click', async function(){
        $('.location_add_new_location_input').attr('data-value', '');
        $('.location_add_new_location_input').val('');
    });

    $('.pills_locations').on('click', async function(){
        let ascendingButtonValue = $('.sort_box_button').attr('data-selected-value');
        $('.sort_box_button').attr('data-source', 'get_location_button');
        $('.header_select').attr('data-source', 'get_location_button');
        let result = await getLocations(ascendingButtonValue);


        $('.main_locations_wrapper').empty();
        $('.main_locations_wrapper_mobile').empty();
        locationTableBuilder(result);
    });

    $('.location_add_new_location_input').on('blur', function(){
        $(this).attr('data-value', $(this).val());
    }); 

    
    $('#addLocationForm').on('submit', async function(e){
        e.preventDefault();
        let dataObj = {};

        dataObj['locationName'] = $('.location_add_new_location_input').attr('data-value');

        let result = await insertLocation(dataObj);

        $('.btn-close').trigger('click');
        if(result.status.code === '302'){
            $('.toast-body').html(result.status.message);
            $('.toast').css('background-color', '#ce1a1a');
            historyMessage(`Failed to add new location with message: "<span style="color: black">${result.status.message}<span>"`,'history_wrapper');
        }

        if(result.status.code === '200'){
            $('.toast-body').html(result.status.message);
            $('.toast').css('background-color', '#279f13');
            historyMessage(`New ${capitalize(dataObj['locationName'])} location added`,'history_wrapper', 'green');
        }

        myToast.show();

        $('.pills_locations').trigger('click');//show.bs.tab

        locationTab.show();
    });

/*===================================================================================================*/
/*===================================================================================================*/
/*===================================================================================================*/


/*===================================================================================================*/
/*=================================== RESULT ACTION START ===========================================*/
/*===================================================================================================*/


/******************************************************************************************************/
/************************************* USER EDIT SECTION **********************************************/
/******************************************************************************************************/

    $(document).on('change', '.result_edit_user_department_select', async function(){
        $(this).attr('data-selected-value', $(this).val());
        $(this).attr('data-selected-id', $(this).find(':selected').attr('data-id'));
    });


    $('#result_edit_user_name_input').on('blur', function(){
        $(this).attr('data-value', $(this).val());
    });

    $('#result_edit_user_surname_input').on('blur', function(){
        $(this).attr('data-value', $(this).val());
    });

    $('#result_edit_user_jobtitle_input').on('blur', function(){
        $(this).attr('data-value', $(this).val());
    });

    $('#result_edit_user_email_input').on('blur', function(){
        $(this).attr('data-value', $(this).val());
    });

    $('#resultEditUserModal').on('show.bs.modal', async function(e){
        $(this).find('input[type="hidden"]').attr('data-id', $(e.relatedTarget).attr('data-value'));

        let userID = $(e.relatedTarget).attr('data-value');
        let resultEmployee = await defaultGetAllEmployee('asc', 'firstName', 1, userID);

        $('#result_edit_user_name_input').val(`${resultEmployee.data[0].firstName}`);
        $('#result_edit_user_name_input').attr('data-value', resultEmployee.data[0].firstName);

        $('#result_edit_user_surname_input').val(`${resultEmployee.data[0].lastName}`);
        $('#result_edit_user_surname_input').attr('data-value', resultEmployee.data[0].lastName);

        $('#result_edit_user_jobtitle_input').val(`${resultEmployee.data[0].jobTitle}`);
        $('#result_edit_user_jobtitle_input').attr('data-value', resultEmployee.data[0].jobTitle);

        $('#result_edit_user_email_input').val(`${resultEmployee.data[0].email}`);
        $('#result_edit_user_email_input').attr('data-value', resultEmployee.data[0].email);

        let resultDepartment = await getDepartments();
        populateSelect(resultDepartment, 'result_edit_user_department_select', 'department');

        $('.result_edit_user_department_select option').each(function(i, elem){
            if(parseInt($(elem).attr('data-id')) === parseInt(resultEmployee.data[0].departmentID)){
                $('.result_edit_user_department_select')[0].options[$(elem).attr('data-index')].selected = true;
                $('.result_edit_user_department_select').trigger('change');
            }
        });
    });

    $('#editUserForm').on('submit', async function(e){
        e.preventDefault();
        let dataObj = {};

        dataObj['firstName'] = $('#result_edit_user_name_input').attr('data-value');
        dataObj['lastName'] = $('#result_edit_user_surname_input').attr('data-value');
        dataObj['jobTitle'] = $('#result_edit_user_jobtitle_input').attr('data-value');
        dataObj['email'] = $('#result_edit_user_email_input').attr('data-value');
        dataObj['departmentID'] = $('.result_edit_user_department_select').attr('data-selected-id');
        dataObj['id'] = $(this).find('input[type="hidden"]').attr('data-id');

        let result = await updateUser(dataObj);


        $('.btn-close').trigger('click');

        if(result.status.code === '200'){
            $('.toast-body').html(result.status.message);
            $('.toast').css('background-color', '#279f13');
            historyMessage(`${result.status.message}`,'history_wrapper', 'green');
        }
        
        myToast.show();
        $('.pills_users').trigger('click');
        userTab.show();
    });

/******************************************************************************************************/
/******************************************************************************************************/
/******************************************************************************************************/

/******************************************************************************************************/
/************************************* USER DELETE SECTION **********************************************/
/******************************************************************************************************/

    $('#resultDeleteUserModal').on('show.bs.modal', async function(e){
        $('.result_delete_user_save_button').attr('data-value', $(e.relatedTarget).attr('data-value'));
        let userID = $(e.relatedTarget).attr('data-value');

        let user = await defaultGetAllEmployee('asc','firstName',1 ,userID);

        $('.result_delete_user_item').empty();
        $('.result_delete_user_item').append(`You are about to delete user: `);
        $('.result_delete_user_item').append(`${user.data[0].firstName} ${user.data[0].lastName}</br>`);
        $('.result_delete_user_item').append(`Operation is not reversible!`);

        $('.result_delete_user_save_button').attr('data-firstName', user.data[0].firstName);
        $('.result_delete_user_save_button').attr('data-lastName', user.data[0].lastName);
    });

    $('.result_delete_user_save_button').on('click', async function(){
        let dataObj = {};
        dataObj['id'] = $('.result_delete_user_save_button').attr('data-value');
        let result = await deleteUser(dataObj);

        $('.btn-close').trigger('click');

        if(result.status.code === '200'){
            $('.toast-body').html(`${$(this).attr('data-firstName')} ${$(this).attr('data-lastName')} succesfully deleted`);
            $('.toast').css('background-color', '#279f13');
            historyMessage(`${$(this).attr('data-firstName')} ${$(this).attr('data-lastName')} succesfully deleted`,'history_wrapper', 'green');
            myToast.show();
        }

        $('.pills_users').trigger('click');
        userTab.show();
    });

/******************************************************************************************************/
/******************************************************************************************************/
/******************************************************************************************************/

/******************************************************************************************************/
/************************************* DEPARTMENT EDIT SECTION ****************************************/
/******************************************************************************************************/
    
    $('#result_edit_department_department_input').on('blur', function(){
        $(this).attr('data-value', $(this).val());
    });

    $(document).on('change', '.result_edit_department_location_select', function(){
        $(this).attr('data-selected-value', $(this).val());
        $(this).attr('data-selected-id', $(this).find(':selected').attr('data-id'));
    });

    $('#resultEditDepartmentModal').on('show.bs.modal', async function(e){
        $(this).find('input[type="hidden"]').attr('data-id', $(e.relatedTarget).attr('data-value'));

        let departmentID = $(e.relatedTarget).attr('data-value');
        let resultDepartment = await getDepartments(0, 'asc', 1, departmentID);

        $('#result_edit_department_department_input').val(`${resultDepartment.data[0].departmentName}`);
        $('#result_edit_department_department_input').attr('data-value', resultDepartment.data[0].departmentName);

        let add_new_location = await getLocations();
        populateSelect(add_new_location, 'result_edit_department_location_select', 'location');

        $('.result_edit_department_location_select option').each(function(i, elem){
            if(parseInt($(elem).attr('data-id')) === parseInt(resultDepartment.data[0].locationID)){
                $('.result_edit_department_location_select')[0].options[$(elem).attr('data-index')].selected = true;
                $('.result_edit_department_location_select').trigger('change');
            }
        });
    });

    $('#editDepartmentForm').on('submit', async function(e){
        e.preventDefault();
        let dataObj = {};

        dataObj['departmentName'] = $('#result_edit_department_department_input').attr('data-value');
        dataObj['locationID'] = $('#result_edit_department_location_select').attr('data-selected-id');

        dataObj['departmentID'] = $(this).find('input[type="hidden"]').attr('data-id');


        let result = await updateDepartment(dataObj);

        $('.btn-close').trigger('click');

        if(result.status.code === '302'){
            $('.toast-body').html(result.status.message);
            $('.toast').css('background-color', '#ce1a1a');
            historyMessage(`Failed to update, with message: "<span style="color: black">${result.status.message}</span>"`,'history_wrapper');
            myToast.show();
            return;
        }
        
        

        if(result.status.code === '200'){
            $('.toast-body').html(result.status.message);
            $('.toast').css('background-color', '#279f13');
            historyMessage(`Update succeed, with message: "<span style="color: black">${result.status.message}</span>"`,'history_wrapper', 'green');
        }
        
        myToast.show();
        $('.pills_departments').trigger('click');
        departmentTab.show();
    });



/******************************************************************************************************/
/******************************************************************************************************/
/******************************************************************************************************/

/******************************************************************************************************/
/************************************* DEPARTMENT DELETE SECTION **************************************/
/******************************************************************************************************/

    $('#resultDeleteDepartmentModal').on('show.bs.modal', async function(e){
        let dataObj = {};
        $(this).find('input[type="hidden"]').attr('data-id', $(e.relatedTarget).attr('data-value'));
        $(this).find('input[type="hidden"]').attr('data-name', $(e.relatedTarget).attr('data-name'));
        let departmentID = $(e.relatedTarget).attr('data-value');
        let departmentName = $(e.relatedTarget).attr('data-name');
        dataObj['count'] = 1;
        dataObj['departmentID'] = departmentID;

        let result = await deleteDepartment(dataObj);

        if(result.status.code === '302'){
            $('.result_delete_department_item').empty();
            $('.result_delete_department_item').append(`You cannot remove the entry for <b>${departmentName}</b> because it has <b>${result.status.count}</b> employees assigned to it.`);
            $('#deleteDepartmentForm .modal-footer').empty();
            $('#deleteDepartmentForm .modal-footer').append(`<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">OK</button>`);
        }else{
            $('.result_delete_department_item').empty();
            $('.result_delete_department_item').append(`Are you sure that you want to remove the entry for <b>${departmentName}</b>?`);
            $('#deleteDepartmentForm .modal-footer').empty();
            $('#deleteDepartmentForm .modal-footer').append(`<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>`);
            $('#deleteDepartmentForm .modal-footer').append(`<button type="submit" class="btn btn-primary">Yes</button>`);
        }
    });

    $('#deleteDepartmentForm').on('submit', async function(e){
        e.preventDefault();
        let dataObj = {};
        dataObj['count'] = 0;
        dataObj['departmentID'] = $(this).find('input[type="hidden"]').attr('data-id');
        dataObj['departmentName'] = $(this).find('input[type="hidden"]').attr('data-name');
        let result = await deleteDepartment(dataObj);

        $('.btn-close').trigger('click');


        if(result.status.code === '200'){
            $('.toast-body').html(`Department ${dataObj['departmentName']} succesfully deleted`);
            $('.toast').css('background-color', '#279f13');
            historyMessage(`Delete operation succeed, with message: "<span style="color: black">${result.status.message}</span>"`,'history_wrapper', 'green');
            myToast.show();
        }

        $('.pills_departments').trigger('click');
        departmentTab.show();
    });



/******************************************************************************************************/
/******************************************************************************************************/
/******************************************************************************************************/

/******************************************************************************************************/
/************************************* LOCATION EDIT SECTION ******************************************/
/******************************************************************************************************/

    $('#result_edit_location_location_input').on('blur', function(){
        $(this).attr('data-value', $(this).val());
    });

    $('#resultEditLocationModal').on('show.bs.modal', async function(e){
        $(this).find('input[type="hidden"]').attr('data-id', $(e.relatedTarget).attr('data-value'));
        $(this).find('input[type="hidden"]').attr('data-lname', $(e.relatedTarget).attr('data-lname'));

        let locationID = $(e.relatedTarget).attr('data-value');
        let resultLocation = await getLocations('asc', 1, locationID);


        $('#result_edit_location_location_input').val(`${resultLocation.data[0].name}`);
        $('#result_edit_location_location_input').attr('data-value', resultLocation.data[0].name);
    });

    $('#editLocationForm').on('submit', async function(e){
        e.preventDefault();
        let dataObj = {};

        dataObj['locationName'] = $('#result_edit_location_location_input').attr('data-value');
        dataObj['locationID'] = $(this).find('input[type="hidden"]').attr('data-id');;

        let result = await updateLocation(dataObj);

        $('.btn-close').trigger('click');

        if(result.status.code === '302'){
            $('.toast-body').html(result.status.message);
            $('.toast').css('background-color', '#ce1a1a');
            historyMessage(`Failed to update, with message: "<span style="color: black">${result.status.message}</span>"`,'history_wrapper');
            myToast.show();
            return;
        }
        
        if(result.status.code === '200'){
            $('.toast-body').html(result.status.message);
            $('.toast').css('background-color', '#279f13');
            historyMessage(`Update succeed, with message: "<span style="color: black">${result.status.message}</span>"`,'history_wrapper', 'green');
        }
        
        myToast.show();
        $('.pills_locations').trigger('click');
        locationTab.show();
    });

/******************************************************************************************************/
/******************************************************************************************************/
/******************************************************************************************************/

/******************************************************************************************************/
/************************************* LOCATION DELETE SECTION ****************************************/
/******************************************************************************************************/

    $('#resultDeleteLocationModal').on('show.bs.modal', async function(e){
        let dataObj = {};
        $(this).find('input[type="hidden"]').attr('data-id', $(e.relatedTarget).attr('data-value'));
        $(this).find('input[type="hidden"]').attr('data-lname', $(e.relatedTarget).attr('data-lname'));
        let locationID = $(e.relatedTarget).attr('data-value');
        let locationName = $(e.relatedTarget).attr('data-lname');
        dataObj['count'] = 1;
        dataObj['locationID'] = locationID;

        let result = await deleteLocation(dataObj);

        if(result.status.code === '302'){
            $('.result_delete_location_item').empty();
            $('.result_delete_location_item').append(`You cannot remove the entry for <b>${locationName}</b> because it has <b>${result.status.count}</b> departments assigned to it.`);
            $('#deleteLocationForm .modal-footer').empty();
            $('#deleteLocationForm .modal-footer').append(`<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">OK</button>`);
        }else{
            $('.result_delete_location_item').empty();
            $('.result_delete_location_item').append(`Are you sure that you want to remove the entry for <b>${locationName}</b>?`);
            $('#deleteLocationForm .modal-footer').empty();
            $('#deleteLocationForm .modal-footer').append(`<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>`);
            $('#deleteLocationForm .modal-footer').append(`<button type="submit" class="btn btn-primary">Yes</button>`);
        }
    });

    $('#deleteLocationForm').on('submit', async function(e){
        e.preventDefault();
        let dataObj = {};
        dataObj['count'] = 0;
        dataObj['locationID'] = $(this).find('input[type="hidden"]').attr('data-id');
        dataObj['locationName'] = $(this).find('input[type="hidden"]').attr('data-lname');

        let result = await deleteLocation(dataObj);

        $('.btn-close').trigger('click');


        if(result.status.code === '200'){
            $('.toast-body').html(`Location ${dataObj['locationName']} succesfully deleted`);
            $('.toast').css('background-color', '#279f13');
            historyMessage(`Delete operation succeed, with message: "<span style="color: black">${result.status.message}</span>"`,'history_wrapper', 'green');
            myToast.show();
        }

        $('.pills_locations').trigger('click');
        locationTab.show();
    });


/******************************************************************************************************/
/******************************************************************************************************/
/******************************************************************************************************/

/*===================================================================================================*/
/*=================================== RESULT ACTION END =============================================*/
/*===================================================================================================*/
});