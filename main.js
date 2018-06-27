(function() {
    var datepicker = window.datepicker;
    var monthData;
    var $wrapper;
    var selectedMonthData;
    datepicker.buildUi = function(year, month) {
        monthData = datepicker.getMonthData(year, month);
        var html = ' <div class="ui-datepicker-header">' +
            '<a href="#" class="ui-datepicker-btn  ui-datepicker-prev-btn">&lt;</a>' +
            '<a href="#" class="ui-datepicker-btn ui-datepicker-next-btn">&gt;</a>' +
            '<span class="ui-datepicker-curr-month">' + monthData.year + '-' + monthData.month + '</span>' +
            '</div>' +
            '<div class="ui-datepicker-body">' +
            '<table>' +
            '<thead>' +
            '<tr>' +
            ' <th>一</th>' +
            '<th>二</th>' +
            '<th>三</th>' +
            '<th>四</th>' +
            '<th>五</th>' +
            '<th>六</th>' +
            '<th>日</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>'
        for (var i = 0; i < monthData.days.length; i++) {
            var date = monthData.days[i];
            if (i % 7 === 0) {
                html += '<tr>';
            }
            if (date.date <= 0 || date.date > monthData.lastDate) {
                html += '<td data-date="' + date.date + '"  class="light">' + date.showDate + '</td>';
            } else {
                html += '<td data-date="' + date.date + '">' + date.showDate + '</td>';
            }
            if (i % 7 === 6) {
                html += '</tr>';
            }
        }
        html += '</tbody>' +
            '</table>' +
            '</div>'
        return html;
    };
   	
    datepicker.render = function(direction) {
        var year, month;
        if (monthData) {
            year = monthData.year;
            month = monthData.month;
        }
        if (direction === 'prev') month--;
        if (direction === 'next') month++;

        var html = datepicker.buildUi(year, month);
        $wrapper = document.querySelector('.ui-datepicker-wrapper');
        if (!$wrapper) {
            $wrapper = document.createElement('div');
            document.body.appendChild($wrapper);
            $wrapper.className = 'ui-datepicker-wrapper';
        }
        $wrapper.innerHTML = html;

        if (!selectedMonthData) return;
        if (selectedMonthData.year === monthData.year && selectedMonthData.month === monthData.month) {
            var tds = document.querySelectorAll('.ui-datepicker-body tr td');
            console.log(tds)
            for (var i = 0; i < tds.length; i++) {
                if (tds[i].dataset.date === selectedMonthData.date) {
                    tds[i].classList.add('active')
                }
            }
        }


    }

    datepicker.init = function(input) {
        datepicker.render();
        var $input = document.querySelector(input);
        var isOpen = false;
        var lastDate = monthData.lastDate;
        //点击input
        $input.addEventListener('click', function(e) {
            if (isOpen) {
                $wrapper.classList.remove('ui-datepicker-wrapper-show');
                isOpen = false;
            } else {
                $wrapper.classList.add('ui-datepicker-wrapper-show');
                var left = $input.offsetLeft;
                var top = $input.offsetTop;
                var height = $input.offsetHeight;
                var datepickerHeight = $wrapper.offsetHeight;
                var documentScrollHeight = document.body.scrollHeight;
                $wrapper.style.left = left + 'px';
                $wrapper.style.top = top + height + 2 + 'px';
                isOpen = true;
                if ((documentScrollHeight - top - height) < datepickerHeight) {
                    $wrapper.style.top = top - datepickerHeight - 2 + 'px';
                }
            }
        }, false)
        //点击切换月份
        $wrapper.addEventListener('click', function(e) {
            var $target = e.target;
            if (!$target.classList.contains('ui-datepicker-btn')) return;
            if ($target.classList.contains('ui-datepicker-prev-btn')) {
                datepicker.render('prev');
            } else if ($target.classList.contains('ui-datepicker-next-btn')) {
                datepicker.render('next');
            }

        }, false)
        //点击选择日期
        $wrapper.addEventListener('click', function(e) {
            var $target = e.target;
            if ($target.tagName.toLowerCase() !== 'td') return;
            selectedMonthData = {};
            //增加选中状态
            var tds = document.querySelectorAll('.ui-datepicker-body tr td');
            for (var i = 0; i < tds.length; i++) {
                if (tds[i].classList.contains('active')) {
                    tds[i].classList.remove('active');
                }
                if(tds[i].dataset.date<=0||tds[i].dataset.date>lastDate){
                	 tds[i].classList.add('light');
                }
            }
            $target.classList.add('active');
            $target.classList.remove('light');
            //给input赋值,记录下当前选中数据
            var date = new Date(monthData.year, monthData.month - 1, $target.dataset.date);
            selectedMonthData = {
                year: monthData.year,
                month: monthData.month,
                date: $target.dataset.date
            };

            $input.value = formate(date);
            $wrapper.classList.remove('ui-datepicker-wrapper-show');
            isOpen = false;
        })
    }


    function formate(date) {
        ret = '';
        var padding = function(num) {
            if (num <= 9) {
                return '0' + num;
            }
            return num;
        }
        ret += date.getFullYear() + '-';
        ret += padding(date.getMonth() + 1) + '-';
        ret += padding(date.getDate())
        return ret;
    }
})()