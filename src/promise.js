// try {
//     module.exports = Promise2
//   } catch (e) {}

function Promise2(executor){
    this.status = 'pending';
    this.resolveCallback = [];
    this.rejectCallback = [];
    const resolve = (value)=>{
        if (value instanceof Promise2) {
            return value.then(resolve, reject)
        }
        if(this.status === 'pending'){
            this.status = 'resolve'
            this.data = value
            process.nextTick(()=>{
                this.resolveCallback.forEach(item=>item(value))
            })
        }
    }
    const reject = (value)=>{
        if(this.status === 'pending'){
            this.status = 'reject'
            this.data = value
            process.nextTick(()=>{
                this.rejectCallback.forEach(item=>item(value))
            })
        }
    }
    try {
        executor(resolve, reject)
    } catch (reason) {
        reject(reason)
    }
}

function resolvePromise(promiseC, x , resolve, reject){
    if(promiseC === x){
        return reject(new TypeError('Chaining cycle detected for promise!'))
    }
    if(x instanceof Promise2){
        if(x.status === 'pending'){
            x.then((r)=>{
                resolvePromise(promiseC,r,resolve,reject);
            },reject)
        }else{
            x.then(resolve,reject)
        }
        return
    }
    if((x !== null) && ((typeof x === 'object') || (typeof x === 'function'))){
        try {
            then = x.then
            if (typeof then === 'function') {
                then.call(x,  y => resolvePromise(promiseC, y, resolve, reject), 
                    r => reject(r))
            } else {
                resolve(x)
            }
        } catch (e) {
            return reject(e)
        }
    }else{
        resolve(x);
    }
}

Promise2.prototype.then = function(onResolved,onRejected){
    let promiseC;
    onResolved =  typeof onResolved === 'function' ? onResolved : ()=>{};
    onRejected =  typeof onRejected === 'function' ? onRejected : ()=>{};
    return promiseC  = new Promise2((resolve,reject)=>{
        if(this.status === 'resolve'){
            process.nextTick(()=>{
                try{
                    const r = onResolved(this.data);
                    resolvePromise(promiseC,r,resolve,reject)
                }catch(reason){
                    reject(reason)
                }
            })
        }
        if(this.status === 'reject'){
            process.nextTick(()=>{
                try{
                    const r = onRejected(this.data);
                    resolvePromise(promiseC,r,resolve,reject)
                }catch(reason){
                    reject(reason)
                }
            })
        }
        if(this.status === 'pending'){
            this.resolveCallback.push((value)=>{
                try {
                    const r = onResolved(value);
                    resolvePromise(promiseC,r,resolve,reject)
                } catch (r) {

                    reject(r)
                }
            })
            this.resolveCallback.push((reason)=>{
                try {
                    const r = onRejected(reason);
                    resolvePromise(promiseC,r,resolve,reject)
                } catch (r) {
                    reject(r)
                }
            })
        }
    })

}

Promise2.prototype.catch = function(onRejected) {
    return this.then(null, onRejected)
  }
const PromiseNew = Promise2;
new PromiseNew((resolve)=>{
    resolve()
}).then(()=>{
    console.log(0)
    return new PromiseNew(resolve=>{
        resolve(4)
    })
}).then(res=>{
    console.log(res)
})

new PromiseNew((resolve)=>{
    resolve()
}).then(()=>{
    console.log(1)
}).then(()=>{
    console.log(2)
}).then(()=>{
    console.log(3)
}).then(()=>{
    console.log(5)
})

// Promise2.deferred = Promise2.defer = function() {
//     var dfd = {}
//     dfd.promise = new Promise2(function(resolve, reject) {
//       dfd.resolve = resolve
//       dfd.reject = reject
//     })
//     return dfd
//   }