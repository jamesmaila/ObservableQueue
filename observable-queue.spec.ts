import { ObservableQueue } from './observable-queue';
import { Observable } from 'rxjs/Observable';
import { it, describe, beforeEach, inject, expect } from '@angular/core/testing';

describe('Observable Queue', () => {

	// Setup Mocks
	let queue: ObservableQueue;
	let returnObservable: boolean;
	let useError: boolean;
	let returnedObservable: boolean;
	let waitForFlagAndReturnObservable = function(observer: any) {
		setTimeout(() => {
			if (returnObservable) {
				if (useError) {
					observer.error();
				} else {
					observer.next();
				}
				returnedObservable = true;
			} else {
				waitForFlagAndReturnObservable(observer);
			}
		}, 0);
	};
	let waitForReturnedObservable = function(callback: any) {
		setTimeout(() => {
			if (returnedObservable) {
				callback();
			} else {
				waitForReturnedObservable(callback);
			}
		}, 0);
	};

	// Provide Mocks
	beforeEach(() => {
		queue = new ObservableQueue();
	});

	describe('add', () => {
		it('should execute a single observable right away if it is the only item in the queue', () => {
			// Arrange
			let item = Observable.of({});
			spyOn(item, 'subscribe').and.callThrough();

			// Act
			queue.add(item, () => {}, () => {});

			// Assert
			expect(item.subscribe).toHaveBeenCalled;
		});
		it('should call the success callback if the observable returns correctly', () => {
			// Arrange
			let item = Observable.of({});
			spyOn(item, 'subscribe').and.callThrough();
			let callbackReached = false;

			// Act
			queue.add(item, () => {
				callbackReached = true;
			}, () => {});

			// Assert
			expect(callbackReached).toEqual(true);
		});
		it('should call the error callback if the observable throws an error', () => {
			// Arrange
			let item = Observable.throw({});
			spyOn(item, 'subscribe').and.callThrough();
			let callbackReached = false;

			// Act
			queue.add(item, () => {}, () => {
				callbackReached = true;
			});

			// Assert
			expect(callbackReached).toEqual(true);
		});
		it('should not subscribe to the second item until the first item resolves sucessfully', (done: any) => {
			// Arrange
			let item1 = Observable.create((observer: any) => {
				waitForFlagAndReturnObservable(observer);
			});
			let item2 = Observable.of({});
			returnObservable = false;
			useError = false;

			spyOn(item1, 'subscribe').and.callThrough();
			spyOn(item2, 'subscribe').and.callThrough();

			// Act
			queue.add(item1, () => {}, () => {});
			queue.add(item2, () => {}, () => {});

			// Assert
			expect(item2.subscribe).not.toHaveBeenCalled();
			returnObservable = true;
			waitForReturnedObservable(() => {
				expect(item2.subscribe).toHaveBeenCalled();

				// Teardown
				returnObservable = false;
				returnedObservable = false;
				useError = false;
				done();
			});
		});
		it('should not subscribe to the second item until the first item resolves with failure', (done: any) => {
			// Arrange
			let item1 = Observable.create((observer: any) => {
				waitForFlagAndReturnObservable(observer);
			});
			let item2 = Observable.of({});
			returnObservable = false;
			useError = true;

			spyOn(item1, 'subscribe').and.callThrough();
			spyOn(item2, 'subscribe').and.callThrough();

			// Act
			queue.add(item1, () => {}, () => {});
			queue.add(item2, () => {}, () => {});

			// Assert
			expect(item2.subscribe).not.toHaveBeenCalled();
			returnObservable = true;
			waitForReturnedObservable(() => {
				expect(item2.subscribe).toHaveBeenCalled();

				// Teardown
				returnObservable = false;
				returnedObservable = false;
				useError = false;
				done();
			});
		});
	});
});

