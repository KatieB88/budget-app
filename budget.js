//fist module- an IIFE that returns an object
//this means our variables can't be accessed from outside
//this returns an object containing all of the functions that we want to be public
//and this is how module patterns work
var budgetController = (function(){

	var Expense = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var Income = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	};
	
	var data = {
		allItems:{
			exp: [],
			inc: []
		},	
		totals:{
			exp: 0,
			inc: 0
		}
	};

	//need a public method to allow other modules to add new items to our data structure by calling this function
	//type is if it's an income or an expense. Allows interface between what's entered into UI and our data var
	return{
		addItem: function(typ, des, val){
			var newItem, ID;
			
			//create new ID- below this will be used when creating a new instance of Expense or Income
			//selecting the last number/item of the relevant array, then finding the ID given to it (see Expense
			//and Income constructors)
			//the length here won't work unless there is actually something in it (there's no -1 position) and will cause a bug, so we need to check if it's empty
			if(data.allItems[typ].length > 0){
				ID = data.allItems[typ][data.allItems[typ].length-1].id + 1;
			}
			else{
				ID = 0;
			}
			

			//create new item based on 'inc' or 'exp' type
			if(typ === 'exp'){
				newItem = new Expense(ID, des, val);
			}
			else if(typ === 'inc'){
				newItem = new Income(ID, des, val);
			}

			//push new item into our data structure
			//we could use an if statement here to check if the type is exp or inc, but because the vars in
			//data.allItems are called exp and inc themselves, then we can just write [type]!
			data.allItems[typ].push(newItem);
			//we also need to allow newItem to be accessible to other modules
			return newItem;
		},
		//allows us to see if we're gettingi the data in our data object
		testing: function(){
			console.log(data);
		}
	};


})();


//this is the module for controlling the UI
var UIController = (function(){

	//having loads of document.querySelector etcs makes code harder to edit in future, so we're going
	//to make a private object here to define them all. THis way, if somehting changes name, we only have to redefine it here
	var DOMstrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expenseContainer: '.expenses__list'
	};

	//we want to use this function in the other module, so it must be public. This means it must be included 
	//in the object returned by this module
	return{ //unnamed object- calling UICOntroller returns this, getInput is a method inside this unnamed object? And
		//then that method has another object inside it (also unnamed) that defines the type, descriptiona and value and
		//returns them all
		getInput: function(){
			return{ //it's job is to return the info we need. We do it this way so that all three will be returned at the same time
			type: document.querySelector(DOMstrings.inputType).value, //will be inc or exp- grabs this info by selecting the 
			//field of input using the class and then looking for it's value property
			description: document.querySelector(DOMstrings.inputDescription).value,
			value: document.querySelector(DOMstrings.inputValue).value
			};
			
		},

		addListItem: function(obj, type){
			var html, newHtml, element;

			//create HTML string with placeholder text
			if (type === 'inc'){
				element = DOMstrings.incomeContainer;
				html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%Description%</div> <div class="right clearfix"> <div class="item__value">+ %value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div></div> </div>';
			}
			else if (type === 'exp'){
				element = DOMstrings.expenseContainer;
				html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%Description%</div> <div class="right clearfix"> <div class="item__value">- %value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
			}

			//replace the placeholder text with actual data (what we receive from teh object)
			//html is a string, and there are lots of methods we can use on strings- replace is one of them
			//replace() locates a string and then replaces it with teh data that we put intot he method
			newHtml = html.replace('%id%', obj.id);
			//now we can override this newHtml, so that we replace our description and it's added to the newHtml (we still have our id replaced here too!)
			newHtml = newHtml.replace('%Description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value);
			
			//insert the HTML into the DOM. beforeend inserts the element as the last child of the container
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		},

		//we don't have to have all our DOMstring contents written in here, we can just make sure the 
		//object is returned so that it can be accessed by other modules
		getDOMstrings: function(){
			return DOMstrings;
			
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

	//to give it a bit more structure, we're putting all our dom manipulation stuff in this function
	//but now we have to evoke this to allow the DOM manipulation to work- we use init for this
	var setupEventListeners = function(){
		var DOM = UICtrl.getDOMstrings();

		//don't have to write an anonymous function if oyu're just planning on running one function on the event listener!
		//this is the case here, so we've just put the function name in its place- careful to remmeber no brackets so that
		//it isn't immediately executed when code is run
		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

		document.addEventListener('keypress', function(event){
		if (event.charCode === 13 || event.which === 13){
			ctrlAddItem();
		}
	});
	};

	
	
	var ctrlAddItem = function(){
		var input, newItem;

		//get field input data- assigning UICtrl here makes input = the returned object, then within that
		//then getInput all the data we need access to within it.
		input = UICtrl.getInput();
		
		//add the item to the budget controller- input above has all the info from getInput, so we use that
		newItem = budgetCtrl.addItem(input.type, input.description, input.value);

		//add the item to the UI
		UICtrl.addListItem(newItem, input.type);
		//calculate the budget

		//display the budget on the UI
	}

	//We need init to be public, so to do that it needs to be returned in an object
	return{
		init: function(){
			console.log("hi");
			setupEventListeners();
		}
	};

})(budgetController, UIController);


//our event listeners will only be setup once we call the init function, so that needs to be done outside out moudles
controller.init();






