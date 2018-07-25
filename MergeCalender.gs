var inputCalenders = [new InputtingCalender("id of calender", "busy"), // change the titles
                      new InputtingCalender("id of calender") // don't change the title 
                     ];
var outputCalenderId = "id of the calender for output";
var outputPrefix = "";
var outputSuffix = " [Auto]";
var searchRangeDaysBefore = 7;
var searchRangeDaysAfter = 365;
var addAllDayEvent = false;

function myFunction() {
  var now = new Date();
  now.setDate(now.getDate() - searchRangeDaysBefore);
  var end = new Date();
  end.setDate(end.getDate() + searchRangeDaysAfter);
  const outputCalender = CalendarApp.getCalendarById(outputCalenderId);
  
  deleteAutoEvents(outputCalender, now, end);
  
  var inputLength = inputCalenders.length;
  for (var i = 0; i < inputLength; i++) {
    var events = inputCalenders[i].getAllEvents(now, end);
    var eventLength = events.length;
    for (var j = 0; j < eventLength; j++) {
      inputCalenders[i].outputEvent(events[j], outputCalender);
    }
  }
}

function deleteAllAutoEvents() {
  var now = new Date();
  var end = new Date();
  end.setDate(end.getDate() + searchRangeDays);
  const outputCalender = CalendarApp.getCalendarById(outputCalenderId);
    
  deleteAutoEvents(outputCalender, now, end);
}

function deleteAutoEvents(calender, start, end) {
  var events = calender.getEvents(start, end);
  var len = events.length;
  for (var i = 0; i < len; i++) {
    var e = events[i];
    if (isAutomaticallyAdded(e)) {
      e.deleteEvent();
    }
  }
}

function addAsNewEvent(event, calender) {
  
}

/*
 * @param {CalendarEvent} 
 * @return {Boolean} if the event is added automatically, true.
 */ 
function isAutomaticallyAdded(event) {
  var title = event.getTitle();
  return ((isNotEmptyString(outputPrefix) ? title.indexOf(outputPrefix) != -1 : true)
          && (isNotEmptyString(outputSuffix) ? title.indexOf(outputSuffix) != -1 : true));
}

/*
 * TODO
 */
function isNotEmptyString(string) {
  return string.length != 0;
}


function InputtingCalender(id) {
  this.id = id;
  this.changeName = false;
}
function InputtingCalender(id, name) {
  this.id = id;
  this.changeName = true;
  this.newName = name;
}
InputtingCalender.prototype.outputEvent = function(event, calender) {
  var name = outputPrefix + (this.changeName ? this.newName : event.getTitle()) + outputSuffix;
  
  if (event.isAllDayEvent()) {
    if (addAllDayEvent) {
      calender.createAllDayEvent(name, event.getStartTime(), event.getEndTime());
    }
  } else {
    calender.createEvent(name, event.getStartTime(), event.getEndTime());
  }
};
InputtingCalender.prototype.getAllEvents = function(now, end) {
    return CalendarApp.getCalendarById(this.id).getEvents(now, end);
};
