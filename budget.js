//fist module- an IIFE that returns an object
//this means our variables can't be accessed from outside
//this returns an object containing all of the functions that we want to be public
//and this is how modul patterns work
var budgetController = (function(){

	
})();


//this is the module for controlling the UI
var UIController = (function(){

	//having loads of document.querySelector etcs makes code harder to edit in future, so we're going
	//to make a private object here to define them all. THis way, if somehting changes name, we only have to redefine it here
	var DOMstrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn'
	};

	//we want to use this function in the other module, so it must be public. This means it must be included 
	//in the object returned by this module
	return{ //empty object- calling UICOntroller returns this, I think getInput is a method inside this unnamed object? And
		//then that method has another object inside it (also unnamed) that defines the type, descriptiona and value and
		//returns them all
		getInput: function(){
			return{ //empty object in empty object- it's job is to return the info we need. We do it this way so that all three will be returned at the same time
			type: document.querySelector(DOMstrings.inputType).value, //will be inc or exp- grabs this info by selecting the 
			//field of input using the class and then looking for it's value property
			description: document.querySelector(DOMstrings.inputDescription).value,
			value: document.querySelector(DOMstrings.inputValue).value
			};
			
		},
		//we don't have to have all out DOMstring contents written in here, we can just make sure the 
		//object is returned so that it can be accessed by other modules
		getDOMstrings: function(){
			return{
				DOMstrings;
			}
		}
	};


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

	var DOM = UICtrl.getDOMstrings;
	
	var ctrlAddItem = function(){
		//get field input data- assigning UICtrl here makes input = the returned object, then within that
		//then getInput all the data we need access to within it.
		var input = UICtrl.getInput();
		console.log(input);
		//add the item to the budget controller

		//add the item to the UI

		//calculate the budget

		//display the budget on the UI
	}

	//don't have to write an anonymous function if oyu're just planning on running one function on the event listener!
	//this is the case here, so we've just put the function name in its place- careful to remmeber no brackets so that
	//it isn't immediately executed when code is run
	document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);



	document.addEventListener('keypress', function(event){
		if (event.charCode === 13 || event.which === 13){
			ctrlAddItem();
		}
	});

})(budgetController, UIController);