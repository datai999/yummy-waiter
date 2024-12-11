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

    type SideItem = {
        id: string,
        code?: string,
        name: string,
        count: number,
    }

    type SelectedItem = {
        beef: Map<string, PhoCode>,
        beefSide: Map<string, SideItem>,
        beefUpdated: string[],

        chicken: Map<string, PhoCode>,
        chickenSide: Map<string, SideItem>,
        chickenUpdated: string[],

        drink: Map<string, SideItem>,
        dessert: Map<string, SideItem>,
    };
}

module.exports = {
    Pho,
    NonPho,
    PhoCode,
    SideItem,
    SelectedItem,
};