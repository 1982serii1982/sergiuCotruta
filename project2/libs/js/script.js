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

function selectChanger(keepClicked){
    //Select
    let selects = document.getElementsByTagName('select');
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

function populateSelect(inputData, className = ''){

    if(className.length === 0){
        Object.keys(inputData[0]).forEach(function(v, i, a){
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
    }else{
        inputData.forEach(function(v, i, a){
            if(i == 0){
                $(`.${className}`).append(`<option value="${v.name.toLowerCase()}" selected>${v.name}</option>`);
                $(`.${className}`).attr('data-selected-value', `${v.name.toLowerCase()}`);
            }else{
                $(`.${className}`).append(`<option value="${v.name.toLowerCase()}">${v.name}</option>`);
            }
        });
    }
    
}
/***************************************************************************/
async function getDepartments(){
    let res = await phpRequest("getAllDepartments");
    return res;
}

async function getLocations(){
    let res = await phpRequest("getAllLocation");
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

async function defaultGetAllEmployee(order = 'asc', orderBy = 'firstName'){
    order = order.toUpperCase();
    let res = await phpRequest("getAllEmployee", {order: order, orderBy: orderBy});
    return res;
}

function tableBuilder(inputData, orderBy = 'firstName'){
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
                                    <div class="header_action">Action</div>
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
                    <div class="result_action">
                        <button class="result_edit" data-value="${currentVal.id}"><i class="fa-solid fa-pencil"></i></button>
                        <button class="result_delete" data-value="${currentVal.id}"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>
        `;

        bodyTemplate = bodyTemplate.concat(template);

        if(index === array.length-1){
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
                                <div class="header_action">Action</div>
                            </div>
                            ${bodyTemplate}
                        </div>
                    </div>
                </div>
            `;
            result = result.concat(mainTemplate);
        }
    });

    $('.main_wrapper').append(`<div class="result_total">${inputData.length} result(s) found</div>`);
    $('.main_wrapper').append(result);
}


/*****************************************************************************/

(async function(){

    
    let allEmployeeResult = await defaultGetAllEmployee();
    let departments = await getDepartments();
    let locations = await getLocations();
    tableBuilder(allEmployeeResult);

    populateSelect(departments, 'department_select');
    populateSelect(locations, 'location_select');
    populateSelect(allEmployeeResult);
    selectChanger(true);

})();

$(document).ready(function () {

    
    /************************************************ CHANGE BOX ***************************/


    $('.header_select').on('change', async function(e){
        let result;
        let selectedValue = $(this).children("option:selected").val();
        let ascendingButtonValue = $('.sort_box_button').attr('data-selected-value');

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

        }else{
            result = await defaultGetAllEmployee(ascendingButtonValue, selectedValue);
        }

        $('.main_wrapper').empty();
        tableBuilder(result, selectedValue);

        $('.header_select').attr('data-selected-value', $(this).children("option:selected").val());
    });

    /************************************************ SORT BOX ***************************/


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

        }else{
            result = await defaultGetAllEmployee(ascendingButtonValue, selectedValue);
        }

        
        $('.main_wrapper').empty();
        tableBuilder(result, selectedValue);
        
    });

    /************************************************ SEARCH BOX ***************************/

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

        let result = await getSearch(ascendingButtonValue, selectedValue, searchString);

        $('.main_wrapper').empty();
        tableBuilder(result, selectedValue);
    });

    $('.refresh_button').on('click', async function(e){
        let result = await defaultGetAllEmployee();
        $('.sort_box_button').attr('data-source', '');
        $('.header_select').attr('data-source', '');

        $('.header_search').attr('data-searched-value', '');
        $('.header_search').val('');
        $('.main_wrapper').empty();
        tableBuilder(result);
    });

    /************************************************ FILTER BOX ***************************/
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


    /*************************************** NAME ROW *****************************************/



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
        tableBuilder(result, selectedValue);
    });

    /*************************************** SURNAME ROW *****************************************/

    
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

        console.log(dataObj);

        
        let result = await getFilterSearch(dataObj);

        $('.main_wrapper').empty();
        tableBuilder(result, selectedValue);
    });

    /*************************************** EMAIL ROW *****************************************/


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

        console.log(dataObj);

        
        let result = await getFilterSearch(dataObj);

        $('.main_wrapper').empty();
        tableBuilder(result, selectedValue);
    });


    /*************************************** DEPARTMENT ROW *****************************************/

    


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
        tableBuilder(result, selectedValue);
    });

    /*************************************** LOCATION ROW *****************************************/


    


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
        tableBuilder(result, selectedValue);
    });


    /*************************************** APPLY BUTTON *****************************************/


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
        tableBuilder(result, selectedValue);
    });




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