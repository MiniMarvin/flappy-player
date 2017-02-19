var popSize = 20;

// Create an array to hold the population of networks
var networks = [];

// Populate the networks array
for (var i = 0; i < popSize; i++) {
    networks.push(new Brainwave.Network(4, 1, 1, 4));
}

// Next we need to create the Genetics object that will evolve the networks for us
var genetics = new Brainwave.Genetics(popSize, networks[0].getNumWeights());

// When creating the genetics object it will also generate random weights an baises for the networks
// These should be imported into the population of networks before beginning any training
for (var j = 0; j < popSize; j++) {
    networks[j].importWeights(genetics.population[j].weights);
}

// Now the networks and genetics are all set up training can begin. Pass each network an input and issue
// it a fitness depending on how close its output was to the desired output
for (var k = 0; k < popSize; k++) {
    var output = networks[k].run([1, 4, 6, 2]);

    // Lets just suppose we are looking for an output as close to one as possible
    var fitness = 1 - Math.abs(1 - output); // So the max fitness we can have here is 1

    // Now we need to update the genetics with this fitness
    genetics.population[k].fitness = fitness;
}

// After you have decided on a fitness for each network, we can use the genetics
// object to evolve them based on the results
genetics.epoch(genetics.population);

// Then we just need to import the new weights into the networks and repeat again and again
for (var n = 0; n < popSize; n++) {
    networks[n].importWeights(genetics.population[n].weights);
}