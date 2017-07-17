var debug = true;

var Timer = (function () {
    function Timer() {
        this.isRunning = false;
        this.minutes = 25;
        this.seconds = 0;
        this.break = 5;
        this.session = 25;

        this.isRunning = function () {
            return this.isRunning;
        }
        this.toggleIsRunning = function () {
            this.isRunning = isRunning ? false : true;
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
        this.displayTime = function () {
            $("#timer-readout").html(this.minutes);
        }
        this.setTime = function (duration) {
            this.minutes = duration;
            this.displayTime();
        }
        this.incrementTime = function () {
            this.minutes++;
            this.displayTime();
        }
        this.decrementTime = function () {
            this.minutes--;
            this.displayTime();
        }
        this.getTime = function () {
            return this.minutes;
        }

        this.startTimer = function () {
            function tick() {
                that.decrementTime();
                if (that.getTime() === 0) {
                    clearTimeout(tid);
                } else {
                    setTimeout(tick, 1000);
                }
            }
            var that = this;
            var tid = setTimeout(tick, 1000);
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
    if (debug) console.log("DISPLAY", timer.getTime());
    $("#break .readout").html(timer.getBreak());
    $("#session .readout").html(timer.getSession());
    $("#timer-readout").html(timer.getTime());
}

function setListeners() {
    $("#break .minus").click(function () {
        timer.decrementBreak();
    });
    $("#break .plus").click(function () {
        timer.incrementBreak();
    });
    $("#session .minus").click(function () {
        timer.decrementSession();
        timer.decrementTime();
    });
    $("#session .plus").click(function () {
        timer.incrementSession();
        timer.incrementTime();
    });
    $("#timer").click(function () {
        timer.startTimer();
    });
}