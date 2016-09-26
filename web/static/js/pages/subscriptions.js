// *Subscribing all the pages:
spa.subscribe(new Page('fallback'));

spa.subscribe(new Page('login'));
spa.subscribe(new Page('auth'));

spa.subscribe(new Page(''));
spa.subscribe(new Page('vehicle-info'));
spa.subscribe(new Page('vehicle-create'));


// *Setting the fallback page:
spa.setFallbackPage('fallback');

// *When SPA system is ready:
spa.onReady(() => {
   console.log('SPA is ready');
});
