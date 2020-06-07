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


namespace jkp {

    export type Th = [number, number, number];


    export class JKP {

        private history: Array<Th> = new Array();
        private weights: Th[][]=[];

        private depth = 7;
        private randomfactor = 0.5;

        constructor(depth:number, randomfactor:number) {
            this.depth = depth;
            this.randomfactor = randomfactor;

            for (let d = 0; d < this.depth; ++d) {
                this.history[d] = [0, 0, 0];
                this.weights[d] = [];
                for (let i = 0; i < 3; ++i) {
                    this.weights[d][i] = [this.getNoise(),this.getNoise(),this.getNoise()];
                }
            }

        }

        //inform the system of a throw
        //t: player's throw
        public considerThrow(t:number):void {

            let th = this.getTh(t);

            //update weights where prediction is wrong
            let pth = this.normalize(this.getExpectations());

            for (let i=0; i< 3;++i){ //i=which option is under consideration

                if(pth[i] == th[i]) continue; //only update weights for options that were wrong

                for(let d=0; d< this.depth; ++d){
                    for(let j=0; j< 3; ++j){
                        this.weights[d][i][j] += th[i] * (this.history[d][j] + this.getNoise());
                    }
                }
            }

            //update history
            this.history.unshift(th);
            this.history.pop();
        }

        //return the expection value for each outcome
        private getExpectations():Th{

            let r:Th=[0,0,0];

            for(let d = 0; d<this.depth;++d){
                for(let i=0;i<3;++i){
                    for(let j=0;j<3;++j) {
                        r[i] += this.history[d][j] * this.weights[d][i][j];
                    }
                }
            }

            return r;
        }

        //return a rand value centered on 0
        private getNoise():number {
            return (Math.random()-0.5) * this.randomfactor;
        }

        //return the predicted next throw
        private normalize(r:Th):Th{

            let p = r.indexOf(Math.max(...r));

            return this.getTh(p);
        }

        //return the predicted next throw as a number
        public getPredictedThrow():number{
            return this.fromTh(this.normalize(this.getExpectations()));
        }

        //return our internal state
        public getStatus():any{

            return [this.history, this.weights, this.getExpectations()];

        }

        //convert number to onehot
        private getTh(t:number):Th{
            let th:Th = [-1,-1,-1];
            th[t] = 1;
            return th;
        }

        //convert onehot to number
        private fromTh(th:Th):number{
            return th.indexOf(Math.max(...th));
        }

    }

}