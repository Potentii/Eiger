// *Subscribing all the pages:
spa.subscribe(new Page('fallback'));
spa.subscribe(new Page('log'));
spa.subscribe(new Page('email-settings'));
spa.subscribe(new Page('settings'));

// *Setting the fallback page:
spa.setFallbackPage('fallback');
