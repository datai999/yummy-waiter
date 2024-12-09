declare module 'myTypes' {
    type Pho = {
        id: string,
        meats: string[],
        noodle: string,
        preferences?: string[],
        note?: string,
    };

    type PhoCode = {
        id: string,
        meats: string,
        noodle: string,
        preferences?: string,
        note?: string,
    };

    type SelectedItem = {
        beef: Map<string, Pho>,
        beefUpdated: string,
        chicken: Map<string, Pho>,
        chickenUpdated: string,
    };
}

module.exports = {
    Pho,
    PhoCode,
    SelectedItem,
};