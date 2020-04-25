let { asyncOp, RandStream } = require('./lib/lib');
var EventEmitter = require('events');

// solutions here

/////////////////////////////
class Resource {
    constructor(id, name) {
        var _id = id;
        var _name = name;
        var _reserveState = false;
        this.getId = function() { return _id; }
        this.getName = function() { return _name; }
        this.getResState = function() {return _reserveState; }
        this.setResState = function(state) { _reserveState = state; }
    }
    release(){
        this.setResState(false);
    }
}
class ResourceManager {
    constructor(count) {
        this._Resources = [count];

        for(var i = 0; i < count; i++)
        {
            var resource = new Resource(i, "res-" + i);
            this._Resources[i] = resource;
        }
    }

    borrow (res) {
        
        if(this._Resources.length == 0) {
            console.log("Cannot reserve.");
        } else {
            var resource = null;
            var isExists = false;

            for(var i = 0; i < this._Resources.length; i++)
            {
                // console.log(this._Resources[i].getId(), this._Resources[i].getName(), this._Resources[i].getResState());
                if(this._Resources[i].getResState() === false)
                {
                    resource = this._Resources[i];
                    isExists = true;
                    break;
                }
            }
            if(isExists === true) {
                resource.setResState(true);
            }
            return res(resource);
        }
    }
}

  const pool = new ResourceManager(2);
  console.log('START');
  let timestamp = Date.now();

  pool.borrow((res) => {
    console.log('RES: 1');
    setTimeout(() => {
      res.release();
    }, 500);
  });

  pool.borrow((res) => {
    console.log('RES: 2');
  });

  pool.borrow((res) => {
    console.log('RES: 3');
    console.log('DURATION: ' + (Date.now() - timestamp));
  });

//   setTimeout(() => {
//     pool.borrow((res) => {
//         console.log('RES: 3',res);
//         console.log('DURATION: ' + (Date.now() - timestamp));
//       });
//   }, 1000);
  

/////////////////////// END Resource Pool //////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////
////////////// Randstring Problem////////////////////////////////////////

class RandStringSource extends EventEmitter {
    constructor (RandStream) {
       super();
       this.randomStream = RandStream;
      }
}
 function processData(data) {
    if(data.includes('.')) {
        for(var i = 0; i < data.length; i++ )
        {
            if(data[i] === '.') 
            {
                emitEvent(stack.pop());
                results = '';
                continue;
            }
            else {
                if(data[i] !== '') {
                    results += data[i];
                    stack.push(results);
                }
                    
            }
        }
        
    }
}

//////////////////////////////////////////////////
/// Running the Stream piece of code/////////////////
////////////////////////////////////////////////////

let source = new RandStringSource(new RandStream());

source.randomStream.on('data', (data) => {
     processData(data);
   });

var stack = [];
let results = '';


function emitEvent(data) {
   source.emit('data', data);
}

source.on('data',  (data) => {
    console.log(data);
});

/////////////////////////END Randstring/////////////////////////////

/////////////////////////////////////////////////////////////////
/////////// The DoAync Problem///////////////////////////////////
////////////////////////////////////////////////////////////////

async function series(val) {
    await asyncOp(val);
}

async function parallel(items) {
    await Promise.all(items.map(async item => { await asyncOp(item) }))
}

async function doAsync(arr) {
    for (const val of arr) {
        if (typeof val === 'string') {
            await series(val);
        }
        else if (Array.isArray(val)) {
            await parallel(val);

        }
    }
}
// // Test code to call doAsync
var arr = ['A', ['B', 'C', 'D', 'E'], 'F', 'G', ['H', 'I']];
(async function () {
    await doAsync(arr);
})()