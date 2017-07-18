var debug = false;

var Timer = (function () {
    function Timer() {
        this.sessionTimer = true;
        this.running = false;
        this.tid = null;
        this.minutes = null;
        this.seconds = null;
        this.break = 5;
        this.breakColor = "red";
        this.session = 25;
        this.sessionColor = "rgba(165, 246, 0, 0.81)";
        this.alarm = null;

        this.isRunning = function () {
            return this.running;
        }
        this.toggleIsRunning = function () {
            this.running = running ? false : true;
        }
        this.displayBreak = function () {
            $("#break .readout").html(this.break);
        }
        this.setBreak = function (duration) {
            this.break = duration;
            this.displayBreak()
        }
        this.incrementBreak = function () {
            this.break++;
            this.displayBreak()
        }
        this.decrementBreak = function () {
            if (this.break > 1) this.break--;
            this.displayBreak()
        }
        this.getBreak = function () {
            return this.break;
        }
        this.displaySession = function () {
            $("#session .readout").html(this.session);
        }
        this.setSession = function (duration) {
            this.session = duration;
            this.displaySession();
        }
        this.incrementSession = function () {
            this.session++;
            this.displaySession();
        }
        this.decrementSession = function () {
            if (this.session > 1) this.session--;
            this.displaySession();
        }
        this.getSession = function () {
            return this.session;
        }

        function formatSeconds(n) {
            return n > 9 ? "" + n : "0" + n;
        }
        this.displayTime = function () {
            var label = null;
            var color = null;
            var percent = null;

            if (this.sessionTimer) {
                label = "Session";
                color = this.sessionColor;
                percent = Math.floor((((this.session * 60) - (this.minutes * 60 + this.seconds)) / (this.session * 60)) * 100 + 0.5);
            } else {
                label = "Break!";
                color = this.breakColor;
                percent = Math.floor((((this.minutes * 60 + this.seconds)) / (this.break * 60)) * 100 + 0.5);
            }
            var bgStyle = "linear-gradient(0deg, " + color + " " + percent + "%, transparent " + percent + "%)"
            if (debug) console.log("BG: " + bgStyle);
            $(".timer-label").html(label);
            $("#timer").css("border-color", color);
            $("#timer").css({
                background: bgStyle
            });
            $("#timer-readout").html(this.minutes + ":" + formatSeconds(this.seconds));
        }
        this.setTime = function (duration) {
            this.minutes = duration;
            this.seconds = 0;
            this.displayTime();
        }
        this.decrementTime = function () {
            if (this.seconds === 0) {
                this.minutes--;
                this.seconds = 59;
            } else {
                this.seconds--;
            }
            this.displayTime();
        }
        this.isTimeOut = function () {
            return (this.minutes === 0 && this.seconds === 0);
        }

        this.startTimer = function () {
            function tick() {
                that.decrementTime();
                if (that.isTimeOut()) { //Switch timers on TimeOut
                    that.switchTimer();
                }
                that.tid = setTimeout(tick, 1000);

            }

            var that = this;
            this.running = true;
            that.tid = setTimeout(tick, 1000);
        }
        this.stopTimer = function () {
            clearTimeout(this.tid);
            this.running = false;
        }
        this.switchTimer = function () {
            if (debug) console.log("SWITCH: " + timer.sessionTimer + " " + timer.break+" " + timer.tid);
            if (this.alarm) this.alarm.play();
            if (timer.sessionTimer) {
                timer.sessionTimer = false;
                timer.setTime(timer.break);
            } else {
                timer.sessionTimer = true;
                timer.setTime(timer.session);
            }
        }
        this.setAlarm = function (alarm) {
            if (alarm) this.alarm = alarm;
        }
        this.getAlarm = function () {
            return this.alarm;
        }
    }

    var instance;
    return {
        getInstance: function () {
            if (instance === undefined) {
                instance = new Timer();
                // Hide the constructor so the returned objected can't be new'd...
                instance.constructor = null;
            }
            return instance;
        }
    };
})();

function Sound(src) {
    try {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function () {
            this.sound.play();
        }
        this.stop = function () {
            this.sound.pause();
        }
    } catch (err) {
        console.log(err);
    }
}

var timer = Timer.getInstance();

$(document).ready(function () {
    setDisplay()
    setListeners();
    timer.setAlarm(new Sound("https://www.kganguly.com/media/A-Tone-His_Self-1266414414.mp3"));
});

function setDisplay() {
    timer.displayBreak();
    timer.displaySession();
    timer.setTime(timer.getSession());
}

function setListeners() {
    $("#break .minus").click(function () {
        if (!timer.isRunning()) {
            timer.decrementBreak();
            if (!timer.sessionTimer) timer.setTime(timer.getBreak());
        }
    });
    $("#break .plus").click(function () {
        if (!timer.isRunning()) {
            timer.incrementBreak();
            if (!timer.sessionTimer) timer.setTime(timer.getBreak());
        }
    });
    $("#session .minus").click(function () {
        if (!timer.isRunning()) {
            timer.decrementSession();
            if (timer.sessionTimer) timer.setTime(timer.getSession());
        }
    });
    $("#session .plus").click(function () {
        if (!timer.isRunning()) {
            timer.incrementSession();
            if (timer.sessionTimer) timer.setTime(timer.getSession());
        }
    });
    $("#timer").click(function () {
        var alarm = timer.getAlarm();
        alarm.play();
        alarm.stop();
        if (timer.isRunning()) {
            timer.stopTimer();
        } else {
            timer.startTimer();
        }
    });
}