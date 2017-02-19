/**
 * @Author: Caio M. Gomes
 * @Sources: https://github.com/ivanseidel/IAMDinosaur/blob/master/Learner.js
 *           https://github.com/amaneureka/T-Rex
 * @Place: Recife
 */

'use strinct';

var Architect = synaptic.Architect;
var Network = synaptic.Network;
var Layer = synaptic.Layer;

function mindControl(inputs, outputs, rate) {
    this.inputSize = inputs;
    this.outputSize = outputs;
    this.rate = rate;
    this.network = new Architect.Perceptron(inputs,20,20,outputs);
    
    this.evaluate = function(input, output){
        for (var i = 0; i < 1000; i++) {
            if(input.length < this.inputSize) 
                return 0;
                
            this.network.activate(input);
            this.network.propagate(this.rate, output);
        }
        console.log(this.network.activate(input));
    }
    
    this.execute = function(input){
        /*if(input.length < this.inputSize) 
            return 0;*/
        //console.log(input);
        
        var active = this.network.activate(input);
        console.log(active);
        //if(active == [1,0]){
        if(active[0] > 0.5 && active[1] < 0.5) {
            return 1;
        }
        else{
            return 0;
        }
    }
    
    //download JSON:
    function download(filename, text) {
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);
    
      element.style.display = 'none';
      document.body.appendChild(element);
    
      element.click();
    
      document.body.removeChild(element);
    }
    
    this.getJSON = function() {
        var genJSON = this.network.toJSON();
        var gen = JSON.stringify(genJSON);
        console.log("Flappy_genome_"+new Date().toLocaleString()+".txt");
        download("Flappy_genome_"+new Date().toLocaleString()+".txt", gen);
    }
    
    //implement the method to setup network from JSON
    this.setupFromJSON = function(gen) {
        var gen_j = JSON.parse(gen);
        this.network = Network.fromJSON(gen_j);
    }
    
}


