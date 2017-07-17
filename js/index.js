var debug = true;

var Timer = (function () {
    function Timer() {
        this.sessionTimer = true;
        this.running = false;
        this.tid = null;
        this.minutes = 25;
        this.seconds = 0;
        this.break = 5;
        this.session = 25;



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
            this.break--;
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
            this.session--;
            this.displaySession();
        }
        this.getSession = function () {
            return this.session;
        }

        function formatSeconds(n) {
            return n > 9 ? "" + n : "0" + n;
        }
        this.displayTime = function () {
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
                if (that.isTimeOut()) {
                    if (that.sessionTimer) {
                        if (debug) console.log("SWITCH: " + that.sessionTimer + " " + that.break+" " + that.tid);
                        that.sessionTimer = false;
                        that.setTime(that.break);
                        that.tid = setTimeout(tick, 1000);
                    } else {
                        that.sessionTimer = true;
                        that.setTime(that.session);
                        that.tid = setTimeout(tick, 1000);
                    }
                } else {
                    that.tid = setTimeout(tick, 1000);
                }
            }

            var that = this;
            this.running = true;
            that.tid = setTimeout(tick, 1000);
        }
        this.stopTimer = function () {
            clearTimeout(this.tid);
            this.running = false;
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

var timer = Timer.getInstance();

$(document).ready(function () {
    setDisplay()
    setListeners();
});

function setDisplay() {
    timer.displayBreak();
    timer.displaySession();
    timer.displayTime();
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
        if (timer.isRunning()) {
            timer.stopTimer();
        } else {
            timer.startTimer();
        }
    });
}