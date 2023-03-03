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

function selectChanger(keepClicked = true, selective = false, className = ''){

    let selects;

    if(selective){
        selects = document.querySelectorAll(`.${className}`);
    }else{
        selects = document.getElementsByTagName('select');
    }

    
    if (selects.length > 0) {
        selects_init();
    }


    function selects_init() {
        for (let index = 0; index < selects.length; index++) {
            const select = selects[index];
            select_init(select);
        }
        document.addEventListener('click', function (e) {
            selects_close(e);
        });
        document.addEventListener('keydown', function (e) {
            if (e.which == 27) {
                selects_close(e);
            }
        });
    }


    function selects_close(e) {
        const selects = document.querySelectorAll('.select');
        if (!e.target.closest('.select')) {
            for (let index = 0; index < selects.length; index++) {
                const select = selects[index];
                const select_body_options = select.querySelector('.select__options');
                select.classList.remove('_active');
                _slideUp(select_body_options, 0);
            }
        }
    }


    function select_init(select) {
        const select_parent = select.parentElement;
        const select_modifikator = select.getAttribute('class');
        select.style.display = 'none';

        select_parent.insertAdjacentHTML('beforeend', `<div class="select select_${select_modifikator}"></div>`);

        let new_select = select.parentElement.querySelector('.select');
        new_select.appendChild(select);
        select_item(select);
    }

    function select_item(select) {
        const select_parent = select.parentElement;
        const select_options = select.querySelectorAll('option');
        
        const select_selected_option = select.querySelector('option:checked');
        const select_selected_text = select_selected_option.text;

        let template = `
            <div class="select__item">
                <div class="select__title">
                    <div class="select__value">
                        <span>${select_selected_text}</span>
                    </div>
                </div>
                <div class="select__options" tabindex=0>
                        ${select_get_options(select_options)}
                </div>
            </div>
        `;

        select_parent.insertAdjacentHTML('beforeend', template);

        select_actions(select, select_parent);
    }

    function select_get_options(select_options) {
        if (select_options) {
            let select_options_content = '';
            for (let index = 0; index < select_options.length; index++) {
                const select_option = select_options[index];
                const select_option_value = select_option.value;
                if (select_option_value != '') {
                    const select_option_text = select_option.text;
                    select_options_content += `<div data-index="${index}" data-value="${select_option_value}" class="select__option">${select_option_text}</div>`;
                }
            }
            return select_options_content;
        }
    }

    function select_actions(original, select) {
        const select_item = select.querySelector('.select__item');
        const select_body_options = select.querySelector('.select__options');
        const select_options = select.querySelectorAll('.select__option');

        

        select_item.addEventListener('click', function () {
            let selects = document.querySelectorAll('.select');
            for (let index = 0; index < selects.length; index++) {
                const select = selects[index];
                const select_body_options = select.querySelector('.select__options');
                if (select != select_item.closest('.select')) {
                    select.classList.remove('_active');
                    _slideUp(select_body_options);
                }
            }
            _slideToggle(select_body_options);
            select.classList.toggle('_active');
        });

        for (let index = 0; index < select_options.length; index++) {
            const select_option = select_options[index];
            
            select_option.addEventListener('click', function(e) {
                e.stopPropagation();

                if(!keepClicked){
                    let selectOptions = select.querySelectorAll('.select__option');

                    for (let id = 0; id < selectOptions.length; id++) {
                        const el = selectOptions[id];
                        if(el.dataset.value === 'default'){
                            el.remove();
                            continue;
                        }
                        el.style.display = 'block';
                    }
                    this.style.display = 'none';
                }

                select.querySelector('.select__value').innerHTML = '<span>' + this.innerHTML + '</span>';
                

                _slideToggle(select_body_options);
                select.classList.toggle('_active');

                original.options[this.dataset.index].selected = true;
                $(original).trigger('change');
            });
        }
    }

    let _slideUp = (target) => {
        target.style.display = 'none';
    }


    let _slideDown = (target) => {
        let display = window.getComputedStyle(target).display;
        if(display === 'none'){
            display = 'block';
        }
        target.style.display = display;
    }


    let _slideToggle = (target) => {
        if (window.getComputedStyle(target).display === 'none') {
            _slideDown(target);
        } else {
            _slideUp(target);
        }
    }
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
                    <button class="result_delete_department" data-value="${currentVal.departmentID}" data-bs-toggle="modal" data-bs-target="#resultDeleteDepartmentModal"><i class="fa-solid fa-trash-can"></i></button>
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
                        <button class="result_delete_department_mobile" data-value="${currentVal.departmentID}" data-bs-toggle="modal" data-bs-target="#resultDeleteDepartmentModal"><i class="fa-solid fa-trash-can"></i></button>
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
                    <button class="result_edit_location" data-value="${currentVal.id}" data-bs-toggle="modal" data-bs-target="#resultEditLocationModal"><i class="fa-solid fa-pencil"></i></button>
                    <button class="result_delete_location" data-value="${currentVal.id}" data-bs-toggle="modal" data-bs-target="#resultDeleteLocationModal"><i class="fa-solid fa-trash-can"></i></button>
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
                        <button class="result_edit_location_mobile" data-value="${currentVal.id}" data-bs-toggle="modal" data-bs-target="#resultEditLocationModal"><i class="fa-solid fa-pencil"></i></button>
                        <button class="result_delete_location_mobile" data-value="${currentVal.id}" data-bs-toggle="modal" data-bs-target="#resultDeleteLocationModal"><i class="fa-solid fa-trash-can"></i></button>
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
        }else{
            $(this).parents('.filters_item_mobile').find('.setdata_mobile').css('display', 'none');
        }
    });


    /*************************************** NAME ROW *****************************************/


    $('.name_input_mobile').on('keypress', function(e){
        if(e.key === 'Enter'){
            e.preventDefault();
            $('.name_button_mobile').trigger('click');
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
        let dataObj = {};
        let ascendingButtonValue = $('.sort_box_button').attr('data-selected-value');
        let selectedValue = $('.header_select').attr('data-selected-value');
        let searchString = $('.name_input_mobile').val();
        $('.name_input_mobile').attr('data-searched-value', searchString);

        $('.sort_box_button').attr('data-source', 'filter_search_mobile');
        $('.header_select').attr('data-source', 'filter_search_mobile');

        dataObj['firstName'] = searchString;
        dataObj['order'] = ascendingButtonValue;
        dataObj['orderBy'] = selectedValue;

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

        
        let result = await getFilterSearch(dataObj);

        $('.main_user_wrapper').empty();
        $('.main_user_wrapper_mobile').empty();
        userTableBuilder(result);
        userTab.show();
    });
    /*************************************** SURNAME ROW *****************************************/

    $('.surname_input_mobile').on('keypress', function(e){
        if(e.key === 'Enter'){
            e.preventDefault();
            $('.surname_button_mobile').trigger('click');
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
        let dataObj = {};
        let ascendingButtonValue = $('.sort_box_button').attr('data-selected-value');
        let selectedValue = $('.header_select').attr('data-selected-value');
        let searchString = $('.surname_input_mobile').val();
        $('.surname_input_mobile').attr('data-searched-value', searchString);

        $('.sort_box_button').attr('data-source', 'filter_search_mobile');
        $('.header_select').attr('data-source', 'filter_search_mobile');

        dataObj['lastName'] = searchString;
        dataObj['order'] = ascendingButtonValue;
        dataObj['orderBy'] = selectedValue;

        if($('#name_checkbox_mobile').is(":checked")){
            if($('.name_input_mobile').attr('data-searched-value') !== ''){
                dataObj['firstName'] = $('.name_input_mobile').attr('data-searched-value');
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

    /*************************************** EMAIL ROW *****************************************/

    $('.email_input_mobile').on('keypress', function(e){
        if(e.key === 'Enter'){
            e.preventDefault();
            $('.email_button_mobile').trigger('click');
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
        let dataObj = {};
        let ascendingButtonValue = $('.sort_box_button').attr('data-selected-value');
        let selectedValue = $('.header_select').attr('data-selected-value');
        let searchString = $('.email_input_mobile').val();
        $('.email_input_mobile').attr('data-searched-value', searchString);

        $('.sort_box_button').attr('data-source', 'filter_search_mobile');
        $('.header_select').attr('data-source', 'filter_search_mobile');

        dataObj['email'] = searchString;
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


    /*************************************** DEPARTMENT ROW *****************************************/

    $('#department_select_mobile').on('change', async function(e){
        let dataObj = {};
        let ascendingButtonValue = $('.sort_box_button').attr('data-selected-value');
        let selectedValue = $('.header_select').attr('data-selected-value');
        let departmentValue = $(this).children("option:selected").val();
        $(this).attr('data-selected-value', departmentValue);

        $('.sort_box_button').attr('data-source', 'filter_search_mobile');
        $('.header_select').attr('data-source', 'filter_search_mobile');

        dataObj['department'] = departmentValue;
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

    /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ LOCATION ROW @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

    $('#location_select_mobile').on('change', async function(e){
        let dataObj = {};
        let ascendingButtonValue = $('.sort_box_button').attr('data-selected-value');
        let selectedValue = $('.header_select').attr('data-selected-value');
        let locationValue = $(this).children("option:selected").val();
        $(this).attr('data-selected-value', locationValue);

        $('.sort_box_button').attr('data-source', 'filter_search_mobile');
        $('.header_select').attr('data-source', 'filter_search_mobile');

        dataObj['location'] = locationValue;
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


        
        let result = await getFilterSearch(dataObj);

        $('.main_user_wrapper').empty();
        $('.main_user_wrapper_mobile').empty();
        userTableBuilder(result);
        userTab.show();
    });

    /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ APPLY BUTTON @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/


    $('.apply_button_mobile').on('click', async function(){
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

        $('#add_user_email_input').attr('data-value', '');
        $('#add_user_email_input').val('');

        let departments = await getDepartments();
        populateSelect(departments, 'add_user_department_select', 'department');
    });

    $('.pills_users').on('show.bs.tab', async function(e){
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

        $('.pills_users').trigger('show.bs.tab');

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

    $('.pills_departments').on('show.bs.tab', async function(e){
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

        $('.pills_departments').trigger('show.bs.tab');

        departmentTab.show();
    });

/*--------------------------------------------------------------------------------------------------- */
/*---------------------------------------------- LOCATION --------------------------------------------*/
/*--------------------------------------------------------------------------------------------------- */

    $('.add_location_mobile').on('click', async function(){
        $('.location_add_new_location_input').attr('data-value', '');
        $('.location_add_new_location_input').val('');
    });

    $('.pills_locations').on('show.bs.tab', async function(){
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

        $('.pills_locations').trigger('show.bs.tab');

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
        $('.pills_users').trigger('show.bs.tab');
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

        $('.pills_users').trigger('show.bs.tab');
        userTab.show();
    });

/******************************************************************************************************/
/******************************************************************************************************/
/******************************************************************************************************/

/******************************************************************************************************/
/************************************* DEPARTMENT EDIT SECTION ****************************************/
/******************************************************************************************************/
    $(document).on('change', '.result_edit_department_location_select', async function(){
        $(this).attr('data-selected-value', $(this).val());
        $(this).attr('data-selected-index', $(this).find(':selected').attr('data-index'));
        $(this).attr('data-selected-id', $(this).find(':selected').attr('data-id'));
    });

    $('#result_edit_department_department_input').on('blur', function(){
        $(this).attr('data-value', $(this).val());
    });

    $('#resultEditDepartmentModal').on('show.bs.modal', async function(e){
        $(this).find('input[type="hidden"]').attr('data-id', $(e.relatedTarget).attr('data-value'));

        let departmentID = $(e.relatedTarget).attr('data-value');
        let resultDepartment = await getDepartments(0, 'asc', 1, departmentID);

        $('#result_edit_department_department_input').val(`${resultDepartment.data[0].departmentName}`);
        $('#result_edit_department_department_input').attr('data-value', resultDepartment.data[0].departmentName);

        let locations = await getLocations();
        populateSelect(locations, 'result_edit_department_location_select', 'location');

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

        dataObj['locationID'] = $('.result_edit_department_location_select').attr('data-selected-id');
        dataObj['locationName'] = $('.result_edit_department_location_select').attr('data-selected-value');

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
        $('.pills_departments').trigger('show.bs.tab');
        departmentTab.show();
    });



/******************************************************************************************************/
/******************************************************************************************************/
/******************************************************************************************************/

/******************************************************************************************************/
/************************************* DEPARTMENT DELETE SECTION **************************************/
/******************************************************************************************************/

    $(document).on('click', '.result_delete_department, .result_delete_department_mobile', async function(){
        $('.result_delete_department_save_button').attr('data-value', $(this).attr('data-value'));
        let departmentID = $(this).attr('data-value');

        let department = await getDepartments(0, 'asc', 1, departmentID);

        $('.result_delete_department_item').empty();
        $('.result_delete_department_item').append(`You are about to delete department `);
        $('.result_delete_department_item').append(`${department.data[0].departmentName} from ${department.data[0].locationName} location</br>`);
        $('.result_delete_department_item').append(`Operation is not reversible!`);

        

        $('.result_delete_department_save_button').attr('data-departmentName', department.data[0].departmentName);
        $('.result_delete_department_save_button').attr('data-locationName', department.data[0].locationName);
    });

    $('.result_delete_department_save_button').on('click', async function(){
        let dataObj = {};
        dataObj['departmentID'] = $('.result_delete_department_save_button').attr('data-value');
        dataObj['departmentName'] = $('.result_delete_department_save_button').attr('data-departmentName');
        dataObj['locationName'] = $('.result_delete_department_save_button').attr('data-locationName');
        let result = await deleteDepartment(dataObj);

        $('.btn-close').trigger('click');



        if(result.status.code === '302'){
            $('.toast-body').html(`Department ${$(this).attr('data-departmentName')} from  ${$(this).attr('data-locationName')} location can not be deleted, there is a reference to it in main table`);
            $('.toast').css('background-color', '#ce1a1a');
            historyMessage(`Failed to delete department ${$(this).attr('data-departmentName')} with message: "<span style="color: black">${result.status.message}</span>"`,'history_wrapper');
            myToast.show();
            return;
        }


        if(result.status.code === '200'){
            $('.toast-body').html(`Department ${$(this).attr('data-departmentName')} from ${$(this).attr('data-locationName')} succesfully deleted`);
            $('.toast').css('background-color', '#279f13');
            historyMessage(`Delete operation succeed, with message: "<span style="color: black">${result.status.message}</span>"`,'history_wrapper', 'green');
            myToast.show();
        }

        $('.get_department_button').trigger('click');


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

    $('#result_edit_location_location_input').on('keyup', function(){
        $(this).css('box-shadow', 'none');
        $(this).css('border-color', 'black');
    });

    $(document).on('click', '.result_edit_location, .result_edit_location_mobile', async function(){
        $('#result_edit_location_location_input').css('box-shadow', 'none');
        $('#result_edit_location_location_input').css('border-color', 'black');


        let locationID = $(this).attr('data-value');
        let resultLocation = await getLocations('asc', 1, locationID);


        $('#result_edit_location_location_input').val(`${resultLocation.data[0].name}`);
        $('#result_edit_location_location_input').attr('data-value', resultLocation.data[0].name);


        $('.result_edit_location_save_button').attr('data-value', $(this).attr('data-value'));
    });

    $('.result_edit_location_save_button').on('click', async function(){
        let dataObj = {}, textHash = '', checkHash;


        if($('#result_edit_location_location_input').attr('data-value') !== ''){
            dataObj['locationName'] = $('#result_edit_location_location_input').attr('data-value');
        }else{
            $('#result_edit_location_location_input').css('box-shadow', '0 0 6px 1px red');
            $('#result_edit_location_location_input').css('border-color', 'red');
        }


        dataObj['locationID'] = $(this).attr('data-value');

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
        $('.get_location_button').trigger('click');

    });

/******************************************************************************************************/
/******************************************************************************************************/
/******************************************************************************************************/

/******************************************************************************************************/
/************************************* LOCATION DELETE SECTION ****************************************/
/******************************************************************************************************/

    $(document).on('click', '.result_delete_location, .result_delete_location_mobile', async function(){
        $('.result_delete_location_save_button').attr('data-value', $(this).attr('data-value'));
        let locationID = $(this).attr('data-value');

        let location = await getLocations('asc', 1, locationID);


        $('.result_delete_location_item').empty();
        $('.result_delete_location_item').append(`You are about to delete location `);
        $('.result_delete_location_item').append(`${location.data[0].name}</br>`);
        $('.result_delete_location_item').append(`Operation is not reversible!`);

        $('.result_delete_location_save_button').attr('data-locationName', location.data[0].name);
    });

    $('.result_delete_location_save_button').on('click', async function(){
        let dataObj = {};
        dataObj['locationID'] = $('.result_delete_location_save_button').attr('data-value');
        dataObj['locationName'] = $('.result_delete_location_save_button').attr('data-locationName');

        let result = await deleteLocation(dataObj);

        $('.btn-close').trigger('click');



        if(result.status.code === '302'){
            $('.toast-body').html(`Location ${$(this).attr('data-locationName')} can not be deleted, there is a reference to it in main table`);
            $('.toast').css('background-color', '#ce1a1a');
            historyMessage(`Failed to delete location ${$(this).attr('data-locationName')} with message: "<span style="color: black">${result.status.message}</span>"`,'history_wrapper');
            myToast.show();
            return;
        }


        if(result.status.code === '200'){
            $('.toast-body').html(`Location ${$(this).attr('data-locationName')} succesfully deleted`);
            $('.toast').css('background-color', '#279f13');
            historyMessage(`Delete operation succeed, with message: "<span style="color: black">${result.status.message}</span>"`,'history_wrapper', 'green');
            myToast.show();
        }

        $('.get_location_button').trigger('click');


    });


/******************************************************************************************************/
/******************************************************************************************************/
/******************************************************************************************************/

/*===================================================================================================*/
/*=================================== RESULT ACTION END =============================================*/
/*===================================================================================================*/
});