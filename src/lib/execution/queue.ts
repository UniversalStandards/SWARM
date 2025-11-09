interface ResourceRequirements {
  cpu: number;
  memory: number;
  gpu: number;
}

interface QueueItem {
  task: () => Promise<void>;
  priority: number;
  resourceRequirements: ResourceRequirements;
  retries: number;
  id: string;
}

export class ExecutionQueueManager {
  private queue: QueueItem[] = [];
  private resources: ResourceRequirements = {
    cpu: 0,
    memory: 0,
    gpu: 0,
  };
  private maxResources: ResourceRequirements = {
    cpu: 8, // max CPU cores
    memory: 32000, // max memory in MB
    gpu: 2, // max GPU units
  };
  private retryLimit: number = 3;
  private currentlyRunning: number = 0;

  constructor(maxResources?: Partial<ResourceRequirements>) {
    if (maxResources) {
      this.maxResources = { ...this.maxResources, ...maxResources };
    }
  }

  // Add a task with priority and resource requirements
  addTask(
    task: () => Promise<void>,
    priority: number = 0,
    resourceRequirements: ResourceRequirements = { cpu: 1, memory: 512, gpu: 0 }
  ): string {
    const id = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.queue.push({ task, priority, resourceRequirements, retries: 0, id });
    this.queue.sort((a, b) => b.priority - a.priority);
    this.processQueue();
    return id;
  }

  // Check if resources are available for a task
  private canAllocateResources(resourceRequirements: ResourceRequirements): boolean {
    return (
      this.resources.cpu + resourceRequirements.cpu <= this.maxResources.cpu &&
      this.resources.memory + resourceRequirements.memory <= this.maxResources.memory &&
      this.resources.gpu + resourceRequirements.gpu <= this.maxResources.gpu
    );
  }

  // Allocate resources for a task
  private allocateResources(resourceRequirements: ResourceRequirements): void {
    this.resources.cpu += resourceRequirements.cpu;
    this.resources.memory += resourceRequirements.memory;
    this.resources.gpu += resourceRequirements.gpu;
  }

  // Release resources after task completion
  private releaseResources(resourceRequirements: ResourceRequirements): void {
    this.resources.cpu -= resourceRequirements.cpu;
    this.resources.memory -= resourceRequirements.memory;
    this.resources.gpu -= resourceRequirements.gpu;
  }

  // Process the queue and run tasks if resources are available
  private processQueue(): void {
    if (this.queue.length === 0) return;

    for (let i = 0; i < this.queue.length; i++) {
      const item = this.queue[i];
      if (this.canAllocateResources(item.resourceRequirements)) {
        this.allocateResources(item.resourceRequirements);
        this.queue.splice(i, 1);
        this.runTask(item);
        i--;
      }
    }
  }

  // Run a task with retry logic
  private async runTask(item: QueueItem): Promise<void> {
    this.currentlyRunning++;
    try {
      await item.task();
      this.releaseResources(item.resourceRequirements);
      this.currentlyRunning--;
      this.processQueue();
    } catch (error) {
      this.currentlyRunning--;
      if (item.retries < this.retryLimit) {
        item.retries++;
        this.queue.push(item);
        this.queue.sort((a, b) => b.priority - a.priority);
      } else {
        console.error(`Task ${item.id} failed after ${this.retryLimit} retries:`, error);
      }
      this.releaseResources(item.resourceRequirements);
      this.processQueue();
    }
  }

  // Get queue status
  getStatus(): {
    queueLength: number;
    currentlyRunning: number;
    resourceUsage: ResourceRequirements;
    maxResources: ResourceRequirements;
  } {
    return {
      queueLength: this.queue.length,
      currentlyRunning: this.currentlyRunning,
      resourceUsage: { ...this.resources },
      maxResources: { ...this.maxResources },
    };
  }

  // Dynamic resource optimization based on system load
  optimizeThroughput(systemLoad?: { cpu: number; memory: number }): void {
    if (!systemLoad) return;

    // Dynamically adjust max resources based on current system load
    if (systemLoad.cpu < 0.5) {
      this.maxResources.cpu = Math.min(16, this.maxResources.cpu + 1);
    } else if (systemLoad.cpu > 0.9) {
      this.maxResources.cpu = Math.max(2, this.maxResources.cpu - 1);
    }

    if (systemLoad.memory < 0.5) {
      this.maxResources.memory = Math.min(64000, this.maxResources.memory + 4000);
    } else if (systemLoad.memory > 0.9) {
      this.maxResources.memory = Math.max(8000, this.maxResources.memory - 4000);
    }

    this.processQueue();
  }

  // Clear all pending tasks
  clearQueue(): void {
    this.queue = [];
  }
}
