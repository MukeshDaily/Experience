var app = app || {};

$(function() {
	'use strict';

	// Todo Item View
	// --------------

	// The DOM element for a todo item...
	app.TodoView = Backbone.View.extend({

		//... is a list tag.
		tagName:  'li',

		// Cache the template function for a single item.
		template: _.template( $('#item-template').html() ),

		// The DOM events specific to an item.
		events: {			
			//'dblclick label':	'edit',
			'click .edbox':	'edit',
			'click .destroy':	'clear',
			'click .editconfirm':	'updateOnEnter',
			//'keypress .edit':	'updateOnEnter',
			//'blur .edit':		'close'			
			//'blur .edit':		'updateOnBlur',
			//'blur .editdesc':		'updateOnBlur'
		},

		// The TodoView listens for changes to its model, re-rendering. Since there's
		// a one-to-one correspondence between a **Todo** and a **TodoView** in this
		// app, we set a direct reference on the model for convenience.
		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
			this.listenTo(this.model, 'visible', this.toggleVisible);
		},

		// Re-render the titles of the todo item.
		render: function() {
			this.$el.html( this.template( this.model.toJSON() ) );
			this.$el.toggleClass( 'completed', this.model.get('completed') );

			this.toggleVisible();
			this.$input = this.$('.edit');
			this.$inputdesc = this.$('.editdesc');
			return this;
		},

		toggleVisible: function() {
			this.$el.toggleClass( 'hidden',  this.isHidden());
		},

		isHidden: function() {
			var isCompleted = this.model.get('completed');
			var caty = this.model.get('category');
			if(app.TodoFilter==='completed' || app.TodoFilter==='active' || app.TodoFilter===''){
				return ( // hidden cases only
					(!isCompleted && app.TodoFilter === 'completed')
					|| (isCompleted && app.TodoFilter === 'active')				
				);
			}
			else{
				return ( // hidden cases only
					(caty !== app.TodoFilter)
				);
			}
			
		},
		
		// Switch this view into `"editing"` mode, displaying the input field.
		edit: function() {
			this.$el.addClass('editing');
			this.$input.focus();
		},

		// Close the `"editing"` mode, saving changes to the todo.
		close: function() {
			var value = this.$input.val().trim();
			var valuedesc = this.$inputdesc.val().trim();
			
			if ( value ) {
				this.model.save({ title: value , desc : valuedesc});
			} else {
				this.clear();
			}

			this.$el.removeClass('editing');
		},
		
		updateOnBlur: function() {
			var value = this.$input.val().trim();
			var valuedesc = this.$inputdesc.val().trim();
			
			if ( value ) {
				this.model.save({ title: value , desc : valuedesc});
			} else {
				this.clear();
			}
		},
		// If you hit `enter`, we're through editing the item.
		updateOnEnter: function( e ) {					
				this.close();
		},

		// Remove the item, destroy the model from *localStorage* and delete its view.
		clear: function() {
			this.model.destroy();
		}
	});
});
