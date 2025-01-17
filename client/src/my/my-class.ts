import "reflect-metadata";
import { Exclude, plainToClass, Transform, Type } from 'class-transformer';
import { MENU, TableStatus } from './my-constants';
import { generateId } from './my-service';
import { UTILS } from "./my-util";

export class ItemRef {
    trackedIndex: number = -1;
    id: string = '';

    public constructor(trackedIndex: number, id: string) {
        this.trackedIndex = trackedIndex;
        this.id = id;
    }
}

export class NonPho {
    id: string = '';
    code: string;
    note?: String;
    qty: number = 1;
    actualQty: number = 1;

    @Type(() => ItemRef)
    void?: ItemRef;
    @Type(() => ItemRef)
    voided?: ItemRef[];

    public constructor(code: string) {
        this.id = generateId();
        this.code = code;
    }
}

export class Pho extends NonPho {
    isPho: boolean = true;
    combo?: string;
    meats: string[] = [];
    noodle: string = 'BC';
    preferences?: string[];
    referCode?: string;

    public constructor() {
        super('');
        this.id = '';
    }

    static from(nonPho: NonPho): Pho {
        const pho = new this();
        pho.id = nonPho.id;
        pho.code = nonPho.code;
        pho.note = nonPho.note;
        pho.qty = nonPho.qty;
        pho.actualQty = nonPho.qty;
        pho.isPho = false;
        return pho;
    }
}

export class TrackedItem {
    @Type(() => String)
    @UTILS.TransformTime()
    time?: Date;
    server: string;

    public constructor(server: any) {
        if (server)
            this.server = server.name;
        else this.server = '?';
    }
}

export class TrackedPho extends TrackedItem {
    @Transform(value => new Map(Object.entries(value.value).map(([key, item]) => [key, plainToClass(Pho, item)])
    ), { toClassOnly: true })
    items: Map<string, Pho> = new Map();
}

export class TrackedNonPho extends TrackedItem {
    @Transform(value => new Map(Object.entries(value.value).map(([key, item]) => [key, plainToClass(NonPho, item)])
    ), { toClassOnly: true })
    items: Map<string, NonPho> = new Map();
}

export class CategoryItem {

    @Type(() => TrackedPho)
    pho: TrackedPho[] = [];

    @Type(() => TrackedNonPho)
    nonPho: TrackedNonPho[] = [];

    @Type(() => String)
    action: string[] = [];

    public lastPhos(): Map<string, Pho> {
        return this.pho.length === 0 ? new Map() : this.pho[this.pho.length - 1].items;
    }

    public lastNonPhos(): Map<string, NonPho> {
        return this.nonPho.length === 0 ? new Map() : this.nonPho[this.nonPho.length - 1].items;
    }

    private getQty(type: string, actual: boolean = false): number {
        return Array.from(type === 'pho' ? this.pho : this.nonPho).reduce((preTrackedQty, tracked) =>
            preTrackedQty + Array.from(tracked.items.values())
                .filter(tracked => !tracked.void)
                .reduce((preQty, cur) => preQty + (actual ? cur.actualQty : cur.qty), 0), 0
        );
    }

    public getPhoQty(): number {
        return this.getQty('pho');
    }

    public getPhoActualQty(): number {
        return this.getQty('pho', true);
    }

    public getNonPhoQty(): number {
        return this.getQty('nonPho');
    }
}

export class Table {
    id: string;
    note?: string;
    status: TableStatus = TableStatus.AVAILABLE;

    @Type(() => String)
    @UTILS.TransformTime()
    orderTime: Date | null = null;

    @Exclude()
    timer: number = 0;

    @Transform(value => {
        let resut = new Map<number, Map<string, CategoryItem>>();
        for (let entry of Object.entries(value.value)) {
            const categoryItems = new Map(Object.entries(entry[1] as Object).map(categoryItems => {
                return [categoryItems[0], plainToClass(CategoryItem, categoryItems[1])];
            }));
            resut.set(Number(entry[0]), categoryItems);
        }
        return resut;
    }, { toClassOnly: true })
    bags: Map<number, Map<string, CategoryItem>> = new Map();

    public constructor(id: string) {
        this.id = id;
        this.bags.set(this.bags.size, this.newBag());
        // this.bags.set(this.bags.size, this.newBag());
    }

    public newBag(): Map<string, CategoryItem> {
        return new Map(Object.keys(MENU).map(category => [category, new CategoryItem()]));
    }

    public getServers(): string[] {
        const servers = new Set<string>();
        this.bags.forEach(bag => bag.forEach(category => {
            category.pho.forEach(tracked => servers.add(tracked.server));
            category.nonPho.forEach(tracked => servers.add(tracked.server));
        }));
        return Array.from(servers);
    }

    public getName(): string {
        const time = this.id.split(' ')[1].split(':');
        return this.id.startsWith('Table') ? this.id : 'Togo' + ':' + time[0] + ':' + time[1];
    }
}

export class LockedTable {
    locked: boolean;
    server: string;

    public constructor(locked: boolean, server: string) {
        this.locked = locked;
        this.server = server;
    }
}

export class Auth {
    name: string;

    public constructor(name: string) {
        this.name = name;
    }
}