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
let curHr = 0;
let curMin = 0;
let alarmHr = 0;
let alarmMin = 0;
let alarmSet = false;

// this function sets the current time from the user's input
function setTime() {
    basic.showString("Hr");
    while (true) {
        basic.pause(100);
        basic.showNumber(curHr);
        if (input.buttonIsPressed(Button.A) && !(input.buttonIsPressed(Button.B))) {
            curHr += 1;
        }
        else if (input.buttonIsPressed(Button.B) && !(input.buttonIsPressed(Button.A))) {
            curHr -= 1;
        }
        else if (input.buttonIsPressed(Button.AB)) {
            basic.showString("Min")
            while (true) {
                basic.pause(100);
                basic.showNumber(curMin);
                if (input.buttonIsPressed(Button.A) && !(input.buttonIsPressed(Button.B))) {
                    curMin += 1;
                }
                else if (input.buttonIsPressed(Button.B) && !(input.buttonIsPressed(Button.A))) {
                    curMin -= 1;
                }
                else if (input.buttonIsPressed(Button.AB)) {
                    timeanddate.set24HourTime(curHr, curMin, 0);
                    timeSet = true;
                    break;
                }
            }
            break;
        }
    }
}

// this function sets the alarm time from the user's input
function setAlarm() {
    basic.showString("Hr");
    while (true) {
        basic.pause(100);
        basic.showNumber(curHr);
        if (input.buttonIsPressed(Button.A) && !(input.buttonIsPressed(Button.B))) {
            curHr += 1;
        }
        else if (input.buttonIsPressed(Button.B) && !(input.buttonIsPressed(Button.A))) {
            curHr -= 1;
        }
        else if (input.buttonIsPressed(Button.AB)) {
            basic.showString("Min")
            while (true) {
                basic.pause(100);
                basic.showNumber(curMin);
                if (input.buttonIsPressed(Button.A) && !(input.buttonIsPressed(Button.B))) {
                    curMin += 1;
                }
                else if (input.buttonIsPressed(Button.B) && !(input.buttonIsPressed(Button.A))) {
                    curMin -= 1;
                }
                else if (input.buttonIsPressed(Button.AB)) {
                    alarmHr = curHr;
                    alarmMin = curMin;
                    alarmSet = true;
                    break;
                }
            }
        }
        else {
            continue;
        }
        break;
    }
}

// this section deals with the alarm sounding
// initialise variables
let dismissed = false;
let hoursSlept = 0;
let mood = 0;

// this function checks if it's time for the alarm to sound, sounds it and then asks the user for their mood
function checkAlarm() {
    if (dismissed == true) {
        timeanddate.numericTime(function (hour: number, minute: number, second: number, month: number, day: number, year: number) {
            if (hour == alarmHr + 1) {
                dismissed = false;
            }
        })
    }
    if ((alarmSet == true) && (dismissed == false)) {
        timeanddate.numericTime(function (hour: number, minute: number, second: number, month: number, day: number, year: number) {
            if (hour == alarmHr) {
                if (minute == alarmMin) {
                    while (true) {
                        basic.showString("A")
                        music.play(music.stringPlayable("C C5 C5 C5 C5 C5 C5 C ", 256), music.PlaybackMode.UntilDone) // play alarm noise
                        if (input.buttonIsPressed(Button.A)) {
                            basic.showString("d"); //for dismiss
                            dismissed = true;
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
