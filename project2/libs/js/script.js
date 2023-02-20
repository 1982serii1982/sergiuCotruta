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
            let dataObj = {}, string = '', indexes = [];
            inputData.data.forEach(function(v, i, a){
                if(string !== v.name){
                    indexes = [v.id, v.locationID];
                    dataObj[v.name] = [];
                    dataObj[v.name].push(indexes);
                }else{
                    indexes = [v.id, v.locationID];
                    dataObj[v.name].push(indexes);
                }
                string = v.name;
            });



            let j = 0;
            for(let key in dataObj){
                let str = '';
                dataObj[key].forEach(function(v, i, a){
                    str += `${v[0]} ${v[1]}:`;
                });

                str = str.slice(0, str.length-1);

                // let string = '2 9';
                // let arr = string.split(":");
                // console.log(arr);

                if(j == 0){
                    $(`.${className}`).append(`<option value="${key.toLowerCase()}" data-bind="${str}" data-index="${j}" selected>${key}</option>`);
                    $(`.${className}`).attr('data-selected-value', `${key.toLowerCase()}`);
                }else{
                    $(`.${className}`).append(`<option value="${key.toLowerCase()}" data-bind="${str}" data-index="${j}">${key}</option>`);
                }
                j++;
            }

            break;

        case 'location':
            inputData.data.forEach(function(v, i, a){
                if(i == 0){
                    $(`.${className}`).append(`<option data-index="${v.id}" value="${v.name.toLowerCase()}" selected>${v.name}</option>`);
                    $(`.${className}`).attr('data-selected-value', `${v.name.toLowerCase()}`);
                    $(`.${className}`).attr('data-selected-index', `${v.id}`);
                }else{
                    $(`.${className}`).append(`<option data-index="${v.id}" value="${v.name.toLowerCase()}">${v.name}</option>`);
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

function tableBuilder(inputData, orderBy = 'firstName'){
    let char = '',
        mainTemplate, mainTemplateMobile,
        headerTemplate,
        template,templateMobile,
        result = '',resultMobile = '',
        bodyTemplate = '', bodyTemplateMobile = '';

    inputData.data.forEach(function(currentVal, index, array){

        if(currentVal[orderBy].charAt(0).toUpperCase() !== char){
            if(index !== 0){
                mainTemplate = `
                    ${headerTemplate}
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-12">
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
                    ${headerTemplate}
                    <div class="container-fluid">
                        <div class="row">
                            ${bodyTemplateMobile}
                        </div>
                    </div>
                `;

                result = result.concat(mainTemplate);
                bodyTemplate = '';

                resultMobile = resultMobile.concat(mainTemplateMobile);
                bodyTemplateMobile = '';
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

        if(index === array.length-1){
            mainTemplate = `
                ${headerTemplate}
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-12">
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
            result = result.concat(mainTemplate);

            mainTemplateMobile = `
                ${headerTemplate}
                <div class="container-fluid">
                    <div class="row">
                        ${bodyTemplateMobile}
                    </div>
                </div>
            `;
            resultMobile = resultMobile.concat(mainTemplateMobile);
        }
    });

    $('.main_wrapper').append(`<div class="result_total">${inputData.data.length} result(s) found</div>`);
    $('.main_wrapper').append(result);

    $('.main_wrapper_mobile').append(`<div class="result_total">${inputData.data.length} result(s) found</div>`);
    $('.main_wrapper_mobile').append(resultMobile);
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

async function getDepartments(){
    let res = await phpRequest("getAllDepartments");
    return res;
}

async function getLocations(){
    let res = await phpRequest("getAllLocation");
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
    tableBuilder(allEmployeeResult);


    populateSelect(departments, 'department_select', 'department');
    populateSelect(departments, 'department_select_mobile', 'department');

    populateSelect(locations, 'location_select', 'location');
    populateSelect(locations, 'location_select_mobile', 'location');

    populateSelect(allEmployeeResult, '', 'personnel');
    selectChanger(true, true, 'header_select');

    selectChanger(true, true, 'department_select');
    selectChanger(true, true, 'department_select_mobile');

    selectChanger(true, true, 'location_select');
    selectChanger(true, true, 'location_select_mobile');

    
    
    historyMessage(`Web application succesfully opened`,'history_wrapper', 'green');
})();

$(document).ready(function () {

    let myToastEl = document.querySelector('.toast');
    let myToast = new bootstrap.Toast(myToastEl, {autohide: true, delay: 2000});

    

/****************************************************************************************************/
/************************************************* CHANGE BOX ***************************************/
/****************************************************************************************************/


    $('.header_select').on('change', async function(e){
        let result;
        let selectedValue = $(this).children("option:selected").val();
        let ascendingButtonValue = $('.sort_box_button').attr('data-selected-value');
        $(this).attr('data-selected-value', selectedValue);

        if($('.header_select').attr('data-source') === 'main_search'){
            result = await getSearch(ascendingButtonValue, selectedValue, $('.header_search').attr('data-searched-value'));
        }else if($('.header_select').attr('data-source') === 'filter_search'){
            let dataObj = {};

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

        }else if($('.header_select').attr('data-source') === 'filter_search_mobile'){
            let dataObj = {};

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
        }else{
            result = await defaultGetAllEmployee(ascendingButtonValue, selectedValue);
        }

        $('.main_wrapper').empty();
        $('.main_wrapper_mobile').empty();
        tableBuilder(result, selectedValue);
    });

/****************************************************************************************************/
/************************************************* SORT BOX *****************************************/
/****************************************************************************************************/


    $('.sort_box_button').on('click', async function(){

        let result;

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

        if($('.sort_box_button').attr('data-source') === 'main_search'){
            result = await getSearch(ascendingButtonValue, selectedValue, $('.header_search').attr('data-searched-value'));
        }else if($('.sort_box_button').attr('data-source') === 'filter_search'){
            let dataObj = {};
            
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

        }else if($('.sort_box_button').attr('data-source') === 'filter_search_mobile'){
            let dataObj = {};
            
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
        }else{
            result = await defaultGetAllEmployee(ascendingButtonValue, selectedValue);
        }

        
        $('.main_wrapper').empty();
        $('.main_wrapper_mobile').empty();
        tableBuilder(result, selectedValue);
        
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

        $('.main_wrapper').empty();
        $('.main_wrapper_mobile').empty();
        tableBuilder(result, selectedValue);
    });

    $('.refresh_button').on('click', async function(e){
        let ascendingButtonValue = $('.sort_box_button').attr('data-selected-value');
        let selectedValue = $('.header_select').attr('data-selected-value');
        let result = await defaultGetAllEmployee(ascendingButtonValue, selectedValue);
        $('.sort_box_button').attr('data-source', '');
        $('.header_select').attr('data-source', '');

        $('.header_search').attr('data-searched-value', '');
        $('.header_search').val('');
        $('.main_wrapper').empty();
        $('.main_wrapper_mobile').empty();
        tableBuilder(result,selectedValue);
    });

    $('.filter_button').on('click', function(){
        
    });

    $('.history_button_mobile').on('click', function(){
        $('.history_button').trigger('click');
    });






    $('.add_user_mobile').on('click', function(){
        $('.add_user_button').trigger('click');
    });

    $('.add_department_mobile').on('click', function(){
        $('.add_department_button').trigger('click');
    });

    $('.add_location_mobile').on('click', function(){
        $('.add_location_button').trigger('click');
    });


/****************************************************************************************************/
/************************************************* FILTER BOX ***************************************/
/****************************************************************************************************/

/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
/**************************************** DESKTOP VERSION ********************************************/
/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
    $('.filters_body :checkbox').on('change',function(){

        let i = 0;

        for(const key in $('.filters_body :checkbox')){
            if($('.filters_body :checkbox')[key].checked === true){
                i++;
            }
        }

        if(i == 0){
            $('.apply_button').prop('disabled', true);
        }else{
            $('.apply_button').prop('disabled', false);
        }

        if($(this)[0].checked === true){
            $(this).parents('.filters_item').find('.setdata').css('display', 'block');
        }else{
            $(this).parents('.filters_item').find('.setdata').css('display', 'none');
        }
    });

/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
/**************************************** MOBILE VERSION ********************************************/
/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

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

    /*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
    /**************************************** DESKTOP VERSION *********************************/
    /*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/


    $('.name_input').on('keypress', function(e){
        if(e.key === 'Enter'){
            e.preventDefault();
            $('.name_button').trigger('click');
        }
    });

    $('.name_input').on('blur', function(e){
        $('.name_input').attr('data-searched-value', $('.name_input').val());
    });

    $('#name_checkbox').on('change', function(){
        $('.name_input').attr('data-searched-value', '');
        $('.name_input').val('');
    });

    $('.name_button').on('click', async function(e){
        let dataObj = {};
        let ascendingButtonValue = $('.sort_box_button').attr('data-selected-value');
        let selectedValue = $('.header_select').attr('data-selected-value');
        let searchString = $('.name_input').val();
        $('.name_input').attr('data-searched-value', searchString);

        $('.sort_box_button').attr('data-source', 'filter_search');
        $('.header_select').attr('data-source', 'filter_search');

        dataObj['firstName'] = searchString;
        dataObj['order'] = ascendingButtonValue;
        dataObj['orderBy'] = selectedValue;

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

        
        let result = await getFilterSearch(dataObj);

        $('.main_wrapper').empty();
        $('.main_wrapper_mobile').empty();
        tableBuilder(result, selectedValue);
    });

    /*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
    /**************************************** MOBILE VERSION *************************************/
    /*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/


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

        $('.main_wrapper').empty();
        $('.main_wrapper_mobile').empty();
        tableBuilder(result, selectedValue);
    });
    /*************************************** SURNAME ROW *****************************************/

    /*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
    /**************************************** DESKTOP VERSION *********************************/
    /*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

    
    $('.surname_input').on('keypress', function(e){
        if(e.key === 'Enter'){
            e.preventDefault();
            $('.surname_button').trigger('click');
        }
    });

    $('.surname_input').on('blur', function(e){
        $('.surname_input').attr('data-searched-value', $('.surname_input').val());
    });

    $('#surname_checkbox').on('change', function(){
        $('.surname_input').attr('data-searched-value', '');
        $('.surname_input').val('');
    });

    $('.surname_button').on('click', async function(e){
        let dataObj = {};
        let ascendingButtonValue = $('.sort_box_button').attr('data-selected-value');
        let selectedValue = $('.header_select').attr('data-selected-value');
        let searchString = $('.surname_input').val();
        $('.surname_input').attr('data-searched-value', searchString);

        $('.sort_box_button').attr('data-source', 'filter_search');
        $('.header_select').attr('data-source', 'filter_search');

        dataObj['lastName'] = searchString;
        dataObj['order'] = ascendingButtonValue;
        dataObj['orderBy'] = selectedValue;

        if($('#name_checkbox').is(":checked")){
            //console.log('name is checked');
            if($('.name_input').attr('data-searched-value') !== ''){
                //console.log($('.name_input').attr('data-searched-value'));
                dataObj['firstName'] = $('.name_input').attr('data-searched-value');
            } 
        }

        if($('#email_checkbox').is(":checked")){
            //console.log('email is checked');
            if($('.email_input').attr('data-searched-value') !== ''){
                //console.log($('.email_input').attr('data-searched-value'));
                dataObj['email'] = $('.email_input').attr('data-searched-value');
            }
        }

        if($('#department_checkbox').is(":checked")){
            //console.log('department is checked');
            if($('#department_select').attr('data-selected-value') !== ''){
                //console.log($('#department_select').attr('data-selected-value'));
                dataObj['department'] = $('#department_select').attr('data-selected-value');
            }
        }

        if($('#location_checkbox').is(":checked")){
            //console.log('location is checked');
            if($('#location_select').attr('data-selected-value') !== ''){
                //console.log($('#location_select').attr('data-selected-value'));
                dataObj['location'] = $('#location_select').attr('data-selected-value');
            }
        }


        
        let result = await getFilterSearch(dataObj);

        $('.main_wrapper').empty();
        $('.main_wrapper_mobile').empty();
        tableBuilder(result, selectedValue);
    });

    /*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
    /**************************************** MOBILE VERSION *************************************/
    /*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

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

        $('.main_wrapper').empty();
        $('.main_wrapper_mobile').empty();
        tableBuilder(result, selectedValue);
    });

    /*************************************** EMAIL ROW *****************************************/

    /*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
    /**************************************** DESKTOP VERSION *********************************/
    /*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/


    $('.email_input').on('keypress', function(e){
        if(e.key === 'Enter'){
            e.preventDefault();
            $('.email_button').trigger('click');
        }
    });

    $('.email_input').on('blur', function(e){
        $('.email_input').attr('data-searched-value', $('.email_input').val());
    });

    $('#email_checkbox').on('change', function(){
        $('.email_input').attr('data-searched-value', '');
        $('.email_input').val('');
    });

    $('.email_button').on('click', async function(e){
        let dataObj = {};
        let ascendingButtonValue = $('.sort_box_button').attr('data-selected-value');
        let selectedValue = $('.header_select').attr('data-selected-value');
        let searchString = $('.email_input').val();
        $('.email_input').attr('data-searched-value', searchString);

        $('.sort_box_button').attr('data-source', 'filter_search');
        $('.header_select').attr('data-source', 'filter_search');

        dataObj['email'] = searchString;
        dataObj['order'] = ascendingButtonValue;
        dataObj['orderBy'] = selectedValue;

        if($('#name_checkbox').is(":checked")){
            //console.log('name is checked');
            if($('.name_input').attr('data-searched-value') !== ''){
                //console.log($('.name_input').attr('data-searched-value'));
                dataObj['firstName'] = $('.name_input').attr('data-searched-value');
            } 
        }

        if($('#surname_checkbox').is(":checked")){
            //console.log('surname is checked');
            if($('.surname_input').attr('data-searched-value') !== ''){
                //console.log($('.surname_input').attr('data-searched-value'));
                dataObj['lastName'] = $('.surname_input').attr('data-searched-value');
            }
        }

        if($('#department_checkbox').is(":checked")){
            //console.log('department is checked');
            if($('#department_select').attr('data-selected-value') !== ''){
                //console.log($('#department_select').attr('data-selected-value'));
                dataObj['department'] = $('#department_select').attr('data-selected-value');
            }
        }

        if($('#location_checkbox').is(":checked")){
            //console.log('location is checked');
            if($('#location_select').attr('data-selected-value') !== ''){
                //console.log($('#location_select').attr('data-selected-value'));
                dataObj['location'] = $('#location_select').attr('data-selected-value');
            }
        }


        
        let result = await getFilterSearch(dataObj);

        $('.main_wrapper').empty();
        $('.main_wrapper_mobile').empty();
        tableBuilder(result, selectedValue);
    });

    /*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
    /**************************************** MOBILE VERSION *************************************/
    /*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

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

        $('.main_wrapper').empty();
        $('.main_wrapper_mobile').empty();
        tableBuilder(result, selectedValue);
    });


    /*************************************** DEPARTMENT ROW *****************************************/

    /*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
    /**************************************** DESKTOP VERSION *********************************/
    /*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

    
    $('#department_select').on('change', async function(e){
        let dataObj = {};
        let ascendingButtonValue = $('.sort_box_button').attr('data-selected-value');
        let selectedValue = $('.header_select').attr('data-selected-value');
        let departmentValue = $(this).children("option:selected").val();
        $(this).attr('data-selected-value', departmentValue);

        $('.sort_box_button').attr('data-source', 'filter_search');
        $('.header_select').attr('data-source', 'filter_search');

        dataObj['department'] = departmentValue;
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

        if($('#location_checkbox').is(":checked")){
            if($('#location_select').attr('data-selected-value') !== ''){
                dataObj['location'] = $('#location_select').attr('data-selected-value');
            }
        }

        
        let result = await getFilterSearch(dataObj);

        $('.main_wrapper').empty();
        $('.main_wrapper_mobile').empty();
        tableBuilder(result, selectedValue);
    });

    /*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
    /**************************************** MOBILE VERSION *************************************/
    /*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

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

        $('.main_wrapper').empty();
        $('.main_wrapper_mobile').empty();
        tableBuilder(result, selectedValue);
    });

    /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ LOCATION ROW @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

    /*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
    /**************************************** DESKTOP VERSION *********************************/
    /*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/


    $('#location_select').on('change', async function(e){
        let dataObj = {};
        let ascendingButtonValue = $('.sort_box_button').attr('data-selected-value');
        let selectedValue = $('.header_select').attr('data-selected-value');
        let locationValue = $(this).children("option:selected").val();
        $(this).attr('data-selected-value', locationValue);

        $('.sort_box_button').attr('data-source', 'filter_search');
        $('.header_select').attr('data-source', 'filter_search');

        dataObj['location'] = locationValue;
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


        
        let result = await getFilterSearch(dataObj);

        $('.main_wrapper').empty();
        $('.main_wrapper_mobile').empty();
        tableBuilder(result, selectedValue);
    });

    /*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
    /**************************************** MOBILE VERSION *************************************/
    /*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

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

        $('.main_wrapper').empty();
        $('.main_wrapper_mobile').empty();
        tableBuilder(result, selectedValue);
    });

    /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ APPLY BUTTON @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

    /*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
    /**************************************** DESKTOP VERSION ************************************/
    /*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/


    $('.apply_button').on('click', async function(){
        let dataObj = {};
        let ascendingButtonValue = $('.sort_box_button').attr('data-selected-value');
        let selectedValue = $('.header_select').attr('data-selected-value');

        $('.sort_box_button').attr('data-source', 'filter_search');
        $('.header_select').attr('data-source', 'filter_search');

        
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


        
        let result = await getFilterSearch(dataObj);

        $('.main_wrapper').empty();
        $('.main_wrapper_mobile').empty();
        tableBuilder(result, selectedValue);
    });

    /*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
    /**************************************** MOBILE VERSION *************************************/
    /*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/


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

        $('.main_wrapper').empty();
        $('.main_wrapper_mobile').empty();
        tableBuilder(result, selectedValue);
    });
/*===================================================================================================*/
/*=================================== ADD/DELETE BOX ================================================*/
/*===================================================================================================*/

/*--------------------------------------------------------------------------------------------------- */
/*---------------------------------------------- USER ------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------- */

    $('.add_user_button').on('click', async function(){
        let dataToSend = [];
        //let parent = $(this).parent();
        let parent = $('#addUserModal').parent();
        if(parent.find('.select_add_user_department_select').length > 0 || parent.find('.select_add_user_location_select').length > 0){
            let select_department_parent = parent.find('.select_add_user_department_select').parent();
            let select_location_parent = parent.find('.select_add_user_location_select').parent();
            parent.find('.select_add_user_department_select').remove();
            parent.find('.select_add_user_location_select').remove();
            select_department_parent.append(`<select name="addUserDepartment" class="add_user_department_select" id="add_user_department_select"></select>`);
            select_location_parent.append(`<select name="addUserLocation" class="add_user_location_select" id="add_user_location_select"></select>`);
        }

        $('#add_user_name_input').attr('data-value', '');
        $('#add_user_name_input').val('');
        $('#add_user_name_input').css('box-shadow', 'none');
        $('#add_user_name_input').css('border-color', 'black');

        $('#add_user_surname_input').attr('data-value', '');
        $('#add_user_surname_input').val('');
        $('#add_user_surname_input').css('box-shadow', 'none');
        $('#add_user_surname_input').css('border-color', 'black');

        $('#add_user_email_input').attr('data-value', '');
        $('#add_user_email_input').val('');
        $('#add_user_email_input').css('box-shadow', 'none');
        $('#add_user_email_input').css('border-color', 'black');


        
        let departments = await getDepartments();
        populateSelect(departments, 'add_user_department_select', 'department');
        selectChanger(true, true, 'add_user_department_select');

        let dataBind = $('.add_user_department_select').find(":selected").attr('data-bind');
        $('.add_user_department_select').attr('data-selected-bind', dataBind);
        let dataBindArray = dataBind.split(":");
        dataBindArray.forEach(function(v, i, a){
            let res = v.split(" ");
            dataToSend.push(res[1]);
        });



        let locations = await getCustomLocations({data: dataToSend, not: 0});
        
        populateSelect(locations, 'add_user_location_select', 'location');
        
        selectChanger(true, true, 'add_user_location_select');
    });

    $('#add_user_name_input').on('blur', function(){
        $(this).attr('data-value', $(this).val());
    });

    $('#add_user_name_input').on('focus', function(){
        $('#add_user_name_input').css('box-shadow', 'none');
        $('#add_user_name_input').css('border-color', 'black');
    });



    $('#add_user_surname_input').on('blur', function(){
        $(this).attr('data-value', $(this).val());
    });

    $('#add_user_surname_input').on('focus', function(){
        $('#add_user_surname_input').css('box-shadow', 'none');
        $('#add_user_surname_input').css('border-color', 'black');
    });



    $('#add_user_email_input').on('blur', function(){
        $(this).attr('data-value', $(this).val());
    });

    $('#add_user_email_input').on('focus', function(){
        $('#add_user_email_input').css('box-shadow', 'none');
        $('#add_user_email_input').css('border-color', 'black');
    });



    $(document).on('change', '.add_user_department_select', async function(){
        let dataToSend = [];
        $(this).attr('data-selected-value', $(this).val());
        let select_location_parent = $('.add_user_location_select').parents('.add_user_item');
        select_location_parent.find('.select_add_user_location_select').remove();
        select_location_parent.append(`<select name="addUserLocation" class="add_user_location_select" id="add_user_location_select"></select>`);
        
        let dataBind = $(this).find(":selected").attr('data-bind');
        $('.add_user_department_select').attr('data-selected-bind', dataBind);
        let dataBindArray = dataBind.split(":");
        dataBindArray.forEach(function(v, i, a){
            let res = v.split(" ");
            dataToSend.push(res[1]);
        });

        let locations = await getCustomLocations({data: dataToSend, not: 0});
        
        populateSelect(locations, 'add_user_location_select', 'location');
        
        selectChanger(true, true, 'add_user_location_select');
    });



    $(document).on('change', '.add_user_location_select', function(){
        $(this).attr('data-selected-value', $(this).val());
        $(this).attr('data-selected-index', $(this).find(':selected').attr('data-index'));
    });



    $('.add_user_save_button').on('click', async function(){
        let dataObj = {}, k = 0;

        if($('#add_user_name_input').attr('data-value') !== ''){
            dataObj['firstName'] = $('#add_user_name_input').attr('data-value');
        }else{
            $('#add_user_name_input').css('box-shadow', '0 0 6px 1px red');
            $('#add_user_name_input').css('border-color', 'red');
            k++;
        }

        if($('#add_user_surname_input').attr('data-value') !== ''){
            dataObj['lastName'] = $('#add_user_surname_input').attr('data-value');
        }else{
            $('#add_user_surname_input').css('box-shadow', '0 0 6px 1px red');
            $('#add_user_surname_input').css('border-color', 'red');
            k++;
        }

        if($('#add_user_email_input').attr('data-value') !== ''){
            dataObj['email'] = $('#add_user_email_input').attr('data-value');
        }else{
            $('#add_user_email_input').css('box-shadow', '0 0 6px 1px red');
            $('#add_user_email_input').css('border-color', 'red');
            k++;
        }

        if(k !== 0){
            return;
        }

        let departmentName = $('.add_user_department_select').parent().find('span').html();
        let locationName = $('.add_user_location_select').parent().find('span').html();

        let locationID = $('.add_user_location_select').attr('data-selected-index');
        let departmentBindValue = $('.add_user_department_select').attr('data-selected-bind');//in format with : splited

        let departmentBindValueSplited = departmentBindValue.split(':');
        departmentBindValueSplited.forEach(function(v, i, a){
            let res = v.split(" ");
            if(res[1] === locationID){
                dataObj['departmentID'] = res[0];
            }
        });

        let result = await insertUser(dataObj);

        $('.btn-close').trigger('click');

        if(result.status.code === '200'){
            $('.toast-body').html(`User ${dataObj['firstName']} ${dataObj['lastName']} succesfully created in ${departmentName} department with ${locationName} location.`);
            $('.toast').css('background-color', '#279f13');
            historyMessage(`User ${dataObj['firstName']} ${dataObj['lastName']} succesfully created in ${departmentName} department with ${locationName} location.`,'history_wrapper', 'green');
            myToast.show();
        }else{
            $('.toast-body').html(`User ${dataObj['firstName']} ${dataObj['lastName']} failed to create.`);
            $('.toast').css('background-color', 'ce1a1a');
            historyMessage(`User ${dataObj['firstName']} ${dataObj['lastName']} failed to create.`,'history_wrapper');
            myToast.show();
            return;
        }

        $('.refresh_button').trigger('click');
    });

/*--------------------------------------------------------------------------------------------------- */
/*---------------------------------------------- DEPARTMENT ------------------------------------------*/
/*--------------------------------------------------------------------------------------------------- */

    $('.add_department_button').on('click', async function(){
        myToast.hide();
        let addExistingDataToSend = [];
        let deleteDataToSend = [];
        let parent = $('#addDepartmentModal').parent();

        /****************************************  ADD NEW ***************************************/

        if(parent.find('.select_add_new_location_select').length > 0){
            let select_parent = $('.select_add_new_location_select').parent();
            $('.select_add_new_location_select').remove();
            select_parent.append('<select name="addNewLocationSelect" id="add_new_location_select" class="add_new_location_select"></select>')
        }

        /****************************************  ADD EXISTING ***************************************/

        if(parent.find('.select_add_existing_department_select').length > 0){
            let select_parent = $('.select_add_existing_department_select').parent();
            $('.select_add_existing_department_select').remove();
            select_parent.append('<select name="addExistingDepartmentSelect" id="add_existing_department_select" class="add_existing_department_select"></select>')
        }

        if(parent.find('.select_add_existing_location_select').length > 0){
            let select_parent = $('.select_add_existing_location_select').parent();
            $('.select_add_existing_location_select').remove();
            select_parent.append('<select name="addExistingLocationSelect" id="add_existing_location_select" class="add_existing_location_select"></select>')
        }

        /****************************************  DELETE ******************************************/

        if(parent.find('.select_delete_department_select').length > 0){
            let select_parent = $('.select_delete_department_select').parent();
            $('.select_delete_department_select').remove();
            select_parent.append('<select name="deleteDepartmentSelect" id="delete_department_select" class="delete_department_select"></select>')
        }

        if(parent.find('.select_delete_location_select').length > 0){
            let select_parent = $('.select_delete_location_select').parent();
            $('.select_delete_location_select').remove();
            select_parent.append('<select name="deleteLocationSelect" id="delete_location_select" class="delete_location_select"></select>')
        }
/********************************************************************************************************* */
        /****************************************  ADD NEW ***************************************/

        let add_new_location = await getLocations();
        populateSelect(add_new_location, 'add_new_location_select', 'location');
        selectChanger(true, true, 'add_new_location_select');
        $('.add_new_department_input').attr('data-value', '');
        $('.add_new_department_input').val('');
        $('.add_new_department_input').css('box-shadow', 'none');
        $('.add_new_department_input').css('border-color', 'black');

        /****************************************  ADD EXISTING ***************************************/

        let add_existing_departments = await getDepartments();
        populateSelect(add_existing_departments, 'add_existing_department_select', 'department');
        selectChanger(true, true, 'add_existing_department_select');

        let addExistingDataBind = $('.add_existing_department_select').find(":selected").attr('data-bind');
        $('.add_existing_department_select').attr('data-selected-bind', addExistingDataBind);
        let addExistingDataBindArray = addExistingDataBind.split(":");
        addExistingDataBindArray.forEach(function(v, i, a){
            let res = v.split(" ");
            addExistingDataToSend.push(res[1]);
        });

        let add_existing_location = await getCustomLocations({data: addExistingDataToSend, not: 1});
        if(add_existing_location.status.code === '200'){
            populateSelect(add_existing_location, 'add_existing_location_select', 'location');
            selectChanger(true, true, 'add_existing_location_select');
        }else{
            $('.add_existing_location_select').append(`<option>No location to add</option>`);
            $('.add_existing_location_select').attr('data-selected-value', '');
            $('.add_existing_location_select').attr('data-selected-index', '');
            selectChanger(true, true, 'add_existing_location_select');
        }
        

        /****************************************  DELETE ***************************************/

        let delete_departments = await getDepartments();
        populateSelect(delete_departments, 'delete_department_select', 'department');
        selectChanger(true, true, 'delete_department_select');

        let deleteDataBind = $('.delete_department_select').find(":selected").attr('data-bind');
        $('.delete_department_select').attr('data-selected-bind', deleteDataBind);
        let deleteDataBindArray = deleteDataBind.split(":");
        deleteDataBindArray.forEach(function(v, i, a){
            let res = v.split(" ");
            deleteDataToSend.push(res[1]);
        });

        let delete_location = await getCustomLocations({data: deleteDataToSend, not: 0});
        if(delete_location.status.code === '200'){
            populateSelect(delete_location, 'delete_location_select', 'location');
            selectChanger(true, true, 'delete_location_select');
        }
    });



/******************************************************************************************************/
/****************************************** DEPARTMENT TAB BUTTONS ************************************ */
/******************************************************************************************************/

    $('#pills-add-new-tab').on('click', function(){
        $('.add_department_save_button').attr('data-source', 'add_new');
        $('.add_department_save_button').html('Save');
    });

    $('#pills-add-existing-tab').on('click', function(){
        $('.add_department_save_button').attr('data-source', 'add_existing');
        $('.add_department_save_button').html('Save');
    });

    $('#pills-delete-tab').on('click', function(){
        $('.add_department_save_button').attr('data-source', 'delete');
        $('.add_department_save_button').html('Delete');
    });

/******************************************************************************************************/
/******************************************************************************************************/
/******************************************************************************************************/


/******************************************************************************************************/
/****************************************** DEPARTMENT ADD NEW SECTION ****************************** */
/******************************************************************************************************/

    $('.add_new_department_input').on('blur', function(){
        $(this).attr('data-value', $(this).val());
    });

    $('.add_new_department_input').on('keyup', function(){
        $('.add_new_department_input').css('box-shadow', 'none');
        $('.add_new_department_input').css('border-color', 'black');
    });

    $(document).on('change', '.add_new_location_select', function(){
        $(this).attr('data-selected-value', $(this).val());
        $(this).attr('data-selected-index', $(this).find(':selected').attr('data-index'));
    });

/******************************************************************************************************/
/******************************************************************************************************/
/******************************************************************************************************/

/******************************************************************************************************/
/************************************* DEPARTMENT ADD EXISTING SECTION ****************************** */
/******************************************************************************************************/

    $(document).on('change', '.add_existing_department_select', async function(){
        let dataToSend = [];
        $(this).attr('data-selected-value', $(this).val());
        let select_location_parent = $('.add_existing_location_select').parents('.add_existing_item');
        select_location_parent.find('.select_add_existing_location_select').remove();
        select_location_parent.append(`<select name="addExistingLocationSelect" id="add_existing_location_select" class="add_existing_location_select"></select>`);
        
        let dataBind = $(this).find(":selected").attr('data-bind');
        $('.add_existing_department_select').attr('data-selected-bind', dataBind);
        let dataBindArray = dataBind.split(":");
        dataBindArray.forEach(function(v, i, a){
            let res = v.split(" ");
            dataToSend.push(res[1]);
        });

        let locations = await getCustomLocations({data: dataToSend, not: 1});

        if(locations.status.code === '200'){
           populateSelect(locations, 'add_existing_location_select', 'location');
           selectChanger(true, true, 'add_existing_location_select');
        }else{
            $('.add_existing_location_select').append(`<option>No location to add</option>`);
            $('.add_existing_location_select').attr('data-selected-value', '');
            $('.add_existing_location_select').attr('data-selected-index', '');
            selectChanger(true, true, 'add_existing_location_select');
        }
        
        
    });

    $(document).on('change', '.add_existing_location_select', function(){
        $(this).attr('data-selected-value', $(this).val());
        $(this).attr('data-selected-index', $(this).find(':selected').attr('data-index'));
    });

/******************************************************************************************************/
/******************************************************************************************************/
/******************************************************************************************************/

/******************************************************************************************************/
/************************************* DEPARTMENT DELETE SECTION ************************************ */
/******************************************************************************************************/

    $(document).on('change', '.delete_department_select', async function(){
        let dataToSend = [];
        $(this).attr('data-selected-value', $(this).val());
        let select_location_parent = $('.delete_location_select').parents('.delete_item');
        select_location_parent.find('.select_delete_location_select').remove();
        select_location_parent.append(`<select name="deleteLocationSelect" id="delete_location_select" class="delete_location_select"></select>`);
        
        let dataBind = $(this).find(":selected").attr('data-bind');
        $('.delete_department_select').attr('data-selected-bind', dataBind);
        let dataBindArray = dataBind.split(":");
        dataBindArray.forEach(function(v, i, a){
            let res = v.split(" ");
            dataToSend.push(res[1]);
        });

        let locations = await getCustomLocations({data: dataToSend, not: 0});

        if(locations.status.code === '200'){
           populateSelect(locations, 'delete_location_select', 'location');
           selectChanger(true, true, 'delete_location_select');
        }
        
    });

    $(document).on('change', '.delete_location_select', function(){
        $(this).attr('data-selected-value', $(this).val());
        $(this).attr('data-selected-index', $(this).find(':selected').attr('data-index'));
    });

/******************************************************************************************************/
/******************************************************************************************************/
/******************************************************************************************************/


    $('.add_department_save_button').on('click', async function(){
        
        let dataObj = {};
        switch($(this).attr('data-source')){
            case 'add_new':
                if($('.add_new_department_input').attr('data-value') !== ''){
                    dataObj['departmentName'] = $('.add_new_department_input').attr('data-value');
                }else{
                    $('.add_new_department_input').css('box-shadow', '0 0 6px 1px red');
                    $('.add_new_department_input').css('border-color', 'red');
                    break;
                }

                dataObj['locationID'] = $('.add_new_location_select').attr('data-selected-index');
                dataObj['locationName'] = $('.add_new_location_select').attr('data-selected-value');
                dataObj['ref'] = 'add_new';

                let result1 = await insertDepartment(dataObj);
                $('.btn-close').trigger('click');
                if(result1.status.code === '302'){
                    $('.toast-body').html(result1.status.message);
                    $('.toast').css('background-color', '#ce1a1a');
                    historyMessage(`Failed to add new department, with message: "<span style="color: black">${result1.status.message}</span>"`,'history_wrapper');
                }

                if(result1.status.code === '200'){
                    $('.toast-body').html(result1.status.message);
                    $('.toast').css('background-color', '#279f13');
                    historyMessage(`Department added succesfull, with message: "<span style="color: black">${result1.status.message}</span>"`,'history_wrapper', 'green');
                }
                
                myToast.show();
                break;
            case 'add_existing':
                
                if($('.add_existing_location_select').attr('data-selected-index') == ''){
                    $('.btn-close').trigger('click');
                    $('.toast-body').html('<span>There is no location available to add for this department.</br>Go to Location section to add new location</span>');
                    $('.toast').css('background-color', '#ce1a1a');
                    historyMessage(`Failed to add new department, with message: "<span style="color: black">There is no location available to add for this department.</br>Go to Location section to add new location</span>"`,'history_wrapper');
                    myToast.show();
                    break;
                }

                dataObj['departmentName'] = $('.add_existing_department_select').attr('data-selected-value');
                dataObj['locationName'] = $('.add_existing_location_select').attr('data-selected-value');
                dataObj['locationID'] = $('.add_existing_location_select').attr('data-selected-index');
                dataObj['ref'] = 'add_existing';

                let result2 = await insertDepartment(dataObj);

                $('.btn-close').trigger('click');
                if(result2.status.code === '302'){
                    $('.toast-body').html(result2.status.message);
                    $('.toast').css('background-color', '#ce1a1a');
                    historyMessage(`Failed to add new department, with message: "<span style="color: black">${result2.status.message}</span>"`,'history_wrapper');
                }

                if(result2.status.code === '200'){
                    $('.toast-body').html(result2.status.message);
                    $('.toast').css('background-color', '#279f13');
                    historyMessage(`Department added succesfull, with message: "<span style="color: black">${result2.status.message}</span>"`,'history_wrapper', 'green');
                }
                
                myToast.show();
                break;
            case 'delete':
                dataObj['departmentName'] = $('.delete_department_select').attr('data-selected-value');
                dataObj['locationName'] = $('.delete_location_select').attr('data-selected-value');
                dataObj['locationID'] = $('.delete_location_select').attr('data-selected-index');
                dataObj['ref'] = 'delete';


                let locationID = $('.delete_location_select').attr('data-selected-index');
                let departmentBindValue = $('.delete_department_select').attr('data-selected-bind');//in format with : splited

                let departmentBindValueSplited = departmentBindValue.split(':');
                departmentBindValueSplited.forEach(function(v, i, a){
                    let res = v.split(" ");
                    if(res[1] === locationID){
                        dataObj['departmentID'] = res[0];
                    }
                });

                let result3 = await deleteDepartment(dataObj);

                $('.btn-close').trigger('click');
                if(result3.status.code === '302'){
                    $('.toast-body').html(result3.status.message);
                    $('.toast').css('background-color', '#ce1a1a');
                    historyMessage(`Failed to delete department, with message: "<span style="color: black">${result3.status.message}</span>"`,'history_wrapper');
                }

                if(result3.status.code === '200'){
                    $('.toast-body').html(result3.status.message);
                    $('.toast').css('background-color', '#279f13');
                    historyMessage(`Department deleted succesfull, with message: "<span style="color: black">${result3.status.message}</span>"`,'history_wrapper', 'green');
                }
                
                myToast.show();
                break;
            default:
                console.log()
        }
    });

/*--------------------------------------------------------------------------------------------------- */
/*---------------------------------------------- LOCATION --------------------------------------------*/
/*--------------------------------------------------------------------------------------------------- */

    $('.add_location_button').on('click', async function(){

        myToast.hide();
        let addExistingDataToSend = [];
        let deleteDataToSend = [];
        let parent = $('#addLocationModal').parent();

        if(parent.find('.select_location_delete_location_select').length > 0){
            let select_parent = $('.select_location_delete_location_select').parent();
            $('.select_location_delete_location_select').remove();
            select_parent.append('<select name="locationDeleteLocationSelect" id="location_delete_location_select" class="location_delete_location_select"></select>')
        }




        $('.location_add_new_location_input').attr('data-value', '');
        $('.location_add_new_location_input').val('');
        $('.location_add_new_location_input').css('box-shadow', 'none');
        $('.location_add_new_location_input').css('border-color', 'black');


        let location_delete_location = await getLocations();
        if(location_delete_location.status.code === '200'){
            populateSelect(location_delete_location, 'location_delete_location_select', 'location');
            selectChanger(true, true, 'location_delete_location_select');
        }else{
            $('.location_delete_location_select').append(`<option>No location to add</option>`);
            $('.location_delete_location_select').attr('data-selected-value', '');
            $('.location_delete_location_select').attr('data-selected-index', '');
            selectChanger(true, true, 'location_delete_location_select');
        }
        
        
    });

    $('.location_add_new_location_input').on('blur', function(){
        $(this).attr('data-value', $(this).val());
    });

    $('.location_add_new_location_input').on('keyup', function(){
        $('.location_add_new_location_input').css('box-shadow', 'none');
        $('.location_add_new_location_input').css('border-color', 'black');
    });

/******************************************************************************************************/
/****************************************** LOCATION TAB BUTTONS ************************************ */
/******************************************************************************************************/

    $('#pills-add-new-location-tab').on('click', function(){
        $('.add_location_save_button').attr('data-source', 'add_new');
        $('.add_location_save_button').html('Save');
    });

    $('#pills-delete-location-tab').on('click', function(){
        $('.add_location_save_button').attr('data-source', 'delete');
        $('.add_location_save_button').html('Delete');
    });

/******************************************************************************************************/
/******************************************************************************************************/
/******************************************************************************************************/

/******************************************************************************************************/
/************************************* LOCATION DELETE SECTION ************************************** */
/******************************************************************************************************/

    $(document).on('change', '.location_delete_location_select', function(){
        $(this).attr('data-selected-value', $(this).val());
        $(this).attr('data-selected-index', $(this).find(':selected').attr('data-index'));
    });

/******************************************************************************************************/
/******************************************************************************************************/
/******************************************************************************************************/  

    
    $('.add_location_save_button').on('click', async function(){
        let dataObj = {};

        switch($(this).attr('data-source')){
            case 'add_new':
                if($('.location_add_new_location_input').attr('data-value') !== ''){
                    dataObj['locationName'] = $('.location_add_new_location_input').attr('data-value');
                }else{
                    $('.location_add_new_location_input').css('box-shadow', '0 0 6px 1px red');
                    $('.location_add_new_location_input').css('border-color', 'red');
                    historyMessage(`Failed to add new location with message: "<span style="color: black">Missing location name in input field<span>"`,'history_wrapper');
                    break;
                }

                let result1 = await insertLocation(dataObj);

                $('.btn-close').trigger('click');
                if(result1.status.code === '302'){
                    $('.toast-body').html(result1.status.message);
                    $('.toast').css('background-color', '#ce1a1a');
                    historyMessage(`Failed to add new location with message: "<span style="color: black">${result1.status.message}<span>"`,'history_wrapper');
                    myToast.show();
                    break;
                }

                if(result1.status.code === '200'){
                    $('.toast-body').html(result1.status.message);
                    $('.toast').css('background-color', '#279f13');
                    historyMessage(`New ${capitalize(dataObj['locationName'])} location added`,'history_wrapper', 'green');
                }

                myToast.show();
                break;
            case 'delete':
                if($('.location_delete_location_select').attr('data-selected-index') == ''){
                    $('.btn-close').trigger('click');
                    $('.toast-body').html('<span>There is no location available to delete.');
                    $('.toast').css('background-color', '#ce1a1a');
                    myToast.show();
                    historyMessage(`Failed to delete location, with message: "<span style="color: black">There is no location available to delete.</span>"`,'history_wrapper');
                    break;
                }

                dataObj['locationID'] = $('.location_delete_location_select').attr('data-selected-index');
                dataObj['locationName'] = $('.location_delete_location_select').attr('data-selected-value');

                let result2 = await deleteLocation(dataObj);

                $('.btn-close').trigger('click');
                if(result2.status.code === '302'){
                    $('.toast-body').html(result2.status.message);
                    $('.toast').css('background-color', '#ce1a1a');
                    historyMessage(`Failed to delete location, with message: "<span style="color: black">${result2.status.message}</span>"`,'history_wrapper');
                    myToast.show();
                    break;
                }

                if(result2.status.code === '200'){
                    $('.toast-body').html(result2.status.message);
                    $('.toast').css('background-color', '#279f13');
                    historyMessage(`Location ${capitalize(dataObj['locationName'])} deleted`,'history_wrapper', 'green');
                }
                
                myToast.show();

                break;
            default:
                console.log();
        }
    });

/*===================================================================================================*/
/*===================================================================================================*/
/*===================================================================================================*/







/*===================================================================================================*/
/*=================================== HISTORY BOX START =============================================*/
/*===================================================================================================*/


/*===================================================================================================*/
/*===================================== HISTORY BOX END =============================================*/
/*===================================================================================================*/






/*===================================================================================================*/
/*=================================== RESULT ACTION START ===========================================*/
/*===================================================================================================*/


/******************************************************************************************************/
/************************************* USER EDIT SECTION **********************************************/
/******************************************************************************************************/

    $(document).on('change', '.result_edit_user_department_select', async function(){
        let dataToSend = [];
        $(this).attr('data-selected-value', $(this).val());
        let select_location_parent = $('.result_edit_user_location_select').parents('.result_edit_user_item');
        select_location_parent.find('.select_result_edit_user_location_select').remove();
        select_location_parent.append(`<select name="resultEditUserLocation" class="result_edit_user_location_select" id="result_edit_user_location_select"></select>`);

        let dataBind = $(this).find(":selected").attr('data-bind');
        $('.result_edit_user_department_select').attr('data-selected-bind', dataBind);


        let dataBindArray = dataBind.split(":");
        dataBindArray.forEach(function(v, i, a){
            let res = v.split(" ");
            dataToSend.push(res[1]);
        });

        let location = await getCustomLocations({data: dataToSend, not: 0});
        populateSelect(location, 'result_edit_user_location_select', 'location');
        selectChanger(true, true, 'result_edit_user_location_select');
    });

    $(document).on('change', '.result_edit_user_location_select', async function(){
        $(this).attr('data-selected-value', $(this).val());
        $(this).attr('data-selected-index', $(this).find(':selected').attr('data-index'));
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




    $('#result_edit_user_name_input').on('keyup', function(){
        $(this).css('box-shadow', 'none');
        $(this).css('border-color', 'black');
    });

    $('#result_edit_user_surname_input').on('keyup', function(){
        $(this).css('box-shadow', 'none');
        $(this).css('border-color', 'black');
    });

    $('#result_edit_user_email_input').on('keyup', function(){
        $(this).css('box-shadow', 'none');
        $(this).css('border-color', 'black');
    });





    $(document).on('click', '.result_edit, .result_edit_mobile', async function(){
        let dataToSend = [];
        $('#result_edit_user_name_input').css('box-shadow', 'none');
        $('#result_edit_user_name_input').css('border-color', 'black');
        $('#result_edit_user_surname_input').css('box-shadow', 'none');
        $('#result_edit_user_surname_input').css('border-color', 'black');
        $('#result_edit_user_email_input').css('box-shadow', 'none');
        $('#result_edit_user_email_input').css('border-color', 'black');

        if($('.result_user_edit').find('.select_result_edit_user_department_select').length > 0){
            let select_department_parent = $('.result_user_edit').find('.select_result_edit_user_department_select').parent();
            $('.result_user_edit').find('.select_result_edit_user_department_select').remove();
            select_department_parent.append(`<select name="resultEditUserDepartment" class="result_edit_user_department_select" id="result_edit_user_department_select"></select>`);
        }

        if($('.result_user_edit').find('.select_result_edit_user_location_select').length > 0){
            let select_location_parent = $('.result_user_edit').find('.select_result_edit_user_location_select').parent();
            $('.result_user_edit').find('.select_result_edit_user_location_select').remove();
            select_location_parent.append(`<select name="resultEditUserLocation" class="result_edit_user_location_select" id="result_edit_user_location_select"></select>`);
        }

        let userID = $(this).attr('data-value');
        let resultEmployee = await defaultGetAllEmployee('asc', 'firstName', 1, userID);

        $('#result_edit_user_name_input').val(resultEmployee.data[0].firstName);
        $('#result_edit_user_name_input').attr('data-value', resultEmployee.data[0].firstName);
        $('#result_edit_user_surname_input').val(resultEmployee.data[0].lastName);
        $('#result_edit_user_surname_input').attr('data-value', resultEmployee.data[0].lastName);
        $('#result_edit_user_email_input').val(resultEmployee.data[0].email);
        $('#result_edit_user_email_input').attr('data-value', resultEmployee.data[0].email);

        let resultDepartment = await getDepartments();
        populateSelect(resultDepartment, 'result_edit_user_department_select', 'department');
        selectChanger(true, true, 'result_edit_user_department_select');

        let department_fake_option = $('.select_result_edit_user_department_select').find('.select__option');
        department_fake_option.each(function(i, elem) {
            if($(elem).attr('data-value') === resultEmployee.data[0].department.toLowerCase()){
                $('.select_result_edit_user_department_select').find('span').html($(elem).html());

                let originalSelect = document.querySelector('.result_edit_user_department_select');
                originalSelect.options[$(elem).attr('data-index')].selected = true;

                $('.result_edit_user_department_select').attr('data-selected-value', originalSelect.options[$(elem).attr('data-index')].value);

                let dataBindInside = $('.result_edit_user_department_select').find(":selected").attr('data-bind');
                $('.result_edit_user_department_select').attr('data-selected-bind', dataBindInside);
            }
        });

        let dataBind = $('.result_edit_user_department_select').attr('data-selected-bind');

        let dataBindArray = dataBind.split(":");
        dataBindArray.forEach(function(v, i, a){
            let res = v.split(" ");
            dataToSend.push(res[1]);
        });

        

        let location = await getCustomLocations({data: dataToSend, not: 0});
        populateSelect(location, 'result_edit_user_location_select', 'location');
        selectChanger(true, true, 'result_edit_user_location_select');

        let location_fake_option = $('.select_result_edit_user_location_select').find('.select__option');
        location_fake_option.each(function(i, elem) {
            if($(elem).attr('data-value') === resultEmployee.data[0].location.toLowerCase()){
                $('.select_result_edit_user_location_select').find('span').html($(elem).html());

                let originalSelect = document.querySelector('.result_edit_user_location_select');
                originalSelect.options[$(elem).attr('data-index')].selected = true;

                $('.result_edit_user_location_select').attr('data-selected-value', originalSelect.options[$(elem).attr('data-index')].value);
                $('.result_edit_user_location_select').attr('data-selected-index', originalSelect.options[$(elem).attr('data-index')].dataset.index);
            }
        });

        $('.result_edit_user_save_button').attr('data-value', $(this).attr('data-value'));
            
    });

    $('.result_edit_user_save_button').on('click', async function(){
        let dataObj = {};
        let j = 0;

        if($('#result_edit_user_name_input').attr('data-value') !== ''){
            dataObj['firstName'] = $('#result_edit_user_name_input').attr('data-value');
        }else{
            $('#result_edit_user_name_input').css('box-shadow', '0 0 6px 1px red');
            $('#result_edit_user_name_input').css('border-color', 'red');
            j = j + 1;
        }

        if($('#result_edit_user_surname_input').attr('data-value') !== ''){
            dataObj['lastName'] = $('#result_edit_user_surname_input').attr('data-value');
        }else{
            $('#result_edit_user_surname_input').css('box-shadow', '0 0 6px 1px red');
            $('#result_edit_user_surname_input').css('border-color', 'red');
            j = j + 2;
        }

        if($('#result_edit_user_email_input').attr('data-value') !== ''){
            dataObj['email'] = $('#result_edit_user_email_input').attr('data-value');
        }else{
            $('#result_edit_user_email_input').css('box-shadow', '0 0 6px 1px red');
            $('#result_edit_user_email_input').css('border-color', 'red');
            j = j + 4;
        }

        if(j > 0){
            switch(j){
                case 1:
                    historyMessage(`Failed to update user with message: "<span style="color: black">Missing  name in input field<span>"`,'history_wrapper');
                    break;
                case 2:
                    historyMessage(`Failed to update user with message: "<span style="color: black">Missing  surname in input field<span>"`,'history_wrapper');
                    break;
                case 3:
                    historyMessage(`Failed to update user with message: "<span style="color: black">Missing  name in input field<span>"`,'history_wrapper');
                    historyMessage(`Failed to update user with message: "<span style="color: black">Missing  surname in input field<span>"`,'history_wrapper');
                    break;
                case 4:
                    historyMessage(`Failed to update user with message: "<span style="color: black">Missing  email in input field<span>"`,'history_wrapper');
                    break;
                case 5:
                    historyMessage(`Failed to update user with message: "<span style="color: black">Missing  name in input field<span>"`,'history_wrapper');
                    historyMessage(`Failed to update user with message: "<span style="color: black">Missing  email in input field<span>"`,'history_wrapper');
                    break;
                case 6:
                    historyMessage(`Failed to update user with message: "<span style="color: black">Missing  surname in input field<span>"`,'history_wrapper');
                    historyMessage(`Failed to update user with message: "<span style="color: black">Missing  email in input field<span>"`,'history_wrapper');
                    break;
                case 7:
                    historyMessage(`Failed to update user with message: "<span style="color: black">Missing  name in input field<span>"`,'history_wrapper');
                    historyMessage(`Failed to update user with message: "<span style="color: black">Missing  surname in input field<span>"`,'history_wrapper');
                    historyMessage(`Failed to update user with message: "<span style="color: black">Missing  email in input field<span>"`,'history_wrapper');
                    break;
                default:
                    console.log();
            }
            return;
        }

        let dataBind = $('.result_edit_user_department_select').attr('data-selected-bind');
        let locationID = $('.result_edit_user_location_select').attr('data-selected-index');
        let splited = dataBind.split(':');
        splited.forEach(function(v, i, a){
            let res = v.split(" ");
            if(res[1] === locationID){
                dataObj['departmentID'] = res[0];
            }
        });

        dataObj['id'] = $(this).attr('data-value');

        let result = await updateUser(dataObj);


        $('.btn-close').trigger('click');

        if(result.status.code === '200'){
            $('.toast-body').html(result.status.message);
            $('.toast').css('background-color', '#279f13');
            historyMessage(`${result.status.message}`,'history_wrapper', 'green');
        }
        
        myToast.show();
        $('.refresh_button').trigger('click');


    });

/******************************************************************************************************/
/******************************************************************************************************/
/******************************************************************************************************/

/******************************************************************************************************/
/************************************* USER DELETE SECTION **********************************************/
/******************************************************************************************************/

    $(document).on('click', '.result_delete, .result_delete_mobile', async function(){
        $('.result_delete_user_save_button').attr('data-value', $(this).attr('data-value'));
        let userID = $(this).attr('data-value');

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

        $('.refresh_button').trigger('click');


    });

/******************************************************************************************************/
/******************************************************************************************************/
/******************************************************************************************************/

/*===================================================================================================*/
/*=================================== RESULT ACTION END =============================================*/
/*===================================================================================================*/









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