$(function(){

	// This demo depends on the canvas element
	if(!('getContext' in document.createElement('canvas'))){
		alert('Sorry, it looks like your browser does not support canvas!');
		return false;
	}

	// The URL of your web server (the port is set in app.js)
	var url = 'http://localhost:6789';

	var doc = $(document),
		win = $(window),
		canvas = $('#paper'),
		ctx = canvas[0].getContext('2d'),
		instructions = $('#instructions');
	
	// Generate an unique ID
	var id = Math.round($.now()*Math.random());
	
	// A flag for drawing activity
	var drawing = false;

	var clients = {};
	var cursors = {};

	var socket = io.connect(url);
	
	var color="back";
	var size;
	
	var color1="back";
	var size1;
	
	socket.on('moving', function (data) {
		
                console.log('Moving');
		if(! (data.id in clients)){
			// a new user has come online. create a cursor for them
			cursors[data.id] = $('<div class="cursor">').appendTo('#cursors');
		}
		
		// Move the mouse pointer
		cursors[data.id].css({
			'left' : data.x,
			'top' : data.y
		});
		
		// Is the user drawing?
		if(data.drawing && clients[data.id]){
			
			// Draw a line on the canvas. clients[data.id] holds
			// the previous position of this user's mouse pointer
			
			drawLine(clients[data.id].x, clients[data.id].y, data.x, data.y);
			size=data.size
			color=data.color
		}
		
		// Saving the current client state
		clients[data.id] = data;
		clients[data.id].updated = $.now();
	});

	var prev = {};
	
	canvas.on('mousedown',function(e){
		e.preventDefault();
		drawing = true;
		prev.x = e.pageX;
		prev.y = e.pageY;
		
		// Hide the instructions
		instructions.fadeOut();
	});
	
	doc.bind('mouseup mouseleave',function(){
		drawing = false;
	});

	var lastEmit = $.now();

	doc.on('mousemove',function(e){
		if($.now() - lastEmit > 30){
			socket.emit('mousemove',{
				'x': e.pageX,
				'y': e.pageY,
				'drawing': drawing,
				'id': id,
				'size': size1,
				'color': color1
			});
			lastEmit = $.now();
		}
		
		// Draw a line for the current user's movement, as it is
		// not received in the socket.on('moving') event above
		
		if(drawing){
			
			drawLine1(prev.x, prev.y, e.pageX, e.pageY);
			
			prev.x = e.pageX;
			prev.y = e.pageY;
		}
	});

	// Remove inactive clients after 10 seconds of inactivity
	setInterval(function(){
		
		for(ident in clients){
			if($.now() - clients[ident].updated > 10000){
				
				// Last update was more than 10 seconds ago. 
				// This user has probably closed the page
				
				cursors[ident].remove();
				delete clients[ident];
				delete cursors[ident];
			}
		}
		
	},10000);

	function drawLine(fromx, fromy, tox, toy){
		ctx.beginPath();
		ctx.lineJoin = ctx.lineCap = 'round';
		ctx.moveTo(fromx, fromy);
		ctx.lineTo(tox, toy);
		ctx.strokeStyle	= color;
		ctx.lineWidth = size;
		ctx.stroke();
			
	}
	
	function drawLine1(fromx, fromy, tox, toy){
		ctx.beginPath();
		ctx.lineJoin = ctx.lineCap = 'round';
		ctx.moveTo(fromx, fromy);
		ctx.lineTo(tox, toy);
		ctx.strokeStyle	= color1;
		ctx.lineWidth = size1;
		ctx.stroke();
			
	}
	
	
	 
	  
	  
	  
	   document.getElementById('s2').addEventListener('click', function() {
   
		size1=2;
		
      }, false);
	  
	  document.getElementById('s4').addEventListener('click', function() {
   
		size1=4;
		
      }, false);
	  
	  
	  document.getElementById('s6').addEventListener('click', function() {
   
		size1=6;
		
      }, false);
	  
	  document.getElementById('s8').addEventListener('click', function() {
   
		size1=8;
		
      }, false);
	  
	  document.getElementById('s10').addEventListener('click', function() {
   
		size1=10;
		
      }, false);
	  
	  document.getElementById('s12').addEventListener('click', function() {
   
		size1=12;
		
      }, false);
	  
	  document.getElementById('s14').addEventListener('click', function() {
   
		size1=14;
		
      }, false);
	  
	  
	  document.getElementById('s16').addEventListener('click', function() {
   
		size1=16;
		
      }, false);
	  
	  document.getElementById('s18').addEventListener('click', function() {
   
		size1=18;
		
      }, false);
	  
	  document.getElementById('s20').addEventListener('click', function() {
   
		size1=20;
		
      }, false);
	

});