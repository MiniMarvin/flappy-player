/**
 * @Author: Caio M. Gomes
 * @Sources: https://github.com/ivanseidel/IAMDinosaur/blob/master/Learner.js
 *           https://github.com/amaneureka/T-Rex
 * @Place: Recife
 */

'use strinct';

function brain(genNum){
    
    //this.perceptron = new Architect.Perceptron(3,20,20,2);
    this.generation = 0;
    this.genNum = genNum;
    this.genomes = [];
    this.gen = 0;
    this.genScores = [];
    this.mutationRate = 0.6;
    this.keepGens = 2
    
    var Architect = synaptic.Architect;
    var Network = synaptic.Network;
    var Layer = synaptic.Layer;
    
    this.genNets = function(inputs, outputs) {
        this.inputNum = inputs;
        this.outputNum = outputs;
        for (var i = 0; i <= this.genNum; i++){
            try {
                
                //this.genomes.push(new Architect.Perceptron(inputs,10,10,10,outputs));
                this.genomes.push(new Architect.Perceptron(inputs,20,20,outputs));//this.genomes.push(myNetwork);
            } catch (e) {
                console.log("error: " + e);
            }
            this.genScores.push(0);
        }
    }
    
    this.mutate = function(gen) {
        //console.log(gen);
        this.mutateKey(gen.neurons, 'bias');
        this.mutateKey(gen.connections, 'weight');
        return gen;
    }
    
    //Rights to Ivan Seidel.
    this.mutateKey = function (a, key){
        for (var k = 0; k < a.length; k++) {
            // Should mutate?
            if (Math.random() > this.mutationRate) {
                continue;
            }
            a[k][key] += a[k][key] * (Math.random() - 0.5) * 3 + (Math.random() - 0.5);
        }
    }

    this.crossOver = function(genA, genB) {
        this.crossOverKey(genA.neurons, genB.neurons, 'bias');
        this.crossOverKey(genA.connections, genB.connections, 'weight');
        return genA;
    }
    
    //Uniform CrossOver with swap rate in 50% between two genomes.
    this.crossOverKey = function (genA, genB, key){
        for (var k = 0; k < genA.length; k++) {
            // Should Swap?
            if (Math.random() > 0.5) {
                continue;
            }
            
            genA[k][key] += genA[k][key] * (Math.random() - 0.5) * 3 + (Math.random() - 0.5);
        }
    }
    
    
    this.execute = function(inputs) {
        var output;
        try {
            output = this.genomes[this.gen].activate(inputs);
        } catch (e) {
            console.log("error: " + e);
            console.log(this.genomes[this.gen]);
        }
        return output;
    }
    
    this.next = function() {
        
        if(this.gen < genNum) this.gen++;
        else{
            this.nextGen();
            this.gen = 0;
        }
    }
    
    this.setFitness = function(fitness) {
        this.genomes[this.gen].fitness = fitness;
        //this.genomes[this.gen].space = space;
    }
    
    
    //TODO: implement the generation control and add a fitness into the generation
    this.nextGen = function() {
        
        //sort the array by fitness
        _.sortBy(this.genomes, ['fitness']).reverse();
        
        this.genomes.pop() //remove the two worst fitness
        this.genomes.pop() //remove the two worst fitness
        console.log(this.genomes);
        //console.log(this.genomes[0]);
        this.genomes[0].fitness = 0;
        //console.log(this.genomes[1]);
        this.genomes[1].fitness = 0;
        
        //create all the new cross overed neurons
        for (var i = this.keepGens; i < this.genomes.length; i++) {
            var gen1 = this.genomes[Math.floor(Math.random()*this.genomes.length)].toJSON();
            var gen2 = this.genomes[Math.floor(Math.random()*this.genomes.length)].toJSON();
            var newgen = this.crossOver(gen1, gen2);
            this.genomes[i] = Network.fromJSON( this.mutate(newgen) );
            //console.log(this.genomes[i]);
            this.genomes[i].fitness = 0;
        }
        
        //create a mutation of the two best gens
        this.genomes.push(Network.fromJSON( this.mutate( this.genomes[0].toJSON() ) ) );
        this.genomes[this.genomes.length - 1].fitness = 0;
        this.genomes.push(Network.fromJSON( this.mutate( this.genomes[1].toJSON() ) ) );
        this.genomes[this.genomes.length - 1].fitness = 0;
        
        /*
        for (var i = 0; i < this.genomes.length; i++) {
            console.log(this.genomes[i]);
        }
        */
    }
    
    //TODO: implement the runtime execution of every genome and the evolutionary methods.
    
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
    
    this.downloadGen = function() {
        var genJSON = this.genomes.toJSON();
        var gen = JSON.parse(genJSON);
        download("generation_"+new Date().toLocaleString()+".txt", gen);
    }
    
    this.getJSON = function() {
        var genJSON = this.genomes[0].toJSON();
        var gen = JSON.stringify(genJSON);
        console.log("genome_"+new Date().toLocaleString()+".txt");
        download("genome_"+new Date().toLocaleString()+".txt", gen);
    }
    
    //implement the method to setup network from JSON
    this.setupFromJSON = function(gen) {
        var gen_j = JSON.parse(gen);
        this.genomes[0] = Network.fromJSON(gen_j);
    }
    
    this.setGenFromJSON = function(gen) {
        var gen_j = JSON.parse(gen);
        this.genomes[0] = Network.fromJSON(gen_j);
        for (var i = 0; i < gen_j.length; i++) {
            this.genomes[i] = Network.fromJSON(gen_j);
        }
    }
    
    //TODO: make the network do not press if the position is upper than the pipe
    //jump if the position is downner than the pipe
    this.teach = function(mylog, fitness) {
        var net = new Architect.Perceptron(this.inputNum, 20, 20, this.outputNum);
        var learningRate = 0.01;
        var consistence = 0;
        
        console.log(mylog);
        var loopCount = 0;
        
        while(consistence == 0 && loopCount <= 20000) {
        //while(consistence == 0) {    
            consistence = 1;
            
            for (var i = 0; i < mylog.place.length; i++) {
                if(mylog.place[i].length < this.inputNum) continue; //if got something null just ignore
                
                var actvated = net.activate( mylog.place[i] );
                
                if( ( net.activate( mylog.place[i]) < 0.5 && mylog.action[i] == 1 ) ||
                ( net.activate( mylog.place[i]) > 0.5 && mylog.action[i] == 0 ) ) {
                    consistence = 0;
                }
                if(mylog.action[i] > 0.5) net.propagate( learningRate,  [1] );
                //else net.propagate( learningRate, [0]);
            }
            loopCount++;
        }
        
        for (var i = 0; i < mylog.place.length; i++) {
            if(mylog.place[i].length < this.inputNum) continue; //if got something null just ignore
            console.log("situation: "+mylog.place[i]+" | \nact: "+mylog.action[i]+" | \nout: "+ net.activate( mylog.place[i]) );
        }
        
        
        
        this.genomes[0] = Network.fromJSON( net.toJSON() );
        this.genomes[0].fitness = fitness;
        console.log(this.genomes[this.gen].fitness);
        
        //this.next();
        
    }

    
} 