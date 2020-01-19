const { min } = Math;

export default class Timer {
  public static timeScale = 1;
  public static maxStep = 0.05;

  public static step(now: DOMHighResTimeStamp) {
    const delta = (now - Timer.prevTime) / 1_000;
    Timer.currTime += min(delta, Timer.maxStep) * Timer.timeScale;
    Timer.prevTime = now;
  }

  public static get time() {
    return Timer.currTime;
  }

  private static currTime = Number.MIN_VALUE;
  private static prevTime = 0;

  private init = Timer.time;
  private prev = Timer.time;
  private pausedAt = 0;

  constructor(public target = 0) {}

  public get isRunning() {
    return this.pausedAt === 0;
  }

  public set(seconds = 0) {
    this.target = seconds;
    this.reset();
  }

  public reset() {
    this.init = Timer.time;
    this.pausedAt = 0;
  }

  public tick() {
    const delta = Timer.time - this.prev;
    this.prev = Timer.time;
    return this.isRunning ? delta : 0;
  }

  public delta() {
    return (this.pausedAt || Timer.time) - this.init - this.target;
  }

  public pause() {
    if (!this.isRunning) {
      return;
    }

    this.pausedAt = Timer.time;
  }

  public unpause() {
    if (this.isRunning) {
      return;
    }

    this.init += Timer.time - this.pausedAt;
    this.pausedAt = 0;
  }
}
