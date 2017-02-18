import {State} from "./enum";
import * as exec from "child_process";
import * as util from "util";

export class GPIO {
    private static POWER_PIN = 0;
    private static LIGHT_PIN = 2;
    private _initialized = false;

    public isInitialized(): boolean {
        return this._initialized;
    }

    public initialize(): boolean {
        if (this.isInitialized()) {
            return false;
        }

        exec.execSync(util.format("gpio mode %d out", GPIO.POWER_PIN));
        exec.execSync(util.format("gpio mode %d out", GPIO.LIGHT_PIN));
        this.setState(State.Off);
        this._initialized = true;
        return true;
    }

    public destroy(): boolean {
        if (!this.isInitialized()) {
            return false;
        }

        this.setState(State.Off);
        this._initialized = false;
        return true;
    }

    public setState(state: State): boolean {
        if (!this.isInitialized()) {
            return false
        }

        switch (state) {
            case State.Off:
                exec.execSync(util.format("gpio write %d 1", GPIO.LIGHT_PIN));
                exec.execSync(util.format("gpio write %d 1", GPIO.POWER_PIN));
                return true;
            case State.White:
                exec.execSync(util.format("gpio write %d 0", GPIO.LIGHT_PIN));
                exec.execSync(util.format("gpio write %d 0", GPIO.POWER_PIN));
                return true;
            case State.Blue:
                exec.execSync(util.format("gpio write %d 1", GPIO.LIGHT_PIN));
                exec.execSync(util.format("gpio write %d 0", GPIO.POWER_PIN));
                return true;
            default:
                return false;
        }
    }
}