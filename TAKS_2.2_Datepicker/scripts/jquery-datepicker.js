$(function () {
  $("#datepicker").datepicker({
    changeMonth: true,
    changeYear: true,
    numberOfMonths: 3,
    showAnim: "slideDown",
    showButtonPanel: true,
    showOn: "both",
    onSelect: singleFieldRangeDatepickerOnSelect,
    onClose: singleFieldRangeDatepickerOnClose,
    buttonImage: "images/icons/calendar.gif",
    buttonImageOnly: true,
    buttonText: "Select date"
  })
});

function singleFieldRangeDatepickerOnSelect(selectedDate) {
  if (!$(this).data().datepicker.first) {
    $(this).data().datepicker.inline = true;
    $(this).data().datepicker.first = selectedDate;
  } else {
    if (selectedDate > $(this).data().datepicker.first) {
      $(this).val($(this).data().datepicker.first + " - " + selectedDate);
    } else {
      $(this).val(selectedDate + " - " + $(this).data().datepicker.first);
    }
    $(this).data().datepicker.inline = false;
  }
}

function singleFieldRangeDatepickerOnClose() {
  delete $(this).data().datepicker.first;
  $(this).data().datepicker.inline = false;
}

$.datepicker._gotoToday = function (id) {
  var target = $(id);
  var inst = this._getInst(target[0]);
  if (this._get(inst, 'gotoCurrent') && inst.currentDay) {
    inst.selectedDay = inst.currentDay;
    inst.drawMonth = inst.selectedMonth = inst.currentMonth;
    inst.drawYear = inst.selectedYear = inst.currentYear;
  }
  else {
    var date = new Date();
    inst.selectedDay = date.getDate();
    inst.drawMonth = inst.selectedMonth = date.getMonth();
    inst.drawYear = inst.selectedYear = date.getFullYear();
    // the below two lines are new
    this._setDateDatepicker(target, date);
    this._selectDate(id, this._getDateDatepicker(target));
  }
  this._notifyChange(inst);
  this._adjustDate(target);
}


// The only line changed in the _generateHTML is the one with the text "ui-datepicker-close"
// The change has been made to keep the "Done" button on the form for the second date selection
// Otherwise, because we use "datepicker.inline = true" the "Done" button will disappear before the second date selection
$.datepicker._generateHTML = function( inst ) {
  var maxDraw, prevText, prev, nextText, next, currentText, gotoDate,
    controls, buttonPanel, firstDay, showWeek, dayNames, dayNamesMin,
    monthNames, monthNamesShort, beforeShowDay, showOtherMonths,
    selectOtherMonths, defaultDate, html, dow, row, group, col, selectedDate,
    cornerClass, calender, thead, day, daysInMonth, leadDays, curRows, numRows,
    printDate, dRow, tbody, daySettings, otherMonth, unselectable,
    tempDate = new Date(),
    today = this._daylightSavingAdjust(
      new Date( tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate() ) ), // clear time
    isRTL = this._get( inst, "isRTL" ),
    showButtonPanel = this._get( inst, "showButtonPanel" ),
    hideIfNoPrevNext = this._get( inst, "hideIfNoPrevNext" ),
    navigationAsDateFormat = this._get( inst, "navigationAsDateFormat" ),
    numMonths = this._getNumberOfMonths( inst ),
    showCurrentAtPos = this._get( inst, "showCurrentAtPos" ),
    stepMonths = this._get( inst, "stepMonths" ),
    isMultiMonth = ( numMonths[ 0 ] !== 1 || numMonths[ 1 ] !== 1 ),
    currentDate = this._daylightSavingAdjust( ( !inst.currentDay ? new Date( 9999, 9, 9 ) :
      new Date( inst.currentYear, inst.currentMonth, inst.currentDay ) ) ),
    minDate = this._getMinMaxDate( inst, "min" ),
    maxDate = this._getMinMaxDate( inst, "max" ),
    drawMonth = inst.drawMonth - showCurrentAtPos,
    drawYear = inst.drawYear;

  if ( drawMonth < 0 ) {
    drawMonth += 12;
    drawYear--;
  }
  if ( maxDate ) {
    maxDraw = this._daylightSavingAdjust( new Date( maxDate.getFullYear(),
      maxDate.getMonth() - ( numMonths[ 0 ] * numMonths[ 1 ] ) + 1, maxDate.getDate() ) );
    maxDraw = ( minDate && maxDraw < minDate ? minDate : maxDraw );
    while ( this._daylightSavingAdjust( new Date( drawYear, drawMonth, 1 ) ) > maxDraw ) {
      drawMonth--;
      if ( drawMonth < 0 ) {
        drawMonth = 11;
        drawYear--;
      }
    }
  }
  inst.drawMonth = drawMonth;
  inst.drawYear = drawYear;

  prevText = this._get( inst, "prevText" );
  prevText = ( !navigationAsDateFormat ? prevText : this.formatDate( prevText,
    this._daylightSavingAdjust( new Date( drawYear, drawMonth - stepMonths, 1 ) ),
    this._getFormatConfig( inst ) ) );

  prev = ( this._canAdjustMonth( inst, -1, drawYear, drawMonth ) ?
    "<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click'" +
    " title='" + prevText + "'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "e" : "w" ) + "'>" + prevText + "</span></a>" :
    ( hideIfNoPrevNext ? "" : "<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='" + prevText + "'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "e" : "w" ) + "'>" + prevText + "</span></a>" ) );

  nextText = this._get( inst, "nextText" );
  nextText = ( !navigationAsDateFormat ? nextText : this.formatDate( nextText,
    this._daylightSavingAdjust( new Date( drawYear, drawMonth + stepMonths, 1 ) ),
    this._getFormatConfig( inst ) ) );

  next = ( this._canAdjustMonth( inst, +1, drawYear, drawMonth ) ?
    "<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click'" +
    " title='" + nextText + "'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "w" : "e" ) + "'>" + nextText + "</span></a>" :
    ( hideIfNoPrevNext ? "" : "<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='" + nextText + "'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "w" : "e" ) + "'>" + nextText + "</span></a>" ) );

  currentText = this._get( inst, "currentText" );
  gotoDate = ( this._get( inst, "gotoCurrent" ) && inst.currentDay ? currentDate : today );
  currentText = ( !navigationAsDateFormat ? currentText :
    this.formatDate( currentText, gotoDate, this._getFormatConfig( inst ) ) );

  // Original JQuery lib version is commented
  // controls = ( !inst.inline ? "<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>" +
  //   this._get( inst, "closeText" ) + "</button>" : "" );
  controls = ("<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>" +
    this._get( inst, "closeText" ) + "</button>");

  buttonPanel = ( showButtonPanel ) ? "<div class='ui-datepicker-buttonpane ui-widget-content'>" + ( isRTL ? controls : "" ) +
    ( this._isInRange( inst, gotoDate ) ? "<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'" +
    ">" + currentText + "</button>" : "" ) + ( isRTL ? "" : controls ) + "</div>" : "";

  firstDay = parseInt( this._get( inst, "firstDay" ), 10 );
  firstDay = ( isNaN( firstDay ) ? 0 : firstDay );

  showWeek = this._get( inst, "showWeek" );
  dayNames = this._get( inst, "dayNames" );
  dayNamesMin = this._get( inst, "dayNamesMin" );
  monthNames = this._get( inst, "monthNames" );
  monthNamesShort = this._get( inst, "monthNamesShort" );
  beforeShowDay = this._get( inst, "beforeShowDay" );
  showOtherMonths = this._get( inst, "showOtherMonths" );
  selectOtherMonths = this._get( inst, "selectOtherMonths" );
  defaultDate = this._getDefaultDate( inst );
  html = "";

  for ( row = 0; row < numMonths[ 0 ]; row++ ) {
    group = "";
    this.maxRows = 4;
    for ( col = 0; col < numMonths[ 1 ]; col++ ) {
      selectedDate = this._daylightSavingAdjust( new Date( drawYear, drawMonth, inst.selectedDay ) );
      cornerClass = " ui-corner-all";
      calender = "";
      if ( isMultiMonth ) {
        calender += "<div class='ui-datepicker-group";
        if ( numMonths[ 1 ] > 1 ) {
          switch ( col ) {
            case 0: calender += " ui-datepicker-group-first";
              cornerClass = " ui-corner-" + ( isRTL ? "right" : "left" ); break;
            case numMonths[ 1 ] - 1: calender += " ui-datepicker-group-last";
              cornerClass = " ui-corner-" + ( isRTL ? "left" : "right" ); break;
            default: calender += " ui-datepicker-group-middle"; cornerClass = ""; break;
          }
        }
        calender += "'>";
      }
      calender += "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" + cornerClass + "'>" +
        ( /all|left/.test( cornerClass ) && row === 0 ? ( isRTL ? next : prev ) : "" ) +
        ( /all|right/.test( cornerClass ) && row === 0 ? ( isRTL ? prev : next ) : "" ) +
        this._generateMonthYearHeader( inst, drawMonth, drawYear, minDate, maxDate,
        row > 0 || col > 0, monthNames, monthNamesShort ) + // draw month headers
        "</div><table class='ui-datepicker-calendar'><thead>" +
        "<tr>";
      thead = ( showWeek ? "<th class='ui-datepicker-week-col'>" + this._get( inst, "weekHeader" ) + "</th>" : "" );
      for ( dow = 0; dow < 7; dow++ ) { // days of the week
        day = ( dow + firstDay ) % 7;
        thead += "<th scope='col'" + ( ( dow + firstDay + 6 ) % 7 >= 5 ? " class='ui-datepicker-week-end'" : "" ) + ">" +
          "<span title='" + dayNames[ day ] + "'>" + dayNamesMin[ day ] + "</span></th>";
      }
      calender += thead + "</tr></thead><tbody>";
      daysInMonth = this._getDaysInMonth( drawYear, drawMonth );
      if ( drawYear === inst.selectedYear && drawMonth === inst.selectedMonth ) {
        inst.selectedDay = Math.min( inst.selectedDay, daysInMonth );
      }
      leadDays = ( this._getFirstDayOfMonth( drawYear, drawMonth ) - firstDay + 7 ) % 7;
      curRows = Math.ceil( ( leadDays + daysInMonth ) / 7 ); // calculate the number of rows to generate
      numRows = ( isMultiMonth ? this.maxRows > curRows ? this.maxRows : curRows : curRows ); //If multiple months, use the higher number of rows (see #7043)
      this.maxRows = numRows;
      printDate = this._daylightSavingAdjust( new Date( drawYear, drawMonth, 1 - leadDays ) );
      for ( dRow = 0; dRow < numRows; dRow++ ) { // create date picker rows
        calender += "<tr>";
        tbody = ( !showWeek ? "" : "<td class='ui-datepicker-week-col'>" +
          this._get( inst, "calculateWeek" )( printDate ) + "</td>" );
        for ( dow = 0; dow < 7; dow++ ) { // create date picker days
          daySettings = ( beforeShowDay ?
            beforeShowDay.apply( ( inst.input ? inst.input[ 0 ] : null ), [ printDate ] ) : [ true, "" ] );
          otherMonth = ( printDate.getMonth() !== drawMonth );
          unselectable = ( otherMonth && !selectOtherMonths ) || !daySettings[ 0 ] ||
            ( minDate && printDate < minDate ) || ( maxDate && printDate > maxDate );
          tbody += "<td class='" +
            ( ( dow + firstDay + 6 ) % 7 >= 5 ? " ui-datepicker-week-end" : "" ) + // highlight weekends
            ( otherMonth ? " ui-datepicker-other-month" : "" ) + // highlight days from other months
            ( ( printDate.getTime() === selectedDate.getTime() && drawMonth === inst.selectedMonth && inst._keyEvent ) || // user pressed key
            ( defaultDate.getTime() === printDate.getTime() && defaultDate.getTime() === selectedDate.getTime() ) ?

            // or defaultDate is current printedDate and defaultDate is selectedDate
            " " + this._dayOverClass : "" ) + // highlight selected day
            ( unselectable ? " " + this._unselectableClass + " ui-state-disabled" : "" ) +  // highlight unselectable days
            ( otherMonth && !showOtherMonths ? "" : " " + daySettings[ 1 ] + // highlight custom dates
            ( printDate.getTime() === currentDate.getTime() ? " " + this._currentClass : "" ) + // highlight selected day
            ( printDate.getTime() === today.getTime() ? " ui-datepicker-today" : "" ) ) + "'" + // highlight today (if different)
            ( ( !otherMonth || showOtherMonths ) && daySettings[ 2 ] ? " title='" + daySettings[ 2 ].replace( /'/g, "&#39;" ) + "'" : "" ) + // cell title
            ( unselectable ? "" : " data-handler='selectDay' data-event='click' data-month='" + printDate.getMonth() + "' data-year='" + printDate.getFullYear() + "'" ) + ">" + // actions
            ( otherMonth && !showOtherMonths ? "&#xa0;" : // display for other months
            ( unselectable ? "<span class='ui-state-default'>" + printDate.getDate() + "</span>" : "<a class='ui-state-default" +
            ( printDate.getTime() === today.getTime() ? " ui-state-highlight" : "" ) +
            ( printDate.getTime() === currentDate.getTime() ? " ui-state-active" : "" ) + // highlight selected day
            ( otherMonth ? " ui-priority-secondary" : "" ) + // distinguish dates from other months
            "' href='#'>" + printDate.getDate() + "</a>" ) ) + "</td>"; // display selectable date
          printDate.setDate( printDate.getDate() + 1 );
          printDate = this._daylightSavingAdjust( printDate );
        }
        calender += tbody + "</tr>";
      }
      drawMonth++;
      if ( drawMonth > 11 ) {
        drawMonth = 0;
        drawYear++;
      }
      calender += "</tbody></table>" + ( isMultiMonth ? "</div>" +
            ( ( numMonths[ 0 ] > 0 && col === numMonths[ 1 ] - 1 ) ? "<div class='ui-datepicker-row-break'></div>" : "" ) : "" );
      group += calender;
    }
    html += group;
  }
  html += buttonPanel;
  inst._keyEvent = false;
  return html;
}