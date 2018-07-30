function InputtingCalender(id, name) {
  this.id = id;
  if (name == undefined) {
    this.changeName = false;
  } else {
    this.changeName = true;
    this.newName = name;
  }
}
InputtingCalender.prototype = {
  getEventName: function(event) {
    return outputPrefix + (this.changeName ? this.newName : event.getTitle()) + outputSuffix;
  },
  outputEvent: function(event, calender) {
    if (event.isAllDayEvent()) {
      if (addAllDayEvent) {
        calender.createAllDayEvent(this.getEventName(event), event.getStartTime(), event.getEndTime());
      }
    } else {
      calender.createEvent(this.getEventName(event), event.getStartTime(), event.getEndTime());
    }
  },
  getAllEvents: function(now, end) {
    return CalendarApp.getCalendarById(this.id).getEvents(now, end);
  }
};

var inputCalenders = [new InputtingCalender("id of calender", "busy"), // change the titles
                      new InputtingCalender("id of calender") // don't change the title 
                     ];
var outputCalenderId = "id of the calender for output";
var outputPrefix = "";
var outputSuffix = " [Auto]";
var searchRangeDaysBefore = 1;
var searchRangeDaysAfter = 365;
var addAllDayEvent = false;

function myFunction() {
  var start = new Date();
  start.setDate(start.getDate() - searchRangeDaysBefore);
  var end = new Date();
  end.setDate(end.getDate() + searchRangeDaysAfter);
  var outputCalender = CalendarApp.getCalendarById(outputCalenderId);

  var existingEvents = outputCalender.getEvents(start, end);
  //deleteIfAutoEvents(outputCalender, now, end);

  var inputLength = inputCalenders.length;
  for (var i = 0; i < inputLength; i++) {
    var calender = inputCalenders[i];
    var events = calender.getAllEvents(start, end);
    var eventLength = events.length;
    for (var j = 0; j < eventLength; j++) {
      var event = events[j];
      if (!removeExistedEvent(existingEvents, event, calender)) {
        inputCalenders[i].outputEvent(event, outputCalender);
      }
    }
  }
  
  var len = existingEvents.length;
  for (var i = 0; i < len; i++) {
    var e = existingEvents[i];
    if (isAutomaticallyAdded(e)) {
      e.deleteEvent();
    }
  }
}

function deleteAutoEvents() {
  var now = new Date();
  now.setDate(now.getDate() - searchRangeDaysBefore);
  var end = new Date();
  end.setDate(end.getDate() + searchRangeDaysAfter);
  const outputCalender = CalendarApp.getCalendarById(outputCalenderId);
    
  deleteAutoEvents(outputCalender, now, end);
}

function deleteIfAutoEvents(calender, start, end) {
  var events = calender.getEvents(start, end);
  var len = events.length;
  for (var i = 0; i < len; i++) {
    var e = events[i];
    if (isAutomaticallyAdded(e)) {
      e.deleteEvent();
    }
  }
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

function isNotEmptyString(string) {
  return string.length != 0;
}

/*
 * @param {CalendarEvent[]} 
 * @param {CalendarEvent} 
 * @return {Boolean}
 */ 
function removeExistedEvent(existingEvents, searchingEvent, calender) {
  var len = existingEvents.length;
  for (var i = 0; i < len; i++) {
    var e = existingEvents[i];
    if (//isAutomaticallyAdded(e) &&
        e.isAllDayEvent() == searchingEvent.isAllDayEvent()
        && e.getTitle() == calender.getEventName(searchingEvent)
        && e.getStartTime() == searchingEvent.getStartTime()
        && e.getEndTime() == searchingEvent.getEndTime()) {
      existingEvents.remove(i);
      return true;
    }
  }
  return false;
}
