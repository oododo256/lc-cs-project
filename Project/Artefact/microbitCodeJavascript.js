// Define Icons Used as Constants
const menuIcons =
    [
        images.createImage(`
. . . . #
. . . # .
. . # . .
. . . # .
. . . . .
`),
        images.createImage(`
. # # # .
# . . . .
. # # . .
. . . # .
# # # . .
`)]

//These icons are for selecting whether or not you mean to set the current time, or alarm routine
const setIcons =
    [
        images.createImage(`
. . . . .
. # # # .
. . # . .
. . # . .
. . # . .
`),
        images.createImage(`
. . . . .
. # # # .
. # . # .
. # # # .
. # . # .
`)]

// initialise variables
let curHr = 0; //used for the setting functions (to hold the currently selected hour and minute)
let curMin = 0;
let alarmHr = 0; //the hour and minute set for the alarm to go off at
let alarmMin = 0;
let alarmSet = false; //is the alarm set? start false

// this function sets the current time from the user's input
function setTime() {
    basic.showString("Hr");//show that we're now setting the hour
    while (true) {
        basic.pause(100); //wait 100ms (this is to prevent the number going up too fast)
        basic.showNumber(curHr); //show what the currently selected number is
        if (input.buttonIsPressed(Button.A) && !(input.buttonIsPressed(Button.B))) { //if A pressed and B isn't
            curHr += 1; //increment the current hour
        }
        else if (input.buttonIsPressed(Button.B) && !(input.buttonIsPressed(Button.A))) { //if B pressed and A isn't
            curHr -= 1; //decrement the current
        }
        else if (input.buttonIsPressed(Button.AB)) { //if both pressed
            basic.showString("Min") //show that we are now setting the minute
            while (true) { //new loop 
                basic.pause(100); 
                basic.showNumber(curMin); // same principle as above but for minute
                if (input.buttonIsPressed(Button.A) && !(input.buttonIsPressed(Button.B))) {
                    curMin += 1;
                }
                else if (input.buttonIsPressed(Button.B) && !(input.buttonIsPressed(Button.A))) {
                    curMin -= 1;
                }
                else if (input.buttonIsPressed(Button.AB)) { // if both
                    timeanddate.set24HourTime(curHr, curMin, 0); // set the time using curHr as the current hour, curMin as the current minute, and setting the second to 0
                    timeSet = true; // the time is now set
                    break; //break the minute loop
                }
            }
            break; //break the hour loop
        }
    }
}

// this function sets the alarm time from the user's input
function setAlarm() { //same principle as the setTime function
    basic.showString("Hr"); //we're setting hour now
    while (true) { //hour loop
        basic.pause(100); //wait so the number doesn't go up too fast
        basic.showNumber(curHr); //show current number
        if (input.buttonIsPressed(Button.A) && !(input.buttonIsPressed(Button.B))) {
            curHr += 1; //increment
        }
        else if (input.buttonIsPressed(Button.B) && !(input.buttonIsPressed(Button.A))) {
            curHr -= 1; //decrement
        }
        else if (input.buttonIsPressed(Button.AB)) {
            basic.showString("Min")
            while (true) { //minute loop
                basic.pause(100);
                basic.showNumber(curMin);
                if (input.buttonIsPressed(Button.A) && !(input.buttonIsPressed(Button.B))) {
                    curMin += 1; //increment
                }
                else if (input.buttonIsPressed(Button.B) && !(input.buttonIsPressed(Button.A))) {
                    curMin -= 1; //decrement
                }
                else if (input.buttonIsPressed(Button.AB)) {
                    alarmHr = curHr; //set alarmHr to the current selected hour
                    alarmMin = curMin; //same for the minute
                    alarmSet = true; //the alarm is now set
                    break; // break minute loop
                }
            }
        }
        else {
            continue;
        }
        break; //break hour loop
    }
}

// this section deals with the alarm sounding
// initialise variables
let dismissed = false; //is the alarm being dismissed by the user, start with no
let hoursSlept = 0; //how many hours has the user slept, start with 0
let mood = 0; //whats the user's mood, start with 0

// this function checks if it's time for the alarm to sound, sounds it and then asks the user for their mood
function checkAlarm() {
    if (dismissed == true) { //if the alarm is being dismissed
        timeanddate.numericTime(function (hour: number, minute: number, second: number, month: number, day: number, year: number) {
            if (hour == alarmHr + 1) {//if its been an hour
                dismissed = false;//no longer dismissed
            }
        })
    }
    if ((alarmSet == true) && (dismissed == false)) {//if the alarm is set and not dismissed
        timeanddate.numericTime(function (hour: number, minute: number, second: number, month: number, day: number, year: number) {
            if (hour == alarmHr) { //if its the alarm hour
                if (minute == alarmMin) { //...and the alarm minute
                    while (true) { //loop the alarm
                        basic.showString("A") //show "A" for alarm
                        music.play(music.stringPlayable("C C5 C5 C5 C5 C5 C5 C ", 256), music.PlaybackMode.UntilDone) // play alarm noise
                        if (input.buttonIsPressed(Button.A)) {//if the user presses A, dismiss
                            basic.showString("d"); //for dismiss
                            dismissed = true; //dismiss alarm
                            wakeUpHour = hour;
                            hoursSlept = ((wakeUpHour + 24) - sleepHr); // we calculate the hours slept here
                            if (sleepHr == wakeUpHour) {
                                hoursSlept = 0;
                            }
                            basic.showString("Mood") // get the user's mood
                            while (true) {
                                basic.showNumber(mood);
                                if (input.buttonIsPressed(Button.A) && !(input.buttonIsPressed(Button.B))) {
                                    mood += 1;
                                }
                                else if (input.buttonIsPressed(Button.B) && !(input.buttonIsPressed(Button.A))) {
                                    mood -= 1;
                                }
                                else if (input.buttonIsPressed(Button.AB)) {
                                    basic.showString("OK");
                                    break;
                                }

                            }
                            datalogger.log(datalogger.createCV("Hours slept", hoursSlept), datalogger.createCV("Mood Rating", mood));
                            break;
                        }
                    }
                }
            }
        })
    }
    else {
        //pass
    }
}

//initialise the menu
let currentIcon = 0;
let timeSet = false;
let sleepHr = 0;
let wakeUpHour = 0;

// set the sleep time of the user on the logo button being pressed
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    if (timeSet == true) {
        timeanddate.numericTime(function (hour: number, minute: number, second: number, month: number, day: number, year: number) {
            sleepHr = hour;
            basic.showString("Sleep Time Set");
            basic.showNumber(sleepHr);
        }
        )
    }
    else {
        basic.showString("TIME NOT SET");
    }
})

// main loop
while (true) {
    checkAlarm();
    menuIcons[currentIcon].showImage(0)
    if (input.buttonIsPressed(Button.A) && (timeSet) && (currentIcon == 0)) {
        while (true) {
            checkAlarm();
            basic.showString(timeanddate.time(timeanddate.TimeFormat.HHMM24hr));
            if (input.buttonIsPressed(Button.B)) {
                basic.showString("e"); //for exiting
                break;
            }
        }
    }
    else if (input.buttonIsPressed(Button.A) && !(timeSet) && (currentIcon == 0)) {
        basic.showString("TIME NOT SET")
    }
    else if (input.buttonIsPressed(Button.A) && (currentIcon == 1)) {
        currentIcon = 0;
        while (true) {
            setIcons[currentIcon].showImage(0)
            if (input.buttonIsPressed(Button.B) && !(input.buttonIsPressed(Button.A))) {
                if (currentIcon == 1) {
                    currentIcon = 0;
                }
                else {
                    currentIcon = 1;
                }
            }
            else if (input.buttonIsPressed(Button.A) && !(input.buttonIsPressed(Button.B)) && (currentIcon == 0)) {
                setTime();
                currentIcon = 0;
                break;
            }
            else if (input.buttonIsPressed(Button.A) && !(input.buttonIsPressed(Button.B)) && (currentIcon == 1)) {
                setAlarm();
                currentIcon = 0;
                break;
            }
            else if (input.buttonIsPressed(Button.AB)) {
                basic.showString("e"); // for exiting
                currentIcon = 0;
                break;
            }
        }
    }
    else if (input.buttonIsPressed(Button.B)) {
        if (currentIcon == 0) {
            currentIcon = 1;
        }
        else {
            currentIcon = 0;
        }
        basic.pause(100)
    }
}
