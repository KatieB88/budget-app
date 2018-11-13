//fist module- an IIFE that returns an object
//this means our variables can't be accessed from outside
//this returns an object containing all of the functions that we want to be public
//and this is how modul patterns work
var budgetController = (function(){

	
})();


//this is the module for controlling the UI
var UIController = (function(){

	//we want to use this function in the other module, so it must be public. This means it must be included 
	//in the object returned by this module
	


})();



//it's good that our modules above are separate- it allows us to just take a module and put it in new code
//easily among other benefits. However, we do need them to be ABLE to talk to each other. The UI needs 
//to get the input from the user and pass that along into the budgetController. We use this third module for this:
//the app controller.
//As modules are just function expressions, we can pass arguments into them, and that's what we're going
//to do here. We're passing the other two modules as arguments into controller so that it can connect htem.
//It's not necessary to pass them in as arguments, we have access to what they return, so we could just
//write them inside the function w/o arguments. This isn't good practise though, as it makes it less indepent
//and less like an actual module. Here it is much more versatile- we can change the name of a module and only
//have to alter it in one place!
var controller = (function(budgetCtrl, UICtrl){

	var ctrlAddItem = function(){
		//get field input data

		//add the item to the budget controller

		//add the item to the UI

		//calculate the budget

		//display the budget on the UI
	}

	document.querySelector('.add__btn').addEventListener('click', ctrlAddItem());

	document.addEventListener('keypress', function(event){
		if (event.charCode === 13 || event.which === 13){
			ctrlAddItem();
		}
	});

})(budgetController, UIController);