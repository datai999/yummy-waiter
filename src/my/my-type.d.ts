declare module 'myTypes' {
    type Pho = {
        id: string,
        meats: string[],
        noodle: string,
        preferences?: string[],
        note?: string,
    };

    type NonPho = {
        beefSide: string[],
        beefMeatSide: string[],
        chickenSide: string[],
        drink: string[],
        dessert: string[],
    }

    type PhoCode = Pho & {
        meatCodes: string,
        noodleCode: string,
        preferenceCodes?: string,
    };

    type NonPhoCode = {
        id: string,
        key?: string,
        code: string,
        count: number,
    }

    type SelectedItem = {
        beef: Map<string, PhoCode>,
        beefSide: Map<string, NonPhoCode>,
        beefUpdated: string[],

        chicken: Map<string, PhoCode>,
        chickenSide: Map<string, NonPhoCode>,
        chickenUpdated: string[],

        drink: Map<string, NonPhoCode>,
        dessert: Map<string, NonPhoCode>,
    };
}

declare module 'myTable' {
    type Table = {
        id: string;
        status: TableStatus;
        orderTime: Date | null;
        timer: number;
        orders: { item: string; quantity: number; notes: string }[];
    }
}

module.exports = {
    Pho,
    NonPho,
    PhoCode,
    NonPhoCode,
    SelectedItem,

    Table
};