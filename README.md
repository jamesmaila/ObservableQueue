# ObservableQueue
Observable Queue data structure for angular2.  

Ensures observables are executed synchronously, the next observable is subscribed to only after the previous one returns.  
This queue structure is useful for logic requiring atomic operations.

# Usage
Instantiate using default constructor.
```
  this.queue = new ObservableQueue();
 ```
 
 For explicit start, construct with autoStart flag set to false.
 ```
  this.queue = new ObservableQueue(autoStart: false);
 ```
Add work item using the .add() method.  

For explicit start, use .start() method. Otherwise, observables will fire automatically as they are added.
 
# Signatures
 ```
  public add(observable: Observable<any>, successAction: any, failureAction: any): void
  public start(): void
 ```
 
# Examples
Inputs: Observable, Success action, Failure action  

 ```
  let observable1 = this.http.get('www.google.com').map(res => res.json());
  let success1 = () => { console.log('Success1!'); }
  let failure1 = () => { console.log('Error1!'); }
  this.queue.add(observable1, success1, failure1);

  let observable2 = this.http.get('www.bing.com).map(res => res.json());
  let success2 = () => { console.log('Success2!'); }
  let failure2 = () => { console.log('Error2!'); }
  this.queue.add(observable2, success2, failure2);

  this.queue.start();

  ```
