

const AccurateTimer = ( callback, interval ) => {

  console.log( this )
  const that = this;
  let expected, timeout;
  this.interval = interval;

  this.start = function () {

    expected = Performance.now() + this.interval;
    timeout = setTimeout( step, this.interval );

  };

  this.stop = function () {
    clearTimeout( timeout );
  };

  function step() {
    const drift = Date.now() - expected;

    callback();
    expected += that.interval;
    timeout = setTimeout( step, Math.max( 0, that.interval - drift ) );
  }


};

export default AccurateTimer;
