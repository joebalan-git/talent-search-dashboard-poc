(function ($) {
    "use strict";  

    var allColumns = [];
    var allData = [];
    var filteredData = [];
    
    function rerenderTableData(){

        $(".data-wrapper table tbody").html("");
        
        $.each(filteredData, function(i, data){
            $(".data-wrapper table tbody").append(`<tr></tr>`);
            $.each(allColumns, function(i, column){
                $(".data-wrapper table tbody tr:last-child").append(`<td class="column${i+1} c">${data[column.key]}</td>`);
            });
        });
    }

    function filterData(){
        let filters = [];
        $("select[data-key]").each((i, s) => {
            if($(s).val()){
                filters.push({
                    key: $(s).data("key"), 
                    value: $(s).val()
                })
            }
        });

        filteredData = allData.filter((el) => {
            return !filters.map((f) => { return f.value === el[f.key];}).includes(false);
        });
        
        rerenderTableData();
    }

    function getUniqueDataOptionFromAllDatas(key){
        return allData.map((d) => d[key]).reduce((a, c) => {
            if(!a.includes(c)) a.push(c)
            return a;
        }, []).filter(x => x);
    }

    $.getJSON("./assets/json/config.json", function(results){
        const {columns, data} = results;

        allColumns = columns;
        allData = filteredData = data;
        
        // populate the search fields...
        $(".filter-wrapper table thead").append(`<tr class="table100-head"></tr>`);
        $(".filter-wrapper table tbody").append(`<tr></tr>`);
        $.each(columns, function(i, column){
            if(column.filter){
                $(".filter-wrapper table thead tr:last-child").append(`<th class="column${i+1} c">${column.label}</th>`);
                $(".filter-wrapper table tbody tr:last-child").append(`<td class="column${i+1} c"><select data-key="${column.key}"><option value="">Select ${column.label}</option></select></td>`);
                // populate the possible values to the dropdown options...
                console.log(getUniqueDataOptionFromAllDatas(column.key));
                $.each(getUniqueDataOptionFromAllDatas(column.key), function(i, option){
                    $(`.filter-wrapper table tbody tr:last-child > td > select[data-key='${column.key}']`).append(`<option value="${option}">${option}</option>`);
                });
            }
        });

        // bind onchange event for the select...
        $("select[data-key]").on('change', function(){
            filterData();
        });
        $("select[data-key]").select2();

        // populate the columns...
        $(".data-wrapper table thead").append(`<tr class="table100-head"></tr>`);
        $.each(columns, function(i, column){
            $(".data-wrapper table thead tr:last-child").append(`<th class="column${i+1} c">${column.label}</th>`);
        });

        // populate the table...
        rerenderTableData();

        $('.filter-wrapper,.data-wrapper').removeClass('hidden');
    });     

})(jQuery);