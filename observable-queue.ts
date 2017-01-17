import { Observable } from 'rxjs/Observable';

export class ObservableQueue {

	private queue: any[];
	private autoStart: boolean;
	
	constructor(autoStart = true) {
		this.queue = [];
		this.autoStart = autoStart;
	}

	/**
	 * Adds an observable work item to the queue. If it is the only item, it executes it.
	 * 
	 * @param {Observable<any>} observable
	 * @param {*} successAction
	 * @param {*} failureAction
	 */
	public add(observable: Observable<any>, successAction: any, failureAction: any): void {
		this.queue.push({
			observable: observable,
			successAction: successAction,
			failureAction: failureAction
		});

		// If this is the only work item, execute it right away
		if (this.queue.length === 1 && this.autoStart) {
			this.execute(this.queue[0]);
		}
	}
	
	/**
	 * Starts executing queue items.
	 */
	public start(): void {
		if (this.queue.length > 0) {
			this.execute(this.queue[0]);
		}
	}

	/**
	 * Shifts the previous work item out of the queue, and executes the next in line.
	 * 
	 * @private
	 */
	private executeNext(): void {
		// Shift completed item out of queue
		if (this.queue.length > 0) {
			this.queue.shift();
		}

		// Execute remaining work items
		if (this.queue.length > 0) {
			this.execute(this.queue[0]);
		}
	}

	/**
	 * Executes the observable item, upon completion it runs the corresponding
	 * success/failure action and executes the next work item in line.
	 * 
	 * @private
	 * @param {*} item
	 */
	private execute(item: any): void {
		item.observable.subscribe(
			(response: any) => { // Success
				if (item.successAction) {
					item.successAction(response);
				}
				this.executeNext();
			},
			(error: any) => { // Failure
				if (item.failureAction) {
					item.failureAction(error);
				}
				this.executeNext();
			}
		);
	}
}
