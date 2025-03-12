import "reflect-metadata";
import { Exclude, plainToClass, Transform, Type } from 'class-transformer';
import { TableStatus } from './my-constants';
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

export class NonPhoConfig {
    displayName: string;
    code?: string;
    price?: number;
    disabled?: boolean;
    displayOrder?: number = 50;

    public constructor(displayName: string) {
        this.displayName = displayName;
    }
}

export class NonPho {
    id: string = '';
    code: string;
    note?: String;
    qty: number = 1;
    actualQty: number = 1;
    price: number = 0;

    @Type(() => ItemRef)
    void?: ItemRef;
    @Type(() => ItemRef)
    voided?: ItemRef[];

    public constructor(code: string, price: number) {
        this.id = generateId();
        this.code = code;
        this.price = price;
    }
}

export class Pho extends NonPho {
    isPho: boolean = true;
    combo?: string;
    meats: string[] = [];
    noodle: string = 'BC';
    preferences?: string[];
    referCode?: string;
    discountQty?: number;
    discountPercent?: number;

    public constructor() {
        super('', 0);
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

export class Customer {
    phone: string;
    name?: string;
    totalPoint: number;
    point: number;
    prePoint: number;

    public constructor(phone: string) {
        this.phone = phone;
        this.totalPoint = 0;
        this.point = 0;
        this.prePoint = 0;
    }
}

export class Table {
    id: string;
    note?: string;
    customer?: Customer;
    status: TableStatus = TableStatus.AVAILABLE;

    @Type(() => String)
    @UTILS.TransformTime()
    orderTime: Date | null = null;

    @Type(() => String)
    @UTILS.TransformTime()
    cleanTime?: Date | null = null;

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
        const MENU = JSON.parse(localStorage.getItem('menu')!);
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

    public isTogo(): boolean { return this.id.startsWith('Togo') }
}

export class Order extends Table {
}

export class Discount {
    discount: number;
    amount?: number;

    public constructor(discount: number) {
        this.discount = discount;
    }
}

export class Receipt extends Order {
    cashier: string;
    subTotal: number = 0;
    total: number = 0;
    tax: number = 0;
    finalTotal: number = 0;
    tendered?: number;
    change?: number;
    point: number = 0;

    discountPercent?: Discount;
    discountSubtract?: Discount;

    public constructor(cashier: string, order: Order, note?: string) {
        if (!order) order = new Order('?');
        super(order.id);
        this.cashier = cashier;
        this.note = order.note || note;
        this.status = order.status;
        this.orderTime = order.orderTime;
        this.cleanTime = order.cleanTime;
        this.timer = order.timer;
        this.customer = order.customer;

        if (order.status === TableStatus.AVAILABLE)
            this.orderTime = new Date();
    }

    public calculateTotal(bags: Map<number, Map<string, CategoryItem>>, discountPercents?: number, discountSubtracts?: number): Receipt {
        this.bags = bags;
        let subTotal: number = Array.from(this.bags.values()).reduce((acc, categotyItems) => {
            return acc + Array.from(categotyItems.values()).reduce((subAcc, categotyItem) => {
                const phoTotal = categotyItem.pho.reduce((trackedAcc, tracked) => {
                    return trackedAcc + Array.from(tracked.items.values())
                        .reduce((phoAcc, pho) => pho.void ? phoAcc : phoAcc + pho.actualQty * pho.price, 0)
                }, 0);
                const nonPhoTotal = categotyItem.nonPho.reduce((trackedAcc, tracked) => {
                    return trackedAcc + Array.from(tracked.items.values())
                        .reduce((nonPhoAcc, nonPho) => nonPho.void ? nonPhoAcc : nonPhoAcc + nonPho.actualQty * nonPho.price, 0)
                }, 0);
                return subAcc + phoTotal + nonPhoTotal;
            }, 0);
        }, 0);
        this.subTotal = Math.ceil(subTotal * 100) / 100;
        this.total = this.subTotal;

        const tax = Math.ceil(0.0925 * subTotal * 100) / 100;
        const finalTotal = Math.ceil((subTotal + tax) * 100) / 100;
        this.point = Math.floor(finalTotal);

        if (!discountPercents)
            this.discountPercent = undefined;
        else {
            this.discountPercent = new Discount(discountPercents);
            this.discountPercent.amount = this.total * this.discountPercent.discount / 100;
            this.total -= this.discountPercent.amount;
        }
        if (!discountSubtracts)
            this.discountSubtract = undefined;
        else {
            this.discountSubtract = new Discount(discountSubtracts);
            this.discountSubtract.amount = this.discountSubtract.discount;
            this.total -= this.discountSubtract.amount;
        }

        this.total = Math.ceil(Math.max(this.total, 0) * 100) / 100;
        this.tax = Math.ceil(0.0925 * this.total * 100) / 100;
        this.finalTotal = Math.ceil((this.total + this.tax) * 100) / 100;
        return this;
    }

    public hasDiscount(): boolean {
        return this.total < this.subTotal;
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
    code: string;
    name: string;

    public constructor(name: string, code: string) {
        this.code = code;
        this.name = name;
    }
}