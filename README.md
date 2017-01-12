# ObservableQueue
Observable Queue data structure for angular2.  

Ensures observables are executed synchronously, the next observable is subscribed to only after the previous one returns.  
This queue structure is useful for logic require atomic operations.

# Usage
Instantiate using default constructor
```
  let queue = new ObservableQueue();
 ```
 
Add work item using the .add() method. 
 
# Signature
 ```
  public add(observable: Observable<any>, successAction: any, failureAction: any): void
 ```
 
# Example
Inputs: Observable, Success action, Failure action  
 ```
  let observable = this.http.get('www.google.com').map(res => res.json());
  let success = () => { console.log('Success!'); }
  let failure = () => { console.log('Error!'); }
  
  this.queue.add(observable, success, failure);
  ```
