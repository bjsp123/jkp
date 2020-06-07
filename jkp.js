/*
  DATASMITH.ORG

  A simple perceptron implementation of a jan ken pon AI.

  Enhancements needed:
  -- most importantly, the observations should be drew/won/lost and same/changed up/changed down, rather than rock/paper/scissors
  -- running both kinds of model at once and comparing results dynamically would give even better performance
  -- for human opponents, taking into account timing would probably also give good results

  This code is © 2020 Ben Peterson All Rights Reserved.

  Feel free to use and enhance, but please give credit if you find this code useful.
 */
var jkp;
(function (jkp) {
    var JKP = /** @class */ (function () {
        function JKP(depth, randomfactor) {
            this.history = new Array();
            this.weights = [];
            this.depth = 7;
            this.randomfactor = 0.5;
            this.depth = depth;
            this.randomfactor = randomfactor;
            for (var d = 0; d < this.depth; ++d) {
                this.history[d] = [0, 0, 0];
                this.weights[d] = [];
                for (var i = 0; i < 3; ++i) {
                    this.weights[d][i] = [this.getNoise(), this.getNoise(), this.getNoise()];
                }
            }
        }
        //inform the system of a throw
        //t: player's throw
        JKP.prototype.considerThrow = function (t) {
            var th = this.getTh(t);
            //update weights where prediction is wrong
            var pth = this.normalize(this.getExpectations());
            for (var i = 0; i < 3; ++i) { //i=which option is under consideration
                if (pth[i] == th[i])
                    continue; //only update weights for options that were wrong
                for (var d = 0; d < this.depth; ++d) {
                    for (var j = 0; j < 3; ++j) {
                        this.weights[d][i][j] += th[i] * (this.history[d][j] + this.getNoise());
                    }
                }
            }
            //update history
            this.history.unshift(th);
            this.history.pop();
        };
        //return the expection value for each outcome
        JKP.prototype.getExpectations = function () {
            var r = [0, 0, 0];
            for (var d = 0; d < this.depth; ++d) {
                for (var i = 0; i < 3; ++i) {
                    for (var j = 0; j < 3; ++j) {
                        r[i] += this.history[d][j] * this.weights[d][i][j];
                    }
                }
            }
            return r;
        };
        //return a rand value centered on 0
        JKP.prototype.getNoise = function () {
            return (Math.random() - 0.5) * this.randomfactor;
        };
        //return the predicted next throw
        JKP.prototype.normalize = function (r) {
            var p = r.indexOf(Math.max.apply(Math, r));
            return this.getTh(p);
        };
        //return the predicted next throw as a number
        JKP.prototype.getPredictedThrow = function () {
            return this.fromTh(this.normalize(this.getExpectations()));
        };
        //return our internal state
        JKP.prototype.getStatus = function () {
            return [this.history, this.weights, this.getExpectations()];
        };
        //convert number to onehot
        JKP.prototype.getTh = function (t) {
            var th = [-1, -1, -1];
            th[t] = 1;
            return th;
        };
        //convert onehot to number
        JKP.prototype.fromTh = function (th) {
            return th.indexOf(Math.max.apply(Math, th));
        };
        return JKP;
    }());
    jkp.JKP = JKP;
})(jkp || (jkp = {}));
//# sourceMappingURL=jkp.js.map